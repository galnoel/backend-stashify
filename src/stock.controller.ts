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
    @GetUser() user: { id: string },
  ): Promise<StockItem> {
    return this.stockService.create(createDto, user.id);
  }

  @Get()
  async findAll(
    @GetUser() user: {id: string},
    @Query('start_date') startDate?: string,
    @Query('end_date') endDate?: string,
    @Query('sort') sort: 'asc' | 'desc' = 'desc'
  ): Promise<StockItem[]> {
    return this.stockService.findAll(user.id, startDate, endDate, sort);
  }

  @Get(':id')
  findOne(
    @Param('id', ParseUUIDPipe) id: string,
    @GetUser() user: {id: string},
  ): Promise<StockItem> {
    return this.stockService.findOne(id, user.id);
  }

  @Put(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateDto: UpdateStockItemDto,
    @GetUser() user: {id: string},
  ): Promise<StockItem> {
    return this.stockService.update(id, updateDto, user.id);
  }

  @Delete(':id')
  remove(
    @Param('id', ParseUUIDPipe) id: string,
    @GetUser() user: {id: string},
  ): Promise<void> {
    return this.stockService.remove(id, user.id);
  }
}

