package com.openclassrooms.starterjwt.controllers;

import com.openclassrooms.starterjwt.dto.TeacherDto;
import com.openclassrooms.starterjwt.mapper.TeacherMapper;
import com.openclassrooms.starterjwt.models.Teacher;
import com.openclassrooms.starterjwt.services.TeacherService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.context.TestPropertySource;
import org.springframework.test.web.servlet.MockMvc;
import java.util.List;
import static org.mockito.Mockito.when;
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
public class TeacherControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private TeacherService teacherService;

    @MockBean
    private TeacherMapper teacherMapper;

    @Test
    @WithMockUser
    void findById_shouldReturn200_whenTeacherExists() throws Exception {

        Teacher teacher = new Teacher();
        TeacherDto dto = new TeacherDto();

        when(teacherService.findById(1L)).thenReturn(teacher);
        when(teacherMapper.toDto(teacher)).thenReturn(dto);

        mockMvc.perform(get("/api/teacher/1")).andExpect(status().isOk());

    }

    @Test
    @WithMockUser
    void findById_shouldReturn404_whenTeacherNotFound() throws Exception {

        when(teacherService.findById(99L)).thenReturn(null);

        mockMvc.perform(get("/api/teacher/99")).andExpect(status().isNotFound());

    }

    @Test
    @WithMockUser
    void findAll_shouldReturn200() throws Exception {

        when(teacherService.findAll()).thenReturn(List.of());
        when(teacherMapper.toDto(List.of())).thenReturn(List.of());

        mockMvc.perform(get("/api/teacher")).andExpect(status().isOk());

    }
}