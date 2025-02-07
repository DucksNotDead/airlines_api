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
import { CashiersService } from '../cashiers/cashiers.service';

@Controller('tickets')
export class TicketsController {
  constructor(
    private readonly ticketsService: TicketsService,
    private readonly clientsService: ClientsService,
    private readonly usersService: UsersService,
    private readonly cashiersService: CashiersService,
  ) {}

  @Roles('Admin', 'Employee')
  @Post()
  async create(@Body() createTicketDto: CreateTicketDto) {
    const ticket = await this.ticketsService.create(createTicketDto);
    if (ticket) {
      return { message: 'Ticket was created' };
    }
  }

  @Public()
  @Get()
  async findAll(
    @Query('status') status: TTicketStatus,
    @UserParam() user: User,
  ) {
    const clientId: undefined | number | null = user
      ? user.role === UserRole.Client
        ? ((await this.clientsService.findByUserId(user.id))?.id ?? null)
        : undefined
      : null;

    return this.ticketsService.findAll(status, clientId);
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

    await this.ticketsService.update(+id, updateTicketDto);

    return { message: 'Ticket was updated' };
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
    @Body() dto: BuyTicketDto,
    @UserParam() user: User,
  ) {
    let clientAccount = user?.role === UserRole.Client && user;
    let isAccountCreated = false;
    const createAccount = async () => {
      clientAccount = await this.usersService.create({
        login: dto.email,
        password: String(dto.passport),
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

    let client: Client = await this.clientsService.findByPassport(dto.passport);
    if (!client) {
      if (!clientAccount) {
        await createAccount();
      }

      client = await this.clientsService.create({
        passport: dto.passport,
        fio: dto.fio,
        user_id: clientAccount.id,
      });
    }
    if (!clientAccount && !client.user_id) {
      await createAccount();
      client.user_id = clientAccount.id;
    }

    await this.ticketsService.buy(+id, client.id);

    client.passport = Number(client.passport);

    return { isAccountCreated, client };
  }

  @Roles('Admin', 'Cashier')
  @Post('confirm/:id')
  async confirm(
    @Param('id') id: string,
    @UserParam() { id: userId }: User,
    @Body() { cash_desk_id }: { cash_desk_id: number },
  ) {
    const ticket = await this.ticketsService.findById(+id);
    if (!ticket) {
      throw new BadRequestException('Ticket not found');
    }
    if ((ticket as any).status_id !== 2) {
      throw new BadRequestException('Ticket not under control');
    }
    const cashier = await this.cashiersService.findByUserId(userId);
    if (!cashier) {
      throw new BadRequestException('Cashier not found');
    }

    await this.ticketsService.confirm(+id, cashier.id, cash_desk_id);

    return { message: 'Confirmed' };
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

    await this.ticketsService.deny(+id);

    return { message: 'Denied' };
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
