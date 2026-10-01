import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ReviewService } from './review.service';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { ReviewDto } from './dto/review.dto';
import { CurrentUser } from 'src/user/decorators/user.decorator';

@Controller('reviews')
export class ReviewController {
  constructor(private readonly reviewService: ReviewService) {}

  @Auth()
  @Get('by-storeId/:storeId')
  async getByStoreId(
    @CurrentUser('id') userId: string,
    @Param('storeId') storeId: string,
  ) {
    return this.reviewService.getByStoreId(storeId, userId);
  }

  @UsePipes(new ValidationPipe())
  @HttpCode(200)
  @Auth()
  @Post(':productId/:storeId')
  async create(
    @CurrentUser('id') userId: string,
    @Param('productId') productId: string,
    @Param('storeId') storeId: string,
    @Body() dto: ReviewDto,
  ) {
    return this.reviewService.create(userId, productId, storeId, dto);
  }

  @HttpCode(200)
  @Auth()
  @Delete(':id')
  async delete(@CurrentUser('id') userId: string, @Param('id') id: string) {
    return this.reviewService.delete(id, userId);
  }
}
