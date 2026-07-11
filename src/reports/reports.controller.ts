import { AdminGuard } from '@/guards/admin.guard';
import { AuthGuard } from '@/guards/auth.guard';
import { Serialize } from '@/interceptors/serilaize.interceptor';
import { ApproverReportDTO } from '@/reports/dtos/approve-report-dto';
import { CreateReportDTO } from '@/reports/dtos/create-report-dto';
import { GetEstimateDTO } from '@/reports/dtos/get-estimate-dto';
import { ReportDTO } from '@/reports/dtos/report.dto';
import { ReportsService } from '@/reports/reports.service';
import { currentUser } from '@/users/decorators/current-user.decorator';
import { User } from '@/users/user.entity';
import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';

@Controller('reports')
export class ReportsController {
  constructor(private reportsService: ReportsService) {}

  @Get()
  getEstimate(@Query() query: GetEstimateDTO) {
    return this.reportsService.createEstimate(query);
  }

  @Post()
  @UseGuards(AuthGuard)
  @Serialize(ReportDTO)
  createReport(@Body() body: CreateReportDTO, @currentUser() user: User) {
    return this.reportsService.create(body, user);
  }

  @Patch('/:id')
  @UseGuards(AdminGuard)
  approveReport(@Param('id') id: number, @Body() Body: ApproverReportDTO) {
    return this.reportsService.changeApproval(id, Body.approved);
  }
}
