import { Component } from '@angular/core';
import { Button } from "../../components/button/button";

@Component({
  selector: 'app-home',
  standalone: true,
  templateUrl: './home.html',
  styleUrl: './home.scss',
  imports: [Button]
})
export default class Home { }
