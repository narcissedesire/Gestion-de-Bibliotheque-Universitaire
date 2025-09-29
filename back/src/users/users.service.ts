import { typeUser } from 'src/users/model/users.model';
import { paginate, PaginationParams, SearchField } from 'src/utils/pagination';
import { JwtService } from '@nestjs/jwt';
import {
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
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
    console.log('Creating user with data:', user);
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
    const saveUser = await this.userRepository.save(newUser);
    return {
      success: true,
      message: 'Inscription réussie',
      saveUser,
    };
  }

  async signToken(user: {
    id: string;
    email: string;
    type: string;
    nom: string;
    prenom: string;
    createdAt: Date;
  }) {
    const payload = {
      id: user.id,
      email: user.email,
      type: user.type,
      nom: user.nom,
      prenom: user.prenom,
      createdAt: user.createdAt,
    };
    console.log('Payload JWT généré:', payload);
    return this.jwtService.signAsync(payload);
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
        createdAt: existingUser.createdAt,
      });

      // Retourne le token + infos utiles
      return {
        accessToken,
        // user: {
        //   id: existingUser.id,
        //   email: existingUser.email,
        //   type: existingUser.type,
        //   nom: existingUser.nom,
        //   prenom: existingUser.prenom,
        // },
      };
    } catch (error) {
      console.error('Erreur lors de la connexion:', error.message);

      // Utilisation d'une erreur plus adaptée
      throw new UnauthorizedException(
        'Impossible de se connecter. Vérifiez vos identifiants.',
      );
    }
  }

  async afficheUsers(
    params: PaginationParams,
    type: typeUser,
    disponible?: boolean,
  ) {
    const searchFields: SearchField[] = [
      { field: 'nom' },
      { field: 'type', isEnum: true },
      { field: 'prenom' },
    ];

    let where: any = {};
    if (type) {
      where.type = { type };
    }
    if (disponible !== undefined) {
      where.isActive = disponible;
    }

    return paginate<User>(this.userRepository, params, searchFields, where, {
      relations: ['emprunts', 'reservations'],
    });
  }

  async afficheUserSansFiltre() {
    const data = this.userRepository.find();
    console.log('data avao : ', data);
    return data;
  }

  async updateUser(id: string, userData: Partial<User>) {
    console.log('update user', userData);
    try {
      const user = await this.userRepository.preload({ id, ...userData });
      if (!user) {
        throw new NotFoundException('Utilisateur non trouvé');
      }
      // const update = await this.userRepository.update(id, userData);
      // Object.assign(user, userData);
      const dataUser = await this.userRepository.save(user);
      return {
        message: 'Utilisateur mis à jour avec succès',
        success: true,
        dataUser,
      };
    } catch (error) {
      return {
        message: "Erreur lors de la mise à jour de l'utilisateur",
        success: false,
        error: error.message,
      };
    }
  }

  async updateStatusUser(id: string, userData: Partial<User>) {
    try {
      const user = await this.userRepository.preload({ id, ...userData });
      if (!user) {
        throw new NotFoundException('Utilisateur non trouvé');
      }
      const dataUser = await this.userRepository.save(user);
      return {
        message: 'Utilisateur mis à jour avec succès',
        success: true,
        dataUser,
      };
    } catch (error) {
      return {
        message: "Erreur lors de la mise à jour de l'utilisateur",
        success: false,
        error: error.message,
      };
    }
  }

  async deleteUser(id: string) {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException('Utilisateur non trouvé');
    }
    return this.userRepository.remove(user);
  }
}
