package com.openclassrooms.starterjwt.services;

import com.openclassrooms.starterjwt.models.Teacher;
import com.openclassrooms.starterjwt.repository.TeacherRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import java.util.List;
import java.util.Optional;
import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
public class TeacherServiceTest {

    @Mock
    private TeacherRepository teacherRepository;

    @InjectMocks
    private TeacherService teacherService;

    @Test
    void findAll_shouldReturnAllTeachers() {

        List<Teacher> teachers = List.of(new Teacher(), new Teacher());
        when(teacherRepository.findAll()).thenReturn(teachers);

        List<Teacher> result = teacherService.findAll();

        assertThat(result).hasSize(2);
        verify(teacherRepository).findAll();

    }

    @Test
    void findById_shouldReturnTeacher_whenExists() {

        Teacher teacher = new Teacher();
        when(teacherRepository.findById(1L)).thenReturn(Optional.of(teacher));

        Teacher result = teacherService.findById(1L);

        assertThat(result).isEqualTo(teacher);
        verify(teacherRepository).findById(1L);

    }

    @Test
    void findById_shouldReturnNull_whenNotExists() {

        when(teacherRepository.findById(99L)).thenReturn(Optional.empty());

        Teacher result = teacherService.findById(99L);

        assertThat(result).isNull();
        verify(teacherRepository).findById(99L);
        
    }
}