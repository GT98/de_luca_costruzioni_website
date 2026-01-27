import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { DdtService } from '../../../services/ddt.service';
import { Materiale } from '../../../models/materiale';

@Component({
  selector: 'app-materiali',
  imports: [CommonModule],
  templateUrl: './materiali.html',
  styleUrl: './materiali.scss',
})
export default class Materiali implements OnInit {
  private ddtService = inject(DdtService);
  private router = inject(Router);

  materiali = signal<Materiale[]>([]);
  loading = signal(false);
  error = signal<string | null>(null);

  async ngOnInit(): Promise<void> {
    await this.loadMateriali();
  }

  async loadMateriali(): Promise<void> {
    try {
      this.loading.set(true);
      this.error.set(null);
      const data = await this.ddtService.getMateriali();
      this.materiali.set(data);
    } catch (err) {
      this.error.set('Errore nel caricamento dei materiali');
      console.error(err);
    } finally {
      this.loading.set(false);
    }
  }

  openCreatePage(): void {
    this.router.navigate(['/admin/materiali/create']);
  }

  openEditPage(materiale: Materiale): void {
    if (materiale.id) {
      this.router.navigate(['/admin/materiali/edit', materiale.id]);
    }
  }

  async deleteMateriale(id: number): Promise<void> {
    if (confirm('Sei sicuro di voler eliminare questo materiale?')) {
      try {
        await this.ddtService.deleteMateriale(id);
        await this.loadMateriali();
      } catch (err) {
        console.error("Errore nell'eliminazione del materiale:", err);
        alert("Errore nell'eliminazione del materiale");
      }
    }
  }
}
