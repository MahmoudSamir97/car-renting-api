// import { getDatabaseConfig } from './src/config';
// import 'dotenv/config';
// import { DataSource } from 'typeorm';

// export default new DataSource({
//   ...getDatabaseConfig(process.env),
//   entities: ['src/**/*.entity.ts'],
//   migrations: ['src/migrations/*.ts'],
// });
import { config } from 'dotenv';
import { DataSource } from 'typeorm';
import { getDatabaseConfig } from './src/config/database.config';

config({
  path: `.env.${process.env.NODE_ENV}`,
});

console.log({
  NODE_ENV: process.env.NODE_ENV,
  DB_NAME: process.env.DB_NAME,
});

export default new DataSource({
  ...getDatabaseConfig(process.env),
  entities: ['src/**/*.entity.ts'],
  migrations: ['src/migrations/*.ts'],
});
