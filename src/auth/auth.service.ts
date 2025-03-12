import { BadRequestException, ConflictException, Injectable, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import { SupabaseClient, createClient } from '@supabase/supabase-js';
import { RegisterDto, LoginDto } from './auth.dto';

@Injectable()
export class AuthService {
  private supabase: SupabaseClient;
  private supabaseAdmin: SupabaseClient;

  constructor() {
    const supabaseUrl = process.env.SUPABASE_URL as string;
    const supabaseKey = process.env.SUPABASE_KEY as string;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY as string;

    if (!supabaseUrl || !supabaseKey || !supabaseServiceKey) {
      throw new Error('Supabase environment variables are not set');
    }

    this.supabase = createClient(supabaseUrl, supabaseKey);
    this.supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);
  }

  async register(registerDto: RegisterDto) {
    // Check username availability
    const { data: existingUser } = await this.supabase
      .from('profiles')
      .select('username')
      .eq('username', registerDto.username)
      .single();

    if (existingUser) {
      throw new ConflictException('Username already exists');
    }

    // Create auth user
    const { data: authData, error: authError } = await this.supabase.auth.signUp({
      email: registerDto.email,
      password: registerDto.password,
    });

    if (authError) {
      throw new BadRequestException(authError.message);
    }

    // Create profile
    const { error: profileError } = await this.supabase
      .from('profiles')
      .insert([{
        id: authData.user?.id ?? '',
        username: registerDto.username,
        fullname: registerDto.fullname
      }]);

    if (profileError) {
      // Rollback user creation if profile fails
      if (authData.user) {
        await this.supabaseAdmin.auth.admin.deleteUser(authData.user.id);
      }
      throw new InternalServerErrorException('Registration failed');
    }

    return {
      message: 'Registration successful. Please check your email for verification',
      user: authData.user
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
    if (error) {
      throw new BadRequestException('Logout failed');
    }
    return { message: 'Logout successful' };
  }

  private validateEmail(email: string): boolean {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  }
}