import { Component, OnInit, inject, signal } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';

import { AuthService } from './services/auth.service';
import { EntriesService } from './services/entries.service';
import { AuthInterceptor } from './interceptors/auth.interceptor';

import { HeaderComponent } from './components/header/header.component';
import { EntryFormComponent } from './components/entry-form/entry-form.component';
import { StatsGridComponent } from './components/stats-grid/stats-grid.component';
import { RecentEntriesComponent } from './components/recent-entries/recent-entries.component';
import { RegisterFormComponent } from './components/register-form/register-form.component';
import { LoginFormComponent } from './components/login-form/login-form.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    HeaderComponent,
    EntryFormComponent,
    StatsGridComponent,
    RecentEntriesComponent,
    RegisterFormComponent,
    LoginFormComponent
  ],
  template: `
    <!-- Decorative Background Elements -->
    <div class="decorative-blob decorative-blob-1"></div>
    <div class="decorative-blob decorative-blob-2"></div>
    <div class="decorative-blob decorative-blob-3"></div>
    <div class="decorative-blob decorative-blob-4"></div>
    
    <div class="content-wrapper">
      <!-- Authentication Check -->
      <div *ngIf="!isAuthenticated" class="min-h-screen flex items-center justify-center">
        <!-- Login Form -->
        <app-login-form *ngIf="authMode === 'login'"></app-login-form>

        <!-- Register Form -->
        <app-register-form *ngIf="authMode === 'register'"></app-register-form>
      </div>

      <!-- Main Dashboard -->
      <div *ngIf="isAuthenticated">
        <app-header></app-header>
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          <!-- Add Entry Button -->
          <div class="text-center mb-8">
            <button (click)="openEntryModal()" 
                    class="primary-button text-white px-8 py-4 rounded-2xl font-semibold text-lg shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:scale-105">
              ✨ Ajouter mon entrée du jour
            </button>
          </div>
          
          <app-recent-entries></app-recent-entries>
          <!--<app-stats-grid></app-stats-grid>-->
        </div>
      </div>
    </div>

    <!-- Entry Form Modal -->
    <app-entry-form 
      [isOpen]="isEntryModalOpen" 
      (modalClosed)="closeEntryModal()">
    </app-entry-form>
  `
})
export class App implements OnInit {
  private authService = inject(AuthService);
  private entriesService = inject(EntriesService);
  
  isAuthenticated = false;
  authMode: 'login' | 'register' = 'login';
  isEntryModalOpen = signal(false);

  ngOnInit(): void {
    this.authService.isAuthenticated$.subscribe(authenticated => {
      this.isAuthenticated = authenticated;
      if (authenticated) {
        this.loadInitialData();
      }
    });

    this.authService.authMode$.subscribe(mode => {
      this.authMode = mode;
    });
  }

  private loadInitialData(): void {
    // Load recent entries and stats
    this.entriesService.loadEntries().subscribe();
    this.entriesService.loadStats().subscribe();
  }

  openEntryModal(): void {
    this.isEntryModalOpen.set(true);
  }

  closeEntryModal(): void {
    this.isEntryModalOpen.set(false);
  }
}

// Bootstrap the application with providers
bootstrapApplication(App, {
  providers: [
    provideHttpClient(withInterceptors([
      (req, next) => {
        const authService = inject(AuthService);
        const token = authService.getToken();
        
        if (token) {
          const authReq = req.clone({
            headers: req.headers.set('Authorization', `Bearer ${token}`)
          });
          return next(authReq);
        }
        
        return next(req);
      }
    ]))
  ]
}).catch(err => console.error(err));