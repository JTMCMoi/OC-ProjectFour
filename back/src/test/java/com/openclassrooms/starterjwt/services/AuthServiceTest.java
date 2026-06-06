package com.openclassrooms.starterjwt.services;

import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import com.openclassrooms.starterjwt.payload.request.LoginRequest;
import com.openclassrooms.starterjwt.payload.response.JwtResponse;
import com.openclassrooms.starterjwt.security.jwt.JwtUtils;
import com.openclassrooms.starterjwt.security.services.UserDetailsImpl;
import org.springframework.security.core.Authentication;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

import org.junit.jupiter.api.Test;


@ExtendWith(MockitoExtension.class)
public class AuthServiceTest {

    @Mock
    private AuthenticationManager authenticationManager;

    @Mock
    private JwtUtils jwtUtils;

    @Mock
    private UserService userService;

    @InjectMocks
    private AuthService authService;

    @Test
    void login_shouldReturnJwtResponse_whenCredentialsAreValid() {

        LoginRequest loginRequest = new LoginRequest();
        loginRequest.setEmail("alice@example.com");
        loginRequest.setPassword("password123");

        UserDetailsImpl userDetails = UserDetailsImpl.builder()
            .id(1L)
            .username("alice@example.com")
            .firstName("Alice")
            .lastName("Dupont")
            .admin(false)
            .password("password123")
            .build();

        Authentication authentication = mock(Authentication.class);
        when(authentication.getPrincipal()).thenReturn(userDetails);
        when(authenticationManager.authenticate(any(UsernamePasswordAuthenticationToken.class)))
            .thenReturn(authentication);
        when(jwtUtils.generateJwtToken(authentication)).thenReturn("fake-jwt-token");
        when(userService.isAdmin("alice@example.com")).thenReturn(false);

        JwtResponse response = authService.login(loginRequest);

        assertThat(response.getToken()).isEqualTo("fake-jwt-token");
        assertThat(response.getId()).isEqualTo(1L);
        assertThat(response.getUsername()).isEqualTo("alice@example.com");
        assertThat(response.getFirstName()).isEqualTo("Alice");
        assertThat(response.getLastName()).isEqualTo("Dupont");
        assertThat(response.getAdmin()).isFalse();

        verify(authenticationManager).authenticate(any(UsernamePasswordAuthenticationToken.class));
        verify(jwtUtils).generateJwtToken(authentication);
        verify(userService).isAdmin("alice@example.com");
    }

    @Test
    void login_shouldReturnAdminTrue_whenUserIsAdmin() {
        
        LoginRequest loginRequest = new LoginRequest();
        loginRequest.setEmail("alice@example.com");
        loginRequest.setPassword("password123");

        UserDetailsImpl userDetails = UserDetailsImpl.builder()
            .id(1L)
            .username("admin@example.com")
            .firstName("Alice")
            .lastName("Dupont")
            .admin(true)
            .password("password123")
            .build();

        Authentication authentication = mock(Authentication.class);
        when(authentication.getPrincipal()).thenReturn(userDetails);

        when(authenticationManager.authenticate(any(UsernamePasswordAuthenticationToken.class)))
            .thenReturn(authentication);
        when(jwtUtils.generateJwtToken(authentication)).thenReturn("admin-jwt-token");
        when(userService.isAdmin("admin@example.com")).thenReturn(true);

        JwtResponse response = authService.login(loginRequest);

        assertThat(response.getAdmin()).isTrue();
    }

    @Test
    void login_shouldThrow_whenCredentialsAreInvalid() {

        LoginRequest loginRequest = new LoginRequest();
        loginRequest.setEmail("wrong@example.com");
        loginRequest.setPassword("wrongpass");

        when(authenticationManager.authenticate(any()))
            .thenThrow(new BadCredentialsException("Bad credentials"));

        assertThatThrownBy(() -> authService.login(loginRequest))
            .isInstanceOf(BadCredentialsException.class);

        verify(jwtUtils, never()).generateJwtToken(any());
        verify(userService, never()).isAdmin(any());
        
    }
}
