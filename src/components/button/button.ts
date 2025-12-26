import { NgClass } from '@angular/common';
import { Component, input } from '@angular/core';
import { RouterLink, RouterLinkActive } from "@angular/router";

@Component({
  selector: 'app-button',
  imports: [NgClass, RouterLink, RouterLinkActive],
  templateUrl: './button.html',
  styleUrl: './button.scss',
})
export class Button {

  navigateTo = input<string>('');
  navigateToTag = input<string>('');
  showIcon = input<boolean>(false);
  iconDirection = input<'right' | 'down'>('right');
  kind = input<string>('primary');
  text = input<string>('');
  fontSize = input<number>(1);

  scrollToTag(): void {
    const tagId = this.navigateToTag();
    if (!tagId) return;

    const element = document.getElementById(tagId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

}
