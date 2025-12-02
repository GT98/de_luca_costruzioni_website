import { TitleCasePipe } from '@angular/common';
import { Component, input } from '@angular/core';
import { RouterLink } from "@angular/router";

@Component({
  selector: 'app-hero-banner',
  imports: [TitleCasePipe, RouterLink],
  templateUrl: './hero-banner.html',
  styleUrls: ['./hero-banner.scss'],
})
export class HeroBanner {
  title = input<string>('');
  size = input<'default' | 'full'>('default');
  isPortfolioDetail = input<boolean>(false);
  imageUrl = input<string>('/assets/images/hero_banner_mock_image.png');

  bannerMode = input('medium');
}
