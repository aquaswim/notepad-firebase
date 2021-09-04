import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { TexteditorComponent } from './texteditor/texteditor.component';
import {ReactiveFormsModule} from '@angular/forms';
import {AngularFireModule} from '@angular/fire';
import {environment} from '../environments/environment';
import {AngularFireDatabaseModule, USE_EMULATOR as USE_DATABASE_EMULATOR} from '@angular/fire/database';
import {AngularFirePerformanceModule, PerformanceMonitoringService} from '@angular/fire/performance';
import { LockerComponent } from './locker/locker.component';

@NgModule({
  declarations: [
    AppComponent,
    TexteditorComponent,
    LockerComponent
  ],
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFirePerformanceModule,
    AngularFireDatabaseModule,
  ],
  providers: [
    PerformanceMonitoringService,
    { provide: USE_DATABASE_EMULATOR, useValue: environment.useEmulators ? ['localhost', 9000] : undefined },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
