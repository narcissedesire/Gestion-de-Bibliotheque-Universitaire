import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UserCreateDto } from './dto/userCreate.dto';
import {
  ActiveUser,
  DecorRole,
  Public,
} from 'src/decorators/active-user.decorator';
import { UserLoginDto } from './dto/userLogin.dto';
import { typeUser, User } from './model/users.model';
import { AccessTokenGuard } from 'src/iam/access-token/access-token.guard';
import { AuthorizationGuard } from 'src/iam/authorization/authorization.guard';
import { PaginationParams } from 'src/utils/pagination';

interface resposToken {
  id: string;
  email: string;
  type: typeUser;
}
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Public()
  @Post('/inscription')
  createUser(@Body() user: UserCreateDto) {
    return this.usersService.createUser(user);
  }

  @Public()
  @Post('/login')
  login(@Body() user: UserLoginDto) {
    return this.usersService.connexion(user);
  }

  @UseGuards(AccessTokenGuard, AuthorizationGuard)
  @Get('/profile')
  @DecorRole(typeUser.ETUDIANT, typeUser.PROFESSEUR)
  getUserConnect(@ActiveUser() user: resposToken) {
    return {
      message: 'Les donner du token',
      user: user,
    };
  }

  @Get('/affiche_user')
  @UseGuards(AccessTokenGuard, AuthorizationGuard)
  @DecorRole(typeUser.ADMIN)
  afficheUser(@Query() query: PaginationParams & { type: typeUser }) {
    if (query.page && isNaN(Number(query.page))) {
      throw new BadRequestException('La page doit être un nombre');
    }
    console.log('page :', query.page);
    console.log('Limit : ', query.limit);
    if (query.limit && isNaN(Number(query.limit))) {
      throw new BadRequestException('La limite doit être un nombre');
    }
    if (query.type && !Object.values(typeUser).includes(query.type)) {
      throw new BadRequestException("Type d'événement invalide");
    }
    return this.usersService.afficheUsers(
      {
        page: query.page ? Number(query.page) : 1,
        limit: query.limit && Number(query.limit),
        search: query.search || '',
        orderBy: query.orderBy,
        orderDirection: query.orderDirection,
        type: query.type,
      },
      query.type,
    );
  }

  @Get('/affiche-users-sans-filtre')
  @UseGuards(AccessTokenGuard, AuthorizationGuard)
  @DecorRole(typeUser.ADMIN)
  afficheUserSansFiltre() {
    return this.usersService.afficheUserSansFiltre();
  }

  @Put('/update-user/:id')
  updateUser(@Param('id') id: string, @Body() userData: Partial<User>) {
    return this.usersService.updateUser(id, userData);
  }

  @Delete('/delete-user/:id')
  deleteUser(@Param('id') id: string) {
    return this.usersService.deleteUser(id);
  }
}
