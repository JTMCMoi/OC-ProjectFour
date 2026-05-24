import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DetailComponent } from './detail.component';
import { SessionApiService } from '../../../../core/service/session-api.service';
import { SessionService } from '../../../../core/service/session.service';
import { TeacherService } from '../../../../core/service/teacher.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { of } from 'rxjs';
import { Session } from '../../../../core/models/session.interface';
import { Teacher } from '../../../../core/models/teacher.interface';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { expect, jest } from '@jest/globals';


describe('DetailComponent', () => {

  let component: DetailComponent;
  let fixture: ComponentFixture<DetailComponent>;

  const mockSession: Session = {
    id: 1,
    name: 'Session Yoga',
    description: 'Une session de yoga',
    date: new Date('2024-01-01'),
    teacher_id: 1,
    users: [1, 2, 3],
  };

  const mockTeacher: Teacher = {
    id: 1,
    firstName: 'John',
    lastName: 'Doe',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  };

  const mockSessionService = {
    sessionInformation: { id: 1, admin: true }
  };

  const mockSessionApiService = {
    detail: jest.fn(),
    delete: jest.fn(),
    participate: jest.fn(),
    unParticipate: jest.fn(),
  };

  const mockTeacherService = {
    detail: jest.fn()
  };

  const mockMatSnackBar = {
    open: jest.fn()
  };

  const mockRouter = {
    navigate: jest.fn()
  };

  const mockActivatedRoute = {
    snapshot: {
      paramMap: {
        get: jest.fn().mockReturnValue('1')
      }
    }
  };

  beforeEach(async () => {

    mockSessionApiService.detail.mockReturnValue(of(mockSession));
    mockSessionApiService.delete.mockReturnValue(of(null));
    mockSessionApiService.participate.mockReturnValue(of(null));
    mockSessionApiService.unParticipate.mockReturnValue(of(null));
    mockTeacherService.detail.mockReturnValue(of(mockTeacher));

    await TestBed.configureTestingModule({
      imports: [DetailComponent, NoopAnimationsModule],
      providers: [
        { provide: SessionApiService, useValue: mockSessionApiService },
        { provide: SessionService, useValue: mockSessionService },
        { provide: TeacherService, useValue: mockTeacherService },
        { provide: MatSnackBar, useValue: mockMatSnackBar },
        { provide: Router, useValue: mockRouter },
        { provide: ActivatedRoute, useValue: mockActivatedRoute }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).overrideComponent(DetailComponent, {
      set: {
        providers: [
          { provide: MatSnackBar, useValue: mockMatSnackBar }
        ]
      }
    }).compileComponents();

    fixture = TestBed.createComponent(DetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Initial state', () => {

    it('should set sessionId from route params', () => {
      expect(component.sessionId).toBe('1');
    });

    it('should set isAdmin from sessionService', () => {
      expect(component.isAdmin).toBe(true);
    });

    it('should set userId from sessionService', () => {
      expect(component.userId).toBe('1');
    });
  });

  describe('ngOnInit', () => {

    it('should fetch session on init', () => {
      expect(mockSessionApiService.detail).toHaveBeenCalledWith('1');
    });

    it('should set session after fetch', () => {
      expect(component.session).toEqual(mockSession);
    });

    it('should set teacher after fetch', () => {
      expect(component.teacher).toEqual(mockTeacher);
    });

    it('should set isParticipate to true if user is in session', () => {
      expect(component.isParticipate).toBe(true); // userId 1 est dans users: [1, 2, 3]
    });

  });

  describe('back', () => {

    it('should call window.history.back()', () => {
      const historySpy = jest.spyOn(window.history, 'back');
      component.back();
      expect(historySpy).toHaveBeenCalled();
    });

  });

  describe('delete', () => {

    it('should call sessionApiService.delete with sessionId', () => {
      component.delete();
      expect(mockSessionApiService.delete).toHaveBeenCalledWith('1');

    });

    it('should open a snackbar after deletion', () => {
      component.delete();
      expect(mockMatSnackBar.open).toHaveBeenCalledWith('Session deleted !', 'Close', { duration: 3000 });
    });

    it('should navigate to sessions after deletion', () => {
      component.delete();
      expect(mockRouter.navigate).toHaveBeenCalledWith(['sessions']);
    });

  });

  describe('participate', () => {

    it('should call sessionApiService.participate with sessionId and userId', () => {
      component.participate();
      expect(mockSessionApiService.participate).toHaveBeenCalledWith('1', '1');
    });

    it('should refresh session after participation', () => {
      jest.clearAllMocks();
      mockSessionApiService.detail.mockReturnValue(of(mockSession));
      mockTeacherService.detail.mockReturnValue(of(mockTeacher));
      component.participate();
      expect(mockSessionApiService.detail).toHaveBeenCalledTimes(1);
    });

  });

  describe('unParticipate', () => {

    it('should call sessionApiService.unParticipate with sessionId and userId', () => {
      component.unParticipate();
      expect(mockSessionApiService.unParticipate).toHaveBeenCalledWith('1', '1');
    });

    it('should refresh session after unParticipation', () => {
      jest.clearAllMocks();
      mockSessionApiService.detail.mockReturnValue(of(mockSession));
      mockTeacherService.detail.mockReturnValue(of(mockTeacher));
      component.unParticipate();
      expect(mockSessionApiService.detail).toHaveBeenCalledTimes(1);
    });

  });

});
