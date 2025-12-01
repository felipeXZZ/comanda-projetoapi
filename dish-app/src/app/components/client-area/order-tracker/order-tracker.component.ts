import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { TopbarComponent } from '../topbar/topbar.component';
import { PedidoService } from '../../../services/pedido.service';
import type { PedidoCompleto } from '../../../services/pedido.service';

// COMMIT
// COMMIT CADU

@Component({
  selector: 'app-order-tracker',
  standalone: true,
  imports: [CommonModule, TopbarComponent],
  templateUrl: './order-tracker.component.html',
  styleUrls: ['./order-tracker.component.css']
})
export class OrderTrackerComponent implements OnInit, OnDestroy {

  pedidos: PedidoCompleto[] = [];
  isLoading = false;
  error: string | null = null;

  private pedidosSub!: Subscription;

  constructor(private pedidoService: PedidoService) {}

  ngOnInit(): void {
    this.isLoading = true;

    // Primeiro carrega os pedidos, depois se inscreve para receber atualizações

    this.pedidoService.loadAllPedidos();
    
    // Escuta o BehaviorSubject com todos os pedidos
    this.pedidosSub = this.pedidoService.pedidos$.subscribe({
      next: (data: PedidoCompleto[]) => {
        // Filtra apenas pedidos válidos com status
        this.pedidos = data
          .filter(pedido => pedido && pedido.status)
          .sort((a, b) => (b.id > a.id ? 1 : -1));
        this.isLoading = false;
      },
      error: (err: any) => {
        console.error('Erro ao carregar pedidos:', err);
        this.error = 'Não foi possível carregar os pedidos.';
        this.isLoading = false;
      }
    });
  }

  ngOnDestroy(): void {
    if (this.pedidosSub) this.pedidosSub.unsubscribe();
  }

  formatarStatus(status: string | undefined | null): string {
    if (!status) return 'Status indefinido';

    switch (status) {
      case 'RECEBIDO': return '📝 Pedido Recebido';
      case 'EM_PREPARO': return '👨‍🍳 Em Preparo';
      case 'PRONTO': return '✅ Pronto';
      case 'SAIU_PARA_ENTREGA': return '🚚 Saiu para Entrega'; // Corrigido typo: ENTREGRA -> ENTREGA
      case 'ENTREGUE': return '✅ Entregue';
      case 'CANCELADO': return '❌ Cancelado';
      default: return status.replace(/_/g, ' '); // Substitui todos os underscores
    }
  }
}
