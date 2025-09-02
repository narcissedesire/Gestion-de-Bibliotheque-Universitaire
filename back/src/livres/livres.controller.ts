import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { LivresService } from './livres.service';
import { LivreCreateDto } from './dto/livreCreate.dto';
import { ActiveUser, DecorRole } from 'src/decorators/active-user.decorator';
import { typeUser, User } from 'src/users/model/users.model';
import { AccessTokenGuard } from 'src/iam/access-token/access-token.guard';
import { AuthorizationGuard } from 'src/iam/authorization/authorization.guard';
import { PaginationParams } from 'src/utils/pagination';
import { LivreGere } from './model/livres.model';

@Controller('livres')
export class LivresController {
  constructor(private readonly livreService: LivresService) {}

  @Post('/create')
  @UseGuards(AccessTokenGuard, AuthorizationGuard)
  @DecorRole(typeUser.ADMIN)
  createLivres(@Body() livre: LivreCreateDto) {
    console.log('donne du front : ' + JSON.stringify(livre));
    return this.livreService.createLivres(livre);
  }

  @Get('/findAll')
  @UseGuards(AccessTokenGuard, AuthorizationGuard)
  @DecorRole(typeUser.ADMIN, typeUser.ETUDIANT, typeUser.PROFESSEUR)
  findAllLivres(@Query() query: PaginationParams & { type: LivreGere }) {
    if (query.page && isNaN(Number(query.page))) {
      throw new BadRequestException('La page doit être un nombre');
    }
    console.log('page :', query.page);
    console.log('Limit : ', query.limit);
    if (query.limit && isNaN(Number(query.limit))) {
      throw new BadRequestException('La limite doit être un nombre');
    }
    if (query.type && !Object.values(LivreGere).includes(query.type)) {
      throw new BadRequestException("Type d'événement invalide");
    }
    return this.livreService.findAllLivres(
      {
        page: query.page ? Number(query.page) : 1,
        limit: query.limit ? Number(query.limit) : 10,
        search: query.search || '',
        orderBy: query.orderBy || 'titre',
        orderDirection: query.orderDirection,
        type: query.type,
      },
      query.type,
    );
  }

  @Get('/livre-populaires')
  @UseGuards(AccessTokenGuard, AuthorizationGuard)
  @DecorRole(typeUser.ADMIN, typeUser.ETUDIANT, typeUser.PROFESSEUR)
  getLivrePopulaires() {
    return this.livreService.getLivresPopulaires();
  }

  @Get('/findSansFiltre')
  @UseGuards(AccessTokenGuard, AuthorizationGuard)
  findAllSansFiltre() {
    return this.livreService.findAllLivresSansFiltre();
  }

  @Get('/findById')
  @UseGuards(AccessTokenGuard, AuthorizationGuard)
  findLivreById(@Query('id') id: string) {
    if (!id) {
      throw new BadRequestException("L'ID du livre est requis");
    }
    return this.livreService.findLivreById(id);
  }

  @Put('/update/:id')
  @UseGuards(AccessTokenGuard, AuthorizationGuard)
  @DecorRole(typeUser.ADMIN)
  updateLivre(
    @Param('id') id: string,
    @Body() livreData: Partial<LivreCreateDto>,
  ) {
    if (!id) {
      throw new BadRequestException("L'ID du livre est requis");
    }
    if (!livreData || Object.keys(livreData).length === 0) {
      throw new BadRequestException('Les données du livre sont requises');
    }
    return this.livreService.updateLivre(id, livreData);
  }

  @Delete('/delete/:id')
  @UseGuards(AccessTokenGuard, AuthorizationGuard)
  @DecorRole(typeUser.ADMIN)
  deleteLivre(@Param('id') id: string) {
    if (!id) {
      throw new BadRequestException("L'ID du livre est requis");
    }
    return this.livreService.deleteLivre(id);
  }
}
