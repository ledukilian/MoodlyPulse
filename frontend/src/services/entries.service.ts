import { Injectable, signal } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { BehaviorSubject, Observable, tap, catchError, of } from 'rxjs';
import { DailyEntry, EntryStats, ApiResponse } from '../models/entry.model';

@Injectable({
  providedIn: 'root'
})
export class EntriesService {
  private apiUrl = 'http://localhost:8080';
  private entriesSubject = new BehaviorSubject<DailyEntry[]>([]);
  private statsSubject = new BehaviorSubject<EntryStats | null>(null);
  
  public entries$ = this.entriesSubject.asObservable();
  public stats$ = this.statsSubject.asObservable();
  
  // Signals for reactive UI
  public isLoading = signal(false);
  public error = signal<string | null>(null);
  public todayEntry = signal<DailyEntry | null>(null);

  constructor(private http: HttpClient) {}

  loadEntries(startDate?: string, endDate?: string): Observable<DailyEntry[]> {
    this.isLoading.set(true);
    this.error.set(null);
    
    let params = new HttpParams();
    if (startDate) params = params.set('start_date', startDate);
    if (endDate) params = params.set('end_date', endDate);
    
    return this.http.get<DailyEntry[]>(`${this.apiUrl}/entries`, { params })
      .pipe(
        tap(entries => {
          this.entriesSubject.next(entries);
          this.updateTodayEntry(entries);
          this.isLoading.set(false);
        }),
        catchError(error => this.handleError(error))
      );
  }

  getEntry(id: number): Observable<DailyEntry> {
    return this.http.get<DailyEntry>(`${this.apiUrl}/entries/${id}`)
      .pipe(
        catchError(error => this.handleError(error))
      );
  }

  saveEntry(entry: DailyEntry): Observable<DailyEntry> {
    this.isLoading.set(true);
    this.error.set(null);
    
    return this.http.post<DailyEntry>(`${this.apiUrl}/entries`, entry)
      .pipe(
        tap(savedEntry => {
          this.updateEntriesAfterSave(savedEntry);
          this.todayEntry.set(savedEntry);
          this.isLoading.set(false);
        }),
        catchError(error => this.handleError(error))
      );
  }

  deleteEntry(id: number): Observable<void> {
    this.isLoading.set(true);
    this.error.set(null);
    
    return this.http.delete<void>(`${this.apiUrl}/entries/${id}`)
      .pipe(
        tap(() => {
          const currentEntries = this.entriesSubject.value;
          const updatedEntries = currentEntries.filter(entry => entry.id !== id);
          this.entriesSubject.next(updatedEntries);
          this.isLoading.set(false);
        }),
        catchError(error => this.handleError(error))
      );
  }

  loadStats(): Observable<EntryStats> {
    return this.http.get<EntryStats>(`${this.apiUrl}/stats/summary`)
      .pipe(
        tap(stats => this.statsSubject.next(stats)),
        catchError(error => this.handleError(error))
      );
  }

  getTodayEntry(): DailyEntry | null {
    return this.todayEntry();
  }

  private updateTodayEntry(entries: DailyEntry[]): void {
    const today = new Date().toISOString().split('T')[0];
    const todayEntry = entries.find(entry => entry.date === today);
    this.todayEntry.set(todayEntry || null);
  }

  private updateEntriesAfterSave(savedEntry: DailyEntry): void {
    const currentEntries = this.entriesSubject.value;
    const existingIndex = currentEntries.findIndex(entry => entry.date === savedEntry.date);
    
    if (existingIndex >= 0) {
      const updatedEntries = [...currentEntries];
      updatedEntries[existingIndex] = savedEntry;
      this.entriesSubject.next(updatedEntries);
    } else {
      this.entriesSubject.next([savedEntry, ...currentEntries]);
    }
  }

  private handleError(error: any): Observable<never> {
    this.isLoading.set(false);
    const errorMessage = error.error?.message || 'Une erreur est survenue';
    this.error.set(errorMessage);
    throw error;
  }
}