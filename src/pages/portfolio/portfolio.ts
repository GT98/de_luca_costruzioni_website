import { Component } from '@angular/core';
import { HeroBanner } from "../../components/hero-banner/hero-banner";

@Component({
  selector: 'app-portfolio',
  standalone: true,
  templateUrl: './portfolio.html',
  styleUrl: './portfolio.scss',
  imports: [HeroBanner],
})
export default class Portfolio {}
