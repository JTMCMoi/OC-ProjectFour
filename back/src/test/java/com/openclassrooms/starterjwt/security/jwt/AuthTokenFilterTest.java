package com.openclassrooms.starterjwt.security.jwt;

import com.openclassrooms.starterjwt.security.services.UserDetailsServiceImpl;
import jakarta.servlet.FilterChain;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class AuthTokenFilterTest {

    @InjectMocks
    private AuthTokenFilter authTokenFilter;

    @Mock
    private JwtUtils jwtUtils;

    @Mock
    private UserDetailsServiceImpl userDetailsService;

    @Test
    void doFilterInternal_shouldSetAuthentication_whenTokenIsValid() throws Exception {

        HttpServletRequest request = mock(HttpServletRequest.class);
        HttpServletResponse response = mock(HttpServletResponse.class);
        FilterChain filterChain = mock(FilterChain.class);

        when(request.getHeader("Authorization")).thenReturn("Bearer validtoken");
        when(jwtUtils.validateJwtToken("validtoken")).thenReturn(true);
        when(jwtUtils.getUserNameFromJwtToken("validtoken")).thenReturn("test@test.com");

        UserDetails userDetails = mock(UserDetails.class);
        when(userDetails.getAuthorities()).thenReturn(null);
        when(userDetailsService.loadUserByUsername("test@test.com")).thenReturn(userDetails);

        SecurityContextHolder.clearContext();

        authTokenFilter.doFilterInternal(request, response, filterChain);

        assertThat(SecurityContextHolder.getContext().getAuthentication()).isNotNull();
        verify(filterChain).doFilter(request, response);

    }

    @Test
    void doFilterInternal_shouldNotSetAuthentication_whenTokenIsInvalid() throws Exception {

        HttpServletRequest request = mock(HttpServletRequest.class);
        HttpServletResponse response = mock(HttpServletResponse.class);
        FilterChain filterChain = mock(FilterChain.class);

        when(request.getHeader("Authorization")).thenReturn("Bearer invalidtoken");
        when(jwtUtils.validateJwtToken("invalidtoken")).thenReturn(false);

        SecurityContextHolder.clearContext();

        authTokenFilter.doFilterInternal(request, response, filterChain);

        assertThat(SecurityContextHolder.getContext().getAuthentication()).isNull();
        verify(filterChain).doFilter(request, response);

    }

    @Test
    void doFilterInternal_shouldNotSetAuthentication_whenNoToken() throws Exception {

        HttpServletRequest request = mock(HttpServletRequest.class);
        HttpServletResponse response = mock(HttpServletResponse.class);
        FilterChain filterChain = mock(FilterChain.class);

        when(request.getHeader("Authorization")).thenReturn(null);

        SecurityContextHolder.clearContext();

        authTokenFilter.doFilterInternal(request, response, filterChain);

        assertThat(SecurityContextHolder.getContext().getAuthentication()).isNull();
        verify(filterChain).doFilter(request, response);

    }

    @Test
    void doFilterInternal_shouldContinueFilterChain_whenExceptionOccurs() throws Exception {

        HttpServletRequest request = mock(HttpServletRequest.class);
        HttpServletResponse response = mock(HttpServletResponse.class);
        FilterChain filterChain = mock(FilterChain.class);

        when(request.getHeader("Authorization")).thenReturn("Bearer sometoken");
        when(jwtUtils.validateJwtToken("sometoken")).thenThrow(new RuntimeException("unexpected"));

        authTokenFilter.doFilterInternal(request, response, filterChain);

        verify(filterChain).doFilter(request, response);
        
    }
}