
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async findOneByEmail(email: string): Promise<User | undefined> {
    const user = await this.usersRepository.findOne({ where: { email } });
    return user === null ? undefined : user;
  }

  async findOneById(id: number): Promise<User | undefined> {
    const user = await this.usersRepository.findOne({ where: { id } });
    return user === null ? undefined : user;
  }

  async deleteUser(id: number): Promise<boolean> {
    const user = await this.usersRepository.findOne({ where: { id } });
    if (!user) return false;
    await this.usersRepository.remove(user);
    return true;
  }

  async create(
    username: string,
    email: string,
    password: string,
  ): Promise<User> {
    const user = this.usersRepository.create({ username, email, password });
    return this.usersRepository.save(user);
  }
  async findAll(): Promise<User[]> {
    return await this.usersRepository.find();
  }
  async updateUser(userId: number, body: UpdateUserDto): Promise<User | undefined> {
  const user = await this.usersRepository.findOne({ where: { id: userId } });
  if (!user) return undefined;
  if (body.username !== undefined) user.username = body.username;
  if (body.email !== undefined) user.email = body.email;
  if (body.photo !== undefined) user.photo = body.photo;
  await this.usersRepository.save(user);
  return user;
  }
}