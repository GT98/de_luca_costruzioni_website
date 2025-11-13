import { Component } from '@angular/core';
import { HeroBanner } from "../../components/hero-banner/hero-banner";

@Component({
  selector: 'app-contact',
  standalone: true,
  templateUrl: './contact.html',
  styleUrl: './contact.scss',
  imports: [HeroBanner],
})
export default class Contact {}
