import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="glass-card rounded-3xl p-8 max-w-md w-full mx-4 deep-shadow form-decoration">
      <div class="corner-decoration corner-decoration-top-left"></div>
      <div class="corner-decoration corner-decoration-top-right"></div>
      <div class="corner-decoration corner-decoration-bottom-left"></div>
      <div class="corner-decoration corner-decoration-bottom-right"></div>
      
      <div class="text-center mb-8">
        <img src="assets/logo.png" alt="Moodly Pulse Logo" class="w-24 h-24 mx-auto mb-4">
        <h1 class="text-3xl font-bold mood-gradient-text mb-2">Moodly Pulse</h1>
        <p class="text-gray-600">Créez votre compte pour commencer</p>
      </div>
      
      <form [formGroup]="registerForm" (ngSubmit)="onRegister()" class="space-y-6">
        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="block text-gray-700 font-semibold mb-2">Prénom</label>
            <input type="text" formControlName="prenom" 
                   class="input-field w-full px-4 py-3 rounded-xl focus:outline-none"
                   placeholder="Votre prénom">
            <div *ngIf="registerForm.get('prenom')?.invalid && registerForm.get('prenom')?.touched" 
                 class="text-red-500 text-sm mt-1">
              <span *ngIf="registerForm.get('prenom')?.errors?.['required']">Le prénom est requis</span>
              <span *ngIf="registerForm.get('prenom')?.errors?.['minlength']">Le prénom doit contenir au moins 2 caractères</span>
              <span *ngIf="registerForm.get('prenom')?.errors?.['maxlength']">Le prénom ne peut pas dépasser 50 caractères</span>
            </div>
          </div>
          
          <div>
            <label class="block text-gray-700 font-semibold mb-2">Nom</label>
            <input type="text" formControlName="nom" 
                   class="input-field w-full px-4 py-3 rounded-xl focus:outline-none"
                   placeholder="Votre nom">
            <div *ngIf="registerForm.get('nom')?.invalid && registerForm.get('nom')?.touched" 
                 class="text-red-500 text-sm mt-1">
              <span *ngIf="registerForm.get('nom')?.errors?.['required']">Le nom est requis</span>
              <span *ngIf="registerForm.get('nom')?.errors?.['minlength']">Le nom doit contenir au moins 2 caractères</span>
              <span *ngIf="registerForm.get('nom')?.errors?.['maxlength']">Le nom ne peut pas dépasser 50 caractères</span>
            </div>
          </div>
        </div>
        
        <div>
          <label class="block text-gray-700 font-semibold mb-2">Email</label>
          <input type="email" formControlName="email" 
                 class="input-field w-full px-4 py-3 rounded-xl focus:outline-none"
                 placeholder="votre@email.com">
          <div *ngIf="registerForm.get('email')?.invalid && registerForm.get('email')?.touched" 
               class="text-red-500 text-sm mt-1">
            <span *ngIf="registerForm.get('email')?.errors?.['required']">L'email est requis</span>
            <span *ngIf="registerForm.get('email')?.errors?.['email']">Format d'email invalide</span>
          </div>
        </div>
        
        <div>
          <label class="block text-gray-700 font-semibold mb-2">Mot de passe</label>
          <input type="password" formControlName="password"
                 class="input-field w-full px-4 py-3 rounded-xl focus:outline-none"
                 placeholder="••••••••">
          <div *ngIf="registerForm.get('password')?.invalid && registerForm.get('password')?.touched" 
               class="text-red-500 text-sm mt-1">
            <span *ngIf="registerForm.get('password')?.errors?.['required']">Le mot de passe est requis</span>
            <span *ngIf="registerForm.get('password')?.errors?.['minlength']">Le mot de passe doit contenir au moins 6 caractères</span>
          </div>
        </div>
        
        <div>
          <label class="block text-gray-700 font-semibold mb-2">Confirmer le mot de passe</label>
          <input type="password" formControlName="confirmPassword"
                 class="input-field w-full px-4 py-3 rounded-xl focus:outline-none"
                 placeholder="••••••••">
          <div *ngIf="registerForm.get('confirmPassword')?.invalid && registerForm.get('confirmPassword')?.touched" 
               class="text-red-500 text-sm mt-1">
            <span *ngIf="registerForm.get('confirmPassword')?.errors?.['required']">La confirmation du mot de passe est requise</span>
            <span *ngIf="registerForm.get('confirmPassword')?.errors?.['passwordMismatch']">Les mots de passe ne correspondent pas</span>
          </div>
        </div>
        
        <button type="submit" 
                [disabled]="!registerForm.valid || isRegistering"
                class="primary-button w-full text-white py-3 rounded-xl font-semibold">
          <span *ngIf="!isRegistering">S'inscrire</span>
          <span *ngIf="isRegistering">Inscription...</span>
        </button>
      </form>
      
      <div *ngIf="registerError" class="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
        {{ registerError }}
      </div>
      
      <div class="mt-6 text-center">
        <p class="text-gray-600">
          Déjà un compte ? 
          <button (click)="switchToLogin()" class="text-amber-500 font-semibold">
            Se connecter
          </button>
        </p>
      </div>
    </div>
  `
})
export class RegisterFormComponent {
  private authService = inject(AuthService);
  private fb = inject(FormBuilder);
  
  isRegistering = false;
  registerError = '';
  
  registerForm = this.fb.group({
    prenom: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
    nom: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    confirmPassword: ['', [Validators.required]]
  }, { validators: this.passwordMatchValidator });

  passwordMatchValidator(group: any) {
    const password = group.get('password');
    const confirmPassword = group.get('confirmPassword');
    
    if (password && confirmPassword && password.value !== confirmPassword.value) {
      confirmPassword.setErrors({ passwordMismatch: true });
      return { passwordMismatch: true };
    }
    
    if (confirmPassword?.errors?.['passwordMismatch']) {
      delete confirmPassword.errors['passwordMismatch'];
      if (Object.keys(confirmPassword.errors).length === 0) {
        confirmPassword.setErrors(null);
      }
    }
    
    return null;
  }

  onRegister(): void {
    if (this.registerForm.valid) {
      this.isRegistering = true;
      this.registerError = '';
      
      const { prenom, nom, email, password } = this.registerForm.value;
      
      this.authService.register({ prenom: prenom!, nom: nom!, email: email!, password: password! }).subscribe({
        next: () => {
          this.isRegistering = false;
        },
        error: (error) => {
          this.isRegistering = false;
          this.registerError = error.error?.message || 'Erreur lors de l\'inscription';
        }
      });
    }
  }

  switchToLogin(): void {
    // Émettre un événement pour basculer vers le formulaire de connexion
    this.authService.switchToLogin();
  }
} 