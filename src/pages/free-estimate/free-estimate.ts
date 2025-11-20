import { Component } from '@angular/core';
import { HeroBanner } from "../../components/hero-banner/hero-banner";
import { FollowOn } from "../../components/follow-on/follow-on";

@Component({
  selector: 'app-free-estimate',
  imports: [HeroBanner, FollowOn],
  templateUrl: './free-estimate.html',
  styleUrl: './free-estimate.scss',
})
export class FreeEstimate {

}
