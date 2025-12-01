import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Dish, DishService } from '../../services/dish.service';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  // Vamos carregar apenas os 3 primeiros pratos para a prévia
  dishesPreview: Dish[] = [];
  isLoading = true;
  error: string | null = null;

  constructor(private dishService: DishService) { }

  ngOnInit(): void {
    this.loadDishesPreview();
  }

  loadDishesPreview(): void {
    this.isLoading = true;
    this.error = null;
    this.dishService.getDishes().pipe(
      // Pega apenas os 3 primeiros pratos
      map(dishes => dishes.slice(0, 3))
    ).subscribe({
      next: (data) => {
        this.dishesPreview = data;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Erro ao buscar pratos:', err);
        this.error = 'Não foi possível carregar o cardápio.';
        this.isLoading = false;
      }
    });
  }
}
