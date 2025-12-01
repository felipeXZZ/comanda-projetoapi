import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs'; 
import { tap } from 'rxjs/operators';



export interface ItemPedido {

  dish: { id: number };
  quantidade: number;
}

export interface Pedido {
  // Dados do cliente
  nomeCliente: string;
  telefoneCliente: string;
  enderecoCliente: string;
  dataHora: string; // ou Date

  // Lista de itens
  itens: ItemPedido[];
}

// --- Interfaces para RECEBER dados do backend ---
export interface Dish {
  id: number;
  name: string;
  price: number;
}

export interface ItemPedidoCompleto {
  id: number; 
  quantidade: number;
  dish: Dish; 
}

export interface PedidoCompleto {
  id: number;
  nomeCliente: string;
  telefoneCliente: string;
  enderecoCliente: string;
  dataHora: string; 
  status: string; 
  total: number;
  itens: ItemPedidoCompleto[]; //
  isLoading?: boolean;
}


@Injectable({
  providedIn: 'root'
})
export class PedidoService {

  private readonly apiUrl = 'http://localhost:8080/api/pedidos';

  private pedidosState = new BehaviorSubject<PedidoCompleto[]>([]);
  
  //Um Observable público que os componentes podem ouvir
  public pedidos$ = this.pedidosState.asObservable();

  constructor(private http: HttpClient) { }

  /**
   * Busca todos os pedidos da API e "avisa"
   * a todos os ouvintes (o BehaviorSubject)
   */
  public loadAllPedidos(): void {
    this.http.get<PedidoCompleto[]>(this.apiUrl).pipe(
      tap((data) => this.pedidosState.next(data))
    ).subscribe({
      error: (err) => console.error('Erro ao carregar pedidos:', err)
    });
  }
  

 

  /**
   * Cria um novo pedido E ATUALIZA A LISTA
   */
  public createPedido(pedidoData: Pedido): Observable<PedidoCompleto> {
    return this.http.post<PedidoCompleto>(this.apiUrl, pedidoData).pipe(
      tap(() => {
        this.loadAllPedidos(); 
      })
    );
  }

  /**
   * Busca um pedido 
   */
  public getPedidoById(id: number): Observable<PedidoCompleto> {
    return this.http.get<PedidoCompleto>(`${this.apiUrl}/${id}`);
  }

  /**
   * Busca todos os pedidos 
   */
  public getAllPedidos(): Observable<PedidoCompleto[]> {
    return this.http.get<PedidoCompleto[]>(this.apiUrl);
  }

  /**
   * Atualiza o status E ATUALIZA A LISTA
   * O backend espera { "novoStatus": "EM_PREPARO" } no body
   */
  updatePedidoStatus(id: number, novoStatus: string): Observable<PedidoCompleto> {
    const body = { novoStatus: novoStatus }; // Backend espera "novoStatus", não "status"
    console.log(`Atualizando pedido ${id} para status: ${novoStatus}`, body);
    
    return this.http.patch<PedidoCompleto>(`${this.apiUrl}/${id}/status`, body).pipe(
      tap({
        next: (pedidoAtualizado) => {
          console.log('Pedido atualizado com sucesso:', pedidoAtualizado);
          // Atualiza o pedido localmente com a resposta do servidor
          const pedidosAtuais = this.pedidosState.value;
          const pedidosAtualizados = pedidosAtuais.map(pedido => 
            pedido.id === pedidoAtualizado.id ? pedidoAtualizado : pedido
          );
          this.pedidosState.next(pedidosAtualizados);
          
          // Recarrega a lista completa do servidor para garantir sincronização
          // Isso garante que todos os componentes recebam a atualização
          this.loadAllPedidos(); 
        },
        error: (err) => {
          console.error('Erro ao atualizar status no serviço:', err);
          console.error('Status HTTP:', err.status);
          console.error('Mensagem:', err.message);
          if (err.error) {
            console.error('Detalhes do erro:', err.error);
          }
        }
      })
    );
  }
}