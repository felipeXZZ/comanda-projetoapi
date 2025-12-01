package com.ibeus.Comanda.Digital.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.ibeus.Comanda.Digital.model.Dish;
// Comentário de atualização para commit

public interface DishRepository extends JpaRepository<Dish, Long> {
}