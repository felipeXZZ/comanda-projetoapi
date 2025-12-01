import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

// Importa a Topbar do Admin
// COMMIT BRANDÃO
import { TopbarComponent } from '../topbarAdmin/topbarAdmin.component';

// Importa o serviço e as interfaces
import { PedidoService, PedidoCompleto } from '../../../services/pedido.service';

@Component({
  selector: 'app-delivery-order',
  standalone: true,
  imports: [
    CommonModule,
    TopbarComponent
  ],
  templateUrl: './delivery-order.component.html',
  styleUrls: ['./delivery-order.component.css']
})
export class DeliveryOrderComponent implements OnInit {

  public pedidosDeEntrega: PedidoCompleto[] = [];
  public isLoading = false;
  public error: string | null = null;
  public isUpdating: number | null = null; // Rastreia o ID do pedido sendo atualizado

  constructor(private pedidoService: PedidoService) { }

  ngOnInit(): void {
    // Primeiro carrega os pedidos, depois se inscreve para receber atualizações
    this.pedidoService.loadAllPedidos(); // Dispara o carregamento inicial
    this.subscribeToPedidos();
  }

  /**
   * Se inscreve no Observable de pedidos do serviço para receber atualizações em tempo real.
   */
  subscribeToPedidos(): void {
    this.isLoading = true;
    this.error = null;

    this.pedidoService.pedidos$.subscribe({
      next: (data) => {
        // Filtra para exibir apenas os pedidos relevantes para a entrega
        // Os pedidos devem permanecer visíveis enquanto tiverem esses status
        // Quando um pedido está PRONTO e muda para SAIU_PARA_ENTREGA, ele aparece aqui

        const statusRelevantes = ['PRONTO', 'SAIU_PARA_ENTREGA', 'ENTREGUE']; // <-- MUDANÇA AQUI
        this.pedidosDeEntrega = data
          .filter(pedido => pedido && pedido.status && statusRelevantes.includes(pedido.status))
          .sort((a, b) => (a.id! < b.id! ? -1 : 1)); // Ordena por ID crescente

        this.isLoading = false;
      },
      error: (err) => {
        console.error('Erro ao buscar pedidos de entrega:', err);
        this.error = 'Não foi possível carregar os pedidos.';
        this.isLoading = false;
      }
    });
  }

  // <-- FUNÇÃO ADICIONADA AQUI
  /**
   * Chamado quando o botão "Enviar para Entrega" é clicado.
   */
  enviarParaEntrega(pedido: PedidoCompleto): void {
    if (!pedido.id) return;
    this.isUpdating = pedido.id;

    this.pedidoService.updatePedidoStatus(pedido.id, 'SAIU_PARA_ENTREGA').subscribe({
       next: () => {
         this.isUpdating = null; // Sucesso
       },
       error: (err) => {
         this.handleUpdateError(err, pedido);
       }
    });
  }

  /**
   * Chamado quando o botão "Marcar como Entregue" é clicado.
   */
  marcarComoEntregue(pedido: PedidoCompleto): void {
    if (!pedido.id) return;
    this.isUpdating = pedido.id;

    this.pedidoService.updatePedidoStatus(pedido.id, 'ENTREGUE').subscribe({
      next: () => {
        this.isUpdating = null; // Sucesso, para de carregar
      },
      error: (err) => {
        this.handleUpdateError(err, pedido);
      }
    });
  }

  /**
   * Centraliza o tratamento de erros para atualizações de status.
   */
  private handleUpdateError(err: any, pedido: PedidoCompleto): void {
    console.error(`Erro ao atualizar status do pedido #${pedido.id}:`, err);
    alert(`Não foi possível atualizar o Pedido #${pedido.id}. Tente novamente.`);
    this.isUpdating = null; // Garante que o loading pare em caso de erro.
  }
}
