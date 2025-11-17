import { TitleCasePipe } from '@angular/common';
import { Component, input } from '@angular/core';

@Component({
  selector: 'app-hero-banner',
  imports: [TitleCasePipe],
  templateUrl: './hero-banner.html',
  styleUrls: ['./hero-banner.scss'],
})
export class HeroBanner {
  title = input<string>('');
  size = input<'default' | 'full'>('default');

  bannerMode = input('medium');
}
