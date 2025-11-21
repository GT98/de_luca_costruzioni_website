import { Component } from '@angular/core';
import { HeroBanner } from "../../components/hero-banner/hero-banner";
import { BannerCta } from "../../components/banner-cta/banner-cta";
import { ImgSectionHeader } from "../../components/img-section-header/img-section-header";
import { WhoWeAre } from "../../components/who-we-are/who-we-are";
import { MissionVision } from "../../components/mission-vision/mission-vision";
import { Certifications } from "../../components/certifications/certifications";
import { CompanyStatsComponent } from "../../components/company-stats/company-stats";

@Component({
  selector: 'app-agency',
  standalone: true,
  templateUrl: './agency.html',
  styleUrl: './agency.scss',
  imports: [HeroBanner, BannerCta, ImgSectionHeader, MissionVision, Certifications, CompanyStatsComponent],
})
export default class Agency {}
