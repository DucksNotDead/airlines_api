import {
  BadRequestException,
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
import { UserParam } from '../../shared/decorators/user.param';
import { User } from '../../shared/entities/user';
import { Roles } from '../../shared/decorators/roles.method';
import { TTicketStatus, UserRole } from '../../shared/types';
import { Public } from '../../shared/decorators/public.method';
import { BuyTicketDto } from './dto/buy-ticket-dto';
import { ClientsService } from '../clients/clients.service';
import { UsersService } from '../users/users.service';
import { Client } from '../../shared/entities/client';
import { UpdateTicketDto } from './dto/update-ticket-dto';

@Controller('tickets')
export class TicketsController {
  constructor(
    private readonly ticketsService: TicketsService,
    private readonly clientsService: ClientsService,
    private readonly usersService: UsersService,
  ) {}

  @Roles('Admin', 'Employee')
  @Post()
  create(@Body() createTicketDto: CreateTicketDto) {
    return this.ticketsService.create(createTicketDto);
  }

  @Get()
  findAll(
    @Query('status') status: TTicketStatus,
    @Query('mine') mine: string,
    @UserParam() { role: userRole, id: userId }: User,
  ) {
    const isClient = userRole === UserRole.Client;
    const isMine = Boolean(mine) && isClient;

    return this.ticketsService.findAll(
      !(isMine && status === 'for_sale') ? status : undefined,
      isMine && userId,
    );
  }

  @Roles('Admin', 'Employee')
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateTicketDto: UpdateTicketDto,
  ) {
    const ticket = await this.ticketsService.findById(+id);
    if (!ticket) {
      throw new BadRequestException('Ticket not found');
    }
    if ((ticket as any).status_id !== 1) {
      throw new BadRequestException('Ticket not for sale');
    }

    return this.ticketsService.update(+id, updateTicketDto);
  }

  @Roles('Admin', 'Employee')
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.ticketsService.remove(+id);
  }

  @Public()
  @Post('buy/:id')
  async buy(
    @Param('id') id: string,
    @Body() { passport, fio, email }: BuyTicketDto,
    @UserParam() user: User,
  ) {
    let clientAccount = user.role === UserRole.Client && user;
    let isAccountCreated = false;
    const createAccount = async () => {
      clientAccount = await this.usersService.create({
        login: email,
        password: String(passport),
        role: UserRole.Client,
      });
      isAccountCreated = true;
    };

    const ticket = await this.ticketsService.findById(+id);
    if (!ticket) {
      throw new BadRequestException('Ticket not found');
    }
    if ((ticket as any).status_id !== 1) {
      throw new BadRequestException('Ticket is not for sale');
    }

    let client: Client = await this.clientsService.findByPassport(+passport);
    if (!client) {
      if (!clientAccount) {
        await createAccount();
      }

      client = await this.clientsService.create({
        passport: +passport,
        fio,
        user_id: clientAccount.id,
      });
    }
    if (!clientAccount && !client.user_id) {
      await createAccount();
      client.user_id = clientAccount.id;
    }

    await this.ticketsService.buy(+id, client.id);

    return { isAccountCreated };
  }

  @Roles('Admin', 'Cashier')
  @Post('confirm/:id')
  async confirm(@Param('id') id: string) {
    const ticket = await this.ticketsService.findById(+id);
    if (!ticket) {
      throw new BadRequestException('Ticket not found');
    }
    if ((ticket as any).status_id !== 2) {
      throw new BadRequestException('Ticket not under control');
    }

    return this.ticketsService.confirm(+id);
  }

  @Roles('Admin', 'Cashier')
  @Post('deny/:id')
  async deny(@Param('id') id: string) {
    const ticket = await this.ticketsService.findById(+id);
    if (!ticket) {
      throw new BadRequestException('Ticket not found');
    }
    if ((ticket as any).status_id !== 2) {
      throw new BadRequestException('Ticket not under control');
    }

    return this.ticketsService.deny(+id);
  }

  @Public()
  @Get('/types')
  getTypes() {
    return this.ticketsService.getTypes();
  }

  @Public()
  @Get('/statuses')
  getStatuses() {
    return this.ticketsService.getStatuses();
  }
}
