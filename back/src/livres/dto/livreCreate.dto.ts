import { LivreGere } from '../model/livres.model';

export class LivreCreateDto {
  titre: string;
  auteur: string;
  annee: number;
  genre: LivreGere;
  sujet?: string;
  periodicite?: string;
}

export enum booleanDispo {
  disponible = 'true',
  indisponible = 'false',
}
