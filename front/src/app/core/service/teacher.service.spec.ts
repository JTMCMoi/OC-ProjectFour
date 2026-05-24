import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TeacherService } from './teacher.service';
import { Teacher } from '../models/teacher.interface';
import { expect } from '@jest/globals';

describe('TeacherService', () => {

  let service: TeacherService;
  let httpMock: HttpTestingController;

  const mockTeacher: Teacher = {
    id: 1,
    firstName: 'John',
    lastName: 'Doe',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  };

  const mockTeachers: Teacher[] = [mockTeacher, { ...mockTeacher, id: 2, firstName: 'Jane' }];

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [TeacherService]
    });
    service = TestBed.inject(TeacherService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('all', () => {

    it('should send a GET request to api/teacher', () => {
      service.all().subscribe();
      const req = httpMock.expectOne('api/teacher');
      expect(req.request.method).toBe('GET');
      req.flush(mockTeachers);
    });

    it('should return a list of teachers', () => {
      let result: Teacher[] | undefined;
      service.all().subscribe((res) => (result = res));
      const req = httpMock.expectOne('api/teacher');
      req.flush(mockTeachers);
      expect(result).toEqual(mockTeachers);
    });

  });

  describe('detail', () => {

    it('should send a GET request to api/teacher/:id', () => {
      service.detail('1').subscribe();
      const req = httpMock.expectOne('api/teacher/1');
      expect(req.request.method).toBe('GET');
      req.flush(mockTeacher);
    });

    it('should return a single teacher', () => {
      let result: Teacher | undefined;
      service.detail('1').subscribe((res) => (result = res));
      const req = httpMock.expectOne('api/teacher/1');
      req.flush(mockTeacher);
      expect(result).toEqual(mockTeacher);
    });
    
  });

});
