package com.ibeus.Comanda.Digital.repository;

import com.ibeus.Comanda.Digital.model.Pedido;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;


@Repository
public interface PedidoRepository extends JpaRepository<Pedido, Long> {
    
    // Mais tarde, podemos adicionar buscas customizadas aqui, como:
    // List<Pedido> findByStatus(StatusPedido status);
    // List<Pedido> findByTelefoneCliente(String telefone);
    
}