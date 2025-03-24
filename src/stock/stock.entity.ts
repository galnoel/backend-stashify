import { IsString, IsNotEmpty, IsInt, IsPositive, IsNumber, IsDateString, IsOptional } from 'class-validator';

export class StockItem {
    id: string;
    name: string;
    description?: string;
    quantity: number;
    price: number;
    product_type: string;
    // expired_date?: Date;
    created_at: Date;
    updated_at: Date;
  }
  
export class CreateStockItemDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsInt()
  @IsPositive()
  @IsOptional()
  quantity: number;

  @IsNumber()
  @IsPositive()
  price: number;

  @IsString()
  @IsNotEmpty()
  product_type: string;

  // @IsDateString()
  // @IsOptional()
  // expired_date?: Date;
}

export class UpdateStockItemDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsInt()
  @IsPositive()
  @IsOptional()
  quantity?: number;

  @IsNumber()
  @IsPositive()
  @IsOptional()
  price?: number;

  @IsString()
  @IsOptional()
  product_type?: string;

  // @IsDateString()
  // @IsOptional()
  // expired_date?: Date;
}