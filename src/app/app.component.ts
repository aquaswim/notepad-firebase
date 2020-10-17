import {Component, OnDestroy, OnInit} from '@angular/core';
import {NativeRouterService} from './native-router.service';
import {NoteService} from './note.service';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy{
  title = 'firenote 🔥';
  masterLoading = true;
  isLoading = false;
  id: string;
  noteUpdateListener: Subscription;
  text = '';

  constructor(private router: NativeRouterService, private noteService: NoteService) {}

  onChange(text: string): void {
    this.isLoading = true;
    this.noteService.saveNote(this.id, text)
      .catch(err => {
        alert('error saving data to db');
        console.error(err);
      })
      .finally(() => {
        this.isLoading = false;
      });
  }

  ngOnInit(): void {
    this.id = this.getCurrentId();
    if (!this.id) {
      return;
    }
    this.masterLoading = false;
    this.isLoading = true;
    this.noteUpdateListener = this
      .noteService
      .getNoteListener(this.id)
      .subscribe(value => {
        this.isLoading = false;
        if (value) {
          this.text = value.text;
        }
      });
  }

  private getCurrentId(): string {
    const paths = this.router.getCurrentPath();
    if (paths.length !== 1) {
      this.router.redirectTo(`/${this.noteService.generateId()}`);
      return '';
    }
    return paths[0];
  }

  ngOnDestroy(): void {
    this.noteUpdateListener.unsubscribe();
  }
}
