import { Injectable, NotFoundException, InternalServerErrorException, ConflictException } from '@nestjs/common';
import { SupabaseClient, createClient} from '@supabase/supabase-js';
import { CreateStockBatchDto, StockBatch } from './batch.entity';
import { CreateStockMovementDto } from '../stock_movement/movement.entity';

@Injectable()
export class StockBatchService {
  private supabase: SupabaseClient;
  
    constructor() {
      const supabaseUrl = process.env.SUPABASE_URL;
      const supabaseKey = process.env.SUPABASE_KEY;
  
      if (!supabaseUrl || !supabaseKey) {
        throw new Error('Supabase URL and Key must be provided');
      }
  
      this.supabase = createClient(supabaseUrl, supabaseKey);
    }

    async createBatch(dto: CreateStockBatchDto): Promise<StockBatch> {
      try {
        // Debug: Log the check query
        // console.log('Checking for existing batch with:', {
        //   product_id: dto.product_id,
        //   batch_number: dto.batch_number
        // });
    
        const { data: existingBatch, error: checkError } = await this.supabase
          .from('stock_batches')
          .select('*')
          // .eq('product_id', dto.product_id)
          // .eq('batch_number', dto.batch_number)
          // .maybeSingle();
    
        // console.log('Check result:', { existingBatch, checkError });
    
        // if (existingBatch) {
        //   console.log('Conflict detected:', existingBatch);
        //   throw new ConflictException('Batch already exists');
        // }
    
        const { data: newBatch, error: insertError } = await this.supabase
          .from('stock_batches')
          .insert(dto)
          .single();

        if (insertError) {
          console.error('Insert batch error:', insertError);
          throw new InternalServerErrorException('Failed to create batch');
        }

        return newBatch;
      } catch (error) {
        console.error('Create batch error:', error);
        throw error;
      }
    }

  async adjustStock(batchId: string, dto: CreateStockMovementDto, userId: string) {
    return this.supabase.rpc('handle_stock_adjustment', {
      p_batch_id: batchId,
      p_quantity: dto.quantity,
      p_type: dto.movement_type,
      p_user_id: userId
    });
  }

  async getBatch(batchId: string): Promise<StockBatch> {
    const { data, error } = await this.supabase
      .from('stock_batches')
      .select('*')
      .eq('id', batchId)
      .single();

    if (error) throw new NotFoundException('Batch not found');
    return data;
  }
}