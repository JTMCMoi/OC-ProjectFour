package com.openclassrooms.starterjwt.services;

import com.openclassrooms.starterjwt.models.User;
import com.openclassrooms.starterjwt.repository.UserRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;
import java.util.Optional;
import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
public class UserServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @InjectMocks
    private UserService userService;

    @Test
    void delete_shouldCallDeleteById() {

        userService.delete(1L);

        verify(userRepository).deleteById(1L);

    }

    @Test
    void findById_shouldReturnUser_whenExists() {

        User user = new User();
        when(userRepository.findById(1L)).thenReturn(Optional.of(user));

        User result = userService.findById(1L);

        assertThat(result).isEqualTo(user);
        verify(userRepository).findById(1L);

    }

    @Test
    void findById_shouldReturnNull_whenNotExists() {

        when(userRepository.findById(99L)).thenReturn(Optional.empty());

        User result = userService.findById(99L);

        assertThat(result).isNull();

    }

    @Test
    void findByEmail_shouldReturnUser_whenExists() {

        User user = new User();
        when(userRepository.findByEmail("alice@example.com")).thenReturn(Optional.of(user));

        User result = userService.findByEmail("alice@example.com");

        assertThat(result).isEqualTo(user);
        verify(userRepository).findByEmail("alice@example.com");

    }

    @Test
    void findByEmail_shouldReturnNull_whenNotExists() {

        when(userRepository.findByEmail("unknown@example.com")).thenReturn(Optional.empty());

        User result = userService.findByEmail("unknown@example.com");

        assertThat(result).isNull();

    }

    @Test
    void existsByEmail_shouldReturnTrue_whenEmailExists() {

        when(userRepository.existsByEmail("alice@example.com")).thenReturn(true);

        Boolean result = userService.existsByEmail("alice@example.com");

        assertThat(result).isTrue();

    }

    @Test
    void existsByEmail_shouldReturnFalse_whenEmailNotExists() {

        when(userRepository.existsByEmail("unknown@example.com")).thenReturn(false);

        Boolean result = userService.existsByEmail("unknown@example.com");

        assertThat(result).isFalse();

    }

    @Test
    void isAdmin_shouldReturnTrue_whenUserIsAdmin() {

        User user = new User();
        user.setAdmin(true);

        when(userRepository.findByEmail("admin@example.com")).thenReturn(Optional.of(user));

        Boolean result = userService.isAdmin("admin@example.com");

        assertThat(result).isTrue();

    }

    @Test
    void isAdmin_shouldReturnFalse_whenUserIsNotAdmin() {

        User user = new User();
        user.setAdmin(false);

        when(userRepository.findByEmail("alice@example.com")).thenReturn(Optional.of(user));

        Boolean result = userService.isAdmin("alice@example.com");

        assertThat(result).isFalse();

    }

    @Test
    void isAdmin_shouldReturnFalse_whenUserNotFound() {

        when(userRepository.findByEmail("unknown@example.com")).thenReturn(Optional.empty());

        Boolean result = userService.isAdmin("unknown@example.com");

        assertThat(result).isFalse();

    }

    @Test
    void create_shouldEncodePasswordAndSave() {

        when(passwordEncoder.encode("password123")).thenReturn("encoded-password");

        userService.create("alice@example.com", "Dupont", "Alice", "password123");

        verify(passwordEncoder).encode("password123");
        verify(userRepository).save(any(User.class));
        
    }
}