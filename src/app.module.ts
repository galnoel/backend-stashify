import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { StockController } from './stock.controller';
import { StockService } from './stock.service';
import { AuthController } from './auth/auth.contoller';
import { AuthService } from './auth/auth.service';

@Module({
  imports: [],
  controllers: [AppController, StockController, AuthController],
  providers: [AppService, StockService, AuthService],
})
export class AppModule {}
