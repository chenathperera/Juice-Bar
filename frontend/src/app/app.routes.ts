import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { AddJuiceComponent } from './pages/add-juice/add-juice.component';
import { AddCategoryComponent } from './pages/add-category/add-category.component';
import { EditJuiceComponent } from './pages/edit-juice/edit-juice.component';
import { EditCategoryComponent } from './pages/edit-category/edit-category.component';
import { JuiceListComponent } from './pages/juice-list/juice-list.component';
import { CategoryListComponent } from './pages/category-list/category-list.component';
import { OrderListComponent } from './pages/order-list/order-list.component';
import { MenuComponent } from './pages/menu/menu.component';
import { TrackOrderComponent } from './pages/track-order/track-order.component';
import { LoginComponent } from './pages/login/login.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'menu', component: MenuComponent },
  { path: 'track-order', component: TrackOrderComponent },
  { path: 'admin/juices', component: JuiceListComponent },
  { path: 'admin/juices/add', component: AddJuiceComponent },
  { path: 'admin/juices/edit/:id', component: EditJuiceComponent },
  { path: 'admin/categories', component: CategoryListComponent },
  { path: 'admin/categories/add', component: AddCategoryComponent },
  { path: 'admin/categories/edit/:id', component: EditCategoryComponent },
  { path: 'admin/orders', component: OrderListComponent },
  { path: 'admin/orders/:id', component: OrderListComponent }
];
