import { Component } from '@angular/core';
import { Button } from "../../components/button/button";
import { FollowOn } from "../../components/follow-on/follow-on";
import { BannerCta } from "../../components/banner-cta/banner-cta";
import { WhoWeAre } from "../../components/who-we-are/who-we-are";

@Component({
  selector: 'app-home',
  standalone: true,
  templateUrl: './home.html',
  styleUrl: './home.scss',
  imports: [Button, FollowOn, BannerCta, WhoWeAre]
})
export default class Home { }
