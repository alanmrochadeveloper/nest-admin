import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  PipeTransform,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from 'src/auth/auth.guard';
import { PaginatedResult } from 'src/interfaces/paginated-result.interface';
import { User } from 'src/user/models/user.entity';
import { CreateProductDTO } from './dto/create-product.dto';
import { UpdateProductDTO } from './dto/update-product.dto';
import { Product } from './entity/product.entity';
import { ProductService } from './product.service';

@UseGuards(AuthGuard)
@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}
  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Product> {
    return this.productService.findOne(id);
  }

  @Get()
  async all(
    @Query('page') page: string = '1',
    @Query('take') take: string = '1',
  ): Promise<PaginatedResult> {
    return this.productService.paginate(+page, +take);
  }
  @Post()
  async create(@Body() body: CreateProductDTO): Promise<Product> {
    return await this.productService.create(body);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() body: UpdateProductDTO,
  ): Promise<User> {
    return await this.productService.update(id, body);
  }

  @Delete(':id')
  async delete(@Param('id') id: string): Promise<Product> {
    return await this.productService.delete(id);
  }
}
