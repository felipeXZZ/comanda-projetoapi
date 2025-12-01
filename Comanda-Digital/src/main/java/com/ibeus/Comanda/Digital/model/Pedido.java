package com.ibeus.Comanda.Digital.model;

import com.ibeus.Comanda.Digital.model.enums.FormaPagamento;
import com.ibeus.Comanda.Digital.model.enums.StatusPedido;
import jakarta.persistence.*;
// Importações do Lombok que vamos usar
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;
import lombok.EqualsAndHashCode;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "tb_pedido")
// 1. Substituímos @Data por anotações específicas
@Getter
@Setter
// 2. A MÁGICA: Excluímos o campo "itens" desses dois métodos para quebrar o loop
@ToString(exclude = "itens")
@EqualsAndHashCode(exclude = "itens")
public class Pedido {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Dados do cliente (baseado no Figma image_436b3a.png)
    private String nomeCliente;
    private String telefoneCliente;
    private String enderecoCliente;

    
    private LocalDateTime dataCriacao;
    
    @Enumerated(EnumType.STRING) // Salva o nome (ex: "EM_PREPARO") no banco
    @Column(length = 20) // Tamanho suficiente para "SAIU_PARA_ENTREGA" (17 caracteres)
    private StatusPedido status;

    @Enumerated(EnumType.STRING) // Salva o nome da forma de pagamento no banco
    private FormaPagamento formaPagamento;

    // Usando Double para ser consistente com o seu Dish.java
    private Double total;
    
    // "Um Pedido tem Muitos Itens"
    // CascadeType.ALL = Se eu salvar/deletar um Pedido, salve/delete os Itens juntos.
    @OneToMany(mappedBy = "pedido", cascade = CascadeType.ALL, orphanRemoval = true)
    private Set<ItemPedido> itens = new HashSet<>();
    
    @PrePersist // Define a data de criação e o status inicial antes de salvar
    public void prePersist() {
        dataCriacao = LocalDateTime.now();
        if (status == null) {
            status = StatusPedido.RECEBIDO; // Todo novo pedido começa como "RECEBIDO"
        }
    }
}