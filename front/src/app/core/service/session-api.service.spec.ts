import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { SessionApiService } from './session-api.service';
import { Session } from '../models/session.interface';
import { expect } from '@jest/globals';

describe('SessionsService', () => {

  let service: SessionApiService;
  let httpMock: HttpTestingController;

  const mockSession: Session = {
    id: 1,
    name: 'Session Yoga',
    description: 'Une session de yoga',
    date: new Date('2024-01-01'),
    teacher_id: 1,
    users: [1, 2, 3],
  };

  const mockSessions: Session[] = [mockSession, { ...mockSession, id: 2, name: 'Session Pilates' }];

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [SessionApiService]
    });
    service = TestBed.inject(SessionApiService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('all', () => {

    it('should send a GET request to api/session', () => {
      service.all().subscribe();
      const req = httpMock.expectOne('api/session');
      expect(req.request.method).toBe('GET');
      req.flush(mockSessions);
    });

    it('should return a list of sessions', () => {
      let result: Session[] | undefined;
      service.all().subscribe((res) => (result = res));
      const req = httpMock.expectOne('api/session');
      req.flush(mockSessions);
      expect(result).toEqual(mockSessions);
    });

  });

  describe('detail', () => {

    it('should send a GET request to api/session/:id', () => {
      service.detail('1').subscribe();
      const req = httpMock.expectOne('api/session/1');
      expect(req.request.method).toBe('GET');
      req.flush(mockSession);
    });

    it('should return a single session', () => {
      let result: Session | undefined;
      service.detail('1').subscribe((res) => (result = res));
      const req = httpMock.expectOne('api/session/1');
      req.flush(mockSession);
      expect(result).toEqual(mockSession);
    });

  });

  describe('delete', () => {

    it('should send a DELETE request to api/session/:id', () => {
      service.delete('1').subscribe();
      const req = httpMock.expectOne('api/session/1');
      expect(req.request.method).toBe('DELETE');
      req.flush(null);
    });

    it('should complete without returning a value', () => {
      let completed = false;
      service.delete('1').subscribe({ complete: () => (completed = true) });
      const req = httpMock.expectOne('api/session/1');
      req.flush(null);
      expect(completed).toBe(true);
    });

  });

  describe('create', () => {

    it('should send a POST request to api/session', () => {
      service.create(mockSession).subscribe();
      const req = httpMock.expectOne('api/session');
      expect(req.request.method).toBe('POST');
      req.flush(mockSession);
    });

    it('should return the created session', () => {
      let result: Session | undefined;
      service.create(mockSession).subscribe((res) => (result = res));
      const req = httpMock.expectOne('api/session');
      req.flush(mockSession);
      expect(result).toEqual(mockSession);
    });

  });

  describe('update', () => {

    it('should send a PUT request to api/session/:id', () => {
      service.update('1', mockSession).subscribe();
      const req = httpMock.expectOne('api/session/1');
      expect(req.request.method).toBe('PUT');
      req.flush(mockSession);
    });

    it('should return the updated session', () => {
      let result: Session | undefined;
      service.update('1', mockSession).subscribe((res) => (result = res));
      const req = httpMock.expectOne('api/session/1');
      req.flush(mockSession);
      expect(result).toEqual(mockSession);
    });

  });

  describe('participate', () => {

    it('should send a POST request to api/session/:id/participate/:userId', () => {
      service.participate('1', '42').subscribe();
      const req = httpMock.expectOne('api/session/1/participate/42');
      expect(req.request.method).toBe('POST');
      req.flush(null);
    });

    it('should complete without returning a value', () => {
      let completed = false;
      service.participate('1', '42').subscribe({ complete: () => (completed = true) });
      const req = httpMock.expectOne('api/session/1/participate/42');
      req.flush(null);
      expect(completed).toBe(true);
    });

  });

  describe('unParticipate', () => {

    it('should send a DELETE request to api/session/:id/participate/:userId', () => {
      service.unParticipate('1', '42').subscribe();
      const req = httpMock.expectOne('api/session/1/participate/42');
      expect(req.request.method).toBe('DELETE');
      req.flush(null);
    });

    it('should complete without returning a value', () => {
      let completed = false;
      service.unParticipate('1', '42').subscribe({ complete: () => (completed = true) });
      const req = httpMock.expectOne('api/session/1/participate/42');
      req.flush(null);
      expect(completed).toBe(true);
    });
    
  });

});
