import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms'; // Módulos de formulário
import { ActivatedRoute, Router } from '@angular/router'; // Para navegar e ler o ID da URL
import { Dish, DishService } from '../../../services/dish.service'; // O serviço que já existe

@Component({
  selector: 'app-dish-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule // Importante para [formGroup]
  ],
  templateUrl: './dish-form.component.html',
  styleUrls: ['./dish-form.component.css']
})
export class DishFormComponent implements OnInit {

  dishForm: FormGroup;
  isEditMode = false;
  currentDishId: number | null = null;
  isLoading = false;
  error: string | null = null;
  successMessage: string | null = null;

  constructor(
    private fb: FormBuilder,
    private dishService: DishService,
    private router: Router, // Para nos levar de volta ao cardápio
    private route: ActivatedRoute // Para ler o ID da URL (ex: /edit-dish/5)
  ) {
    // Inicializa o formulário
    this.dishForm = this.fb.group({
      name: ['', Validators.required], // Campo 'name' é obrigatório
      description: ['', Validators.required], // Campo 'description' é obrigatório
      price: [null, [Validators.required, Validators.min(0.01)]] // 'price' é obrigatório e > 0
    });
  }

  ngOnInit(): void {
    // Verifica se a URL tem um 'id'. Se tiver, estamos no modo de "Editar".
    this.route.paramMap.subscribe(params => {
      const idParam = params.get('id');
      if (idParam) {
        this.isEditMode = true;
        this.currentDishId = +idParam; // Converte string 'id' para número
        this.loadDishForEditing(this.currentDishId);
      }
    });
  }

  // Se for modo de edição, busca os dados do prato na API
  loadDishForEditing(id: number): void {
    this.isLoading = true;
    this.dishService.getDish(id).subscribe({
      next: (dish) => {
        // Preenche o formulário com os dados do prato
        this.dishForm.patchValue(dish);
        this.isLoading = false;
      },
      error: (err) => {
        this.error = 'Não foi possível carregar o prato para edição.';
        this.isLoading = false;
      }
    });
  }

  // Chamado quando o formulário é submetido
  onSubmit(): void {
    if (this.dishForm.invalid) {
      this.dishForm.markAllAsTouched(); // Mostra erros se o formulário for inválido
      return;
    }

    this.isLoading = true;
    this.error = null;
    this.successMessage = null;
    const dishData = this.dishForm.value;

    if (this.isEditMode && this.currentDishId) {
      // --- Lógica de ATUALIZAR (Editar) ---
      this.dishService.updateDish(this.currentDishId, dishData).subscribe({
        next: () => {
          this.successMessage = 'Prato atualizado com sucesso!';
          this.isLoading = false;
          // Volta para o cardápio após 2 segundos
          setTimeout(() => this.router.navigate(['/']), 2000);
        },
        error: (err) => {
          this.error = 'Erro ao atualizar o prato.';
          this.isLoading = false;
        }
      });
    } else {
      // --- Lógica de CRIAR (Adicionar) ---
      this.dishService.createDish(dishData).subscribe({
        next: () => {
          this.successMessage = 'Prato criado com sucesso!';
          this.isLoading = false;
          // Volta para o cardápio após 2 segundos
          setTimeout(() => this.router.navigate(['/']), 2000);
        },
        error: (err) => {
          this.error = 'Erro ao criar o prato.';
          this.isLoading = false;
        }
      });
    }
  }

  // --- Funções Auxiliares para mostrar erros no HTML ---
  isFieldInvalid(fieldName: string): boolean {
    const control = this.dishForm.get(fieldName);
    return control ? control.invalid && (control.dirty || control.touched) : false;
  }

  getErrorMessage(fieldName: string): string {
    const control = this.dishForm.get(fieldName);
    if (control?.errors?.['required']) {
      return 'Este campo é obrigatório.';
    }
    if (control?.errors?.['min']) {
      return 'O preço deve ser maior que zero.';
    }
    return 'Campo inválido.';
  }
}
