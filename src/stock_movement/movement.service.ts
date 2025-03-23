import { Injectable, NotFoundException } from '@nestjs/common';
import { SupabaseClient, createClient } from '@supabase/supabase-js';
import { CreateStockMovementDto, StockMovementResponseDto } from './movement.entity';

@Injectable()
export class StockMovementService {
  private supabase: SupabaseClient;

  constructor() {
    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_KEY;

    if (!supabaseUrl || !supabaseKey) {
      throw new Error('Supabase URL and Key must be provided');
    }

    this.supabase = createClient(supabaseUrl, supabaseKey);
  }

  async getBatchMovements(batchId: string, page = 1, limit = 10) {
    const { data, error } = await this.supabase
      .from('stock_movements')
      .select('*')
      .eq('batch_id', batchId)
      .order('movement_date', { ascending: false })
      .range((page - 1) * limit, page * limit - 1);

    if (error) throw new NotFoundException('No movements found');
    return data;
  }
}