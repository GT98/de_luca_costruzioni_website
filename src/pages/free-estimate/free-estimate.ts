import { Component } from '@angular/core';
import { ContactInfo } from "../../components/contact-info/contact-info";
import { FollowOn } from "../../components/follow-on/follow-on";
import { FormFreeEstimate } from "../../components/form-free-estimate/form-free-estimate";
import { HeroBanner } from "../../components/hero-banner/hero-banner";
import { ImgSectionHeader } from "../../components/img-section-header/img-section-header";

@Component({
  selector: 'app-free-estimate',
  imports: [HeroBanner, FollowOn, FormFreeEstimate, ImgSectionHeader, ContactInfo],
  templateUrl: './free-estimate.html',
  styleUrl: './free-estimate.scss',
})
export default class FreeEstimate {

}
