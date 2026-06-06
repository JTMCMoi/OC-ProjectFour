package com.openclassrooms.starterjwt.security.services;

import com.openclassrooms.starterjwt.models.User;
import com.openclassrooms.starterjwt.repository.UserRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import java.util.Optional;
import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
public class UserDetailsServiceImplTest {

    @InjectMocks
    private UserDetailsServiceImpl userDetailsService;

    @Mock
    private UserRepository userRepository;

    @Test
    void loadUserByUsername_shouldReturnUserDetails_whenUserExists() {

        User user = User.builder()
        .id(1L)
        .email("test@test.com")
        .firstName("John")
        .lastName("Doe")
        .password("password")
        .admin(false)
        .build();

        when(userRepository.findByEmail("test@test.com")).thenReturn(Optional.of(user));

        UserDetails userDetails = userDetailsService.loadUserByUsername("test@test.com");

        assertThat(userDetails.getUsername()).isEqualTo("test@test.com");
        assertThat(userDetails.getPassword()).isEqualTo("password");

    }

    @Test
    void loadUserByUsername_shouldThrow_whenUserNotFound() {

        when(userRepository.findByEmail("unknown@test.com")).thenReturn(Optional.empty());

        assertThatThrownBy(() -> userDetailsService.loadUserByUsername("unknown@test.com"))
        .isInstanceOf(UsernameNotFoundException.class)
        .hasMessageContaining("unknown@test.com");

    }
    
}