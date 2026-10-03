import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { ProductDto } from './dto/product.dto';
import { PopularQueryDto } from './dto/popular-query.dto';
import { ProductQueryDto } from './dto/product-query.dto';
import { CurrentUser } from 'src/user/decorators/user.decorator';

@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Get()
  async getAll(@Query() query: ProductQueryDto) {
    return this.productService.getAll(query);
  }

  @Get('by-storeId/:storeId')
  async getByStoreId(@Param('storeId') storeId: string) {
    return this.productService.getByStoreId(storeId);
  }

  @Get('by-id/:id')
  async getById(@Param('id') id: string) {
    return this.productService.getById(id);
  }

  @Get('most-popular')
  async getMostPopular(@Query() query: PopularQueryDto) {
    return this.productService.getMostPopular(query.limit);
  }

  @Get('similar/:id')
  async getSimilar(@Param('id') id: string) {
    return this.productService.getSimilar(id);
  }

  @HttpCode(200)
  @Auth()
  @Post(':storeId')
  async create(
    @CurrentUser('id') userId: string,
    @Param('storeId') storeId: string,
    @Body() dto: ProductDto,
  ) {
    return this.productService.create(storeId, userId, dto);
  }

  @HttpCode(200)
  @Auth()
  @Put(':id')
  async update(
    @CurrentUser('id') userId: string,
    @Param('id') id: string,
    @Body() dto: ProductDto,
  ) {
    return this.productService.update(id, userId, dto);
  }

  @HttpCode(200)
  @Auth()
  @Delete(':id')
  async delete(@CurrentUser('id') userId: string, @Param('id') id: string) {
    return this.productService.delete(id, userId);
  }
}
