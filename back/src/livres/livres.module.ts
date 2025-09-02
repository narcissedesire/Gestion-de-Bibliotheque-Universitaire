import { Module } from '@nestjs/common';
import { LivresController } from './livres.controller';
import { LivresService } from './livres.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Livres } from './model/livres.model';
import { IamModule } from 'src/iam/iam.module';

@Module({
  controllers: [LivresController],
  providers: [LivresService],
  exports: [LivresService],
  imports: [TypeOrmModule.forFeature([Livres]), IamModule],
})
export class LivresModule {}
