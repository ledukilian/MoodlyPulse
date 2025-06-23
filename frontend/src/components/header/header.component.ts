import { Component, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { EntriesService } from '../../services/entries.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule],
  template: `
    <header class="glass-card shadow-2xl relative z-10 w-full">
      <div class="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8 py-3 sm:py-4 relative z-10">
        <!-- Main Header Row -->
        <div class="flex items-center justify-between">
          <!-- Logo and Title -->
          <div class="flex items-center gap-2 sm:gap-3">
            <img src="assets/logo.png" alt="Moodly Pulse Logo" class="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12">
            <div>
              <h1 class="text-lg sm:text-xl lg:text-3xl font-bold mood-gradient-text">
                Moodly Pulse
              </h1>
              <p class="text-gray-600 text-xs sm:text-sm hidden sm:block">Suivez votre bien-être au quotidien</p>
            </div>
          </div>

          <!-- User Info and Logout -->
          <div class="flex items-center gap-2 sm:gap-3 lg:gap-4" *ngIf="currentUser">
            <!-- User Info -->
            <div class="hidden sm:flex items-center gap-3">
              <div class="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span class="text-sm font-medium text-gray-700">{{ userDisplayName() }}</span>
            </div>

            <!-- Logout Button -->
            <button (click)="logout()" 
                    class="glass-card rounded-lg sm:rounded-xl px-2 py-1.5 sm:px-3 sm:py-2 flex items-center gap-1 sm:gap-2 transition-all duration-200 deep-shadow">
              <i class="fas fa-sign-out-alt text-xs sm:text-sm text-red-400 transition-colors duration-200"></i>
              <span class="text-xs sm:text-sm text-red-400 transition-colors duration-200 hidden lg:inline">Déconnexion</span>
            </button>
          </div>
        </div>

        <!-- User Stats Row - Only show when user is logged in -->
        <div *ngIf="currentUser" class="mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-gray-200/50">
          <div class="flex flex-wrap items-center justify-between gap-3 sm:gap-4">
            <!-- Date -->
            <div class="flex items-center gap-2">
              <span class="text-gray-500">📅</span>
              <span class="text-xs sm:text-sm text-gray-600 font-medium">{{ currentDate() }}</span>
            </div>

            <!-- Stats -->
            <div class="flex items-center gap-3 sm:gap-4 lg:gap-6">
              <!-- Streak -->
              <div class="flex items-center gap-1 sm:gap-2">
                <span class="text-purple-500">🔥</span>
                <span class="text-xs sm:text-sm text-gray-600 font-medium">Série: {{ userStreak() }}j</span>
              </div>

              <!-- Total Entries -->
              <div class="flex items-center gap-1 sm:gap-2">
                <span class="text-blue-500">📊</span>
                <span class="text-xs sm:text-sm text-gray-600 font-medium">{{ totalEntries() }} entrées</span>
              </div>

              <!-- Average Mood -->
              <div class="flex items-center gap-1 sm:gap-2">
                <span class="text-yellow-500">😊</span>
                <span class="text-xs sm:text-sm text-gray-600 font-medium">{{ averageMood() }}/5</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  `
})
export class HeaderComponent {
  private authService = inject(AuthService);
  private entriesService = inject(EntriesService);
  
  currentUser = computed(() => {
    return this.authService.currentUser$;
  });

  stats = computed(() => {
    this.entriesService.stats$.subscribe();
    return null; // Will be updated when stats are available
  });

  userDisplayName = computed(() => {
    const user = this.authService.getCurrentUser();
    if (!user) return 'Utilisateur';
    return user.email.split('@')[0] || 'Utilisateur';
  });

  currentDate = computed(() => {
    const today = new Date();
    return today.toLocaleDateString('fr-FR', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  });

  userStreak = computed(() => {
    // TODO: Calculate actual streak from entries
    return 5;
  });

  totalEntries = computed(() => {
    // TODO: Get from stats service
    return 23;
  });

  averageMood = computed(() => {
    // TODO: Get from stats service
    return '4.2';
  });

  logout(): void {
    this.authService.logout();
  }
}