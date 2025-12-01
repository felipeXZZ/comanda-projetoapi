import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { TopbarComponent } from '../../admin-area/topbarAdmin/topbarAdmin.component';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { PedidoService, PedidoCompleto } from '../../../services/pedido.service';
import { Dish, DishService } from '../../../services/dish.service'; 

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink, TopbarComponent, ReactiveFormsModule],
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css']
})
export class AdminDashboardComponent implements OnInit {

  // Seção de Pedidos
  pedidos: PedidoCompleto[] = [];
  isLoadingPedidos = true;
  errorPedidos: string | null = null;
  statusList: string[] = [
    'RECEBIDO', 'EM_PREPARO', 'SAIU_PARA_ENTREGA', 'ENTREGUE', 'CANCELADO'
  ];
  
  dishForm: FormGroup;
  dishFormIsLoading = false;
  dishFormError: string | null = null;
  dishFormSuccessMessage: string | null = null;

  // NOVA SEÇÃO DE PRATOS
  dishes: Dish[] = [];
  isLoadingDishes = true;
  errorDishes: string | null = null;

  // INJETA OS DOIS SERVIÇOS
  constructor(
    private pedidoService: PedidoService,
    private dishService: DishService, // <-- INJETA O DISH SERVICE
    private fb: FormBuilder // Injetado para construir o formulário
  ) {
    // Inicializa o formulário de pratos
    this.dishForm = this.fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      price: [null, [Validators.required, Validators.min(0.01)]]
    });
  }

  ngOnInit(): void {
    // INICIA O CARREGAMENTO E SE INSCREVE NAS LISTAS
    this.loadPedidos();
    this.loadDishes();
  }

  loadPedidos(): void {
    this.isLoadingPedidos = true;
    // 1. Primeiro carrega os pedidos, depois se inscreve para receber atualizações
    this.pedidoService.loadAllPedidos();
    // 2. Se inscreve no Observable de pedidos do serviço
    this.pedidoService.pedidos$.subscribe({
      next: (data) => {
        // Filtra apenas pedidos válidos e ordena os dados recebidos
        this.pedidos = data
          .filter(pedido => pedido && pedido.id)
          .sort((a, b) => b.id - a.id);
        this.isLoadingPedidos = false;
        this.errorPedidos = null;
      },
      error: (err) => {
        this.errorPedidos = 'Não foi possível carregar os pedidos.';
        this.isLoadingPedidos = false;
      }
    });
  }

  // CARREGAR PRATOS
  loadDishes(): void {
    this.isLoadingDishes = true;
    this.errorDishes = null;
    this.dishService.getDishes().subscribe({
      next: (data) => {
        this.dishes = data.sort((a, b) => (a.id || 0) - (b.id || 0));
        this.isLoadingDishes = false;
      },
      error: (err) => {
        this.errorDishes = 'Não foi possível carregar os pratos.';
        this.isLoadingDishes = false;
      }
    });
  }

  //DELETAR PRATOS
  deleteDish(id: number | undefined): void {
    if (!id) return;
    if (confirm('Tem certeza que deseja deletar este prato?')) {
      this.dishService.deleteDish(id).subscribe({
        next: () => {
          this.loadDishes();

        },
        error: (err) => {
          alert('Erro ao deletar o prato.');
        }
      });
    }
  }

  onDishFormSubmit(): void {
    if (this.dishForm.invalid) {
      this.dishForm.markAllAsTouched();
      return;
    }

    this.dishFormIsLoading = true;
    this.dishFormError = null;
    this.dishFormSuccessMessage = null;

    this.dishService.createDish(this.dishForm.value).subscribe({
      next: () => {
        this.dishFormSuccessMessage = 'Prato criado com sucesso!';
        this.dishFormIsLoading = false;
        this.loadDishes(); // Atualiza a lista de pratos na tela
        this.dishForm.reset(); // Limpa o formulário
        // Limpa a mensagem de sucesso após 3 segundos
        setTimeout(() => this.dishFormSuccessMessage = null, 3000);
      },
      error: (err) => {
        this.dishFormError = 'Erro ao criar o prato.';
        this.dishFormIsLoading = false;
      }
    });
  }

  isDishFieldInvalid(fieldName: string): boolean {
    const control = this.dishForm.get(fieldName);
    return !!control && control.invalid && (control.dirty || control.touched);
  }

  getDishErrorMessage(fieldName: string): string {
    const control = this.dishForm.get(fieldName);
    if (control?.errors?.['required']) { return 'Este campo é obrigatório.'; }
    if (control?.errors?.['min']) { return 'O preço deve ser maior que zero.'; }
    return 'Campo inválido.';
  }


  onStatusChange(pedidoId: number, event: Event): void {
    const selectElement = event.target as HTMLSelectElement;
    const novoStatus = selectElement.value;
    if (!novoStatus) return;

    this.pedidoService.updatePedidoStatus(pedidoId, novoStatus).subscribe({
      next: () => {
        // A lista será atualizada automaticamente pelo BehaviorSubject no serviço.
      },
      error: (err) => {
        alert('Erro ao atualizar status. (O bug do @Transactional ainda pode estar aqui se o Eclipse não reiniciou corretamente!)');
      }
    });
  }
}
