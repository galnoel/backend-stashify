import { 
    IsUUID, 
    IsEnum, 
    IsInt, 
    IsPositive 
  } from 'class-validator';
  
  // CREATE DTO
  export class CreateStockMovementDto {  
    @IsUUID()
    batch_id: string;
  
    @IsEnum(['IN', 'OUT'])
    movement_type: 'IN' | 'OUT';
  
    @IsInt()
    @IsPositive()
    quantity: number;
  }
  
  // RESPONSE DTO
  export class StockMovementResponseDto {
    id: string;
    batch_id: string;
    movement_type: 'IN' | 'OUT';
    quantity: number;
    movement_date: Date;
    user_id: string;
  }
  
 