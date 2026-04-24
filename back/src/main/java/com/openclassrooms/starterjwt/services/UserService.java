package com.openclassrooms.starterjwt.services;

import com.openclassrooms.starterjwt.models.User;
import com.openclassrooms.starterjwt.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.security.crypto.password.PasswordEncoder;

@Service
public class UserService {
    private final PasswordEncoder passwordEncoder;
    private final UserRepository userRepository;

    public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
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

    public Boolean isAdmin(String username) {
        User user = this.findByEmail(username);
        if ( user != null ) return user.isAdmin();
        return false;
    }

    public void create(String email, String lastName, String firstName, String password) {
        this.save(new User(
            email,
            lastName,
            firstName,
            this.passwordEncoder.encode(password),
            false
        ));
    }
}
