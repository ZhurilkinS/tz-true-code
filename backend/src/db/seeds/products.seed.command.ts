import { Injectable } from '@nestjs/common';
import { ProductsSeedService } from './products.seed.service';
import { Command } from 'nestjs-command';

@Injectable()
export class ProductsSeedCommand {
  constructor(private readonly seedService: ProductsSeedService) {}

  @Command({
    command: 'seed:products',
    describe: 'Seed the database with sample products',
  })
  async seed() {
    console.log('🌱 Начинаем заполнение базы тестовыми товарами...');
    await this.seedService.seedProducts();
  }

  @Command({
    command: 'check:products',
    describe: 'Check products count in database',
  })
  async check() {
    const count = await this.seedService.getProductsCount();
    console.log(`📊 Товаров в базе: ${count}`);
  }
}
