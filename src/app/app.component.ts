import {Component, OnDestroy, OnInit} from '@angular/core';
import {NativeRouterService} from './native-router.service';
import {NoteService} from './note.service';
import {Subscription} from 'rxjs';
import {encrypt, decrypt} from './helpers/crypto';

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
  isProtected = true;
  password = 'password';
  unlocked = true;

  constructor(private router: NativeRouterService, private noteService: NoteService) {}

  onChange(text: string): void {
    this.isLoading = true;
    if (!this.unlocked) {
      return;
    }
    const updatedText = this.isProtected ? encrypt(text, this.password) : text;
    this.noteService.saveNote(this.id, updatedText, this.isProtected)
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
        this.isProtected = value.protected;
        if (this.isProtected) {
          this.text = decrypt(value.text, this.password);
        } else {
          this.text = value.text;
        }
        this.isLoading = false;
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
