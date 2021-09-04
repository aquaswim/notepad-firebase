import {Component, OnDestroy, OnInit} from '@angular/core';
import {NativeRouterService} from './native-router.service';
import {NoteService} from './note.service';
import {Subscription} from 'rxjs';
import {encrypt, decrypt} from './helpers/crypto';
import {SettingModel} from './setting/setting.model';

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
  isProtected = false;
  password = '';
  unlocked = true;
  passwordInvalid = false;
  activeTab = 'editor';

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
        // cek is it new note or not
        if (!value) {
          return;
        }

        this.isProtected = value.protected;
        if (this.isProtected) {
          this.text = decrypt(value.text, this.password);
          if (this.text === null) {
            // locked text
            this.text = value.text;
            this.unlocked = false;
          }
        } else {
          this.text = value.text;
          this.unlocked = true;
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

  cekPassword(password: string): void {
    const content = decrypt(this.text, password);
    if (content) {
      this.unlocked = true;
      this.password = password;
      this.text = content;
    } else {
      this.passwordInvalid = true;
    }
  }

  settingChanged(newSetting: SettingModel): void {
    this.isProtected = newSetting.isProtected;
    this.password = newSetting.password || '';
    this.activeTab = 'editor';
  }
}
