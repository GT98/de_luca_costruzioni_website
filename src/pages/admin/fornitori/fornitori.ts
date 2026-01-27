import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { DdtService } from '../../../services/ddt.service';
import { Fornitore } from '../../../models/fornitore';

@Component({
  selector: 'app-fornitori',
  imports: [CommonModule],
  templateUrl: './fornitori.html',
  styleUrl: './fornitori.scss',
})
export default class Fornitori implements OnInit {
  private ddtService = inject(DdtService);
  private router = inject(Router);

  fornitori = signal<Fornitore[]>([]);
  loading = signal(false);
  error = signal<string | null>(null);

  async ngOnInit(): Promise<void> {
    await this.loadFornitori();
  }

  async loadFornitori(): Promise<void> {
    try {
      this.loading.set(true);
      this.error.set(null);
      const data = await this.ddtService.getFornitori();
      this.fornitori.set(data);
    } catch (err) {
      this.error.set('Errore nel caricamento dei fornitori');
      console.error(err);
    } finally {
      this.loading.set(false);
    }
  }

  openCreatePage(): void {
    this.router.navigate(['/admin/fornitori/create']);
  }

  openEditPage(fornitore: Fornitore): void {
    if (fornitore.id) {
      this.router.navigate(['/admin/fornitori/edit', fornitore.id]);
    }
  }

  async deleteFornitore(id: number): Promise<void> {
    if (confirm('Sei sicuro di voler eliminare questo fornitore?')) {
      try {
        await this.ddtService.deleteFornitore(id);
        await this.loadFornitori();
      } catch (err) {
        console.error("Errore nell'eliminazione del fornitore:", err);
        alert("Errore nell'eliminazione del fornitore");
      }
    }
  }
}
