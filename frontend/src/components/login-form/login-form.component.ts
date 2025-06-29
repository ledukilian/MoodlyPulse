import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="glass-card rounded-3xl p-4 sm:p-8 w-full sm:max-w-md sm:mx-4 deep-shadow form-decoration">
      <div class="corner-decoration corner-decoration-top-left"></div>
      <div class="corner-decoration corner-decoration-top-right"></div>
      <div class="corner-decoration corner-decoration-bottom-left"></div>
      <div class="corner-decoration corner-decoration-bottom-right"></div>
      
      <div class="text-center mb-6 sm:mb-8">
        <img src="assets/logo.png" alt="Moodly Pulse Logo" class="w-20 h-20 sm:w-24 sm:h-24 mx-auto mb-3 sm:mb-4">
        <h1 class="text-2xl sm:text-3xl font-bold mood-gradient-text mb-2">Moodly Pulse</h1>
        <p class="text-gray-600 text-sm sm:text-base">Connectez-vous à votre compte</p>
      </div>
      
      <form [formGroup]="loginForm" (ngSubmit)="onLogin()" class="space-y-4 sm:space-y-6">
        <div>
          <label class="block text-gray-700 font-semibold mb-2 text-sm sm:text-base">Email</label>
          <input type="email" formControlName="email" 
                 class="input-field w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl focus:outline-none text-sm sm:text-base"
                 placeholder="votre@email.com">
          <div *ngIf="loginForm.get('email')?.invalid && loginForm.get('email')?.touched" 
               class="text-red-500 text-xs sm:text-sm mt-1">
            <span *ngIf="loginForm.get('email')?.errors?.['required']">L'email est requis</span>
            <span *ngIf="loginForm.get('email')?.errors?.['email']">Format d'email invalide</span>
          </div>
        </div>
        
        <div>
          <label class="block text-gray-700 font-semibold mb-2 text-sm sm:text-base">Mot de passe</label>
          <input type="password" formControlName="password"
                 class="input-field w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl focus:outline-none text-sm sm:text-base"
                 placeholder="••••••••">
          <div *ngIf="loginForm.get('password')?.invalid && loginForm.get('password')?.touched" 
               class="text-red-500 text-xs sm:text-sm mt-1">
            <span *ngIf="loginForm.get('password')?.errors?.['required']">Le mot de passe est requis</span>
          </div>
        </div>
        
        <button type="submit" 
                [disabled]="!loginForm.valid || isLoggingIn"
                class="primary-button w-full text-white py-2.5 sm:py-3 rounded-xl font-semibold text-sm sm:text-base mt-6">
          <span *ngIf="!isLoggingIn">Se connecter</span>
          <span *ngIf="isLoggingIn">Connexion...</span>
        </button>
      </form>
      
      <div *ngIf="loginError" class="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-xs sm:text-sm">
        {{ loginError }}
      </div>
      
      <div class="mt-4 sm:mt-6 text-center mb-4">
        <p class="text-gray-600 text-sm sm:text-base">
          Pas encore de compte ? 
          <button (click)="switchToRegister()" class="text-amber-500 font-semibold">
            S'inscrire
          </button>
        </p>
      </div>
    </div>
  `
})
export class LoginFormComponent {
  private authService = inject(AuthService);
  private fb = inject(FormBuilder);
  
  isLoggingIn = false;
  loginError = '';
  
  loginForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]]
  });

  onLogin(): void {
    if (this.loginForm.valid) {
      this.isLoggingIn = true;
      this.loginError = '';
      
      const { email, password } = this.loginForm.value;
      
      this.authService.login({ email: email!, password: password! }).subscribe({
        next: () => {
          this.isLoggingIn = false;
        },
        error: (error) => {
          this.isLoggingIn = false;
          this.loginError = error.error?.message || 'Erreur lors de la connexion';
        }
      });
    }
  }

  switchToRegister(): void {
    this.authService.switchToRegister();
  }
} 