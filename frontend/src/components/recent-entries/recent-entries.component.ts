import { Component, computed, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EntriesService } from '../../services/entries.service';
import { DailyEntry } from '../../models/entry.model';

@Component({
  selector: 'app-recent-entries',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="glass-card rounded-3xl p-6 sm:p-8 deep-shadow form-decoration mx-4">
      <div class="corner-decoration corner-decoration-top-left"></div>
      <div class="corner-decoration corner-decoration-top-right"></div>
      <div class="corner-decoration corner-decoration-bottom-left"></div>
      <div class="corner-decoration corner-decoration-bottom-right"></div>
      
      <div class="mb-8 relative z-10">
        <h2 class="text-2xl sm:text-3xl font-bold mood-gradient-text">📅 Mes dernières entrées</h2>
        <p class="text-gray-600 mt-1">Votre parcours bien-être</p>
      </div>
      
      <div class="space-y-6 relative z-10" *ngIf="recentEntries().length > 0">
        <div *ngFor="let entry of recentEntries()" 
             class="entry-card glass-card rounded-3xl p-6 sm:p-8 deep-shadow hover:shadow-2xl transition-all duration-300 relative">
          <div class="corner-decoration corner-decoration-top-left"></div>
          <div class="corner-decoration corner-decoration-top-right"></div>
          <div class="corner-decoration corner-decoration-bottom-left"></div>
          <div class="corner-decoration corner-decoration-bottom-right"></div>
          
          <div class="entry-mood-bg absolute top-4 right-4 text-6xl opacity-20">
            {{ getMoodEmoji(entry.mood) }}
          </div>
          <div class="flex flex-col sm:flex-row justify-between gap-4 relative z-10">
            <div class="flex-1">
              <div class="flex flex-col sm:flex-row sm:items-center gap-4 mb-4">
                <span class="font-bold text-gray-800 text-xl">{{ formatDate(entry.date) }}</span>
              </div>
              <div class="grid grid-cols-1 sm:grid-cols-4 text-sm text-gray-600 mb-4">
                <div class="flex items-center gap-2 px-3 py-2 rounded-xl glass-card deep-shadow">
                  <span class="text-lg">{{ getMoodEmoji(entry.mood) }}</span>
                  <span><strong>{{ getMoodLabel(entry.mood) }}</strong></span>
                </div>
                <div class="flex items-center gap-2 px-3 py-2 rounded-xl glass-card deep-shadow">
                  <span class="text-lg">😴</span>
                  <span><strong>{{ entry.sleep_hours }}h</strong> de sommeil</span>
                </div>
                <div class="flex items-center gap-2 px-3 py-2 rounded-xl glass-card deep-shadow">
                  <span class="text-lg">💧</span>
                  <span><strong>{{ entry.water_cups }}</strong> verres d'eau</span>
                </div>
                <div class="flex items-center gap-2 px-3 py-2 rounded-xl glass-card deep-shadow">
                  <span class="text-lg">🏃‍♀️</span>
                  <span><strong>{{ entry.sport_min }}min</strong> de sport</span>
                </div>
              </div>
              <div class="px-3 pb-2" *ngIf="entry.note">
                <p class="text-gray-700 leading-relaxed">{{ entry.note }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div *ngIf="recentEntries().length === 0" class="text-center py-12 relative z-10">
        <div class="text-6xl mb-4">📝</div>
        <h3 class="text-xl font-semibold text-gray-700 mb-2">Aucune entrée pour le moment</h3>
        <p class="text-gray-500">Commencez par enregistrer votre première journée !</p>
      </div>
      
      <div *ngIf="isLoading()" class="text-center py-12 relative z-10">
        <div class="text-4xl mb-4">⏳</div>
        <p class="text-gray-500">Chargement de vos entrées...</p>
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
    return date.toLocaleDateString('fr-FR', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  }
}