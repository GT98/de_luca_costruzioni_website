import { Component, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';

interface TeamMember {
  id: number;
  name: string;
  role: string;
  image: string;
  bio?: string;
}

@Component({
  selector: 'app-team',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './team.html',
  styleUrls: ['./team.scss'],
  encapsulation: ViewEncapsulation.None
})
export class Team {
  teamMembers: TeamMember[] = [
    {
      id: 1,
      name: 'Marco Rossi',
      role: 'CEO & Founder',
      image: 'assets/images/team/team-1.jpg',
      bio: 'Esperto in strategia aziendale con 15 anni di esperienza'
    },
    {
      id: 2,
      name: 'Laura Bianchi',
      role: 'Project Manager',
      image: 'assets/images/team/team-1.jpg',
      bio: 'Specializzata nella gestione di progetti complessi'
    },
    {
      id: 3,
      name: 'Giuseppe Verdi',
      role: 'Lead Developer',
      image: 'assets/images/team/team-1.jpg',
      bio: 'Sviluppatore full-stack con passione per l\'innovazione'
    },
    {
      id: 4,
      name: 'Sofia Romano',
      role: 'UX/UI Designer',
      image: 'assets/images/team/team-1.jpg',
      bio: 'Designer creativa con focus sull\'esperienza utente'
    },
    {
      id: 5,
      name: 'Andrea Ferrari',
      role: 'Marketing Director',
      image: 'assets/images/team/team-1.jpg',
      bio: 'Esperto di marketing digitale e brand strategy'
    },
    {
      id: 6,
      name: 'Chiara Russo',
      role: 'Business Analyst',
      image: 'assets/images/team/team-1.jpg',
      bio: 'Analista con competenze in data-driven decision making'
    }
  ];
}