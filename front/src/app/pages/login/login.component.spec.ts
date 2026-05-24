import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LoginComponent } from './login.component';
import { AuthService } from '../../core/service/auth.service';
import { SessionService } from 'src/app/core/service/session.service';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { SessionInformation } from 'src/app/core/models/sessionInformation.interface';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { expect, jest } from '@jest/globals';

const MockSessionInfo: SessionInformation = {
  id: 1,
  username: 'john@doe.com',
  firstName: 'John',
  lastName: 'Doe',
  admin: false,
  token: 'fake-jwt-token',
  type: 'Bearer'
};

const mockAuthService = {
  login: jest.fn()
};

const mockSessionService = {
  logIn: jest.fn()
};

const mockRouter = {
  navigate: jest.fn()
};

describe('LoginComponent', () => {

  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;

  const mockSessionInformation: SessionInformation = {
    id: 1,
    username: 'test@test.com',
    firstName: 'John',
    lastName: 'Doe',
    admin: false,
    token: 'fake-jwt-token',
    type: 'Bearer'
  };

  const mockAuthService = {
    login: jest.fn()
  };

  const mockRouter = {
    navigate: jest.fn()
  };

  beforeEach(async () => {

    mockAuthService.login.mockReturnValue(of(mockSessionInformation));

    await TestBed.configureTestingModule({
      imports: [LoginComponent, NoopAnimationsModule],
      providers: [
        { provide: AuthService, useValue: mockAuthService },
        { provide: SessionService, useValue: mockSessionService },
        { provide: Router, useValue: mockRouter }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Initial state', () => {

    it('should have hide at true by default', () => {
      expect(component.hide).toBe(true);
    });

    it('should have onError at false by default', () => {
      expect(component.onError).toBe(false);
    });

    it('should have an invalid form by default', () => {
      expect(component.form.valid).toBe(false);
    });

  });

  describe('Form validation', () => {

    it('should be invalid with empty fields', () => {
      component.form.setValue({ email: '', password: '' });
      expect(component.form.valid).toBe(false);
    });

    it('should be invalid with a bad email', () => {
      component.form.setValue({ email: 'not-an-email', password: 'password123' });
      expect(component.form.valid).toBe(false);
    });

    it('should be valid with correct fields', () => {
      component.form.setValue({ email: 'test@test.com', password: 'password123' });
      expect(component.form.valid).toBe(true);
    });

  });

  describe('submit', () => {

    beforeEach(() => {
      component.form.setValue({ email: 'test@test.com', password: 'password123' });
    });

    it('should call authService.login with form values', () => {
      component.submit();
      expect(mockAuthService.login).toHaveBeenCalledWith({
        email: 'test@test.com',
        password: 'password123'
      });
    });

    it('should call sessionService.logIn with the response on success', () => {
      component.submit();
      expect(mockSessionService.logIn).toHaveBeenCalledWith(mockSessionInformation);
    });

    it('should navigate to /sessions on success', () => {
      component.submit();
      expect(mockRouter.navigate).toHaveBeenCalledWith(['/sessions']);
    });

    it('should set onError to true on error', () => {
      mockAuthService.login.mockReturnValue(throwError(() => new Error('Unauthorized')));
      component.submit();
      expect(component.onError).toBe(true);
    });
    
  });

});