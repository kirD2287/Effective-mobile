import { Body, Controller, Get, Post, Patch } from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from '@prisma/client';

@Controller('/users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  async create(@Body() body: { firstName: string; lastName: string; age: number; gender: string }): Promise<User> {
    return this.usersService.createUser (body.firstName, body.lastName, body.age, body.gender);
  }

  @Patch('/resolve-issues')
  async resolveIssues(): Promise<{ count: number }> {
    const count = await this.usersService.resolveIssues();
    return { count };
  }

  @Get()
  async findAll(): Promise<User[]> {
    return this.usersService.getUsers();
  }
}
