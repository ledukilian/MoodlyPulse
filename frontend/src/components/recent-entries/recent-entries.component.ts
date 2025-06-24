import { Component, computed, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EntriesService } from '../../services/entries.service';
import { DailyEntry } from '../../models/entry.model';

@Component({
  selector: 'app-recent-entries',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="max-w-4xl mx-auto p-4">
      <!-- Entries Container -->
      <div *ngIf="!isLoading() && recentEntries().length > 0" 
           class="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
        
        <!-- Header -->
        <div class="text-center mb-6">
          <h2 class="text-2xl sm:text-3xl font-bold mood-gradient-text mb-2">
            📅 Mes dernières entrées
          </h2>
          <div class="section-separator"></div>
        </div>
        
        <!-- Entries List -->
        <div class="space-y-4">
          <div *ngFor="let entry of recentEntries()" 
               class="bg-gray-50 rounded-xl p-4 hover:bg-gray-100 transition-all duration-200 relative overflow-hidden border-2 border-orange-300">
            
            <!-- Background Emoji -->
            <div class="absolute top-8 right-4 text-8xl opacity-10 pointer-events-none">
              {{ getMoodEmoji(entry.mood) }}
            </div>
            
            <!-- Entry Content -->
            <div class="relative z-10">
              <!-- Date Header -->
              <div class="flex items-center justify-between mb-3 pb-2 border-b border-gray-200">
                <h3 class="text-lg font-semibold text-gray-800">
                  {{ formatDate(entry.date) }}
                </h3>
                <div class="flex items-center gap-2">
                  <span class="text-sm font-medium text-gray-400">{{ getMoodLabel(entry.mood) }}</span>
                  <span class="text-xl">{{ getMoodEmoji(entry.mood) }}</span>
                </div>
              </div>
              
              <!-- Content Grid: Stats Left, Note Right -->
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <!-- Stats List - Left Side -->
                <div class="space-y-2">
                  <div class="flex items-center justify-between py-1">
                    <div class="flex items-center gap-3">
                      <span class="text-lg">😴</span>
                      <span class="text-sm text-gray-600">Sommeil</span>
                    </div>
                    <span class="text-sm font-medium text-gray-800">{{ entry.sleep_hours }}h</span>
                  </div>
                  
                  <div class="flex items-center justify-between py-1">
                    <div class="flex items-center gap-3">
                      <span class="text-lg">💧</span>
                      <span class="text-sm text-gray-600">Verres d'eau</span>
                    </div>
                    <span class="text-sm font-medium text-gray-800">{{ entry.water_cups }}</span>
                  </div>
                  
                  <div class="flex items-center justify-between py-1">
                    <div class="flex items-center gap-3">
                      <span class="text-lg">🏃‍♀️</span>
                      <span class="text-sm text-gray-600">Sport</span>
                    </div>
                    <span class="text-sm font-medium text-gray-800">{{ entry.sport_min }}min</span>
                  </div>
                </div>
                
                <!-- Note - Right Side (Post-it style) -->
                <div *ngIf="entry.note" class="h-full">
                  <div class="bg-yellow-100/50 border-l-4 border-amber-500/60 p-3 rounded-r-lg shadow-sm h-full">
                    <p class="text-sm text-amber-500/90 leading-relaxed">{{ entry.note }}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Loading State -->
      <div *ngIf="isLoading()" class="text-center py-12">
        <div class="text-4xl mb-4">⏳</div>
        <p class="text-gray-500">Chargement de vos entrées...</p>
      </div>
      
      <!-- Empty State -->
      <div *ngIf="!isLoading() && recentEntries().length === 0" class="text-center py-12">
        <div class="text-6xl mb-4">📝</div>
        <h3 class="text-xl font-semibold text-gray-700 mb-2">Aucune entrée pour le moment</h3>
        <p class="text-gray-500">Commencez par enregistrer votre première journée !</p>
      </div>
    </div>
  `
})
export class RecentEntriesComponent implements OnInit {
  private entriesService = inject(EntriesService);

  recentEntries = computed(() => {
    const entries: DailyEntry[] = [];
    this.entriesService.entries$.subscribe(data => entries.push(...data));
    return entries.slice(0, 10); // Show last 10 entries
  });

  isLoading = computed(() => this.entriesService.isLoading());

  moodOptions = [
    { emoji: '😢', label: 'Très triste' },
    { emoji: '😞', label: 'Triste' },
    { emoji: '😐', label: 'Neutre' },
    { emoji: '😊', label: 'Bonne humeur' },
    { emoji: '😍', label: 'Excellente humeur' }
  ];

  ngOnInit(): void {
    this.entriesService.loadEntries().subscribe();
  }

  getMoodEmoji(mood: number): string {
    return this.moodOptions[mood - 1]?.emoji || '😐';
  }

  getMoodLabel(mood: number): string {
    return this.moodOptions[mood - 1]?.label || 'Neutre';
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    const formattedDate = date.toLocaleDateString('fr-FR', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
    return formattedDate.charAt(0).toUpperCase() + formattedDate.slice(1);
  }
}