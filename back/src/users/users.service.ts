import { typeUser } from 'src/users/model/users.model';
import { paginate, PaginationParams, SearchField } from 'src/utils/pagination';
import { JwtService } from '@nestjs/jwt';
import {
  ConflictException,
  Inject,
  Injectable,
  MethodNotAllowedException,
  UnauthorizedException,
} from '@nestjs/common';
import { UserCreateDto } from './dto/userCreate.dto';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './model/users.model';
import * as bcrypt from 'bcrypt';
import { UserLoginDto } from './dto/userLogin.dto';
import { ConfigType } from '@nestjs/config';
import jwtConfig from 'src/config/jwt.config';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
    @Inject(jwtConfig.KEY)
    private readonly jwtConfiguration: ConfigType<typeof jwtConfig>,
  ) {}

  async createUser(user: UserCreateDto) {
    const verifyUser = await this.userRepository.findOne({
      where: { email: user.email },
    });
    if (verifyUser) {
      throw new ConflictException("L'email existe déjà");
    }
    const hashPassword = await bcrypt.hash(user.password, 10);
    const newUser = this.userRepository.create({
      ...user,
      motDePasse: hashPassword,
    });
    return this.userRepository.save(newUser);
  }

  async signToken(user: {
    id: string;
    email: string;
    type: string;
    nom: string;
    prenom: string;
  }) {
    const payload = {
      id: user.id,
      email: user.email,
      type: user.type,
      nom: user.nom,
      prenom: user.prenom,
    };
    console.log('Payload JWT généré:', payload);
    return this.jwtService.signAsync(payload, {
      secret: this.jwtConfiguration.secret,
      expiresIn: this.jwtConfiguration.signOptions.expiresIn,
      audience: this.jwtConfiguration.signOptions.audience,
      issuer: this.jwtConfiguration.signOptions.issuer,
    });
  }

  async connexion(user: UserLoginDto) {
    try {
      // Recherche de l'utilisateur par email
      const existingUser = await this.userRepository.findOne({
        where: { email: user.email },
      });

      if (!existingUser) {
        // Pour ne pas indiquer si email ou mot de passe est faux
        throw new UnauthorizedException('Identifiants incorrects !');
      }

      // Vérification du mot de passe
      const isPasswordValid = await bcrypt.compare(
        user.motDePasse,
        existingUser.motDePasse,
      );
      if (!isPasswordValid) {
        throw new UnauthorizedException('Identifiants incorrects !');
      }

      // Génération du token JWT via la méthode signToken existante
      const accessToken = await this.signToken({
        id: existingUser.id,
        email: existingUser.email,
        type: existingUser.type,
        nom: existingUser.nom,
        prenom: existingUser.prenom,
      });

      // Retourne le token + infos utiles
      return {
        accessToken,
        user: {
          id: existingUser.id,
          email: existingUser.email,
          type: existingUser.type,
          nom: existingUser.nom,
          prenom: existingUser.prenom,
        },
      };
    } catch (error) {
      console.error('Erreur lors de la connexion:', error.message);

      // Utilisation d'une erreur plus adaptée
      throw new UnauthorizedException(
        'Impossible de se connecter. Vérifiez vos identifiants.',
      );
    }
  }

  async afficheUsers(params: PaginationParams, type: typeUser) {
    const searchFields: SearchField[] = [
      { field: 'titre' },
      { field: 'genre', isEnum: true },
      { field: 'auteur' },
    ];

    const where = type ? { type } : undefined;

    return paginate<User>(this.userRepository, params, searchFields, where);
  }

  async afficheUserSansFiltre() {
    const data = this.userRepository.find();
    console.log('data avao : ', data);
    return data;
  }
}
