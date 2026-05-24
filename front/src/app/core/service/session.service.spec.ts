import { TestBed } from '@angular/core/testing';
import { expect } from '@jest/globals';
import { SessionInformation } from '../models/sessionInformation.interface';
import { SessionService } from './session.service';

describe('SessionService', () => {

  let service: SessionService;

  const mockSessionInformation: SessionInformation = {
    id: 1,
    username: 'test@test.com',
    firstName: 'John',
    lastName: 'Doe',
    admin: false,
    token: 'fake-jwt-token',
    type: 'Bearer'
  };

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SessionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('Initial state', () => {

    it('should have isLogged at false by default', () => {
      expect(service.isLogged).toBe(false);
    });

    it('should have sessionInformation undefined by default', () => {
      expect(service.sessionInformation).toBeUndefined();
    });

    it('$isLogged should emit false by default', (done) => {
      service.$isLogged().subscribe((value) => {
        expect(value).toBe(false);
        done();
      });
    });

  });

  describe('logIn', () => {

    it('should set isLogged to true', () => {
      service.logIn(mockSessionInformation);
      expect(service.isLogged).toBe(true);
    });

    it('should set sessionInformation', () => {
      service.logIn(mockSessionInformation);
      expect(service.sessionInformation).toEqual(mockSessionInformation);
    });

    it('$isLogged should emit true after login', (done) => {
      service.logIn(mockSessionInformation);
      service.$isLogged().subscribe((value) => {
        expect(value).toBe(true);
        done();
      });
    });

  });

  describe('logOut', () => {

    it('should set isLogged to false', () => {
      service.logIn(mockSessionInformation);
      service.logOut();
      expect(service.isLogged).toBe(false);
    });

    it('should clear sessionInformation', () => {
      service.logIn(mockSessionInformation);
      service.logOut();
      expect(service.sessionInformation).toBeUndefined();
    });

    it('$isLogged should emit false after logout', (done) => {
      service.logIn(mockSessionInformation);
      service.logOut();
      service.$isLogged().subscribe((value) => {
        expect(value).toBe(false);
        done();
      });
    });
    
  });

});
