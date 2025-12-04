import { NgClass } from '@angular/common';
import { Component, input } from '@angular/core';
import { RouterLink } from "@angular/router";

@Component({
  selector: 'app-button',
  imports: [NgClass, RouterLink],
  templateUrl: './button.html',
  styleUrl: './button.scss',
})
export class Button {

  navigateTo = input<string>('');
  showIcon = input<boolean>(false);
  kind = input<string>('primary');
  text = input<string>('');
  fontSize = input<number>(1);

}
