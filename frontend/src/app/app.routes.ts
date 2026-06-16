import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { AddJuiceComponent } from './pages/add-juice/add-juice.component';
import { EditJuiceComponent } from './pages/edit-juice/edit-juice.component';
import { JuiceListComponent } from './pages/juice-list/juice-list.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'juices', component: JuiceListComponent },
  { path: 'juices/add', component: AddJuiceComponent },
  { path: 'juices/edit/:id', component: EditJuiceComponent }
];
