import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { EntriesService } from '../../services/entries.service';
import { EntryStats } from '../../models/entry.model';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule],
  template: `
    <header class="bg-white shadow-2xl relative z-10 w-full">
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
              <div class="w-2 h-2 bg-green-400 rounded-full"></div>
              <span class="text-sm font-medium text-gray-700">{{ userDisplayName() }}</span>
            </div>

            <!-- Logout Button -->
            <button (click)="logout()" 
                    class="rounded-lg sm:rounded-xl px-2 py-1.5 sm:px-3 sm:py-2 flex items-center gap-1 sm:gap-2 transition-all duration-200">
              <span class="text-xs sm:text-sm text-red-400 transition-colors duration-200 hidden md:inline">Déconnexion</span>
              <i class="fas fa-sign-out-alt text-xs sm:text-sm text-red-400 transition-colors duration-200"></i>
            </button>
          </div>
        </div>

        <!-- User Stats Row - Only show when user is logged in -->
        <div *ngIf="currentUser" class="mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-gray-200/50">
          <div class="flex flex-wrap items-center justify-between gap-3 sm:gap-4">
            <!-- Date with Entry Status Badge -->
            <div class="flex items-center gap-2">
              <span class="text-gray-500">📅</span>
              <span class="text-xs sm:text-sm text-gray-600 font-medium">{{ currentDate() }}</span>
              <!-- Entry Status Badge -->
              <div class="flex items-center gap-1">
                <div *ngIf="hasTodayEntry()" 
                     class="w-3 h-3 bg-green-500 rounded-full"
                     title="Entrée du jour complétée"></div>
                <div *ngIf="!hasTodayEntry()" 
                     class="w-3 h-3 bg-red-500 rounded-full animate-pulse"
                     title="Entrée du jour manquante"></div>
              </div>
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
                <span class="text-xs sm:text-sm text-gray-600 font-medium">{{ totalEntries() }} {{ totalEntries() === 1 ? 'entrée' : 'entrées' }}</span>
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
export class HeaderComponent implements OnInit {
  private authService = inject(AuthService);
  private entriesService = inject(EntriesService);
  
  // Signal to store current stats
  private currentStats = signal<EntryStats | null>(null);
  
  currentUser = computed(() => {
    return this.authService.currentUser$;
  });

  userDisplayName = computed(() => {
    const user = this.authService.getCurrentUser();
    if (!user) return 'User';
    if (user.firstname && user.lastname) {
      return `${user.firstname} ${user.lastname}`;
    }
    return user.email.split('@')[0] || 'User';
  });

  currentDate = computed(() => {
    const today = new Date();
    const dateString = today.toLocaleDateString('fr-FR', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
    // Capitalize first letter
    return dateString.charAt(0).toUpperCase() + dateString.slice(1);
  });

  hasTodayEntry = computed(() => {
    return this.entriesService.getTodayEntry() !== null;
  });

  userStreak = computed(() => {
    const stats = this.currentStats();
    return stats?.current_streak || 0;
  });

  totalEntries = computed(() => {
    const stats = this.currentStats();
    return stats?.total_entries || 0;
  });

  averageMood = computed(() => {
    const stats = this.currentStats();
    if (stats?.average_mood) {
      return stats.average_mood.toFixed(1);
    }
    return '0.0';
  });

  ngOnInit() {
    // Subscribe to stats updates
    this.entriesService.stats$.subscribe(stats => {
      this.currentStats.set(stats);
    });
    
    // Load entries and stats when component initializes
    this.entriesService.loadEntries().subscribe();
  }

  logout(): void {
    this.authService.logout();
  }
}