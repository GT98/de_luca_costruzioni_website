import { Routes } from '@angular/router';

export const routes: Routes = [
    { path: '', loadComponent: () => import('./pages/home/home').then(m => m.default) },
    { path: 'homepage', loadComponent: () => import('./pages/home/home').then(m => m.default) },
    { path: 'agency', loadComponent: () => import('./pages/agency/agency').then(m => m.default) },
    { path: 'services', loadComponent: () => import('./pages/services/services').then(m => m.default) },
    { path: 'portfolio', loadComponent: () => import('./pages/portfolio/portfolio').then(m => m.default) },
    { path: 'portfolio/:id', loadComponent: () => import('./pages/portfolio-detail/portfolio-detail').then(m => m.default) },
    { path: 'contact', loadComponent: () => import('./pages/contact/contact').then(m => m.default) },
    { path: 'free_estimate', loadComponent: () => import('./pages/free-estimate/free-estimate').then(m => m.default) },
    {
        path: 'admin', loadComponent: () => import('./pages/admin/admin').then(m => m.default), children: [
            { path: 'dashboard', loadComponent: () => import('./pages/admin/dashboard/dashboard').then(m => m.default) },
            { path: 'ristrutturazioni', loadComponent: () => import('./pages/admin/ristrutturazioni/ristrutturazioni').then(m => m.default) },

        ]
    },
]


