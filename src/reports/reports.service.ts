import { CreateReportDTO } from '@/reports/dtos/create-report-dto';
import { GetEstimateDTO } from '@/reports/dtos/get-estimate-dto';
import { Report } from '@/reports/report.entity';
import { User } from '@/users/user.entity';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class ReportsService {
  constructor(@InjectRepository(Report) private repo: Repository<Report>) {}

  createEstimate({ make, mileage, lat, lng, year, model }: GetEstimateDTO) {
    return this.repo
      .createQueryBuilder()
      .select('AVG(price)', 'avgPrice')
      .where('make = :make', { make })
      .andWhere('model = :model', { model })
      .andWhere('lng - :lng BETWEEN -5 AND 5 ', { lng })
      .andWhere('lat - :lat BETWEEN -5 AND 5 ', { lat })
      .andWhere('year - :year BETWEEN -3 AND 3 ', { year })
      .andWhere('approved IS TRUE ')
      .orderBy('ABS(mileage - :mileage )', 'DESC')
      .setParameters({ mileage })
      .limit(3)
      .getRawOne();
  }

  create(reportDTO: CreateReportDTO, user: User) {
    const report = this.repo.create(reportDTO);
    report.user = user;
    return this.repo.save(report);
  }

  async changeApproval(id: number, approved: boolean) {
    const report = await this.repo.findOneBy({ id });
    if (!report) throw new NotFoundException('No report found!');

    report.approved = approved;

    return this.repo.save(report);
  }
}
