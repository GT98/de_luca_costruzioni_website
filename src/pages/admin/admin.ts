import { Component, inject, OnInit, computed } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth';
import { LeadService } from '../../services/lead';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-admin',
  imports: [RouterModule, CommonModule],
  templateUrl: './admin.html',
  styleUrl: './admin.scss',
})
export default class Admin implements OnInit {

  authService = inject(AuthService);
  leadService = inject(LeadService);
  
  unreadLeadsCount = computed(() => this.leadService.unreadLeadsCount());

  async ngOnInit(): Promise<void> {
    await this.leadService.updateUnreadCount();
  }

}
