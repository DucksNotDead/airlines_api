import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { TicketsService } from './tickets.service';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { UpdateTicketDto } from './dto/update-ticket.dto';
import { UserParam } from '../../shared/decorators/user.param';
import { User } from '../../shared/entities/user';
import { Roles } from '../../shared/decorators/roles.method';
import { TTicketStatus, UserRole } from '../../shared/types';

@Controller('tickets')
export class TicketsController {
  constructor(private readonly ticketsService: TicketsService) {}

  @Roles('Admin', 'Employee')
  @Post()
  create(@Body() createTicketDto: CreateTicketDto) {
    return this.ticketsService.create(createTicketDto);
  }

  @Get()
  findAll(
    @Query('status') status: TTicketStatus,
    @UserParam() { role: userRole, id: userId }: User,
  ) {
    const isClient = userRole === UserRole.Client;

    return this.ticketsService.findAll(
      !isClient ? status : undefined,
      isClient && userId,
    );
  }

  @Roles('Admin', 'Employee')
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTicketDto: UpdateTicketDto) {
    return this.ticketsService.update(+id, updateTicketDto);
  }

  @Roles('Admin', 'Employee')
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.ticketsService.remove(+id);
  }
}
