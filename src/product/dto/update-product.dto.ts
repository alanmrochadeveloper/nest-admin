import { IsNotEmpty, IsNumber, IsOptional, Length } from 'class-validator';
import { CreateProductDTO } from './create-product.dto';

export class UpdateProductDTO {
  @IsOptional()
  @Length(3, 50)
  title?: string;
  @IsOptional()
  @IsNotEmpty()
  @Length(3, 150)
  description?: string;
  @IsOptional()
  @IsNotEmpty()
  @Length(5, 500)
  image?: string;
  @IsOptional()
  @IsNumber()
  price?: number;
}
