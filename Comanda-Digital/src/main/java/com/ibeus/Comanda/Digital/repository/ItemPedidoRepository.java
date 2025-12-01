package com.ibeus.Comanda.Digital.repository;

import com.ibeus.Comanda.Digital.model.ItemPedido;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

/**
 * Interface de repositório para a entidade ItemPedido.
 * Embora o Pedido gerencie os itens (Cascade), é bom ter este repositório.
 */
@Repository
public interface ItemPedidoRepository extends JpaRepository<ItemPedido, Long> {
}