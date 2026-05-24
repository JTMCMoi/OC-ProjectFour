import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { AuthService } from './auth.service';
import { LoginRequest } from '../models/loginRequest.interface';
import { RegisterRequest } from '../models/registerRequest.interface';
import { SessionInformation } from 'src/app/core/models/sessionInformation.interface';
import { expect } from '@jest/globals';

describe('AuthService', () => {

    let service: AuthService;
    let httpMock: HttpTestingController;

    const mockLoginRequest: LoginRequest = {
        email: 'test@test.com',
        password: 'password123'
    };

    const mockRegisterRequest: RegisterRequest = {
        email: 'test@test.com',
        password: 'password123',
        firstName: 'John',
        lastName: 'Doe'
    };

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
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule],
            providers: [AuthService]
        });

        service = TestBed.inject(AuthService);
        httpMock = TestBed.inject(HttpTestingController);
    });


    afterEach(() => {
        httpMock.verify();
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    describe('register', () => {

        it('should send a POST request to /api/auth/register', () => {
            service.register(mockRegisterRequest).subscribe();
            const req = httpMock.expectOne('/api/auth/register');
            expect(req.request.method).toBe('POST');
            req.flush(null);
        });

        it('should send the loginRequest as body', () => {
            service.login(mockLoginRequest).subscribe();
            const req = httpMock.expectOne('/api/auth/login');
            expect(req.request.body).toEqual(mockLoginRequest);
            req.flush(mockSessionInformation);
        });

        it('should return an Observable<void>', () => {
            let response: void | undefined;
            service.register(mockRegisterRequest).subscribe((res) => {
                response = res;
            });
            const req = httpMock.expectOne('/api/auth/register');
            req.flush(null);
            expect(response).toBeNull();
        });

        it('should propagate HTTP errors', () => {
            let error: any;
            service.register(mockRegisterRequest).subscribe({
                error: (err) => (error = err)
            });
            const req = httpMock.expectOne('/api/auth/register');
            req.flush('Email already exists', {
                status: 400,
                statusText: 'Bad Request'
            });
            expect(error.status).toBe(400);
        });

    });

    describe('login', () => {

        it('should send a POST request to /api/auth/login', () => {
            service.login(mockLoginRequest).subscribe();
            const req = httpMock.expectOne('/api/auth/login');
            expect(req.request.method).toBe('POST');
            req.flush(mockSessionInformation);
        });

        it('should send the loginRequest as body', () => {
            service.login(mockLoginRequest).subscribe();
            const req = httpMock.expectOne('/api/auth/login');
            expect(req.request.body).toEqual(mockLoginRequest);
            req.flush(mockSessionInformation);
        });

        it('should return the SessionInformation on success', () => {
            let result: SessionInformation | undefined;
            service.login(mockLoginRequest).subscribe((res) => {
                result = res;
            });
            const req = httpMock.expectOne('/api/auth/login');
            req.flush(mockSessionInformation);
            expect(result).toEqual(mockSessionInformation);
        });

        it('should propagate HTTP errors', () => {
            let error: any;
            service.login(mockLoginRequest).subscribe({
                error: (err) => (error = err)
            });
            const req = httpMock.expectOne('/api/auth/login');
            req.flush('Unauthorized', {
                status: 401,
                statusText: 'Unauthorized'
            });
            expect(error.status).toBe(401);
        });

    });

});
