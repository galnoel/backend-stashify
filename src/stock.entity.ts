export class StockItem {
    id: string;
    name: string;
    description?: string;
    quantity: number;
    price: number;
    created_at: Date;
    updated_at: Date;
  }
  
  export class CreateStockItemDto {
    name: string;
    description?: string;
    quantity: number;
    price: number;
  }
  
  export class UpdateStockItemDto {
    name?: string;
    description?: string;
    quantity?: number;
    price?: number;
  }