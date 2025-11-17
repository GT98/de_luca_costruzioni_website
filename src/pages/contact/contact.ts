import { Component } from '@angular/core';
import { HeroBanner } from "../../components/hero-banner/hero-banner";
import { FollowOn } from "../../components/follow-on/follow-on";

@Component({
  selector: 'app-contact',
  standalone: true,
  templateUrl: './contact.html',
  styleUrl: './contact.scss',
  imports: [HeroBanner, FollowOn],
})
export default class Contact {}
