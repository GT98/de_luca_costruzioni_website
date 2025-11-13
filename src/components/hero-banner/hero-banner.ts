import { TitleCasePipe } from '@angular/common';
import { Component, computed, input } from '@angular/core';

@Component({
  selector: 'app-hero-banner',
  imports: [TitleCasePipe],
  templateUrl: './hero-banner.html',
  styleUrls: ['./hero-banner.scss'],
})
export class HeroBanner {
  title = input<string>('');
  size = input<'default' | 'full'>('default');

  bannerHeight = computed(() => this.size() === 'full' ? '55.125rem' : '27.5625rem');
}
