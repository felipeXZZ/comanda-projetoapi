import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Dish } from './dish.service'; // Importa a interface 'Dish' que já temos

// Interface para um item *dentro* do carrinho
export interface CartItem {
  dish: Dish;
  quantidade: number;
}

@Injectable({
  providedIn: 'root'
})
export class CartService {

  // BehaviorSubject é um "Observable" especial que guarda o valor atual
  // Ele vai guardar a nossa lista de itens do carrinho. Começa vazio.
  private itemsSubject = new BehaviorSubject<CartItem[]>([]);

  // Qualquer componente pode "ouvir" o items$ para ver as mudanças no carrinho em tempo real
  public items$: Observable<CartItem[]> = this.itemsSubject.asObservable();

  // Um Observable que calcula o total automaticamente sempre que o carrinho muda
  public total$: Observable<number> = this.items$.pipe(
    map(items => {
      return items.reduce((total, item) => total + (item.dish.price * item.quantidade), 0);
    })
  );

  constructor() { }

  /**
   * Adiciona um prato (Dish) ao carrinho.
   * Se o item já existir, apenas incrementa a quantidade.
   */
  public addItem(dish: Dish, quantity: number = 1): void {
    const currentItems = this.itemsSubject.getValue();
    const existingItem = currentItems.find(item => item.dish.id === dish.id);

    if (existingItem) {
      // Item já existe, só incrementa a quantidade
      existingItem.quantidade += quantity;
    } else {
      // Item novo, adiciona com quantidade 1
      currentItems.push({ dish: dish, quantidade: quantity });
    }

    // Emite o novo valor do carrinho para todos os "ouvintes"
    this.itemsSubject.next([...currentItems]);
    console.log('Carrinho atual:', currentItems);
  }


  /***
   * Diminui a quantidade de um item no carrinho.
   * Se a quantidade chegar a zero, remove o item.
   */

  public decreaseQuantity(dishId: number): void {
    const currentItems = this.itemsSubject.getValue();
    const existingItem = currentItems.find(item => item.dish.id === dishId);

    if (existingItem && existingItem.quantidade > 1) {
      // Se tem mais de 1, apenas diminui a quantidade
      existingItem.quantidade--;
      // Emite a lista atualizada (com nova referência)
      this.itemsSubject.next([...currentItems]);
    } 
  }

  /**
   * Remove um item do carrinho (pelo ID do prato).
   */
  public removeItem(dishId: number): void {
    const currentItems = this.itemsSubject.getValue();
    const updatedItems = currentItems.filter(item => item.dish.id !== dishId);

    this.itemsSubject.next(updatedItems);
  }

  /**
   * Limpa o carrinho (usado após o pedido ser finalizado).
   */
  public clearCart(): void {
    this.itemsSubject.next([]);
  }

  /**
   * Pega o valor atual dos itens (para enviar ao backend).
   */
  public getCurrentItems(): CartItem[] {
    return this.itemsSubject.getValue();
  }
}
