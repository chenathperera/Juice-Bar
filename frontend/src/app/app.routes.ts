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
import { RegisterComponent } from './pages/register/register.component';
import { authGuard } from './auth.guard';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'menu', component: MenuComponent },
  { path: 'track-order', component: TrackOrderComponent },
  { path: 'admin/juices', component: JuiceListComponent, canActivate: [authGuard] },
  { path: 'admin/juices/add', component: AddJuiceComponent, canActivate: [authGuard] },
  { path: 'admin/juices/edit/:id', component: EditJuiceComponent, canActivate: [authGuard] },
  { path: 'admin/categories', component: CategoryListComponent, canActivate: [authGuard] },
  { path: 'admin/categories/add', component: AddCategoryComponent, canActivate: [authGuard] },
  { path: 'admin/categories/edit/:id', component: EditCategoryComponent, canActivate: [authGuard] },
  { path: 'admin/orders', component: OrderListComponent, canActivate: [authGuard] },
  { path: 'admin/orders/:id', component: OrderListComponent, canActivate: [authGuard] }
];
