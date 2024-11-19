import { Injectable } from '@nestjs/common';
import { PrismaClient, User } from '@prisma/client';

@Injectable()
export class UsersService {
  private prisma = new PrismaClient();

  async createUser (firstName: string, lastName: string, age: number, gender: string): Promise<User> {
    return this.prisma.user.create({
      data: { firstName, lastName, age, gender },
    });
  }

  async resolveIssues(): Promise<number> {
    const count = await this.prisma.user.count({ where: { hasIssues: true } });
    await this.prisma.user.updateMany({ where: { hasIssues: true }, data: { hasIssues: false } });
    return count;
  }

  async getUsers(): Promise<User[]> {
    return this.prisma.user.findMany();
  }
}
