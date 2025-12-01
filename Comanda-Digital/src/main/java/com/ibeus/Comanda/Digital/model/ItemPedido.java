package com.ibeus.Comanda.Digital.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
// Importações do Lombok que vamos usar
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;
import lombok.EqualsAndHashCode;

@Entity
@Table(name = "tb_item_pedido")
// 1. Substituímos @Data por anotações específicas
@Getter
@Setter
// 2. A MÁGICA: Excluímos o campo "pedido" desses dois métodos para quebrar o loop
@ToString(exclude = "pedido")
@EqualsAndHashCode(exclude = "pedido")
public class ItemPedido {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // "Muitos Itens podem estar em Um Pedido"
    @JsonIgnore // Evita loop infinito ao converter para JSON
    @ManyToOne
    @JoinColumn(name = "pedido_id") // Chave estrangeira
    private Pedido pedido;

    // "Muitos Itens podem se referir a Um Prato (Dish)"
    // ESTA É A LIGAÇÃO COM A SUA BASE
    @ManyToOne
    @JoinColumn(name = "dish_id") // Chave estrangeira
    private Dish dish;

    private Integer quantidade;
    
    // Preço do produto no momento da compra (consistente com Dish.java)
    private Double precoUnitario; 

}