
import { Controller, Get, Patch, Body, Req, UseGuards, Param, ParseIntPipe, Post, Delete, UseInterceptors, UploadedFile } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiBody, ApiConsumes } from '@nestjs/swagger';
import { S3Service, MulterFile } from '../s3/s3.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { File as MulterFileType } from 'multer';

@ApiBearerAuth()
@Controller('users')
export class UsersController {
    constructor(
        private readonly usersService: UsersService,
        private readonly s3Service: S3Service,
    ) {}
    @UseGuards(JwtAuthGuard)
    @Get('me')
    async getMe(@Req() req: any) {
        if (!req.user || !req.user.userId) {
            return { error: 'User not found in request. Make sure JWT strategy is configured.' };
        }
        const user = await this.usersService.findOneById(req.user.userId);
        if (!user) {
            return { error: 'User not found in database.' };
        }
        const { id, username, email, photo } = user;
        return {
            id,
            username: username ?? '',
            email,
            photo: photo ?? '',
        };
    }

    @UseGuards(JwtAuthGuard)
    @ApiBody({ type: Number })
    @Delete(':id')
    async deleteUser(@Param('id', ParseIntPipe) id: number) {
        const result = await this.usersService.deleteUser(id);
        return result ? { message: 'User deleted' } : { error: 'User not found' };
    }

    @Get("all")
    async getAll() {
        const users = await this.usersService.findAll();
        return users.map(({ password, ...rest }) => rest);
    }

    @Get(':id')
    async getUserById(@Param('id', ParseIntPipe) id: number) {
        const user = await this.usersService.findOneById(id);
        if (!user) {
            return { error: 'User not found.' };
        }
        const { password, ...rest } = user;
        return rest;
    }

    @UseGuards(JwtAuthGuard)
    @Patch('me')
    @ApiBody({ type: UpdateUserDto })
    async updateMe(@Req() req: any, @Body() body: UpdateUserDto) {
        if (!req.user || !req.user.userId) {
            return { error: 'User not found in request. Make sure JWT strategy is configured.' };
        }
        const updated = await this.usersService.updateUser(req.user.userId, body);
        if (!updated) {
            return { error: 'User not found or update failed.' };
        }
        const { id, username, email } = updated;
        return {
            id,
            username: username ?? '',
            email,
        };
    }
    @UseGuards(JwtAuthGuard)
    @Patch('me/photo')
    @ApiConsumes('multipart/form-data')
    @ApiBody({
        schema: {
            type: 'object',
            properties: {
                photo: { type: 'string', format: 'binary' },
            },
            required: ['photo'],
        },
    })
    @UseInterceptors(FileInterceptor('photo'))
    async updateMyPhoto(@Req() req: any, @UploadedFile() photo: MulterFileType) {
        if (!req.user || !req.user.userId) {
            return { error: 'User not found in request. Make sure JWT strategy is configured.' };
        }
        // Upload photo to S3 and get URL
        // You may need to adjust this logic to use your S3Service
    const photoUrl = await this.s3Service.uploadFile(photo as MulterFile);
        const updated = await this.usersService.updateUser(req.user.userId, { photo: photoUrl });
        if (!updated) {
            return { error: 'User not found or update failed.' };
        }
        return { id: updated.id, photo: updated.photo };
    }
}