import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

// Importa a Topbar do Admin (como definido no seu TS)
// COMMIT VINICIOS
import { TopbarComponent } from '../topbarAdmin/topbarAdmin.component';

// Importa o serviço e as interfaces corretas
import { PedidoService, PedidoCompleto, ItemPedidoCompleto } from '../../../services/pedido.service';

@Component({
  selector: 'app-kitchen-orders', // seletor no plural
  standalone: true,
  imports: [
    CommonModule,
    TopbarComponent
  ],
  templateUrl: './kitchen-orders.component.html',
  styleUrls: ['./kitchen-orders.component.css']
})
export class KitchenOrdersComponent implements OnInit {

  public pedidosDaCozinha: PedidoCompleto[] = [];
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
        // Filtra para exibir apenas os pedidos relevantes para a cozinha
        // Os pedidos devem permanecer visíveis enquanto tiverem esses status
        const statusRelevantes = ['RECEBIDO', 'EM_PREPARO']; // <-- MUDANÇA AQUI
        this.pedidosDaCozinha = data
          .filter(pedido => pedido && pedido.status && statusRelevantes.includes(pedido.status))
          .sort((a, b) => (a.id! < b.id! ? -1 : 1)); // Ordena por ID crescente

        this.isLoading = false;
      },
      error: (err) => {
        console.error('Erro ao buscar pedidos da cozinha:', err);
        this.error = 'Não foi possível carregar os pedidos.';
        this.isLoading = false;
      }
    });
  }

  /**
   * Chamado quando o botão "Iniciar Preparo" é clicado.
   */
  marcarEmPreparo(pedido: PedidoCompleto): void {
    if (!pedido.id) return;
    this.isUpdating = pedido.id;

    this.pedidoService.updatePedidoStatus(pedido.id, 'EM_PREPARO').subscribe({
      next: () => {
        this.isUpdating = null; // Sucesso, para de carregar
      },
      error: (err) => {
        this.handleUpdateError(err, pedido);
      }
    });
  }

  /**
   * Chamado quando o botão "Marcar como Pronto" é clicado.
   */
  marcarComoPronto(pedido: PedidoCompleto): void {
    if (!pedido.id) return;
    this.isUpdating = pedido.id;

    this.pedidoService.updatePedidoStatus(pedido.id, 'PRONTO').subscribe({
      next: () => {
        this.isUpdating = null; // Sucesso, para de carregar
      },
      error: (err) => {
        this.handleUpdateError(err, pedido);
      }
    });
  }

  // <-- FUNÇÃO 'enviarParaEntrega' REMOVIDA DAQUI

  /**
   * Centraliza o tratamento de erros para atualizações de status.
   */
  private handleUpdateError(err: any, pedido: PedidoCompleto): void {
    console.error(`Erro ao atualizar status do pedido #${pedido.id}:`, err);
    let mensagemErro = `Não foi possível atualizar o Pedido #${pedido.id}.`;

    if (err.error) {
      console.error('Detalhes do erro:', err.error);
      if (err.status === 400) {
        mensagemErro += ' Dados inválidos.';
      } else if (err.status === 404) {
        mensagemErro += ' Pedido não encontrado.';
      } else if (err.status === 500) {
        mensagemErro += ' Erro no servidor.';
      }
    }

    alert(mensagemErro);
    this.isUpdating = null; // Garante que o loading pare em caso de erro.
  }
}
