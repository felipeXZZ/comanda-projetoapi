-- Script SQL para corrigir o tamanho da coluna status na tabela tb_pedido
-- Execute este script no seu banco de dados MySQL

USE comanda_digital;

-- Altera a coluna status para VARCHAR(20) para suportar todos os valores do enum
ALTER TABLE tb_pedido MODIFY COLUMN status VARCHAR(20) NOT NULL;

-- Verifica se a alteração foi aplicada
DESCRIBE tb_pedido;

