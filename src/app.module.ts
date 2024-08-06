import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    MongooseModule.forRoot(
      `mongodb+srv://${process.env.MONGO_USERNAME}:${process.env.MONGO_PASSWORD}@cluster0.fhl2fvi.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`,
    ),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
