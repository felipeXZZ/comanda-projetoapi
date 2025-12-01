# 🛵 Comanda Digital – Sistema de Delivery

Este projeto é um protótipo funcional de sistema de delivery, desenvolvido para fins acadêmicos, utilizando Angular, Spring Boot e MySQL.

O sistema simula um fluxo completo de pedidos, permitindo que o cliente:
* visualize pratos com descrição,
* selecione quantidades,
* adicione ao carrinho,
* acompanhe o status do pedido em tempo real,
* registre o método de pagamento (simulado).

Também inclui as telas da Cozinha e do Entregador, seguindo o layout definido no Figma.

---

## 🚀 Tecnologias Utilizadas

### Frontend
* Angular 17+
* TypeScript
* HTML5
* SCSS
* Angular CLI

### Backend
* Java 17+
* Spring Boot
* Spring Web
* Spring Data JPA
* Spring Validation
* Lombok
* Swagger / OpenAPI
* Maven

### Banco de Dados
* MySQL 8

### Ferramentas & Suporte
* GitHub (versionamento)
* Figma (design)
  
---

## 📦 Como Rodar o Projeto

### 🔧 Frontend (Angular)

1. **Instalar dependências:**
```bash
npm install
```

2. **Rodar em modo desenvolvimento:**
```bash
ng serve
```

3. **Acessar no navegador:**
```
http://localhost:4200
```

---

### 🖥️ Backend (Spring Boot)

1. **Executar a API:**
```bash
mvn spring-boot:run
```
ou executar pela sua IDE (IntelliJ/Eclipse).

2. **Acessar a documentação Swagger:**
```
http://localhost:8080/swagger-ui/index.html#/
```

---

### 🗄️ Configuração do Banco de Dados (MySQL)

**Crie o banco de dados manualmente:**
```sql
CREATE DATABASE comanda_digital;
```

**Exemplo real do `application.properties` usado no projeto:**
```properties
spring.application.name=Comanda-Digital

spring.datasource.url=jdbc:mysql://localhost:3306/comanda_digital
spring.datasource.username=root
spring.datasource.password=suasenha

spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.MySQLDialect
```

---

## 📌 Funcionalidades do Sistema

* ✔️ Cardápio com descrição e imagem dos pratos
* ✔️ Seleção de quantidade (ex: 2 batatas fritas, 5 sushis)
* ✔️ Carrinho de compras
* ✔️ Registro de método de pagamento (simulado)
* ✔️ Atualização e acompanhamento de status do pedido em tempo real
* ✔️ Tela da Cozinha para preparação dos pedidos
* ✔️ Tela do Entregador para acompanhar entregas
* ✔️ Integração completa com MySQL
* ✔️ Layout fiel ao protótipo do Figma

---

## 📄 Licença

Este é um projeto acadêmico — livre para estudos e referências.
