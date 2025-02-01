import { registerAs } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export default registerAs('database',
  (): TypeOrmModuleOptions => ({
    type: 'postgres',
    host: process.env.DATABASE_HOST || 'localhost',
    port: parseInt(process.env.DATABASE_PORT, 10) || 5432,
    username: process.env.DATABASE_USER || "student",
    password: process.env.DATABASE_PASSWORD || "student",
    database: process.env.DATABASE_NAME || "kupipodariday",
    autoLoadEntities: true,
    synchronize: true,
  }))