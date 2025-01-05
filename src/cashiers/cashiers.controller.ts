import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { CashiersService } from './cashiers.service';
import { CreateCashierDto } from './dto/create-cashier.dto';
import { UpdateCashierDto } from './dto/update-cashier.dto';
import { Roles } from '../../shared/decorators/roles.method';

@Controller('cashiers')
export class CashiersController {
  constructor(private readonly cashiersService: CashiersService) {}

  @Roles('Admin')
  @Post()
  create(@Body() createCashierDto: CreateCashierDto) {
    return this.cashiersService.create(createCashierDto);
  }

  @Roles('Admin')
  @Get()
  findAll() {
    return this.cashiersService.findAll();
  }

  @Roles('Admin')
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCashierDto: UpdateCashierDto) {
    return this.cashiersService.update(+id, updateCashierDto);
  }

  @Roles('Admin')
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.cashiersService.remove(+id);
  }
}
