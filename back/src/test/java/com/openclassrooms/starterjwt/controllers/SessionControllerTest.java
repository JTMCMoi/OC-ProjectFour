package com.openclassrooms.starterjwt.controllers;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.openclassrooms.starterjwt.dto.SessionDto;
import com.openclassrooms.starterjwt.mapper.SessionMapper;
import com.openclassrooms.starterjwt.models.Session;
import com.openclassrooms.starterjwt.services.SessionService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.context.TestPropertySource;
import org.springframework.test.web.servlet.MockMvc;
import java.util.List;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
@TestPropertySource(properties = {
    "spring.datasource.url=jdbc:h2:mem:testdb",
    "spring.datasource.driver-class-name=org.h2.Driver",
    "spring.jpa.hibernate.ddl-auto=create-drop",
    "spring.jpa.database-platform=org.hibernate.dialect.H2Dialect"
})
public class SessionControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private SessionService sessionService;

    @MockBean
    private SessionMapper sessionMapper;

    @Test
    @WithMockUser
    void findById_shouldReturn200_whenSessionExists() throws Exception {

        Session session = new Session();
        SessionDto dto = new SessionDto();

        when(sessionService.getById(1L)).thenReturn(session);
        when(sessionMapper.toDto(session)).thenReturn(dto);

        mockMvc.perform(get("/api/session/1")).andExpect(status().isOk());

    }

    @Test
    @WithMockUser
    void findById_shouldReturn404_whenSessionNotFound() throws Exception {

        when(sessionService.getById(99L)).thenReturn(null);

        mockMvc.perform(get("/api/session/99")).andExpect(status().isNotFound());

    }

    @Test
    @WithMockUser
    void findAll_shouldReturn200() throws Exception {

        when(sessionService.findAll()).thenReturn(List.of());
        when(sessionMapper.toDto(List.of())).thenReturn(List.of());

        mockMvc.perform(get("/api/session")).andExpect(status().isOk());

    }

    @Test
    @WithMockUser
    void create_shouldReturn200() throws Exception {

        SessionDto dto = new SessionDto();
        dto.setName("Yoga");
        dto.setDate(new java.util.Date());
        dto.setTeacher_id(1L);
        dto.setDescription("desc");

        Session session = new Session();
        when(sessionMapper.toEntity(any(SessionDto.class))).thenReturn(session);
        when(sessionService.create(any(Session.class))).thenReturn(session);
        when(sessionMapper.toDto(session)).thenReturn(dto);

        mockMvc.perform(post("/api/session")
            .contentType(MediaType.APPLICATION_JSON)
            .content(objectMapper.writeValueAsString(dto)))
            .andExpect(status().isOk());

    }

    @Test
    @WithMockUser
    void update_shouldReturn200() throws Exception {

        SessionDto dto = new SessionDto();
        dto.setName("Yoga");
        dto.setDate(new java.util.Date());
        dto.setTeacher_id(1L);
        dto.setDescription("desc");

        Session session = new Session();
        when(sessionMapper.toEntity(any(SessionDto.class))).thenReturn(session);
        when(sessionService.update(eq(1L), any(Session.class))).thenReturn(session);
        when(sessionMapper.toDto(session)).thenReturn(dto);

        mockMvc.perform(put("/api/session/1")
            .contentType(MediaType.APPLICATION_JSON)
            .content(objectMapper.writeValueAsString(dto)))
            .andExpect(status().isOk());

    }

    @Test
    @WithMockUser
    void delete_shouldReturn200_whenSessionExists() throws Exception {

        Session session = new Session();
        when(sessionService.getById(1L)).thenReturn(session);
        doNothing().when(sessionService).delete(1L);

        mockMvc.perform(delete("/api/session/1")).andExpect(status().isOk());

    }

    @Test
    @WithMockUser
    void delete_shouldReturn404_whenSessionNotFound() throws Exception {

        when(sessionService.getById(99L)).thenReturn(null);

        mockMvc.perform(delete("/api/session/99")).andExpect(status().isNotFound());

    }

    @Test
    @WithMockUser
    void participate_shouldReturn200() throws Exception {

        doNothing().when(sessionService).participate(1L, 2L);

        mockMvc.perform(post("/api/session/1/participate/2")).andExpect(status().isOk());
    }

    @Test
    @WithMockUser
    void noLongerParticipate_shouldReturn200() throws Exception {

        doNothing().when(sessionService).noLongerParticipate(1L, 2L);

        mockMvc.perform(delete("/api/session/1/participate/2")).andExpect(status().isOk());
        
    }
}