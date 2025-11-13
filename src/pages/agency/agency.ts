import { Component } from '@angular/core';
import { HeroBanner } from "../../components/hero-banner/hero-banner";

@Component({
  selector: 'app-agency',
  standalone: true,
  templateUrl: './agency.html',
  styleUrl: './agency.scss',
  imports: [HeroBanner],
})
export default class Agency {}
