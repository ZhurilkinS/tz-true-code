import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like, Between, FindOptionsWhere } from 'typeorm';
import { Product } from './entities/product.entity';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductQueryDto } from './dto/product-query.dto';
import { extname, join } from 'path';
import { existsSync } from 'fs';
import { mkdir, writeFile } from 'fs/promises';
import { randomUUID } from 'crypto';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private readonly productsRepository: Repository<Product>,
  ) {}

  // Создание товара
  async create(
    createProductDto: CreateProductDto,
    image?: Express.Multer.File,
  ): Promise<Product> {
    // Проверяем уникальность артикула
    const existingProduct = await this.productsRepository.findOne({
      where: { article: createProductDto.article },
    });

    if (existingProduct) {
      throw new ConflictException(
        `Товар с артикулом ${createProductDto.article} уже существует`,
      );
    }

    const productData: Partial<Product> = { ...createProductDto };

    // Обрабатываем изображение если оно есть
    if (image) {
      const fileExtension = extname(image.originalname);
      const uniqueFileName = `${randomUUID()}${fileExtension}`;
      productData.imageUrl = `/uploads/${uniqueFileName}`;

      // Сохраняем файл на диск
      await this.saveImageFile(image.buffer, uniqueFileName);
    } else {
      // Можно установить изображение по умолчанию или оставить null
      productData.imageUrl = undefined;
    }

    // Создаем товар
    const product = this.productsRepository.create(productData);
    return await this.productsRepository.save(product);
  }
  // Получение всех товаров с пагинацией и фильтрацией
  async findAll(
    query: ProductQueryDto,
  ): Promise<{ items: Product[]; total: number }> {
    const {
      page = 1,
      limit = 10,
      sortBy = 'name',
      sortOrder = 'ASC',
      minPrice,
      maxPrice,
      search,
    } = query;

    const skip = (page - 1) * limit;
    const where: FindOptionsWhere<Product> = {};

    // Поиск по названию
    if (search) {
      where.name = Like(`%${search}%`);
    }

    // Фильтр по цене
    if (minPrice !== undefined || maxPrice !== undefined) {
      where.price = Between(minPrice || 0, maxPrice || Number.MAX_SAFE_INTEGER);
    }

    const [items, total] = await this.productsRepository.findAndCount({
      where,
      order: { [sortBy]: sortOrder },
      skip,
      take: limit,
    });

    return { items, total };
  }

  // Получение одного товара по ID
  async findOne(id: number): Promise<Product> {
    const product = await this.productsRepository.findOne({
      where: { id },
    });

    if (!product) {
      throw new NotFoundException(`Товар с ID ${id} не найден`);
    }

    return product;
  }

  // Обновление товара
  async update(
    id: number,
    updateProductDto: UpdateProductDto,
    image?: Express.Multer.File,
  ): Promise<Product> {
    await this.findOne(id);

    const updateData: Partial<Product> = { ...updateProductDto };

    // Обновляем изображение если оно есть
    if (image) {
      // Генерируем уникальное имя файла
      const fileExtension = extname(image.originalname);
      const uniqueFileName = `${randomUUID()}${fileExtension}`;
      updateData.imageUrl = `/uploads/${uniqueFileName}`;

      // Сохраняем файл на диск
      await this.saveImageFile(image.buffer, uniqueFileName);
    }

    await this.productsRepository.update(id, updateData);
    return await this.findOne(id);
  }

  private async saveImageFile(buffer: Buffer, fileName: string): Promise<void> {
    const uploadsDir = join(process.cwd(), 'uploads');

    // Создаем директорию если не существует
    if (!existsSync(uploadsDir)) {
      await mkdir(uploadsDir, { recursive: true });
    }

    // Сохраняем файл
    const filePath = join(uploadsDir, fileName);
    await writeFile(filePath, buffer);
  }
  // Удаление товара
  async remove(id: number): Promise<void> {
    const result = await this.productsRepository.delete(id);

    if (result.affected === 0) {
      throw new NotFoundException(`Товар с ID ${id} не найден`);
    }
  }

  // Удаление изображения товара
  async removeImage(id: number): Promise<Product> {
    const product = await this.findOne(id);

    product.imageUrl = undefined;
    return await this.productsRepository.save(product);
  }

  // Поиск товаров по артикулу
  async findByArticle(article: string): Promise<Product[]> {
    return await this.productsRepository.find({
      where: { article: Like(`%${article}%`) },
    });
  }
}
