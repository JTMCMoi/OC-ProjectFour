package com.openclassrooms.starterjwt.controllers;


import com.openclassrooms.starterjwt.exception.BadRequestException;
import com.openclassrooms.starterjwt.payload.request.LoginRequest;
import com.openclassrooms.starterjwt.payload.request.SignupRequest;
import com.openclassrooms.starterjwt.payload.response.MessageResponse;
import com.openclassrooms.starterjwt.services.AuthService;
import com.openclassrooms.starterjwt.services.UserService;

import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
public class AuthController {
    private final AuthService authService;
    private final UserService userService;

    public AuthController(
        UserService userService,
        AuthService authService
    ) {
        this.userService = userService;
        this.authService = authService;
    }

    @PostMapping("/login")
    public ResponseEntity<?> authenticateUser(@Valid @RequestBody LoginRequest loginRequest) {
        return ResponseEntity.ok(this.authService.login(loginRequest));
    }

    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@Valid @RequestBody SignupRequest signUpRequest) {

        if (this.userService.existsByEmail(signUpRequest.getEmail())) {
            throw new BadRequestException("Error: Email is already taken!");
        }

        this.userService.create(
            signUpRequest.getEmail(),
            signUpRequest.getLastName(),
            signUpRequest.getFirstName(),
            signUpRequest.getPassword()
        );

        return ResponseEntity.ok(new MessageResponse("User registered successfully!"));
    }
}
