import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RegisterComponent } from './register.component';
import { AuthService } from '../../core/service/auth.service';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { expect, jest } from '@jest/globals';

describe('RegisterComponent', () => {

  let component: RegisterComponent;
  let fixture: ComponentFixture<RegisterComponent>;

  const mockAuthService = {
    register: jest.fn()
  };

  const mockRouter = {
    navigate: jest.fn()
  };

  beforeEach(async () => {

    mockAuthService.register.mockReturnValue(of(undefined));

    await TestBed.configureTestingModule({
      imports: [RegisterComponent, NoopAnimationsModule],
      providers: [
        { provide: AuthService, useValue: mockAuthService },
        { provide: Router, useValue: mockRouter }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(RegisterComponent);
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

    it('should have onError at false by default', () => {
      expect(component.onError).toBe(false);
    });

    it('should have an invalid form by default', () => {
      expect(component.form.valid).toBe(false);
    });

  });

  describe('Form validation', () => {

    it('should be invalid with empty fields', () => {
      component.form.setValue({ email: '', firstName: '', lastName: '', password: '' });
      expect(component.form.valid).toBe(false);
    });

    it('should be invalid with a bad email', () => {
      component.form.setValue({ email: 'not-an-email', firstName: 'John', lastName: 'Doe', password: 'password123' });
      expect(component.form.valid).toBe(false);
    });

    it('should be valid with correct fields', () => {
      component.form.setValue({ email: 'test@test.com', firstName: 'John', lastName: 'Doe', password: 'password123' });
      expect(component.form.valid).toBe(true);
    });

  });

  describe('submit', () => {

    beforeEach(() => {
      component.form.setValue({
        email: 'test@test.com',
        firstName: 'John',
        lastName: 'Doe',
        password: 'password123'
      });

    });

    it('should call authService.register with form values', () => {
      component.submit();
      expect(mockAuthService.register).toHaveBeenCalledWith({
        email: 'test@test.com',
        firstName: 'John',
        lastName: 'Doe',
        password: 'password123'
      });
    });

    it('should navigate to /login on success', () => {
      component.submit();
      expect(mockRouter.navigate).toHaveBeenCalledWith(['/login']);
    });

    it('should set onError to true on error', () => {
      mockAuthService.register.mockReturnValue(throwError(() => new Error('Bad Request')));
      component.submit();
      expect(component.onError).toBe(true);
    });
    
  });

});