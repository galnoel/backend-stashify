import { Body, Controller, Delete, Get, Param, ParseUUIDPipe, Post, Put, UseGuards, Query } from '@nestjs/common';
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
  async findAll(
    @Query('start_date') startDate?: string,
    @Query('end_date') endDate?: string,
    @Query('sort') sort: 'asc' | 'desc' = 'desc'
  ): Promise<StockItem[]> {
    return this.stockService.findAll(startDate, endDate, sort);
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

