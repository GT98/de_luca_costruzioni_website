import { Component } from '@angular/core';
import { HeroBanner } from "../../components/hero-banner/hero-banner";
import { FollowOn } from "../../components/follow-on/follow-on";

@Component({
  selector: 'app-portfolio-detail',
  imports: [HeroBanner, FollowOn],
  templateUrl: './portfolio-detail.html',
  styleUrl: './portfolio-detail.scss',
})
export class PortfolioDetail {

}
