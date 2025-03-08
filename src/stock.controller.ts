import { Body, Controller, Delete, Get, Param, ParseUUIDPipe, Post, Put } from '@nestjs/common';
import { StockService } from './stock.service';
import { CreateStockItemDto, StockItem, UpdateStockItemDto } from './stock.entity';

@Controller('stock')
export class StockController {
  constructor(private readonly stockService: StockService) {}

  @Post()
  create(@Body() createDto: CreateStockItemDto): Promise<StockItem> {
    return this.stockService.create(createDto);
  }

  @Get()
  findAll(): Promise<StockItem[]> {
    return this.stockService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string): Promise<StockItem> {
    return this.stockService.findOne(id);
  }

  @Put(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateDto: UpdateStockItemDto
  ): Promise<StockItem> {
    return this.stockService.update(id, updateDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    return this.stockService.remove(id);
  }
}