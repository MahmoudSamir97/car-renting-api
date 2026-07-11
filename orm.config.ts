import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { getDatabaseConfig } from '@/config/database.config';

export function getOrmConfig(
  configService: ConfigService,
): TypeOrmModuleOptions {
  return {
    ...getDatabaseConfig(process.env),
    autoLoadEntities: true,
  };
}
