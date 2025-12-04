import { Component, input } from '@angular/core';
import { Button } from "../button/button";

@Component({
  selector: 'app-contact-info',
  imports: [Button],
  templateUrl: './contact-info.html',
  styleUrl: './contact-info.scss',
})
export class ContactInfo {
  currentPage = input<string>('contact');
}
