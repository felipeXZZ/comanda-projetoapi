import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { TopbarComponent } from '../topbar/topbar.component';

// Serviços
import { Dish, DishService } from '../../../services/dish.service';
import { CartService, CartItem } from '../../../services/cart.service';

@Component({
  selector: 'app-dish-list',
  standalone: true,
  imports: [
    CommonModule,
    TopbarComponent,
    RouterLink
  ],
  templateUrl: './dish-list.component.html',
  styleUrls: ['./dish-list.component.css']
})
export class DishListComponent implements OnInit {

  dishes: Dish[] = [];
  isLoading = true;
  error: string | null = null;

  public totalItensNoCarrinho$: Observable<number>;
  public totalPrecoCarrinho$: Observable<number>;

  // Modal
  public isModalVisible = false;
  public selectedDish: Dish | null = null;
  public modalQuantity = 1;

  constructor(
    private dishService: DishService,
    private cartService: CartService
  ) {
    this.totalPrecoCarrinho$ = this.cartService.total$;

    this.totalItensNoCarrinho$ = this.cartService.items$.pipe(
      map((items: CartItem[]) =>
        items.reduce(
          (total: number, item: CartItem) => total + item.quantidade,
          0
        )
      )
    );
  }

  ngOnInit(): void {
    this.loadDishes();
  }

  loadDishes(): void {
    this.isLoading = true;
    this.error = null;

    // ============================
    // PRATOS FIXOS (IMAGENS ESTÁTICAS) COMMIT FELIPE
    // ============================
    const pratosFixos: Dish[] = [
      {
        id: 1,
        name: 'Pizza Artesanal',
        description: 'Mussarela fresca e manjericão',
        price: 25,
        image: 'https://i.ibb.co/LdRZv59x/pizza-artesanal.jpg'
      },
      {
        id: 2,
        name: 'Burger da Casa',
        description: 'Hambúrguer artesanal com queijo e molho especial',
        price: 18,
        image: 'https://i.ibb.co/hJtB8GT7/burger-casa.jpg'
      }
    ];

    this.dishService.getDishes().subscribe({
      next: (data) => {
        // Junta pratos fixos + pratos do backend
        this.dishes = [...pratosFixos, ...data];

        this.isLoading = false;
        console.log('Pratos carregados:', this.dishes);
      },
      error: (err) => {
        console.error('Erro ao buscar pratos:', err);
        this.error = 'Não foi possível carregar o cardápio. O backend está rodando?';
        this.isLoading = false;
      }
    });
  }

  // ============================
  // MÉTODOS DO MODAL
  // ============================

  abrirModal(dish: Dish): void {
    this.selectedDish = dish;
    this.modalQuantity = 1;
    this.isModalVisible = true;
  }

  cancelarModal(): void {
    this.isModalVisible = false;
    this.selectedDish = null;
  }

  incrementQuantity(): void {
    this.modalQuantity++;
  }

  decrementQuantity(): void {
    if (this.modalQuantity > 1) {
      this.modalQuantity--;
    }
  }

  confirmarAdicaoAoCarrinho(): void {
    if (this.selectedDish) {
      console.log('Adicionando', this.modalQuantity, 'x', this.selectedDish.name);

      for (let i = 0; i < this.modalQuantity; i++) {
        this.cartService.addItem(this.selectedDish);
      }

      this.cancelarModal();
    }
  }

}
