import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { JuiceListComponent } from './pages/juice-list/juice-list.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'juices', component: JuiceListComponent }
];
