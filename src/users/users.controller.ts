import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { Roles } from '../../shared/decorators/roles.method';
import { UserParam } from '../../shared/decorators/user.param';
import {CreateUserDto, UpdateUserDto, User} from '../../shared/entities/user';
import { UserRole } from '../../shared/types';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Roles('Admin')
  @Post()
  async create(@Body() dto: CreateUserDto) {
    const candidate = await this.usersService.findByLogin(dto.login);
    if (candidate) {
      throw new BadRequestException('User already exists');
    }

    return await this.usersService.create(dto);
  }

  @Roles('Admin')
  @Get()
  getAll() {
    return this.usersService.findAll();
  }

  @Roles('Admin', 'Client')
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() dto: UpdateUserDto,
    @UserParam() { id: userId, role: userRole }: User,
  ) {
    if (userRole !== UserRole.Admin && +id !== userId) {
      throw new ForbiddenException('Access denied');
    }

    return this.usersService.update(+id, dto);
  }

  @Roles('Admin', 'Client')
  @Delete(':id')
  remove(
    @Param('id') id: string,
    @UserParam() { id: userId, role: userRole }: User,
  ) {
    if (userRole !== UserRole.Admin && +id !== userId) {
      throw new ForbiddenException('Access denied');
    }

    return this.usersService.remove(+id);
  }
}
