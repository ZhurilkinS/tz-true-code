import { Product } from 'src/product/entities/product.entity';
import { DataSource } from 'typeorm';
export const databaseConfig = new DataSource({
  type: 'postgres',
  url: process.env.DATABASE_URL,
  entities: [Product],
  migrations: [__dirname + '/../migrations/*{.ts,.js}'],
  synchronize: false,
  logging: true,
});
