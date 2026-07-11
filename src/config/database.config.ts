import { DataSourceOptions } from 'typeorm';

export function getDatabaseConfig(env: NodeJS.ProcessEnv): DataSourceOptions {
  switch (env.NODE_ENV) {
    case 'development':
      return {
        type: 'sqlite',
        database: env.DB_NAME!,
        synchronize: true,
      };

    case 'test':
      return {
        type: 'sqlite',
        database: env.TEST_DB_NAME!,
        synchronize: false,
      };

    case 'production':
      return {
        type: 'postgres',
        host: env.DB_HOST!,
        port: Number(env.DB_PORT),
        username: env.DB_USERNAME!,
        password: env.DB_PASSWORD!,
        database: env.DB_NAME!,
        synchronize: false,
      };

    default:
      throw new Error(`Unknown NODE_ENV: ${env.NODE_ENV}`);
  }
}
