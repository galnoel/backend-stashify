import { Body, Controller, Delete, Get, Param, ParseUUIDPipe, Post, Put, UseGuards } from '@nestjs/common';
import { StockService } from './stock.service';
import { CreateStockItemDto, StockItem, UpdateStockItemDto } from './stock.entity';
import { JwtGuard } from './auth/auth.guard';
import { GetUser } from './auth/user.decorator';

@Controller('stock')
@UseGuards(JwtGuard)//for all routes
export class StockController {
  constructor(private readonly stockService: StockService) {}

  @Post()
  create(
    @Body() createDto: CreateStockItemDto,
    // @GetUser() user: any
  ): Promise<StockItem> {
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