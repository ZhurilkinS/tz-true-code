import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseInterceptors,
  UploadedFile,
  ParseIntPipe,
  HttpStatus,
  HttpCode,
  ParseFilePipe,
  MaxFileSizeValidator,
  FileTypeValidator,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductQueryDto } from './dto/product-query.dto';
import { Product } from './entities/product.entity';
import { ProductService } from './product.service';

@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  // Создание товара
  @Post()
  @UseInterceptors(FileInterceptor('image'))
  create(
    @Body() createProductDto: CreateProductDto,
    @UploadedFile(
      new ParseFilePipe({
        fileIsRequired: false,
        validators: [
          new MaxFileSizeValidator({ maxSize: 5 * 1024 * 1024 }), // 5MB
          new FileTypeValidator({ fileType: /(jpg|jpeg|png|gif)$/ }),
        ],
      }),
    )
    image?: Express.Multer.File,
  ): Promise<Product> {
    return this.productService.create(createProductDto, image);
  }

  // Получение всех товаров
  @Get()
  @HttpCode(HttpStatus.OK)
  findAll(
    @Query() query: ProductQueryDto,
  ): Promise<{ items: Product[]; total: number }> {
    return this.productService.findAll(query);
  }

  // Получение товара по ID
  @Get(':id')
  @HttpCode(HttpStatus.OK)
  findOne(@Param('id', ParseIntPipe) id: number): Promise<Product> {
    return this.productService.findOne(id);
  }

  // Поиск товаров по артикулу
  @Get('search/:article')
  @HttpCode(HttpStatus.OK)
  findByArticle(@Param('article') article: string): Promise<Product[]> {
    return this.productService.findByArticle(article);
  }

  // Обновление товара
  @Patch(':id')
  @UseInterceptors(FileInterceptor('image'))
  @HttpCode(HttpStatus.OK)
  update(
    @Param('id') id: number,
    @Body() updateProductDto: UpdateProductDto,
    @UploadedFile(
      new ParseFilePipe({
        fileIsRequired: false,
        validators: [
          new MaxFileSizeValidator({ maxSize: 5 * 1024 * 1024 }), // 5MB
          new FileTypeValidator({ fileType: /(jpg|jpeg|png|gif)$/ }),
        ],
      }),
    )
    image?: Express.Multer.File,
  ) {
    return this.productService.update(id, updateProductDto, image);
  }

  // Удаление товара
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.productService.remove(id);
  }

  // Удаление изображения товара
  @Delete(':id/image')
  @HttpCode(HttpStatus.OK)
  removeImage(@Param('id', ParseIntPipe) id: number): Promise<Product> {
    return this.productService.removeImage(id);
  }
}
