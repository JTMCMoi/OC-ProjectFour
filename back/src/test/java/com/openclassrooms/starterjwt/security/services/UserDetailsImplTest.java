package com.openclassrooms.starterjwt.security.services;

import org.junit.jupiter.api.Test;
import static org.assertj.core.api.Assertions.assertThat;

public class UserDetailsImplTest {

    private UserDetailsImpl buildUser(Long id) {
        return UserDetailsImpl.builder()
            .id(id)
            .username("test@test.com")
            .firstName("John")
            .lastName("Doe")
            .admin(false)
            .password("password")
            .build();
    }

    @Test
    void getAuthorities_shouldReturnEmptySet() {
        assertThat(buildUser(1L).getAuthorities()).isEmpty();
    }

    @Test
    void isAccountNonExpired_shouldReturnTrue() {
        assertThat(buildUser(1L).isAccountNonExpired()).isTrue();
    }

    @Test
    void isAccountNonLocked_shouldReturnTrue() {
        assertThat(buildUser(1L).isAccountNonLocked()).isTrue();
    }

    @Test
    void isCredentialsNonExpired_shouldReturnTrue() {
        assertThat(buildUser(1L).isCredentialsNonExpired()).isTrue();
    }

    @Test
    void isEnabled_shouldReturnTrue() {
        assertThat(buildUser(1L).isEnabled()).isTrue();
    }

    @Test
    void equals_shouldReturnTrue_whenSameId() {
        assertThat(buildUser(1L)).isEqualTo(buildUser(1L));
    }

    @Test
    void equals_shouldReturnFalse_whenDifferentId() {
        assertThat(buildUser(1L)).isNotEqualTo(buildUser(2L));
    }

    @Test
    void equals_shouldReturnFalse_whenNull() {
        assertThat(buildUser(1L)).isNotEqualTo(null);
    }

    @Test
    void equals_shouldReturnTrue_whenSameInstance() {
        UserDetailsImpl user = buildUser(1L);
        assertThat(user).isEqualTo(user);
    }

    @Test
    void equals_shouldReturnFalse_whenDifferentClass() {
        assertThat(buildUser(1L)).isNotEqualTo("not a user");
    }
    
}