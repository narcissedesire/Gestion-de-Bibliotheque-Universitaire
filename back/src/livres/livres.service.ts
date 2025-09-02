import { paginate, SearchField } from './../utils/pagination';
import {
  BadRequestException,
  ConflictException,
  Injectable,
} from '@nestjs/common';
import { LivreGere, Livres } from './model/livres.model';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { LivreCreateDto } from './dto/livreCreate.dto';
import { PaginationParams } from 'src/utils/pagination';
import { ExceptionsHandler } from '@nestjs/core/exceptions/exceptions-handler';

@Injectable()
export class LivresService {
  constructor(
    @InjectRepository(Livres)
    private readonly livreRepository: Repository<Livres>,
  ) {}

  async createLivres(livre: LivreCreateDto) {
    const newLivre = this.livreRepository.create(livre);
    return this.livreRepository.save(newLivre);
  }

  async findAllLivres(params: PaginationParams, type: LivreGere) {
    const searchFields: SearchField[] = [
      { field: 'titre' },
      { field: 'genre', isEnum: true },
      { field: 'auteur' },
    ];

    const where = type ? { genre: type } : undefined;

    return paginate<Livres>(this.livreRepository, params, searchFields, where);
  }

  findAllLivresSansFiltre() {
    return this.livreRepository.find();
  }

  async getLivresPopulaires(limit = 5) {
    return this.livreRepository
      .createQueryBuilder('livre')
      .leftJoin('livre.emprunts', 'emprunts')
      .leftJoin('livre.reservations', 'reservations')
      .select([
        'livre.id AS id',
        'livre.titre AS titre',
        'livre.auteur AS auteur',
        'COUNT(DISTINCT emprunts.id) AS empruntCount',
        'COUNT(DISTINCT reservations.id) AS reservationCount',
        '(COUNT(DISTINCT emprunts.id) + COUNT(DISTINCT reservations.id)) AS popularity',
      ])
      .groupBy('livre.id')
      .orderBy('popularity', 'DESC')
      .limit(limit)
      .getRawMany();
  }

  async findLivreById(id: string) {
    return this.livreRepository.findOne({ where: { id } });
  }

  async updateLivre(id: string, livreData: Partial<Livres>) {
    const livreUpdate = await this.livreRepository.preload({
      id,
      ...livreData,
    });
    if (!livreUpdate) {
      throw new BadRequestException('Erreur lor de la mise à jour du livre');
    }
    return this.livreRepository.save(livreUpdate);
  }

  async deleteLivre(id: string) {
    try {
      const livre = await this.livreRepository.findOne({
        where: { id: id },
        relations: ['emprunts', 'reservations'],
      });
      console.log(livre);
      if (!livre) {
        throw new BadRequestException("Le livre n'existe pas");
      }
      if (!livre.disponible) {
        return {
          message:
            'Le livre ne peut pas être supprimé car il est actuellement emprunté ou réservé.',
          result: false,
        };
      }
      if (livre.emprunts.length > 0 || livre.reservations.length > 0) {
        return {
          message:
            'Le livre ne peut pas être supprimé car il a des emprunts ou des réservations associées.',
          result: false,
        };
      }
      const executeDelete = await this.livreRepository.delete(id);
      return {
        message: 'Livre supprimé avec succès',
        result: true,
      };
    } catch (error) {
      return {
        message: 'Erreur sur la suppression du livre' + error,
        result: false,
      };
    }
  }
}
