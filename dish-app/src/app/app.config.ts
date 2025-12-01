import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter, Routes } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';

// Componentes
import { SplashScreenComponent } from './components/splash-screen/splash-screen.component';
import { DishListComponent } from './components/client-area/dish-list/dish-list.component';
import { DishFormComponent } from './components/admin-area/dish-form/dish-form.component';
import { CheckoutComponent } from './components/client-area/checkout/checkout.component';
import { OrderTrackerComponent } from './components/client-area/order-tracker/order-tracker.component';
import { AdminDashboardComponent } from './components/admin-area/admin-dashboard/admin-dashboard.component';

// --- AJUSTE 1: Importe o nome no PLURAL ---
import { KitchenOrdersComponent } from './components/admin-area/kitchen-orders/kitchen-orders.component';
import { DeliveryOrderComponent } from './components/admin-area/delivery-order/delivery-order.component';


const routes: Routes = [
  // Splash como página inicial
  { path: '', component: SplashScreenComponent, pathMatch: 'full' },

  // Aliases semânticos do Splash:
  { path: 'cliente', redirectTo: 'cardapio', pathMatch: 'full' },
  { path: 'funcionario', redirectTo: 'admin', pathMatch: 'full' },

  // Rotas Cliente
  { path: 'cardapio', component: DishListComponent },
  { path: 'checkout', component: CheckoutComponent },
  { path: 'orders', component: OrderTrackerComponent },

  // Rotas Admin
  { path: 'admin', component: AdminDashboardComponent },
  { path: 'admin/edit-dish/:id', component: DishFormComponent },

  { path: 'admin/kitchen', component: KitchenOrdersComponent },
  {path: 'admin/entregas', component: DeliveryOrderComponent },
  // --- AJUSTE 2: Corrija a rota para o plural ---
  //
  { path: 'admin/delivery', component: DeliveryOrderComponent },


  // 404 → volta pro Splash
  { path: '**', redirectTo: '' }
];

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    importProvidersFrom(HttpClientModule, ReactiveFormsModule)
  ]
};
