import {
	Controller,
	Post,
	Get,
	Patch,
	Delete,
	Body,
	Param,
	UseGuards,
	UploadedFile,
	UploadedFiles,
	UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import {
	ApiTags,
	ApiBearerAuth,
	ApiBody,
	ApiConsumes,
} from '@nestjs/swagger';
import { BlogsService } from './blogs.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Blog } from './blog.entity';
import { S3Service } from '../s3/s3.service';
	@ApiBearerAuth()
	@ApiTags('blogs')
	@Controller('blogs')
	export class BlogsController {
		constructor(
			private readonly blogsService: BlogsService,
			private readonly s3Service: S3Service,
		) {}

		@Post()
		@UseGuards(JwtAuthGuard)
		@UseInterceptors(FilesInterceptor('images'))
		@ApiConsumes('multipart/form-data')
		@ApiBody({
			schema: {
				type: 'object',
				properties: {
					  content: { type: 'object', properties: { ru: { type: 'string' }, az: { type: 'string' } } },
					  title: { type: 'object', properties: { ru: { type: 'string' }, az: { type: 'string' } } },
					images: {
						type: 'array',
						items: { type: 'string', format: 'binary' },
					},
				},
			required: ['content', 'images', 'title'],
			},
		})
		async createBlog(
			@Body('content') content: { ru: string; az: string },
			@Body('title') title: { ru: string; az: string },
			@UploadedFiles() images: any[],
		): Promise<Blog> {
		return this.blogsService.createBlog(content, images, title);
		}

		@Get()
		async getAllBlogs(): Promise<Blog[]> {
			return this.blogsService.getAllBlogs();
		}

		@Get(':id')
		async getBlogById(@Param('id') id: string): Promise<Blog | undefined> {
			return this.blogsService.getBlogById(id);
		}

		@Patch(':id')
		@UseGuards(JwtAuthGuard)
		@UseInterceptors(FilesInterceptor('images'))
		@ApiConsumes('multipart/form-data')
		@ApiBody({
			schema: {
				type: 'object',
				properties: {
					  content: { type: 'object', properties: { ru: { type: 'string' }, az: { type: 'string' } } },
					images: {
						type: 'array',
						items: { type: 'string', format: 'binary' },
					},
				},
			required: ['content', 'images'],
			},
		})
		async updateBlog(
			@Param('id') id: string,
			@Body('content') content: { ru: string; az: string },
			@UploadedFiles() images: any[],
		): Promise<Blog | undefined> {
			return this.blogsService.updateBlog(id, content, images);
		}

		@Delete(':id')
		@UseGuards(JwtAuthGuard)
		async deleteBlog(@Param('id') id: string): Promise<{ deleted: boolean }> {
				const deleted = await this.blogsService.deleteBlog(id);
				return { deleted };
			}
	}
