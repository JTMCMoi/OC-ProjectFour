package com.openclassrooms.starterjwt.services;

import com.openclassrooms.starterjwt.models.User;
import com.openclassrooms.starterjwt.repository.UserRepository;
import org.springframework.stereotype.Service;

@Service
public class UserService {
    private final UserRepository userRepository;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public void delete(Long id) {
        this.userRepository.deleteById(id);
    }

    public User findById(Long id) {
        return this.userRepository.findById(id).orElse(null);
    }

    public User findByEmail(String mail) {
        return this.userRepository.findByEmail(mail).orElse(null);
    }

    public Boolean existsByEmail(String mail) {
        return this.userRepository.existsByEmail(mail);
    }

    public void save(User user) {
        this.userRepository.save(user);
    }
}
