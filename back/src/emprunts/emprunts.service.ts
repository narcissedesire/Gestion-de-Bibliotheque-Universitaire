import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { Emprunts, statusType } from './model/emprunts.model';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/model/users.model';
import { Livres } from 'src/livres/model/livres.model';
import { Reservation } from 'src/reservations/model/reservations.model';

@Injectable()
export class EmpruntsService {
  constructor(
    @InjectRepository(Emprunts)
    private readonly empruntsRepository: Repository<Emprunts>,
    @InjectRepository(Reservation)
    private readonly reservationsRepository: Repository<Reservation>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Livres)
    private readonly livresRepository: Repository<Livres>,
  ) {}

  async historiqueEmprunts(
    userId: string,
  ): Promise<{ message: string; result: Emprunts[] }> {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new BadRequestException('Utilisateur non trouvé');
    }

    const emprunts = await this.empruntsRepository.find({
      where: { user: { id: userId } },
      relations: ['livre'], // Charger les informations du livre (ex. titre, auteur)
      order: { date_emprunt: 'DESC' }, // Trier par date d'emprunt (plus récent au plus ancien)
    });

    // Vérifier si l'utilisateur a des emprunts
    if (emprunts.length === 0) {
      return { message: "Vous n'avez jamais effectué d'emprunts", result: [] };
    }

    return { message: 'Historique des emprunts', result: emprunts };
  }

  // async createEmprunt(
  //   livreId: string,
  //   userId: string,
  //   dureeEmprunt: number = 21,
  // ): Promise<{ message: string; result: Emprunts }> {
  //   // Trouver le livre avec ses réservations
  //   const livre = await this.livresRepository.findOne({
  //     where: { id: livreId },
  //     relations: ['reservations', 'reservations.user', 'emprunts'],
  //   });
  //   if (!livre) {
  //     throw new BadRequestException('Livre non trouvé');
  //   }

  //   // Trouver l'utilisateur
  //   const user = await this.userRepository.findOne({
  //     where: { id: userId },
  //   });
  //   if (!user) {
  //     throw new BadRequestException('Utilisateur non trouvé');
  //   }

  //   // Vérifier si le livre est disponible
  //   if (!livre.disponible) {
  //     throw new BadRequestException("Le livre n'est pas disponible");
  //   }

  //   // Vérifier la file d'attente des réservations
  //   const activeReservation = livre.reservations.find(
  //     (res) =>
  //       res.status === StatusReservation.ACTIVE &&
  //       res.position_attente === 1 &&
  //       res.user.id === userId,
  //   );
  //   if (!activeReservation) {
  //     throw new BadRequestException(
  //       "Vous n'êtes pas le premier dans la file d'attente ou vous n'avez pas de réservation active",
  //     );
  //   }

  //   // Calculer la date de retour prévue (par exemple, 21 jours = 3 semaines)
  //   const dateEmprunt = new Date();
  //   const dateRetourPrevue = new Date();
  //   dateRetourPrevue.setDate(dateEmprunt.getDate() + dureeEmprunt);

  //   // Créer l'emprunt
  //   const newEmprunt = this.empruntsRepository.create({
  //     livre,
  //     user,
  //     date_emprunt: dateEmprunt,
  //     date_retour_prevue: dateRetourPrevue,
  //     status: statusType.EN_COURS,
  //   });

  //   // Mettre à jour la disponibilité du livre
  //   livre.disponible = false;
  //   await this.livresRepository.save(livre);

  //   // Mettre à jour la réservation (passer à ANNULEE ou la supprimer)
  //   activeReservation.status = StatusReservation.ANNULEE;
  //   await this.reservationsRepository.save(activeReservation);

  //   // Mettre à jour les positions d'attente des autres réservations
  //   const otherReservations = livre.reservations.filter(
  //     (res) =>
  //       res.id !== activeReservation.id &&
  //       res.status === StatusReservation.EN_ATTENTE,
  //   );
  //   for (let i = 0; i < otherReservations.length; i++) {
  //     otherReservations[i].position_attente = i + 1;
  //     if (i === 0) {
  //       otherReservations[i].status = StatusReservation.ACTIVE; // Prochain dans la file devient actif
  //     }
  //     await this.reservationsRepository.save(otherReservations[i]);
  //   }

  //   // Sauvegarder l'emprunt
  //   const savedEmprunt = await this.empruntsRepository.save(newEmprunt);

  //   return {
  //     message: 'Emprunt créé avec succès',
  //     result: savedEmprunt,
  //   };
  // }

  async createEmprunt(livreId: string, user: User) {
    try {
      const livre = await this.livresRepository.findOne({
        where: { id: livreId },
      });
      // const user = await this.userRepository.findOne({
      //   where: { id: userId },
      // });
      console.log('user : ', user);
      if (!livre || !livre.disponible) {
        throw new BadRequestException('Livre non disponible');
      }
      const newEmprunt = this.empruntsRepository.create({
        livre,
        user,
        date_retour_prevue: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 2 semaines
        status: statusType.EN_COURS,
      });
      livre.disponible = false;
      await this.livresRepository.save(livre);
      await this.empruntsRepository.save(newEmprunt);
      return { result: newEmprunt, message: 'Emprunt saved successfully' };
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async allEmprunts() {
    const emprunts = await this.empruntsRepository.find();
    return emprunts;
  }

  async empruntUser(idUser: string) {
    const emprunt = await this.empruntsRepository.find({
      where: { user: { id: idUser } },
      relations: ['livre'],
    });
    return emprunt;
  }

  async retournerLivre(empruntId: string) {
    const emprunt = await this.empruntsRepository.findOne({
      where: { id: empruntId },
      relations: ['livre'], // pour récupérer le livre associé
    });

    if (!emprunt) {
      throw new NotFoundException('Emprunt introuvable');
    }

    if (emprunt.date_retour_reelle) {
      throw new BadRequestException('Le livre a déjà été retourné');
    }

    // Marquer l'emprunt comme retourné
    emprunt.date_retour_reelle = new Date();
    await this.empruntsRepository.save(emprunt);

    // Rendre le livre à nouveau disponible
    emprunt.livre.disponible = true;
    await this.livresRepository.save(emprunt.livre);

    return { message: 'Livre retourné avec succès', emprunt };
  }
}
