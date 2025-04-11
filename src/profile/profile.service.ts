// auth.service.ts
import {
    BadRequestException,
    ConflictException,
    Injectable,
    InternalServerErrorException,
    UnauthorizedException,
  } from '@nestjs/common';
  import { SupabaseClient, createClient } from '@supabase/supabase-js';
  import { Response } from 'express';
  import { JwtService } from '@nestjs/jwt';
  import { UpdateProfileDto} from './update-user.dto';
  
  @Injectable()
  export class ProfileService {
    private supabase: SupabaseClient;
    private supabaseAdmin: SupabaseClient;
  
    constructor(private readonly jwtService: JwtService) {
      const supabaseUrl = process.env.SUPABASE_URL;
      const supabaseKey = process.env.SUPABASE_KEY;
      const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY;
  
      if (!supabaseUrl || !supabaseKey || !supabaseServiceKey) {
        throw new Error('Supabase environment variables are not set');
      }
  
      this.supabase = createClient(supabaseUrl, supabaseKey);
      this.supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);
    }
  
    private setAuthCookies(res: Response, accessToken: string, refreshToken: string) {
      res.cookie('access_token', accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'none',
        maxAge: 15 * 60 * 1000, // 15 minutes
      });
  
      res.cookie('refresh_token', refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'none',
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      });
    }
  
    async updateUser(userId: string, updateDto: UpdateProfileDto, res: Response) {
      try {
        // 1. Update email in the Auth record (if provided)
        if (updateDto.email) {
          const { data: updatedAuth, error: authError } =
            await this.supabaseAdmin.auth.admin.updateUserById(userId, {
              email: updateDto.email,
            });
            if (authError) {
              console.error('Auth update error:', authError);
              throw new BadRequestException(authError.message);
           }
        }
  
        // 2. Prepare update data for the profiles table.
        const updateData: any = {};
        if (updateDto.username) updateData.username = updateDto.username;
        if (updateDto.fullname) updateData.fullname = updateDto.fullname;
  
        if (Object.keys(updateData).length > 0) {
          const { error: profileError } = await this.supabaseAdmin
            .from('profiles')
            .update(updateData)
            .eq('id', userId);
  
          if (profileError) {
            throw new InternalServerErrorException(profileError.message);
          }
        }
  
        return res.status(200).json({
          message: 'User updated successfully',
        });
      } catch (error) {
        throw new InternalServerErrorException('Update process failed');
      }
    }
  
    // ------------------------------
    // New Method: Delete User
    // ------------------------------
    async deleteUser(userId: string, res: Response) {
      try {
        // Delete user from the Auth system.
        const { error } = await this.supabaseAdmin.auth.admin.deleteUser(userId);
        if (error) {
          throw new BadRequestException(error.message);
        }
  
        // Optionally, delete the user profile from the profiles table.
        // (Ensure your foreign key settings or cascading deletes are configured appropriately.)
        await this.supabaseAdmin
          .from('profiles')
          .delete()
          .eq('id', userId);
  
        return res.status(200).json({
          message: 'User deleted successfully',
        });
      } catch (error) {
        throw new InternalServerErrorException('User deletion failed');
      }
    }
  }