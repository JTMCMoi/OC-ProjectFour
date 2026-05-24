import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { UserService } from './user.service';
import { User } from '../models/user.interface';
import { expect } from '@jest/globals';

describe('UserService', () => {

  let service: UserService;
  let httpMock: HttpTestingController;

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

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [UserService]
    });
    service = TestBed.inject(UserService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getById', () => {

    it('should send a GET request to api/user/:id', () => {
      service.getById('1').subscribe();
      const req = httpMock.expectOne('api/user/1');
      expect(req.request.method).toBe('GET');
      req.flush(mockUser);
    });

    it('should return a single user', () => {
      let result: User | undefined;
      service.getById('1').subscribe((res) => (result = res));
      const req = httpMock.expectOne('api/user/1');
      req.flush(mockUser);
      expect(result).toEqual(mockUser);
    });

  });

  describe('delete', () => {

    it('should send a DELETE request to api/user/:id', () => {
      service.delete('1').subscribe();
      const req = httpMock.expectOne('api/user/1');
      expect(req.request.method).toBe('DELETE');
      req.flush(null);
    });

    it('should complete without returning a value', () => {
      let completed = false;
      service.delete('1').subscribe({ complete: () => (completed = true) });
      const req = httpMock.expectOne('api/user/1');
      req.flush(null);
      expect(completed).toBe(true);
    });
    
  });

});
