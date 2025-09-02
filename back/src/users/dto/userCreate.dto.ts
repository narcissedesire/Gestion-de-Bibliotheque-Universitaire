import { typeUser } from '../model/users.model';

export class UserCreateDto {
  nom: string;
  prenom?: string;
  email: string;
  password: string;
  type?: typeUser;
}
