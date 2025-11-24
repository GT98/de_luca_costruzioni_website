import { Component } from '@angular/core';
import { Button } from "../../components/button/button";
import { FollowOn } from "../../components/follow-on/follow-on";
import { BannerCta } from "../../components/banner-cta/banner-cta";
import { WhoWeAre } from "../../components/who-we-are/who-we-are";
import { GoogleReviews } from "../../components/google-reviews/google-reviews";
import { PortfolioList } from "../../components/portfolio-list/portfolio-list";

@Component({
  selector: 'app-home',
  standalone: true,
  templateUrl: './home.html',
  styleUrl: './home.scss',
  imports: [Button, FollowOn, BannerCta, WhoWeAre, GoogleReviews, PortfolioList]
})
export default class Home { }
