import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MeComponent } from './me.component';
import { UserService } from '../../core/service/user.service';
import { SessionService } from '../../core/service/session.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { User } from '../../core/models/user.interface';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { expect, jest } from '@jest/globals';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('MeComponent', () => {
  let component: MeComponent;
  let fixture: ComponentFixture<MeComponent>;

  const mockUser: User = {
    id: 1,
    email: 'test@test.com',
    firstName: 'John',
    lastName: 'Doe',
    password: 'bidon',
    admin: false,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  };

  const mockSessionService = {
    sessionInformation: {
      admin: true,
      id: 1,
    },
    logOut: jest.fn()
  };

  const mockUserService = {
    getById: jest.fn(),
    delete: jest.fn(),
  };

  const mockRouter = {
    navigate: jest.fn()
  };

  const mockMatSnackBar = {
    open: jest.fn()
  };

  beforeEach(async () => {

    mockUserService.getById.mockReturnValue(of(mockUser));
    mockUserService.delete.mockReturnValue(of(null));

    await TestBed.configureTestingModule({
      imports: [MeComponent, NoopAnimationsModule],
      providers: [
        { provide: UserService, useValue: mockUserService },
        { provide: SessionService, useValue: mockSessionService },
        { provide: Router, useValue: mockRouter },
        { provide: MatSnackBar, useValue: mockMatSnackBar }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).overrideComponent(MeComponent, {
      set: {
        providers: [
          { provide: MatSnackBar, useValue: mockMatSnackBar }
        ]
      }
    })
    .compileComponents();

    fixture = TestBed.createComponent(MeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {

    it('should load user on init', () => {
      expect(mockUserService.getById).toHaveBeenCalledWith('1');
      expect(component.user).toEqual(mockUser);
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

    it('should call userService.delete with the user id', () => {
      component.delete();
      expect(mockUserService.delete).toHaveBeenCalledWith('1');
    });

    it('should open a snackbar after deletion', () => {
      component.delete();
      expect(mockMatSnackBar.open).toHaveBeenCalledWith(
        'Your account has been deleted !',
        'Close',
        { duration: 3000 }
      );
    });

    it('should call sessionService.logOut after deletion', () => {
      component.delete();
      expect(mockSessionService.logOut).toHaveBeenCalled();
    });

    it('should navigate to / after deletion', () => {
      component.delete();
      expect(mockRouter.navigate).toHaveBeenCalledWith(['/']);
    });
  });

});