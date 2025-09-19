import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Blog } from './blog.entity';
import { S3Service } from '../s3/s3.service';

@Injectable()
export class BlogsService {
  constructor(
    @InjectRepository(Blog)
    private blogsRepository: Repository<Blog>,
    private readonly s3Service: S3Service,
  ) {}


  async createBlog(
    content: { ru: string; az: string },
    images: any[],
    title: { ru: string; az: string },
  ): Promise<Blog> {
    const imageUrls = await Promise.all(
      images.map(async (file) => await this.s3Service.uploadFile(file)),
    );
    const blog = this.blogsRepository.create({ content, images: imageUrls, title });
    return this.blogsRepository.save(blog);
  }

  async getAllBlogs(): Promise<Blog[]> {
    return this.blogsRepository.find();
  }

  async getBlogById(id: string): Promise<Blog | undefined> {
    const blog = await this.blogsRepository.findOne({ where: { id } });
    return blog === null ? undefined : blog;
  }

  async updateBlog(
    id: string,
    content: { ru: string; az: string },
    images: any[],
  ): Promise<Blog | undefined> {
    const blog = await this.blogsRepository.findOne({ where: { id } });
    if (!blog) return undefined;
    blog.content = content;
    if (images && images.length > 0) {
      const imageUrls = await Promise.all(
        images.map(async (file) => await this.s3Service.uploadFile(file)),
      );
      blog.images = imageUrls;
    }
    await this.blogsRepository.save(blog);
    return blog;
  }

  async deleteBlog(id: string): Promise<boolean> {
    const blog = await this.blogsRepository.findOne({ where: { id } });
    if (!blog) return false;
    await this.blogsRepository.remove(blog);
    return true;
  }
}
