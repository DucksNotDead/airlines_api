import { Body, Controller, Delete, Get, Param, Patch } from '@nestjs/common';
import { ClientsService } from './clients.service';
import { UpdateClientDto } from './dto/update-client.dto';
import { Roles } from '../../shared/decorators/roles.method';

@Controller('clients')
export class ClientsController {
  constructor(private readonly clientsService: ClientsService) {}

  @Roles('Admin', 'Employee')
  @Get()
  findAll() {
    return this.clientsService.findAll();
  }

  @Roles('Admin', 'Employee')
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateClientDto: UpdateClientDto) {
    return this.clientsService.update(+id, updateClientDto);
  }

  @Roles('Admin', 'Employee')
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.clientsService.remove(+id);
  }
}
