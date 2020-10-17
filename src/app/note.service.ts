import { Injectable } from '@angular/core';
import {AngularFireDatabase} from '@angular/fire/database';
import {IDBNote} from './note.model';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NoteService {
  constructor(private db: AngularFireDatabase) { }

  getNoteListener(id: string): Observable<IDBNote> {
    return this.db.object<IDBNote>(id).valueChanges();
  }

  saveNote(id: string, text: string): Promise<void> {
    return this.db.object<IDBNote>(id).set({
      text
    });
  }

  generateId(): string {
    return this.db.createPushId();
  }
}
