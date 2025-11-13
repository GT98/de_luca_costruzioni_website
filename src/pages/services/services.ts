import { Component } from '@angular/core';
import { HeroBanner } from '../../components/hero-banner/hero-banner';


@Component({
  selector: 'app-services',
  standalone: true,
  templateUrl: './services.html',
  styleUrl: './services.scss',
  imports: [HeroBanner],
})
export default class Services {}
