import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Repository } from 'typeorm';
import { Comment } from './entities/comment.entity';
import { FilterCommentDto } from './dto/filter-comment.dto';
import { Media } from 'src/media/entities/media.entity';
import { Post } from 'src/post/entities/post.entity';
import { User } from 'src/user/entities/user.entity';
import { CreateCommnetDto } from './dto/create-comment.dto';
import * as AWS from 'aws-sdk';

@Injectable()
export class CommentService {
  constructor(
    @InjectRepository(Comment)
    private commentRepository: Repository<Comment>,
    @InjectRepository(Post)
    private postRepository: Repository<Post>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Media)
    private mediaRepository: Repository<Media>,
  ) {}
  keyID: string = process.env.AWS_ACCESS_KEY_ID;
  keySecret: string = process.env.AWS_SECRET_ACCESS_KEY;
  region: string = process.env.AWS_REGION;
  bucketName: string = process.env.AWS_S3_BUCKET_NAME;

  s3 = new AWS.S3({
    accessKeyId: this.keyID,
    secretAccessKey: this.keySecret,
  });

  async findAll(filterquery: FilterCommentDto) {
    const page = filterquery.page || 1;
    const items_per_page = filterquery.items_per_page || 10;
    const search = filterquery.search || '';
    const skip = items_per_page * (page - 1);
    const [res, total] = await this.commentRepository.findAndCount({
      where: {
        comment: Like(`%${search}%`),
        user: {
          first_name: Like(`%${search}%`),
          last_name: Like(`%${search}%`),
        },
      },
      skip: skip,
      order: { updated_at: 'DESC' },
      relations: ['user', 'post'],
      select: {
        user: {
          id: true,
        },
        post: {
          id: true,
        },
        comment: true,
        repliedComment: {
          id: true,
        },
        created_at: true,
      },
    });
    const totalPage = Math.ceil(total / items_per_page);
    const nextPage = Number(page) + 1 <= totalPage ? Number(page) + 1 : null;
    const prePage = Number(page) - 1 > 0 ? Number(page) - 1 : null;

    return {
      data: res,
      total,
      currentPage: page,
      items_per_page,
      totalPage,
      nextPage,
      prePage,
    };
  }

  async findAllByPost(post_id: string): Promise<Comment[]> {
    return this.commentRepository.find({
      order: { updated_at: 'DESC' },
      relations: ['user', 'post', 'replies', 'repliedComment'],
      where: {
        post: {
          id: post_id,
        },
      },
      select: {
        user: {
          id: true,
          first_name: true,
          last_name: true,
          avatar: true,
        },
        post: {
          id: true,
        },
        repliedComment: {
          id: true,
        },
        replies: {
          id: true,
          comment: true,
          user: {
            id: true,
            first_name: true,
            last_name: true,
            avatar: true,
          },
          created_at: true,
        },
      },
    });
  }

  async findAllByUser(user_id: string): Promise<Comment[]> {
    return this.commentRepository.find({
      order: { updated_at: 'DESC' },
      relations: ['user', 'post', 'replies', 'repliedComment'],
      where: {
        user: {
          id: user_id,
        },
      },
      select: {
        user: {
          id: true,
          first_name: true,
          last_name: true,
          avatar: true,
        },
        post: {
          id: true,
        },
        repliedComment: {
          id: true,
        },
        replies: {
          id: true,
          comment: true,
          user: {
            id: true,
            first_name: true,
            last_name: true,
            avatar: true,
          },
          created_at: true,
        },
      },
    });
  }

  async findOne(id: string): Promise<Comment[]> {
    return this.commentRepository.find({
      order: { updated_at: 'DESC' },
      relations: ['user', 'post', 'replies', 'repliedComment'],
      where: {
       id: id,
      },
      select: {
        user: {
          id: true,
          first_name: true,
          last_name: true,
          avatar: true,
        },
        post: {
          id: true,
        },
        repliedComment: {
          id: true,
        },
        replies: {
          id: true,
          comment: true,
          user: {
            id: true,
            first_name: true,
            last_name: true,
            avatar: true,
          },
          created_at: true,
        },
      },
    });
  }

  async create(
    post_id: string,
    user_id: string,
    createCommentDto: CreateCommnetDto,
    file: Express.Multer.File,
  ) {
    enum MediaType {
      IMAGE = 'image',
      VIDEO = 'video',
    }
    const cmt = new Comment();
    cmt.comment = createCommentDto.comment;
    cmt.user = await this.userRepository.findOne({ where: { id: user_id } });
    cmt.post = await this.postRepository.findOne({ where: { id: post_id } });
    if (createCommentDto.replied_comment_id) {
      cmt.repliedComment = await this.commentRepository.findOne({
        where: { id: createCommentDto.replied_comment_id },
      });
    }
    const savedComment = await this.commentRepository.save(cmt);
    const post = await this.postRepository.findOne({
      where: { id: post_id },
    });
    if (!post) {
      throw new HttpException('Post not found', HttpStatus.NOT_FOUND);
    }
    savedComment.post = post;
    await this.commentRepository.save(savedComment);

    if (file) {
      const media = new Media();
      const type = file.mimetype.split('/')[0];
      if (type == 'image') {
        media.type = MediaType.IMAGE;
      } else if (type == 'video') {
        media.type = MediaType.VIDEO;
      }
      const params = {
        Bucket: this.bucketName,
        Key: `comment/${Date.now()}_${file.originalname}`,
        Body: file.buffer,
        ContentType: file.mimetype,
        ACL: 'public-read',
      };
      try {
        const result = await this.s3.upload(params).promise();
        media.link = result.Location;
      } catch (error) {
        throw new BadRequestException('Failed to upload media comment' + error);
      }
      media.comment = savedComment;
      const savedMedia = await this.mediaRepository.save(media);
      await this.commentRepository.update(savedComment.id, {
        media: savedMedia,
      });
    }
    return this.commentRepository.findOne({
      where: { id: savedComment.id },
      relations: ['user', 'post', 'media', 'repliedComment', 'replies'],
      select: {
        user: {
          id: true,
          first_name: true,
          last_name: true,
          avatar: true,
        },
        post: {
          id: true,
        },
        media: {
          id: true,
          link: true,
          type: true,
        },
        repliedComment: {
          id: true,
        },
        replies: {
          id: true,
          comment: true,
          created_at: true,
        },
      },
    });
  }

  async update(
    id: string,
    user_id: string,
    commentData: Partial<Comment>,
    file: Express.Multer.File,
  ): Promise<Comment> {
    enum MediaType {
      IMAGE = 'image',
      VIDEO = 'video',
    }
    const comment = await this.commentRepository.findOne({
      where: { id },
      relations: ['user'],
      select: {
        user: {
          id: true,
        },
      },
    });
    if (comment.user.id !== user_id) {
      throw new HttpException(
        'You are not authorized to edit this comment',
        HttpStatus.UNAUTHORIZED,
      );
    }
    if (file) {
      const media = new Media();
      const type = file.mimetype.split('/')[0];
      if (type == 'image') {
        media.type = MediaType.IMAGE;
      } else if (type == 'video') {
        media.type = MediaType.VIDEO;
      }
      const params = {
        Bucket: this.bucketName,
        Key: `comment/${Date.now()}_${file.originalname}`,
        Body: file.buffer,
        ContentType: file.mimetype,
        ACL: 'public-read',
      };
      try {
        const result = await this.s3.upload(params).promise();
        media.link = result.Location;
      } catch (error) {
        throw new BadRequestException('Failed to upload media comment' + error);
      }
      media.comment = comment;
      await this.mediaRepository.delete({ comment: comment });

      const savedMedia = await this.mediaRepository.save(media);
      await this.commentRepository.update(comment.id, { media: savedMedia });
    } else {
      await this.mediaRepository.delete({ comment: comment });
      await this.commentRepository.update(comment.id, { media: null });
    }
    await this.commentRepository.update(comment.id, commentData);
    return this.commentRepository.findOne({
      where: { id: comment.id },
      relations: ['user', 'post', 'media'],
      select: {
        user: {
          id: true,
          first_name: true,
          last_name: true,
          avatar: true,
        },
        post: {
          id: true,
        },
        media: {
          id: true,
          link: true,
          type: true,
        },
        // parentComment: {
        //   id: true,
        // },
      },
    });
  }

  async remove(id: number): Promise<void> {
    await this.commentRepository.delete(id);
  }
}
