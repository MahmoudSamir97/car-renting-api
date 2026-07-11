import { IsBoolean } from 'class-validator';

export class ApproverReportDTO {
  @IsBoolean()
  approved!: boolean;
}
