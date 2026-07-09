import { AuthGuard } from '@/guards/auth.guard';
import { Serialize } from '@/interceptors/serilaize.interceptor';
import { CreateReportDTO } from '@/reports/dtos/create-report-dto';
import { ReportDTO } from '@/reports/dtos/report.dto';
import { ReportsService } from '@/reports/reports.service';
import { currentUser } from '@/users/decorators/current-user.decorator';
import { User } from '@/users/user.entity';
import { Body, Controller, Post, UseGuards } from '@nestjs/common';

@Controller('reports')
export class ReportsController {
  constructor(private reportsService: ReportsService) {}

  @Post()
  @UseGuards(AuthGuard)
  @Serialize(ReportDTO)
  createReport(@Body() body: CreateReportDTO, @currentUser() user: User) {
    return this.reportsService.create(body, user);
  }
}
