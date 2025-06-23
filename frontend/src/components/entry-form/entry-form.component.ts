import { Component, signal, inject, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EntriesService } from '../../services/entries.service';
import { DailyEntry } from '../../models/entry.model';

@Component({
  selector: 'app-entry-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <!-- Modal Overlay -->
    <div *ngIf="isOpen()" 
         class="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
         (click)="closeModal()">
      
      <!-- Modal Content -->
      <div class="glass-card rounded-3xl p-4 sm:p-6 max-w-xl w-full max-h-[85vh] overflow-y-auto deep-shadow form-decoration mx-4"
           (click)="$event.stopPropagation()">
        
        <!-- Corner Decorations -->
        <div class="corner-decoration corner-decoration-top-left"></div>
        <div class="corner-decoration corner-decoration-top-right"></div>
        <div class="corner-decoration corner-decoration-bottom-left"></div>
        <div class="corner-decoration corner-decoration-bottom-right"></div>
        
        <!-- Close Button - Centered above title -->
        <div class="text-center mb-2">
          <button (click)="closeModal()" 
                  class="text-red-500 hover:text-red-700 text-xl font-bold transition-colors duration-200">
            ✕
          </button>
        </div>
        
        <div class="text-center mb-4 relative z-10">
          <h2 class="text-xl sm:text-2xl font-bold mood-gradient-text mb-2">
            Comment ça va aujourd'hui ?
          </h2>
          <div class="section-separator"></div>
        </div>

        <form [formGroup]="entryForm" (ngSubmit)="onSubmit()" class="space-y-4 relative z-10">
          <!-- Mood Section -->
          <div>
            <label class="block text-gray-700 font-semibold mb-2 text-base">😊 Humeur du jour</label>
            <div class="grid grid-cols-5 gap-2 sm:gap-3 mb-2">
              <button type="button" 
                      *ngFor="let mood of moodOptions; let i = index"
                      class="mood-button aspect-square rounded-lg text-2xl sm:text-3xl flex items-center justify-center glass-card deep-shadow hover:shadow-2xl transition-all duration-300"
                      [class.selected]="selectedMood() === i + 1"
                      (click)="selectMood(i + 1)">
                <span class="drop-shadow-[0_0_12px_rgba(255,255,255,1)]">{{ mood.emoji }}</span>
              </button>
            </div>
          </div>

          <!-- Numeric Fields Row -->
          <div class="grid grid-cols-1 md:grid-cols-3 gap-3">
            <!-- Sleep -->
            <div>
              <label class="block text-gray-700 font-semibold mb-1 text-base">😴 Heures de sommeil</label>
              <input type="number" step="0.5" min="0" max="24" 
                     formControlName="sleep_hours"
                     placeholder="7.5"
                     class="input-field w-full px-3 py-2 rounded-xl focus:outline-none text-base">
            </div>

            <!-- Water -->
            <div>
              <label class="block text-gray-700 font-semibold mb-1 text-base">💧 Verres d'eau</label>
              <input type="number" min="0" 
                     formControlName="water_cups"
                     placeholder="8"
                     class="input-field w-full px-3 py-2 rounded-xl focus:outline-none text-base">
            </div>

            <!-- Sport -->
            <div>
              <label class="block text-gray-700 font-semibold mb-1 text-base">🏃‍♀️ Sport <span class="text-xs text-gray-400">(en minutes)</span></label>
              <input type="number" min="0" 
                     formControlName="sport_min"
                     placeholder="30"
                     class="input-field w-full px-3 py-2 rounded-xl focus:outline-none text-base">
            </div>
          </div>

          <!-- Note -->
          <div>
            <label class="block text-gray-700 font-semibold mb-1 text-base">📝 Note personnelle</label>
            <textarea rows="4" 
                      formControlName="note"
                      placeholder="Partagez vos pensées du jour..."
                      class="input-field w-full px-3 py-2 rounded-xl focus:outline-none resize-none text-base"></textarea>
          </div>

          <div class="text-center pt-3">
            <button type="submit" 
                    [disabled]="!entryForm.valid || isSubmitting()"
                    class="primary-button text-white px-12 py-4 rounded-xl font-semibold text-lg shadow-2xl disabled:opacity-50">
              <span *ngIf="!isSubmitting()">💖 Enregistrer ma journée</span>
              <span *ngIf="isSubmitting()">⏳ Enregistrement...</span>
            </button>
          </div>
        </form>

        <!-- Error Message -->
        <div *ngIf="errorMessage()" class="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 relative z-10 text-sm">
          {{ errorMessage() }}
        </div>
      </div>
    </div>
  `
})
export class EntryFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private entriesService = inject(EntriesService);
  
  @Input() isOpen = signal(false);
  @Output() modalClosed = new EventEmitter<void>();
  
  entryForm: FormGroup;
  selectedMood = signal(0);
  isSubmitting = signal(false);
  errorMessage = signal<string | null>(null);
  
  moodOptions = [
    { emoji: '😢', label: 'Très triste' },
    { emoji: '😞', label: 'Triste' },
    { emoji: '😐', label: 'Neutre' },
    { emoji: '😊', label: 'Bonne humeur' },
    { emoji: '😍', label: 'Excellente humeur' }
  ];

  constructor() {
    this.entryForm = this.fb.group({
      mood: [0, [Validators.required, Validators.min(1), Validators.max(5)]],
      sleep_hours: [7.5, [Validators.required, Validators.min(0), Validators.max(24)]],
      water_cups: [8, [Validators.required, Validators.min(0)]],
      sport_min: [0, [Validators.required, Validators.min(0)]],
      note: ['']
    });
  }

  ngOnInit(): void {
    this.loadTodayEntry();
  }

  private loadTodayEntry(): void {
    const todayEntry = this.entriesService.getTodayEntry();
    if (todayEntry) {
      this.entryForm.patchValue({
        mood: todayEntry.mood,
        sleep_hours: todayEntry.sleep_hours,
        water_cups: todayEntry.water_cups,
        sport_min: todayEntry.sport_min,
        note: todayEntry.note || ''
      });
      this.selectedMood.set(todayEntry.mood);
    }
  }

  selectMood(mood: number): void {
    this.selectedMood.set(mood);
    this.entryForm.patchValue({ mood });
  }

  getMoodEmoji(): string {
    const mood = this.selectedMood();
    return mood > 0 ? this.moodOptions[mood - 1].emoji : '';
  }

  getMoodLabel(): string {
    const mood = this.selectedMood();
    return mood > 0 ? this.moodOptions[mood - 1].label : '';
  }

  closeModal(): void {
    this.modalClosed.emit();
  }

  onSubmit(): void {
    if (this.entryForm.valid) {
      this.isSubmitting.set(true);
      this.errorMessage.set(null);
      
      const today = new Date().toISOString().split('T')[0];
      const entryData: DailyEntry = {
        date: today,
        ...this.entryForm.value
      };

      this.entriesService.saveEntry(entryData).subscribe({
        next: () => {
          this.isSubmitting.set(false);
          this.closeModal();
          // Reset form after successful submission
          this.resetForm();
        },
        error: (error) => {
          this.isSubmitting.set(false);
          this.errorMessage.set('Erreur lors de l\'enregistrement. Veuillez réessayer.');
        }
      });
    }
  }

  private resetForm(): void {
    this.entryForm.reset({
      mood: 0,
      sleep_hours: 7.5,
      water_cups: 8,
      sport_min: 0,
      note: ''
    });
    this.selectedMood.set(0);
    this.errorMessage.set(null);
  }
}