package com.openclassrooms.starterjwt.security.jwt;

import com.openclassrooms.starterjwt.security.services.UserDetailsImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.core.Authentication;
import org.springframework.test.util.ReflectionTestUtils;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
public class JwtUtilsTest {

    @InjectMocks
    private JwtUtils jwtUtils;

    @BeforeEach
    void setUp() {
        ReflectionTestUtils.setField(jwtUtils, "jwtSecret", "testSecretKeyThatIsLongEnoughForHS512AlgorithmAndMustBeAtLeast512BitsWhichMeans64CharactersMinimum!");
        ReflectionTestUtils.setField(jwtUtils, "jwtExpirationMs", 86400000);
    }

    @Test
    void generateJwtToken_shouldReturnToken() {

        UserDetailsImpl userDetails = UserDetailsImpl.builder()
        .username("test@test.com")
        .build();

        Authentication authentication = mock(Authentication.class);
        when(authentication.getPrincipal()).thenReturn(userDetails);

        String token = jwtUtils.generateJwtToken(authentication);

        assertThat(token).isNotNull().isNotEmpty();

    }

    @Test
    void getUserNameFromJwtToken_shouldReturnUsername() {

        UserDetailsImpl userDetails = UserDetailsImpl.builder()
        .username("test@test.com")
        .build();

        Authentication authentication = mock(Authentication.class);
        when(authentication.getPrincipal()).thenReturn(userDetails);

        String token = jwtUtils.generateJwtToken(authentication);
        String username = jwtUtils.getUserNameFromJwtToken(token);

        assertThat(username).isEqualTo("test@test.com");

    }

    @Test
    void validateJwtToken_shouldReturnTrue_whenTokenIsValid() {

        UserDetailsImpl userDetails = UserDetailsImpl.builder()
        .username("test@test.com")
        .build();

        Authentication authentication = mock(Authentication.class);
        when(authentication.getPrincipal()).thenReturn(userDetails);

        String token = jwtUtils.generateJwtToken(authentication);
        assertThat(jwtUtils.validateJwtToken(token)).isTrue();

    }

    @Test
    void validateJwtToken_shouldReturnFalse_whenTokenIsMalformed() {
        assertThat(jwtUtils.validateJwtToken("malformed.token.here")).isFalse();
    }

    @Test
    void validateJwtToken_shouldReturnFalse_whenTokenIsExpired() {

        ReflectionTestUtils.setField(jwtUtils, "jwtExpirationMs", -1000);

        UserDetailsImpl userDetails = UserDetailsImpl.builder()
        .username("test@test.com")
        .build();

        Authentication authentication = mock(Authentication.class);
        when(authentication.getPrincipal()).thenReturn(userDetails);

        String token = jwtUtils.generateJwtToken(authentication);

        assertThat(jwtUtils.validateJwtToken(token)).isFalse();

    }

    @Test
    void validateJwtToken_shouldReturnFalse_whenTokenIsEmpty() {
        assertThat(jwtUtils.validateJwtToken("")).isFalse();
    }

    @Test
    void validateJwtToken_shouldReturnFalse_whenSignatureIsInvalid() {
        assertThat(jwtUtils.validateJwtToken("eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJ0ZXN0QHRlc3QuY29tIn0.invalidsignature")).isFalse();
    }
    
}