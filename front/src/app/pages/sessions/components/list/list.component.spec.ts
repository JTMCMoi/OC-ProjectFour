import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ListComponent } from './list.component';
import { SessionApiService } from '../../../../core/service/session-api.service';
import { SessionService } from '../../../../core/service/session.service';
import { of } from 'rxjs';
import { Session } from '../../../../core/models/session.interface';
import { SessionInformation } from '../../../../core/models/sessionInformation.interface';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { expect, jest } from '@jest/globals';
import { RouterTestingModule } from '@angular/router/testing';

describe('ListComponent', () => {

  let component: ListComponent;
  let fixture: ComponentFixture<ListComponent>;

  const mockSession: Session = {
    id: 1,
    name: 'Session Yoga',
    description: 'Une session de yoga',
    date: new Date('2024-01-01'),
    teacher_id: 1,
    users: [],
  };

  const mockSessionInformation: SessionInformation = {
    id: 1,
    username: 'test@test.com',
    firstName: 'John',
    lastName: 'Doe',
    admin: true,
    token: 'fake-jwt-token',
    type: 'Bearer'
  };

  const mockSessionApiService = {
    all: jest.fn().mockReturnValue(of([mockSession]))
  };

  const mockSessionService = {
    sessionInformation: mockSessionInformation
  };

  beforeEach(async () => {

    await TestBed.configureTestingModule({
      imports: [ListComponent, NoopAnimationsModule, RouterTestingModule],
      providers: [
        { provide: SessionApiService, useValue: mockSessionApiService },
        { provide: SessionService, useValue: mockSessionService },
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(ListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('sessions$', () => {

    it('should call sessionApiService.all on init', () => {
      expect(mockSessionApiService.all).toHaveBeenCalled();
    });

    it('should expose an observable of sessions', (done) => {
      component.sessions$.subscribe((sessions) => {
        expect(sessions).toEqual([mockSession]);
        done();
      });
    });

  });

  describe('user', () => {

    it('should return the current session information', () => {
      expect(component.user).toEqual(mockSessionInformation);
    });

    it('should return undefined if no session information', () => {
      mockSessionService.sessionInformation = undefined as any;
      expect(component.user).toBeUndefined();
    });

  });

});
