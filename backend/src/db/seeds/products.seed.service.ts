import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { faker } from '@faker-js/faker';

import { Product } from 'src/product/entities/product.entity';

@Injectable()
export class ProductsSeedService {
  constructor(
    @InjectRepository(Product)
    private productsRepository: Repository<Product>,
  ) {}

  async seedProducts() {
    // Проверяем, есть ли уже товары
    const existingCount = await this.productsRepository.count();
    if (existingCount > 0) {
      console.log(
        `✅ В базе уже есть ${existingCount} товаров. Пропускаем сидинг.`,
      );
      return;
    }

    const products = this.generateProducts(20);

    try {
      await this.productsRepository.save(products);
      console.log('✅ 20 тестовых товаров успешно добавлены в базу данных');
      return products;
    } catch (error) {
      console.error('❌ Ошибка при добавлении тестовых товаров:', error);
      throw error;
    }
  }

  private generateProducts(count: number): Partial<Product>[] {
    const products: Partial<Product>[] = [];
    const brands = [
      'Apple',
      'Samsung',
      'Nike',
      'Adidas',
      'Sony',
      'LG',
      'Xiaomi',
      'Huawei',
      'Canon',
      'Nikon',
    ];

    for (let i = 1; i <= count; i++) {
      const hasDiscount = Math.random() > 0.5;
      const price = parseFloat(faker.commerce.price(500, 5000));
      const discountPrice = hasDiscount
        ? parseFloat((price * (1 - Math.random() * 0.3)).toFixed(2))
        : undefined;

      products.push({
        name: `${faker.commerce.product()} ${brands[i % brands.length]}`,
        description: faker.lorem.paragraph(3),
        price: price,
        discountPrice: discountPrice,
        article: `ART-${10000 + i}`,
        imageUrl: this.getRandomImageUrl(),
        isActive: Math.random() > 0.1, // 90% товаров активны
        createdAt: faker.date.past(1),
        updatedAt: faker.date.recent(),
      });
    }

    return products;
  }

  private getRandomImageUrl(): string {
    const imageNumbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    const randomImage =
      imageNumbers[Math.floor(Math.random() * imageNumbers.length)];
    return `https://picsum.photos/300/200?random=${randomImage}`;
  }

  async getProductsCount(): Promise<number> {
    return await this.productsRepository.count();
  }
}
