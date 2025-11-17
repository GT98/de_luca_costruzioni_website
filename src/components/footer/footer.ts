import { Component } from '@angular/core';
import { Button } from "../button/button";
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-footer',
  imports: [Button,RouterLink],
  templateUrl: './footer.html',
  styleUrl: './footer.scss',
})
export class Footer {

}
