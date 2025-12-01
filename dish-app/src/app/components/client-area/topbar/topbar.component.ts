import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router'; 
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { CartService, CartItem } from '../../../services/cart.service'; 

@Component({
  selector: 'app-topbar', // Este é o nome da tag que você vai usar
  standalone: true,
  imports: [
    CommonModule,
    RouterLink    
  ],
  templateUrl: './topbar.component.html',
  styleUrls: ['./topbar.component.css']
})
export class TopbarComponent {
  public totalItensNoCarrinho$: Observable<number>;

  constructor(private cartService: CartService, private router: Router) {
    // Pega a lógica do contador de itens
    this.totalItensNoCarrinho$ = this.cartService.items$.pipe(
      map((items: CartItem[]) => items.reduce((total: number, item: CartItem) => total + item.quantidade, 0))
    );
  }

  // Método para verificar se a rota atual está ativa
  public isActive(route: string): boolean {
    return this.router.url === route;
  }
}