package com.openclassrooms.starterjwt.controllers;

import com.openclassrooms.starterjwt.dto.UserDto;
import com.openclassrooms.starterjwt.mapper.UserMapper;
import com.openclassrooms.starterjwt.models.User;
import com.openclassrooms.starterjwt.services.UserService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.context.TestPropertySource;
import org.springframework.test.web.servlet.MockMvc;
import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
@TestPropertySource(properties = {
    "spring.datasource.url=jdbc:h2:mem:testdb",
    "spring.datasource.driver-class-name=org.h2.Driver",
    "spring.jpa.hibernate.ddl-auto=create-drop",
    "spring.jpa.database-platform=org.hibernate.dialect.H2Dialect"
})
public class UserControllerTest {

    @Autowired private MockMvc mockMvc;

    @MockBean
    private UserService userService;

    @MockBean
    private UserMapper userMapper;

    @Test
    @WithMockUser
    void findById_shouldReturn200_whenUserExists() throws Exception {

        User user = new User();
        UserDto dto = new UserDto();
        
        when(userService.findById(1L)).thenReturn(user);
        when(userMapper.toDto(user)).thenReturn(dto);

        mockMvc.perform(get("/api/user/1")).andExpect(status().isOk());

    }

    @Test
    @WithMockUser
    void findById_shouldReturn404_whenUserNotFound() throws Exception {

        when(userService.findById(99L)).thenReturn(null);

        mockMvc.perform(get("/api/user/99")).andExpect(status().isNotFound());

    }

    @Test
    @WithMockUser(username = "test@test.com")
    void delete_shouldReturn200_whenUserIsOwner() throws Exception {

        User user = User.builder()
            .email("test@test.com")
            .firstName("John")
            .lastName("Doe")
            .password("password")
            .admin(false)
            .build();

        when(userService.findById(1L)).thenReturn(user);
        doNothing().when(userService).delete(1L);

        mockMvc.perform(delete("/api/user/1")).andExpect(status().isOk());
        
    }

    @Test
    @WithMockUser(username = "other@test.com")
    void delete_shouldReturn401_whenUserIsNotOwner() throws Exception {

        User user = User.builder()
            .email("test@test.com")
            .firstName("John")
            .lastName("Doe")
            .password("password")
            .admin(false)
            .build();

        when(userService.findById(1L)).thenReturn(user);

        mockMvc.perform(delete("/api/user/1")).andExpect(status().isUnauthorized());

    }

    @Test
    @WithMockUser
    void delete_shouldReturn404_whenUserNotFound() throws Exception {

        when(userService.findById(99L)).thenReturn(null);

        mockMvc.perform(delete("/api/user/99")).andExpect(status().isNotFound());

    }

}