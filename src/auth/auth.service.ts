import { BadRequestException, ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { SupabaseClient, createClient } from '@supabase/supabase-js';
import { RegisterDto, LoginDto } from './auth.dto';

@Injectable()
export class AuthService {
  private supabase: SupabaseClient;

  constructor() {
    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_KEY;

    if (!supabaseUrl || !supabaseKey) {
      throw new Error('Supabase URL and Key must be provided');
    }

    this.supabase = createClient(supabaseUrl, supabaseKey);
  }

  async register(registerDto: RegisterDto) {
    if (!registerDto || !registerDto.email || !registerDto.password) {
      throw new BadRequestException('Email and password must be provided');
    }

    const { email, password } = registerDto;
    const { data, error } = await this.supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      if (error.message.includes('already registered')) {
        throw new ConflictException('Email already registered');
      }
      throw new BadRequestException(error.message);
    }

    return {
      message: 'Registration successful. Check your email for confirmation',
      user: data.user,
    };
  }

  async login({ email, password }: LoginDto) {
    const { data, error } = await this.supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return {
      access_token: data.session.access_token,
      refresh_token: data.session.refresh_token,
      user: data.user
    };
  }

  async logout(accessToken: string) {
    const { error } = await this.supabase.auth.signOut();
    if (error) throw new BadRequestException('Logout failed');
    return { message: 'Logout successful' };
  }
}