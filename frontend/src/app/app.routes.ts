import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { AddJuiceComponent } from './pages/add-juice/add-juice.component';
import { AddCategoryComponent } from './pages/add-category/add-category.component';
import { EditJuiceComponent } from './pages/edit-juice/edit-juice.component';
import { EditCategoryComponent } from './pages/edit-category/edit-category.component';
import { JuiceListComponent } from './pages/juice-list/juice-list.component';
import { CategoryListComponent } from './pages/category-list/category-list.component';
import { OrderListComponent } from './pages/order-list/order-list.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'juices', component: JuiceListComponent },
  { path: 'juices/add', component: AddJuiceComponent },
  { path: 'juices/edit/:id', component: EditJuiceComponent },
  { path: 'categories', component: CategoryListComponent },
  { path: 'categories/add', component: AddCategoryComponent },
  { path: 'categories/edit/:id', component: EditCategoryComponent },
  { path: 'orders', component: OrderListComponent }
];
