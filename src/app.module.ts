import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { StockController } from './stock/stock.controller';
import { StockService } from './stock/stock.service';
import { AuthController } from './auth/auth.contoller';
import { AuthService } from './auth/auth.service';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './auth/jwt.strategy';

@Module({
  imports: [
    JwtModule.register({
      global: true,
      secret: process.env.SUPABASE_JWT_SECRET,
})],
  controllers: [AppController, StockController, AuthController],
  providers: [AppService, StockService, AuthService, JwtStrategy],
})
export class AppModule {}
