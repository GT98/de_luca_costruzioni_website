import { Routes } from '@angular/router';
import Agency from './pages/agency/agency';
import Home from './pages/home/home';
import Services from './pages/services/services';
import Portfolio from './pages/portfolio/portfolio';
import Contact from './pages/contact/contact';
import { FreeEstimate } from './pages/free-estimate/free-estimate';

export const routes: Routes = [
    { path: '', component: Home }, // Default route
    { path: 'homepage', component: Home },
    { path: 'agency', component: Agency },
    { path: 'services', component: Services },
    { path: 'portfolio', component: Portfolio },
    { path: 'contact', component: Contact },
    { path: 'free_estimate', component: FreeEstimate },
];
