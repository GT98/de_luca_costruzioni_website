import { Component } from '@angular/core';
import { HeroBanner } from "../../components/hero-banner/hero-banner";
import { BannerCta } from "../../components/banner-cta/banner-cta";

@Component({
  selector: 'app-agency',
  standalone: true,
  templateUrl: './agency.html',
  styleUrl: './agency.scss',
  imports: [HeroBanner, BannerCta],
})
export default class Agency {}
