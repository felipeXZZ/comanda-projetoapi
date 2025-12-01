package com.ibeus.Comanda.Digital.service;

import com.ibeus.Comanda.Digital.model.Dish;
import com.ibeus.Comanda.Digital.model.ItemPedido;
import com.ibeus.Comanda.Digital.model.Pedido;
import com.ibeus.Comanda.Digital.model.enums.StatusPedido;
// (Removida a importação duplicada do DishRepository, o DishService já cuida disso)
import com.ibeus.Comanda.Digital.repository.PedidoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional; // <-- 1. A IMPORTAÇÃO

import java.util.List;
import java.util.NoSuchElementException;

@Service
public class PedidoService {

    @Autowired
    private PedidoRepository pedidoRepository;

    // Injetamos o DishService que o professor criou
    @Autowired
    private DishService dishService;

    /**
     * Busca todos os pedidos no banco de dados.
     * @return Lista de todos os pedidos.
     */
    public List<Pedido> listarTodos() {
        return pedidoRepository.findAll();
    }

    /**
     * Busca um pedido específico pelo ID.
     * @param id O ID do pedido.
     * @return O Pedido encontrado.
     * @throws NoSuchElementException se o pedido não for encontrado.
     */
    public Pedido buscarPorId(Long id) {
        return pedidoRepository.findById(id).orElseThrow(() -> 
                new NoSuchElementException("Pedido não encontrado com o ID: " + id));
    }

    /**
     * Cria um novo pedido, calcula o total e salva no banco.
     * @param pedido O objeto Pedido (vindo do frontend)
     * @return O Pedido salvo com ID, total e status.
     */
    @Transactional // (Este já estava correto)
    public Pedido criarPedido(Pedido pedido) {
        
        // 1. Define o status inicial
        pedido.setStatus(StatusPedido.RECEBIDO);
        
        double totalPedido = 0.0;

        // 2. Processa cada item do pedido
        for (ItemPedido item : pedido.getItens()) {
            // Busca o prato (Dish) real do banco de dados
            // Usamos o DishService para garantir que o prato existe
            Dish dishDoBanco = dishService.findById(item.getDish().getId());
            
            // 3. Define o preço unitário (PEGANDO DO BANCO, não confiando no frontend)
            item.setPrecoUnitario(dishDoBanco.getPrice());
            
            // 4. Calcula o subtotal do item
            double subtotalItem = item.getPrecoUnitario() * item.getQuantidade();
            totalPedido += subtotalItem;
            
            // 5. Liga o item de volta ao pedido (importante para o JPA)
            item.setPedido(pedido);
        }
        
        // 6. Define o total calculado no pedido
        pedido.setTotal(totalPedido);

        // 7. Salva o pedido (e os itens, graças ao CascadeType.ALL)
        return pedidoRepository.save(pedido);
    }
    
    /**
     * Atualiza o status de um pedido existente.
     * @param id O ID do pedido a ser atualizado.
     * @param novoStatus O novo StatusPedido.
     * @return O Pedido com o status atualizado.
     */
    @Transactional
    public Pedido atualizarStatus(Long id, StatusPedido novoStatus) {
        // 1. Busca o pedido (reusa o método que já temos)
        Pedido pedido = buscarPorId(id);
        
        // 2. Atualiza o status
        pedido.setStatus(novoStatus);
        
        // 3. Salva o pedido atualizado. 
        // Como o método é @Transactional, o JPA/Spring vai fazer o "commit"
        // e salvar a mudança no banco de dados.
        return pedidoRepository.save(pedido);
    }
}