import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { SessionService } from './core/service/session.service';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientModule } from '@angular/common/http';
import { MatToolbarModule } from '@angular/material/toolbar';
import { expect, jest } from '@jest/globals';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { AuthService } from './core/service/auth.service';


describe('AppComponent', () => {

  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;
  let router: Router;

  const mockSessionService = {
    $isLogged: jest.fn().mockReturnValue(of(true)),
    logOut: jest.fn()
  };

  const mockAuthService = {};

  beforeEach(async () => {

    await TestBed.configureTestingModule({
      imports: [AppComponent, RouterTestingModule],
      providers: [
        { provide: SessionService, useValue: mockSessionService },
        { provide: AuthService, useValue: mockAuthService }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    fixture.detectChanges();

  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  describe('$isLogged', () => {

    it('should return an observable from sessionService', (done) => {
      component.$isLogged().subscribe((value) => {
        expect(value).toBe(true);
        done();
      });
    });

    it('should call sessionService.$isLogged', () => {
      component.$isLogged();
      expect(mockSessionService.$isLogged).toHaveBeenCalled();
    });

  });

  describe('logout', () => {

    it('should call sessionService.logOut', () => {
      component.logout();
      expect(mockSessionService.logOut).toHaveBeenCalled();
    });

    it('should navigate to "" after logout', () => {
      const navigateSpy = jest.spyOn(router, 'navigate');
      component.logout();
      expect(navigateSpy).toHaveBeenCalledWith(['']);
    });

  });

});
