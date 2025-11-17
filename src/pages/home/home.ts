import { Component } from '@angular/core';
import { Button } from "../../components/button/button";
import { FollowOn } from "../../components/follow-on/follow-on";
import { BannerCta } from "../../components/banner-cta/banner-cta";

@Component({
  selector: 'app-home',
  standalone: true,
  templateUrl: './home.html',
  styleUrl: './home.scss',
  imports: [Button, FollowOn, BannerCta]
})
export default class Home { }
