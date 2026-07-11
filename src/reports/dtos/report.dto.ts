import { Report } from '@/reports/report.entity';
import { Expose, Transform } from 'class-transformer';

export class ReportDTO {
  @Expose()
  id!: number;
  @Expose()
  price!: number;
  @Expose()
  mileage!: number;
  @Expose()
  year!: number;
  @Expose()
  lng!: number;
  @Expose()
  lat!: number;
  @Expose()
  make!: string;
  @Expose()
  model!: string;

  @Expose()
  approved!: boolean;

  @Transform(({ obj }) => (obj as Report).id)
  @Expose()
  userId!: number;
}
