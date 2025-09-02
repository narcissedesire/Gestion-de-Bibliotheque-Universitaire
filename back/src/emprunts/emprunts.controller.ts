import { Controller, Post, Body, UseGuards, Get } from '@nestjs/common';
import { EmpruntsService } from './emprunts.service';
import { ActiveUser, DecorRole } from 'src/decorators/active-user.decorator';
import { typeUser } from 'src/users/model/users.model';
import { AccessTokenGuard } from 'src/iam/access-token/access-token.guard';
import { AuthorizationGuard } from 'src/iam/authorization/authorization.guard';

@Controller('emprunts')
export class EmpruntsController {
  constructor(private readonly empruntsService: EmpruntsService) {}

  @Post()
  @UseGuards(AccessTokenGuard, AuthorizationGuard)
  @DecorRole(typeUser.ETUDIANT, typeUser.PROFESSEUR)
  createEmprunt(
    @Body('livreId') livreId: string,
    @ActiveUser('id') userId: string,
  ) {
    return this.empruntsService.createEmprunt(livreId, userId);
  }

  @Get('/historique')
  @UseGuards(AccessTokenGuard, AuthorizationGuard)
  @DecorRole(typeUser.ETUDIANT, typeUser.PROFESSEUR)
  historiqueEmprunts(@ActiveUser('id') id: string) {
    return this.empruntsService.historiqueEmprunts(id);
  }

  @Get('/emprunts-users')
  @UseGuards(AccessTokenGuard, AuthorizationGuard)
  @DecorRole(typeUser.ETUDIANT, typeUser.PROFESSEUR)
  empruntsUser(@ActiveUser() user: any) {
    return this.empruntsService.empruntUser(user.id);
  }

  @Get('allEmprunts')
  @UseGuards(AccessTokenGuard, AuthorizationGuard)
  @DecorRole(typeUser.ADMIN)
  allEmprunts() {
    return this.empruntsService.allEmprunts();
  }
}
