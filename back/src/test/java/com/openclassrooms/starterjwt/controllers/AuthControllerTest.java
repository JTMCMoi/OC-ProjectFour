package com.openclassrooms.starterjwt.controllers;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.openclassrooms.starterjwt.payload.request.LoginRequest;
import com.openclassrooms.starterjwt.payload.request.SignupRequest;
import com.openclassrooms.starterjwt.payload.response.JwtResponse;
import com.openclassrooms.starterjwt.services.AuthService;
import com.openclassrooms.starterjwt.services.UserService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.context.TestPropertySource;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.never;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
@TestPropertySource(properties = {
    "spring.datasource.url=jdbc:h2:mem:testdb",
    "spring.datasource.driver-class-name=org.h2.Driver",
    "spring.jpa.hibernate.ddl-auto=create-drop",
    "spring.jpa.database-platform=org.hibernate.dialect.H2Dialect"
})
public class AuthControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private AuthService authService;

    @MockBean
    private UserService userService;

    @Test
    void login_shouldReturn200_withJwtResponse() throws Exception {
        LoginRequest loginRequest = new LoginRequest();
        loginRequest.setEmail("alice@example.com");
        loginRequest.setPassword("password123");

        JwtResponse jwtResponse = new JwtResponse(
            "fake-jwt-token", 1L, "alice@example.com", "Alice", "Dupont", false
        );

        when(authService.login(any(LoginRequest.class))).thenReturn(jwtResponse);

        mockMvc.perform(post("/api/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(loginRequest)))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.token").value("fake-jwt-token"))
            .andExpect(jsonPath("$.id").value(1L))
            .andExpect(jsonPath("$.username").value("alice@example.com"))
            .andExpect(jsonPath("$.firstName").value("Alice"))
            .andExpect(jsonPath("$.lastName").value("Dupont"))
            .andExpect(jsonPath("$.admin").value(false));
    }

    @Test
    void register_shouldReturn200_whenEmailIsAvailable() throws Exception {
        SignupRequest signupRequest = new SignupRequest();
        signupRequest.setEmail("alice@example.com");
        signupRequest.setLastName("Dupont");
        signupRequest.setFirstName("Alice");
        signupRequest.setPassword("password123");

        when(userService.existsByEmail("alice@example.com")).thenReturn(false);

        mockMvc.perform(post("/api/auth/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(signupRequest)))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.message").value("User registered successfully!"));

        verify(userService).create("alice@example.com", "Dupont", "Alice", "password123");
    }

    @Test
    void register_shouldReturn400_whenEmailIsAlreadyTaken() throws Exception {
        SignupRequest signupRequest = new SignupRequest();
        signupRequest.setEmail("alice@example.com");
        signupRequest.setLastName("Dupont");
        signupRequest.setFirstName("Alice");
        signupRequest.setPassword("password123");

        when(userService.existsByEmail("alice@example.com")).thenReturn(true);

        mockMvc.perform(post("/api/auth/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(signupRequest)))
            .andExpect(status().isBadRequest());

        verify(userService, never()).create(any(), any(), any(), any());
    }
}