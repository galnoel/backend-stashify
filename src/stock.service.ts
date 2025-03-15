import { Injectable, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { SupabaseClient, createClient } from '@supabase/supabase-js';
import { CreateStockItemDto, StockItem, UpdateStockItemDto } from './stock.entity';

@Injectable()
export class StockService {
  private supabase: SupabaseClient;

  constructor() {
    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_KEY;

    if (!supabaseUrl || !supabaseKey) {
      throw new Error('Supabase URL and Key must be provided');
    }

    this.supabase = createClient(supabaseUrl, supabaseKey);
  }

  async create(item: CreateStockItemDto): Promise<StockItem> {
    const { data, error } = await this.supabase
      .from('stock')
      .insert([item])
      .select()
      .single();

    if (error) {
      throw new Error(`Supabase error [${error.code}]: ${error.message}`);
    }
    return data;
  }

  async findAll(
    startDate?: string,
    endDate?: string,
    sort: 'asc' | 'desc' = 'desc'
  ): Promise<StockItem[]> {
    let query = this.supabase
      .from('stock')
      .select('*');
  
    // Date filter
    if (startDate && endDate) {
      query = query.gte('created_at', startDate)
                   .lte('created_at', endDate);
    }
  
    // Sorting
    query = query.order('created_at', { ascending: sort === 'asc' });
  
    const { data, error } = await query;
    
    if (error) throw new InternalServerErrorException(error.message);
    return data;
  }

  async findOne(id: string): Promise<StockItem> {
    const { data, error } = await this.supabase
      .from('stock')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        throw new NotFoundException(`Stock item not found. Details: ${error.message}`);
      }
      throw new Error(`Supabase error [${error.code}]: ${error.message}`);
    }
    return data;
  }

  async update(id: string, updateDto: UpdateStockItemDto): Promise<StockItem> {
    const { data, error } = await this.supabase
      .from('stock')
      .update({ ...updateDto, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        throw new NotFoundException(`Stock item not found. Details: ${error.message}`);
      }
      throw new Error(`Supabase error [${error.code}]: ${error.message}`);
    }
    return data;
  }

  async remove(id: string): Promise<void> {
    const { error } = await this.supabase
      .from('stock')
      .delete()
      .eq('id', id);

    if (error) {
      if (error.code === 'PGRST116') {
        throw new NotFoundException(`Stock item not found. Details: ${error.message}`);
      }
      throw new Error(`Supabase error [${error.code}]: ${error.message}`);
    }
  }
}