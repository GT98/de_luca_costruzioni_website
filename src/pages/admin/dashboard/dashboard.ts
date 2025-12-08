import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterModule } from "@angular/router";
import { AdminService } from '../../../services/admin';

@Component({
  selector: 'app-dashboard',
  imports: [RouterModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export default class Dashboard implements OnInit {

  adminService = inject(AdminService);
  ristrutturazioni = this.adminService.ristrutturazioni;

  ngOnInit() {
    this.loadRistrutturazioni();
  }

  async loadRistrutturazioni() {
    try {
      this.adminService.getRistrutturazioniAdmin();
    } catch (error) {
      console.error('Errore caricamento ristrutturazioni:', error);
    }
  }


}
