package com.ibeus.Comanda.Digital.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.ibeus.Comanda.Digital.model.Dish;
import com.ibeus.Comanda.Digital.repository.DishRepository;
import org.springframework.transaction.annotation.Transactional; // 1. IMPORTAR

import java.util.List;

@Service
public class DishService {

    @Autowired
    private DishRepository dishRepository;

    // Métodos de LEITURA (não precisam de @Transactional)
    public List<Dish> findAll() {
        return dishRepository.findAll();
    }

    public Dish findById(Long id) {
        return dishRepository.findById(id).orElseThrow(() -> new RuntimeException("Dish not found"));
    }

    // --- Métodos de ESCRITA (PRECISAM de @Transactional) ---

    @Transactional // <-- 2. ADICIONADO AQUI
    public Dish create(Dish dish) {
        return dishRepository.save(dish);
    }

    @Transactional // <-- 3. ADICIONADO AQUI
    public Dish update(Long id, Dish dishDetails) {
        Dish dish = findById(id);
        dish.setName(dishDetails.getName());
        dish.setDescription(dishDetails.getDescription());
        dish.setPrice(dishDetails.getPrice());
        return dishRepository.save(dish);
    }

    @Transactional // <-- 4. ADICIONADO AQUI
    public void delete(Long id) {
        Dish dish = findById(id);
        dishRepository.delete(dish);
        // Comentário de atualização para commit
    }
}