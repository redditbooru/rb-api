import * as express from 'express';

import { Controller } from '../lib/controller';
import { RouteMap } from '../interfaces/route';
import { MysqlDb } from '../lib/mysql-db';
import { PostModel } from '../models/post';
import { ImageModel } from '../models/image';
import { PostImageModel } from '../models/post-image';
import { PostDataModel } from '../models/post-data';
import { authFullAccess } from '../lib/auth';

type CreatePostData = {
  post: PostModel,
  images: Array<ImageModel>
};

export class PostsController extends Controller {
  public static create(db: MysqlDb): PostsController {
    return new PostsController(db);
  }

  @authFullAccess()
  public async createPost(
    req: express.Request,
    res: express.Response
  ): Promise<(Array<PostImageModel> | void)> {
    const invalidPayloadErrorResponse = () => {
      res.status(400).send('Invalid payload');
    };

    const syncErrorResponse = (errorMessage: string, errorObj: any = null) => {
      console.error(`[POST /post] ${errorMessage}`, errorObj);
      res.status(500).send({ error: 'There was an error creating the post' });
    }

    const data = <CreatePostData>req.body;

    // Bullet check the data payload
    if (!data.post || !Array.isArray(data.images) || !data.images.length) {
      return invalidPayloadErrorResponse();
    }

    // Validate the post model
    const postModel = <PostModel>PostModel.createFromObject(data.post);
    if (!postModel) {
      return invalidPayloadErrorResponse();
    }

    // Validate all the image models
    const imageModels: Array<ImageModel> = [];
    const imageDataValid = data.images.every(image => {
      const imageModel = <ImageModel>ImageModel.createFromObject(image);
      if (imageModel) {
        imageModels.push(imageModel);
      }
      return !!imageModel;
    });

    if (!imageDataValid) {
      return invalidPayloadErrorResponse();
    }

    // Now that bullet proofing is done, sync all the models
    let syncError: any = null;
    await this.db.transaction(async () => {
      try {
        await Promise.all([ postModel, ...imageModels ].map(model => model.sync(this.db)));
      } catch (err) {
        syncError = err;
      }

      return !syncError;
    });

    if (syncError) {
      return syncErrorResponse('Error creating models', syncError);
    }

    // Sync the relationships
    await this.db.transaction(async () => {
      try {
        await Promise.all(imageModels.map(imageModel => {
          const postImageModel = PostImageModel.createFromObject({
            postId: postModel.id,
            imageId: imageModel.id,
          });
          return postImageModel.sync(this.db);
        }));
      } catch (err) {
        syncError = err;
      }

      return !syncError;
    });

    if (syncError) {
      return syncErrorResponse('Error creating relationships', syncError);
    }

    // Create the denormalized data rows
    try {
      await this.db.query('CALL `proc_UpdateDenormalizedPostData` (:postId)', { postId: postModel.id });
      const posts = await PostDataModel.getByPostId(postModel.id, this.db);
      return posts;
    } catch (err) {
      return syncErrorResponse('Error creating denormalized data', err);
    }
  }

  public getRouteMap(): RouteMap {
    return {
      'post:/post': this.createPost.bind(this),
    };
  }
}
