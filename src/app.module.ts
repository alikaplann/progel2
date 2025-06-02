import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { join } from 'path';
import { GroupModule } from './group/group.module';
import { ServeStaticModule } from '@nestjs/serve-static';//login ekranı için
import {CacheModule} from '@nestjs/cache-manager'; // cache için
import { redisStore } from 'cache-manager-redis-store';    
import { NotificationModule } from './notification/notification.module';
import * as dotenv from 'dotenv';
dotenv.config(); // .env dosyasını yüklemek için
@Module({
  imports: [
    AuthModule,
    UserModule,
    GroupModule,
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'),
      exclude: ['/api*', '/auth*', '/users*', '/groups*'],
    }),
    CacheModule.register({
      store: redisStore,
      host: process.env.REDIS_HOST || 'localhost',
      port: +(process.env.REDIS_PORT || 6379),
      ttl: 60,                
      db: 0, 
      isGlobal: true, // Cache'i global olarak kullanmak için                 
    }),
    NotificationModule,
    // API yollarını hariç tut
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

