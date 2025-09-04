import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { ReservationsService } from './reservations.service';
import { Reservation } from './model/reservations.model';
import { AccessTokenGuard } from 'src/iam/access-token/access-token.guard';
import { AuthorizationGuard } from 'src/iam/authorization/authorization.guard';
import { ActiveUser, DecorRole } from 'src/decorators/active-user.decorator';
import { typeUser, User } from 'src/users/model/users.model';

@Controller('reservations')
export class ReservationsController {
  constructor(private readonly reservationsService: ReservationsService) {}

  @Post()
  @UseGuards(AccessTokenGuard, AuthorizationGuard)
  @DecorRole(typeUser.ETUDIANT, typeUser.PROFESSEUR, typeUser.ADMIN)
  async createReservation(
    @Body('livreId') livreId: string,
    @ActiveUser() user: User,
  ) {
    return this.reservationsService.createReservation(livreId, user);
  }

  @Get('/affiche-sans-filtres')
  @UseGuards(AccessTokenGuard, AuthorizationGuard)
  @DecorRole(typeUser.ADMIN)
  afficheReservation() {
    return this.reservationsService.afficheReservationSansFiltre();
  }
}
