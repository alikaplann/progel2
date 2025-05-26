import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { join } from 'path';
import { GroupModule } from './group/group.module';
import { ServeStaticModule } from '@nestjs/serve-static';//login ekranı için
@Module({
  imports: [
    AuthModule,
    UserModule,
    GroupModule,
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'),
      exclude: ['/api*', '/auth*', '/users*', '/groups*'],
    }), // API yollarını hariç tut
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

