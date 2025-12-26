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
      name: 'Pasquale De Luca',
      role: 'CEO & Founder',
      image: 'assets/images/team/team-1.jpg',
      bio: 'Titolare e fondatore con oltre 20 anni di esperienza nel settore'
    },
    {
      id: 2,
      name: 'Grazia Spagnoli',
      role: 'Project Manager',
      image: 'assets/images/team/team-1.jpg',
      bio: 'Volto principale dell\'azienda sui social network'
    },
    {
      id: 3,
      name: 'Nunzia Verdi',
      role: 'Lead Developer',
      image: 'assets/images/team/team-1.jpg',
      bio: 'Amministratrice interna e contabile esperta'
    },
    {
      id: 4,
      name: 'Agostino Toti',
      role: 'UX/UI Designer',
      image: 'assets/images/team/team-1.jpg',
      bio: 'Geometra con esperienza in progettazione e design'
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