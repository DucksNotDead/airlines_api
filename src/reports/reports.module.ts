import { Module } from '@nestjs/common';
import { ReportsService } from './reports.service';
import { ReportsController } from './reports.controller';
import { PdfService } from './pdf.service';
import { CompaniesModule } from '../companies/companies.module';

@Module({
  imports: [CompaniesModule],
  controllers: [ReportsController],
  providers: [ReportsService, PdfService],
})
export class ReportsModule {}
