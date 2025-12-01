import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router'; // <-- MUDANÇA 1: Importar RouterLink
import { Observable } from 'rxjs';
import { TopbarComponent } from '../../client-area/topbar/topbar.component';

// Nossos serviços
import { CartService, CartItem } from '../../../services/cart.service';
import { PedidoService, ItemPedido, Pedido } from '../../../services/pedido.service';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TopbarComponent,
    RouterLink // <-- MUDANÇA 2: Adicionar RouterLink aqui
  ],
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit {

  customerForm: FormGroup;
  items$: Observable<CartItem[]>;
  total$: Observable<number>;

  isLoading = false;
  error: string | null = null;
  successMessage: string | null = null;

  constructor(
    private fb: FormBuilder,
    private cartService: CartService,
    private pedidoService: PedidoService,
    private router: Router
  ) {
    // Inicializa o formulário do cliente
    this.customerForm = this.fb.group({
      nomeCliente: ['', Validators.required],
      telefoneCliente: ['', Validators.required],
      enderecoCliente: ['', Validators.required],
      formaPagamento: ['', Validators.required]
    });

    // Conecta os Observables do serviço ao nosso componente
    this.items$ = this.cartService.items$;
    this.total$ = this.cartService.total$;
  }

  ngOnInit(): void {
    
  }

  // Chamado quando o cliente clica em "Finalizar Pedido"
  onSubmit(): void {
    if (this.customerForm.invalid) {
      this.customerForm.markAllAsTouched();
      return;
    }

    if (this.cartService.getCurrentItems().length === 0) {
      this.error = "Seu carrinho está vazio!";
      return;
    }

    this.isLoading = true;
    this.error = null;
    this.successMessage = null;

    // 1. Formata os itens do carrinho para o formato que o Backend (Java) espera
    const itensParaApi: ItemPedido[] = this.cartService.getCurrentItems().map(item => ({
      dish: { id: item.dish.id! }, // Envia apenas o ID do prato
      quantidade: item.quantidade
    }));

    // 2. Monta o objeto Pedido completo
    const novoPedido: Pedido = {
      ...this.customerForm.value, // Pega (nome, telefone, endereco) do formulário
      itens: itensParaApi
    };

    console.log('Enviando pedido para a API:', novoPedido);

    // 3. Chama o PedidoService para enviar ao backend
    this.pedidoService.createPedido(novoPedido).subscribe({
      next: (pedidoSalvo) => {
        console.log('Pedido criado com sucesso!', pedidoSalvo);
        this.successMessage = `Pedido #${pedidoSalvo.id} realizado com sucesso! Em breve sairá para entrega.`;
        this.isLoading = false;
        this.cartService.clearCart(); // Limpa o carrinho
        this.customerForm.reset();
      },
      error: (err) => {
        console.error('Erro ao criar pedido:', err);
        this.error = 'Não foi possível finalizar o pedido. Tente novamente.';
        this.isLoading = false;
      }
    });
  }
  aumentar(item: CartItem): void {
    this.cartService.addItem(item.dish, 1);
  }

  diminuir(item: CartItem): void {
    if (item.dish.id) {
      this.cartService.decreaseQuantity(item.dish.id);
    }
  }

  remover(item: CartItem): void {
    if (item.dish.id) {
      this.cartService.removeItem(item.dish.id);
    }
  }
  
  // --- Funções Auxiliares para o HTML ---
  isFieldInvalid(fieldName: string): boolean {
    const control = this.customerForm.get(fieldName);
    return control ? control.invalid && (control.dirty || control.touched) : false;
  }
}