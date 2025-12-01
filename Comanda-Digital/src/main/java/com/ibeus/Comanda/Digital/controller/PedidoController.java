package com.ibeus.Comanda.Digital.controller;

import com.ibeus.Comanda.Digital.model.Pedido;
import com.ibeus.Comanda.Digital.model.enums.StatusPedido;
import com.ibeus.Comanda.Digital.service.PedidoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;


import java.util.List;
import java.util.NoSuchElementException;

@RestController
@RequestMapping("/api/pedidos") // URL base para todos os endpoints de pedido
@CrossOrigin(origins = "http://localhost:4200") // Permite o frontend Angular
public class PedidoController {

    @Autowired
    private PedidoService pedidoService;

    /**
     * Endpoint para CRIAR um novo pedido.
     * Mapeado para POST /api/pedidos
     * O frontend envia o JSON do pedido no corpo da requisição (@RequestBody).
     */
    @PostMapping
    public ResponseEntity<Pedido> criarPedido(@RequestBody Pedido pedido) {
        // O PedidoService (que criamos) faz toda a mágica:
        // 1. Calcula o total
        // 2. Define o status
        // 3. Salva no banco
        Pedido pedidoSalvo = pedidoService.criarPedido(pedido);
        return new ResponseEntity<>(pedidoSalvo, HttpStatus.CREATED);
    }

    /**
     * Endpoint para LISTAR TODOS os pedidos.
     * Mapeado para GET /api/pedidos
     * (Para a tela de "Acompanhamento de Pedidos" do funcionário)
     */
    @GetMapping
    public List<Pedido> listarTodosPedidos() {
        return pedidoService.listarTodos();
    }

    /**
     * Endpoint para BUSCAR UM pedido específico pelo ID.
     * Mapeado para GET /api/pedidos/{id}
     * (Para a tela de "Rastreamento" do cliente)
     */
    @GetMapping("/{id}")
    public ResponseEntity<Pedido> buscarPedidoPorId(@PathVariable Long id) {
        try {
            Pedido pedido = pedidoService.buscarPorId(id);
            return ResponseEntity.ok(pedido);
        } catch (NoSuchElementException e) {
            // Retorna 404 Not Found se o pedido não existir
            return ResponseEntity.notFound().build();
        }
    }
    
    /**
     * DTO (Data Transfer Object) simples para receber a atualização de status.
     * O frontend só precisa enviar: { "novoStatus": "EM_PREPARO" }
     * Aceita tanto StatusPedido quanto String para maior flexibilidade
     */
    public record StatusUpdateRequest(String novoStatus) {}

    /**
     * Endpoint para ATUALIZAR O STATUS de um pedido.
     * Mapeado para PATCH /api/pedidos/{id}/status
     * (O funcionário usa isso para mudar de "RECEBIDO" para "EM_PREPARO", etc.)
     */
    @PatchMapping("/{id}/status")
    public ResponseEntity<Pedido> atualizarStatus(
            @PathVariable Long id, 
            @RequestBody StatusUpdateRequest request) {
        try {
            if (request == null || request.novoStatus() == null || request.novoStatus().isEmpty()) {
                System.err.println("Erro: Request ou novoStatus é null/vazio");
                return ResponseEntity.badRequest().build();
            }
            
            // Converte a string para o enum StatusPedido
            StatusPedido statusEnum;
            try {
                statusEnum = StatusPedido.valueOf(request.novoStatus().toUpperCase());
            } catch (IllegalArgumentException e) {
                System.err.println("Erro: Status inválido: " + request.novoStatus());
                return ResponseEntity.badRequest().build();
            }
            
            System.out.println("Atualizando pedido " + id + " para status: " + statusEnum);
            Pedido pedidoAtualizado = pedidoService.atualizarStatus(id, statusEnum);
            System.out.println("Pedido atualizado com sucesso. Novo status: " + pedidoAtualizado.getStatus());
            return ResponseEntity.ok(pedidoAtualizado);
        } catch (NoSuchElementException e) {
            System.err.println("Pedido não encontrado: " + id);
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            // Log do erro para debug
            System.err.println("Erro ao atualizar status do pedido " + id + ": " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
}