import { Component, signal, inject, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EntriesService } from '../../services/entries.service';
import { DailyEntry, CreateEntryRequest } from '../../models/entry.model';

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
      <div class="glass-card rounded-3xl p-4 sm:p-6 max-w-xl w-full max-h-[90vh] overflow-hidden deep-shadow form-decoration mx-4 flex flex-col"
           (click)="$event.stopPropagation()">
        
        <!-- Corner Decorations -->
        <div class="corner-decoration corner-decoration-top-left"></div>
        <div class="corner-decoration corner-decoration-top-right"></div>
        <div class="corner-decoration corner-decoration-bottom-left"></div>
        <div class="corner-decoration corner-decoration-bottom-right"></div>
        
        <!-- Close Button - Centered above title -->
        <div class="text-center mb-2 flex-shrink-0">
          <button (click)="closeModal()" 
                  class="text-red-500 hover:text-red-700 text-xl font-bold transition-colors duration-200">
            ✕
          </button>
        </div>
        
        <div class="text-center mb-4 relative z-10 flex-shrink-0">
          <h2 class="text-2xl sm:text-3xl font-bold mood-gradient-text mb-2">
            Comment ça va aujourd'hui ?
          </h2>
          <div class="section-separator"></div>
        </div>

        <!-- Scrollable Content -->
        <div class="flex-1 overflow-y-auto pr-2">
          <form [formGroup]="entryForm" (ngSubmit)="onSubmit()" class="space-y-6 relative z-10">
            <!-- Mood Section -->
            <div>
              <label class="block text-gray-700 font-semibold mb-4 text-base">😊 Humeur du jour</label>
              <div class="grid grid-cols-5 gap-6 mb-3">
                <button type="button" 
                        *ngFor="let mood of moodOptions; let i = index"
                        class="mood-button aspect-square rounded-xl text-3xl sm:text-2xl flex items-center justify-center glass-card deep-shadow hover:shadow-2xl transition-all duration-300"
                        [class.selected]="selectedMood() === i + 1"
                        (click)="selectMood(i + 1)">
                  <span class="drop-shadow-[0_0_12px_rgba(255,255,255,1)]">{{ mood.emoji }}</span>
                </button>
              </div>
              <div *ngIf="selectedMood() === 0 && entryForm.get('mood')?.touched" 
                   class="text-red-500 text-xs sm:text-sm mt-1">
                Veuillez sélectionner une humeur
              </div>
            </div>

            <!-- Numeric Fields Row -->
            <div class="grid grid-cols-1 gap-4">
              <!-- Sleep -->
              <div class="flex flex-col">
                <label class="block text-gray-700 font-semibold mb-2 text-base">😴 Heures de sommeil</label>
                <input type="number" step="0.5" min="0" max="24" 
                       formControlName="sleep_hours"
                       placeholder="Ex: 7.5"
                       class="input-field w-full px-3 py-2 rounded-xl focus:outline-none text-base">
              </div>

              <!-- Water -->
              <div class="flex flex-col">
                <label class="block text-gray-700 font-semibold mb-2 text-base">💧 Verres d'eau</label>
                <input type="number" min="0" 
                       formControlName="water_cups"
                       placeholder="Ex: 8"
                       class="input-field w-full px-3 py-2 rounded-xl focus:outline-none text-base">
              </div>

              <!-- Sport -->
              <div class="flex flex-col">
                <label class="block text-gray-700 font-semibold mb-2 text-base">🏃‍♀️ Sport <span class="text-xs text-gray-400">(en minutes)</span></label>
                <input type="number" min="0" 
                       formControlName="sport_min"
                       placeholder="Ex: 30"
                       class="input-field w-full px-3 py-2 rounded-xl focus:outline-none text-base">
              </div>
            </div>

            <!-- Note -->
            <div>
              <label class="block text-gray-700 font-semibold mb-2 text-base">📝 Note personnelle</label>
              <textarea rows="3" 
                        formControlName="note"
                        placeholder="Partagez vos pensées du jour..."
                        class="input-field w-full px-3 py-2 rounded-xl focus:outline-none resize-none text-base"></textarea>
            </div>
          </form>
        </div>

        <!-- Fixed Bottom Section -->
        <div class="flex-shrink-0 pt-4 border-t border-gray-200 mt-4">
          <div class="text-center">
            <button type="submit" 
                    [disabled]="!entryForm.valid || isSubmitting()"
                    (click)="onSubmit()"
                    class="primary-button text-white px-12 py-3 rounded-xl font-semibold text-lg shadow-2xl disabled:opacity-50 w-full">
              <span *ngIf="!isSubmitting()">💖 Enregistrer ma journée</span>
              <span *ngIf="isSubmitting()">⏳ Enregistrement...</span>
            </button>
          </div>

          <!-- Error Message -->
          <div *ngIf="errorMessage()" class="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
            {{ errorMessage() }}
          </div>
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
      sleep_hours: [null, [Validators.required, Validators.min(0), Validators.max(24)]],
      water_cups: [null, [Validators.required, Validators.min(0)]],
      sport_min: [null, [Validators.required, Validators.min(0)]],
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
    if (this.entryForm.valid && this.selectedMood() > 0) {
      this.isSubmitting.set(true);
      this.errorMessage.set(null);
      
      const today = new Date().toISOString().split('T')[0];
      const formValue = this.entryForm.value;
      
      // Convertir les types pour correspondre au backend
      const entryData: CreateEntryRequest = {
        date: today,
        mood: this.selectedMood(), // Utiliser la valeur sélectionnée
        sleep_hours: Number(formValue.sleep_hours),
        water_cups: Number(formValue.water_cups),
        sport_min: Number(formValue.sport_min),
        note: formValue.note || ''
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
          console.error('Erreur lors de l\'enregistrement:', error);
          this.errorMessage.set(error.error?.message || 'Erreur lors de l\'enregistrement. Veuillez réessayer.');
        }
      });
    } else {
      // Afficher les erreurs de validation
      this.markFormGroupTouched();
      if (this.selectedMood() === 0) {
        this.errorMessage.set('Veuillez sélectionner une humeur');
      }
    }
  }

  private markFormGroupTouched(): void {
    Object.keys(this.entryForm.controls).forEach(key => {
      const control = this.entryForm.get(key);
      control?.markAsTouched();
    });
  }

  private resetForm(): void {
    this.entryForm.reset({
      mood: 0,
      sleep_hours: null,
      water_cups: null,
      sport_min: null,
      note: ''
    });
    this.selectedMood.set(0);
    this.errorMessage.set(null);
  }
}