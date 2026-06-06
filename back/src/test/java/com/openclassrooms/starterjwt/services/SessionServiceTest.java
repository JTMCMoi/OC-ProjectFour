package com.openclassrooms.starterjwt.services;

import com.openclassrooms.starterjwt.exception.NotFoundException;
import com.openclassrooms.starterjwt.exception.BadRequestException;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import com.openclassrooms.starterjwt.repository.SessionRepository;
import com.openclassrooms.starterjwt.repository.UserRepository;
import org.junit.jupiter.api.Test;
import com.openclassrooms.starterjwt.models.Session;
import com.openclassrooms.starterjwt.models.User;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
public class SessionServiceTest {

    @Mock
    private SessionRepository sessionRepository;

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private SessionService sessionService;

    @Test
    void create_shouldReturnSavedSession() {

        Session session = new Session();
        when(sessionRepository.save(session)).thenReturn(session);

        Session result = sessionService.create(session);

        assertThat(result).isEqualTo(session);
        verify(sessionRepository).save(session);

    }

    @Test
    void delete_shouldCallDeleteById() {

        sessionService.delete(1L);

        verify(sessionRepository).deleteById(1L);

    }

    @Test
    void findAll_shouldReturnAllSessions() {

        List<Session> sessions = List.of(new Session(), new Session());
        when(sessionRepository.findAll()).thenReturn(sessions);

        List<Session> result = sessionService.findAll();

        assertThat(result).hasSize(2);

    }

    @Test
    void getById_shouldReturnSession_whenExists() {

        Session session = new Session();
        when(sessionRepository.findById(1L)).thenReturn(Optional.of(session));

        Session result = sessionService.getById(1L);

        assertThat(result).isEqualTo(session);

    }

    @Test
    void getById_shouldReturnNull_whenNotExists() {

        when(sessionRepository.findById(99L)).thenReturn(Optional.empty());

        Session result = sessionService.getById(99L);

        assertThat(result).isNull();

    }

    @Test
    void update_shouldSetIdAndSave() {

        Session session = new Session();
        when(sessionRepository.save(session)).thenReturn(session);

        Session result = sessionService.update(1L, session);

        assertThat(result.getId()).isEqualTo(1L);
        verify(sessionRepository).save(session);

    }

    @Test
    void participate_shouldAddUser_whenSessionAndUserExistAndNotAlreadyParticipating() {

        User user = new User();
        user.setId(1L);

        Session session = new Session();
        session.setUsers(new ArrayList<>());

        when(sessionRepository.findById(1L)).thenReturn(Optional.of(session));
        when(userRepository.findById(1L)).thenReturn(Optional.of(user));

        sessionService.participate(1L, 1L);

        assertThat(session.getUsers()).contains(user);
        verify(sessionRepository).save(session);

    }

    @Test
    void participate_shouldThrowNotFoundException_whenSessionNotFound() {

        when(sessionRepository.findById(99L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> sessionService.participate(99L, 1L))
            .isInstanceOf(NotFoundException.class);

        verify(sessionRepository, never()).save(any());

    }

    @Test
    void participate_shouldThrowNotFoundException_whenUserNotFound() {

        Session session = new Session();
        session.setUsers(new ArrayList<>());

        when(sessionRepository.findById(1L)).thenReturn(Optional.of(session));
        when(userRepository.findById(99L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> sessionService.participate(1L, 99L))
            .isInstanceOf(NotFoundException.class);

        verify(sessionRepository, never()).save(any());

    }

    @Test
    void participate_shouldThrowBadRequestException_whenAlreadyParticipating() {

        User user = new User();
        user.setId(1L);

        Session session = new Session();
        session.setUsers(new ArrayList<>(List.of(user)));

        when(sessionRepository.findById(1L)).thenReturn(Optional.of(session));
        when(userRepository.findById(1L)).thenReturn(Optional.of(user));

        assertThatThrownBy(() -> sessionService.participate(1L, 1L))
            .isInstanceOf(BadRequestException.class);

        verify(sessionRepository, never()).save(any());

    }

    @Test
    void noLongerParticipate_shouldRemoveUser_whenParticipating() {

        User user = new User();
        user.setId(1L);

        Session session = new Session();
        session.setUsers(new ArrayList<>(List.of(user)));

        when(sessionRepository.findById(1L)).thenReturn(Optional.of(session));

        sessionService.noLongerParticipate(1L, 1L);

        assertThat(session.getUsers()).doesNotContain(user);
        verify(sessionRepository).save(session);

    }

    @Test
    void noLongerParticipate_shouldThrowNotFoundException_whenSessionNotFound() {

        when(sessionRepository.findById(99L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> sessionService.noLongerParticipate(99L, 1L))
            .isInstanceOf(NotFoundException.class);

        verify(sessionRepository, never()).save(any());

    }

    @Test
    void noLongerParticipate_shouldThrowBadRequestException_whenNotParticipating() {

        Session session = new Session();
        session.setUsers(new ArrayList<>());

        when(sessionRepository.findById(1L)).thenReturn(Optional.of(session));

        assertThatThrownBy(() -> sessionService.noLongerParticipate(1L, 99L))
            .isInstanceOf(BadRequestException.class);

        verify(sessionRepository, never()).save(any());
        
    }

}
