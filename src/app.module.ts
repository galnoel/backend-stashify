import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { StockController } from './stock.controller';
import { StockService } from './stock.service';
import { AuthController } from './auth/auth.contoller';
import { AuthService } from './auth/auth.service';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    JwtModule.register({
      global: true,
      secret: process.env.SUPABASE_JWT_SECRET,
})],
  controllers: [AppController, StockController, AuthController],
  providers: [AppService, StockService, AuthService],
})
export class AppModule {}
