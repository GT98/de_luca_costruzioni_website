import { Component } from '@angular/core';
import { HeroBanner } from "../../components/hero-banner/hero-banner";
import { FollowOn } from "../../components/follow-on/follow-on";
import { FormSupplier } from "../../components/form-free-estimate/form-free-estimate";

@Component({
  selector: 'app-free-estimate',
  imports: [HeroBanner, FollowOn, FormSupplier],
  templateUrl: './free-estimate.html',
  styleUrl: './free-estimate.scss',
})
export class FreeEstimate {

}
