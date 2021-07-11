import { IsDecimal, IsNotEmpty, IsNumber, Length } from 'class-validator';

export class CreateProductDTO {
  @IsNotEmpty()
  @Length(3, 50)
  title: string;
  @IsNotEmpty()
  @Length(3, 150)
  description: string;
  @IsNotEmpty()
  @Length(5, 500)
  image?: string;

  @IsNumber()
  price?: number;
}
