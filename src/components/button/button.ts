import { NgClass } from '@angular/common';
import { Component, input } from '@angular/core';

@Component({
  selector: 'app-button',
  imports: [NgClass],
  templateUrl: './button.html',
  styleUrl: './button.scss',
})
export class Button {

  showIcon = input<boolean>(false);
  kind = input<string>('primary');
  text = input<string>('');
  fontSize = input<number>(1);

}
