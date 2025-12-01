package com.ibeus.Comanda.Digital.model.enums;

/**
 * Define os possíveis status de um pedido, conforme o figma.
 */
public enum StatusPedido {
    RECEBIDO,       // O pedido acabou de ser feito pelo cliente
    EM_PREPARO,     // A cozinha está preparando o pedido
    SAIU_PARA_ENTREGA, // O motoboy saiu com o pedido
    PRONTO,
    ENTREGUE,       // O cliente recebeu o pedido
    CANCELADO       // O pedido foi cancelado
}