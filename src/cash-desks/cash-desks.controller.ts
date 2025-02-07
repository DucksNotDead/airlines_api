import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { CashDesksService } from './cash-desks.service';
import { CashDeskDto } from './dto/cash-desk.dto';
import { Roles } from '../../shared/decorators/roles.method';
import { Public } from '../../shared/decorators/public.method';

@Controller('cash-desks')
export class CashDesksController {
  constructor(private readonly cashDesksService: CashDesksService) {}

  @Roles('Admin')
  @Post()
  create(@Body() createCashDeskDto: CashDeskDto) {
    return this.cashDesksService.create(createCashDeskDto);
  }

  @Public()
  @Get()
  findAll() {
    return this.cashDesksService.findAll();
  }

  @Roles('Admin')
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCashDeskDto: CashDeskDto) {
    return this.cashDesksService.update(+id, updateCashDeskDto);
  }

  @Roles('Admin')
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.cashDesksService.remove(+id);
  }
}
