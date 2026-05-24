import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormComponent } from './form.component';
import { SessionApiService } from '../../../../core/service/session-api.service';
import { SessionService } from '../../../../core/service/session.service';
import { TeacherService } from '../../../../core/service/teacher.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { of } from 'rxjs';
import { Session } from '../../../../core/models/session.interface';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { expect, jest } from '@jest/globals';


describe('FormComponent', () => {

  let component: FormComponent;
  let fixture: ComponentFixture<FormComponent>;

  const mockSession: Session = {
    id: 1,
    name: 'Session Yoga',
    description: 'Une session de yoga',
    date: new Date('2024-01-01'),
    teacher_id: 1,
    users: [],
  };

  const mockSessionApiService = {
    detail: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
  };

  const mockSessionService = {
    sessionInformation: { id: 1, admin: true }
  };

  const mockTeacherService = {
    all: jest.fn().mockReturnValue(of([]))
  };

  const mockMatSnackBar = {
    open: jest.fn()
  };

  const mockRouter = {
    navigate: jest.fn(),
    url: '/sessions/create'
  };

  const mockActivatedRoute = {
    snapshot: {
      paramMap: {
        get: jest.fn().mockReturnValue('1')
      }
    }
  };

  const setupComponent = async (routerUrl: string = '/sessions/create') => {

    mockRouter.url = routerUrl;

    await TestBed.configureTestingModule({
      imports: [FormComponent, NoopAnimationsModule],
      providers: [
        { provide: SessionApiService, useValue: mockSessionApiService },
        { provide: SessionService, useValue: mockSessionService },
        { provide: TeacherService, useValue: mockTeacherService },
        { provide: MatSnackBar, useValue: mockMatSnackBar },
        { provide: Router, useValue: mockRouter },
        { provide: ActivatedRoute, useValue: mockActivatedRoute }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).overrideComponent(FormComponent, {
      set: {
        providers: [
          { provide: MatSnackBar, useValue: mockMatSnackBar }
        ]
      }
    }).compileComponents();

    fixture = TestBed.createComponent(FormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  };

  afterEach(() => {
    jest.clearAllMocks();
    TestBed.resetTestingModule();
  });

  describe('Create mode (/sessions/create)', () => {

    beforeEach(async () => {
      await setupComponent('/sessions/create');
    });

    it('should be created', () => {
      expect(component).toBeTruthy();
    });

    it('should have onUpdate at false', () => {
      expect(component.onUpdate).toBe(false);
    });

    it('should initialize an empty form', () => {
      expect(component.sessionForm).toBeDefined();
      expect(component.sessionForm?.get('name')?.value).toBe('');
      expect(component.sessionForm?.get('description')?.value).toBe('');
    });

    it('should have an invalid form by default', () => {
      expect(component.sessionForm?.valid).toBe(false);
    });

    describe('submit', () => {
      beforeEach(() => {
        mockSessionApiService.create.mockReturnValue(of(mockSession));
        component.sessionForm?.setValue({
          name: 'Session Yoga',
          date: '2024-01-01',
          teacher_id: 1,
          description: 'Une session de yoga'
        });
      });

      it('should call sessionApiService.create with form values', () => {
        component.submit();
        expect(mockSessionApiService.create).toHaveBeenCalledWith(component.sessionForm?.value);
      });

      it('should open snackbar with "Session created !" after creation', () => {
        component.submit();
        expect(mockMatSnackBar.open).toHaveBeenCalledWith('Session created !', 'Close', { duration: 3000 });
      });

      it('should navigate to sessions after creation', () => {
        component.submit();
        expect(mockRouter.navigate).toHaveBeenCalledWith(['sessions']);
      });

    });

  });

  describe('Update mode (/sessions/update/1)', () => {
    
    beforeEach(async () => {
      mockSessionApiService.detail.mockReturnValue(of(mockSession));
      await setupComponent('/sessions/update/1');
    });

    it('should be created', () => {
      expect(component).toBeTruthy();
    });

    it('should have onUpdate at true', () => {
      expect(component.onUpdate).toBe(true);
    });

    it('should call sessionApiService.detail with the id', () => {
      expect(mockSessionApiService.detail).toHaveBeenCalledWith('1');
    });

    it('should pre-fill the form with session data', () => {
      expect(component.sessionForm?.get('name')?.value).toBe(mockSession.name);
      expect(component.sessionForm?.get('description')?.value).toBe(mockSession.description);
      expect(component.sessionForm?.get('teacher_id')?.value).toBe(mockSession.teacher_id);
    });

    describe('submit', () => {

      beforeEach(() => {
        mockSessionApiService.update.mockReturnValue(of(mockSession));
      });

      it('should call sessionApiService.update with id and form values', () => {
        component.submit();
        expect(mockSessionApiService.update).toHaveBeenCalledWith('1', component.sessionForm?.value);
      });

      it('should open snackbar with "Session updated !" after update', () => {
        component.submit();
        expect(mockMatSnackBar.open).toHaveBeenCalledWith('Session updated !', 'Close', { duration: 3000 });
      });

      it('should navigate to sessions after update', () => {
        component.submit();
        expect(mockRouter.navigate).toHaveBeenCalledWith(['sessions']);
      });

    });

  });

  describe('Non-admin redirect', () => {

    beforeEach(async () => {
      mockSessionService.sessionInformation = { id: 1, admin: false };
      await setupComponent('/sessions/create');
    });

    afterEach(() => {
      mockSessionService.sessionInformation = { id: 1, admin: true };
    });

    it('should redirect to /sessions if not admin', () => {
      expect(mockRouter.navigate).toHaveBeenCalledWith(['/sessions']);
    });

  });

});
