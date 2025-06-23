import { Component, computed, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EntriesService } from '../../services/entries.service';

@Component({
  selector: 'app-stats-grid',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8 mx-4">
      <div class="stat-card glass-card rounded-3xl p-6 text-center deep-shadow hover:shadow-2xl transition-all duration-300 relative">
        <div class="corner-decoration corner-decoration-top-left"></div>
        <div class="corner-decoration corner-decoration-top-right"></div>
        <div class="corner-decoration corner-decoration-bottom-left"></div>
        <div class="corner-decoration corner-decoration-bottom-right"></div>
        
        <div class="text-2xl mt-2 relative z-10">🔥</div>
        <div class="stat-value text-4xl sm:text-5xl font-bold mb-2 relative z-10">{{ currentStreak() }}j</div>
        <div class="text-gray-700 font-semibold text-sm sm:text-base relative z-10">Série actuelle</div>
        <div class="text-xs sm:text-sm text-gray-500 mt-1 relative z-10">Continuez comme ça !</div>
      </div>
      
      <div class="stat-card glass-card rounded-3xl p-6 text-center deep-shadow hover:shadow-2xl transition-all duration-300 relative">
        <div class="corner-decoration corner-decoration-top-left"></div>
        <div class="corner-decoration corner-decoration-top-right"></div>
        <div class="corner-decoration corner-decoration-bottom-left"></div>
        <div class="corner-decoration corner-decoration-bottom-right"></div>
        
        <div class="text-2xl mt-2 relative z-10">📅</div>
        <div class="stat-value text-4xl sm:text-5xl font-bold mb-2 relative z-10">{{ monthlyEntries() }}</div>
        <div class="text-gray-700 font-semibold text-sm sm:text-base relative z-10">Entrées ce mois</div>
        <div class="text-xs sm:text-sm text-gray-500 mt-1 relative z-10">Excellent suivi</div>
      </div>
      
      <div class="stat-card glass-card rounded-3xl p-6 text-center deep-shadow hover:shadow-2xl transition-all duration-300 relative">
        <div class="corner-decoration corner-decoration-top-left"></div>
        <div class="corner-decoration corner-decoration-top-right"></div>
        <div class="corner-decoration corner-decoration-bottom-left"></div>
        <div class="corner-decoration corner-decoration-bottom-right"></div>
        
        <div class="text-2xl mt-2 relative z-10">😊</div>
        <div class="stat-value text-4xl sm:text-5xl font-bold mb-2 relative z-10">
          {{ averageMood() }}<span class="text-lg text-gray-400">/5</span>
        </div>
        <div class="text-gray-700 font-semibold text-sm sm:text-base relative z-10">Humeur moyenne</div>
      </div>
      
      <div class="stat-card glass-card rounded-3xl p-6 text-center deep-shadow hover:shadow-2xl transition-all duration-300 relative">
        <div class="corner-decoration corner-decoration-top-left"></div>
        <div class="corner-decoration corner-decoration-top-right"></div>
        <div class="corner-decoration corner-decoration-bottom-left"></div>
        <div class="corner-decoration corner-decoration-bottom-right"></div>
        
        <div class="text-2xl mt-2 relative z-10">💤</div>
        <div class="stat-value text-4xl sm:text-5xl font-bold mb-2 relative z-10">{{ averageSleep() }}h</div>
        <div class="text-gray-700 font-semibold text-sm sm:text-base relative z-10">Sommeil moyen</div>
      </div>
      
      <div class="stat-card glass-card rounded-3xl p-6 text-center deep-shadow hover:shadow-2xl transition-all duration-300 relative">
        <div class="corner-decoration corner-decoration-top-left"></div>
        <div class="corner-decoration corner-decoration-top-right"></div>
        <div class="corner-decoration corner-decoration-bottom-left"></div>
        <div class="corner-decoration corner-decoration-bottom-right"></div>
        
        <div class="text-2xl mt-2 relative z-10">🏃‍♀️</div>
        <div class="stat-value text-4xl sm:text-5xl font-bold mb-2 relative z-10">{{ averageSport() }}min</div>
        <div class="text-gray-700 font-semibold text-sm sm:text-base relative z-10">Sport moyen</div>
      </div>
      
      <div class="stat-card glass-card rounded-3xl p-6 text-center deep-shadow hover:shadow-2xl transition-all duration-300 relative">
        <div class="corner-decoration corner-decoration-top-left"></div>
        <div class="corner-decoration corner-decoration-top-right"></div>
        <div class="corner-decoration corner-decoration-bottom-left"></div>
        <div class="corner-decoration corner-decoration-bottom-right"></div>
        
        <div class="text-2xl mt-2 relative z-10">💧</div>
        <div class="stat-value text-4xl sm:text-5xl font-bold mb-2 relative z-10">{{ averageWater() }}</div>
        <div class="text-gray-700 font-semibold text-sm sm:text-base relative z-10">Verres d'eau/jour</div>
      </div>
    </div>
  `
})
export class StatsGridComponent implements OnInit {
  private entriesService = inject(EntriesService);

  stats = computed(() => {
    // This will be reactive when stats are loaded
    return null;
  });

  ngOnInit(): void {
    this.entriesService.loadStats().subscribe();
  }

  currentStreak = computed(() => {
    // TODO: Calculate from actual data
    return 5;
  });

  monthlyEntries = computed(() => {
    // TODO: Get from stats service
    return 23;
  });

  averageMood = computed(() => {
    // TODO: Get from stats service
    return '4.2';
  });

  averageSleep = computed(() => {
    // TODO: Get from stats service
    return '7.3';
  });

  averageSport = computed(() => {
    // TODO: Get from stats service
    return '25';
  });

  averageWater = computed(() => {
    // TODO: Get from stats service
    return '6.8';
  });
}