import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { TexteditorComponent } from './texteditor/texteditor.component';
import {ReactiveFormsModule} from '@angular/forms';
import {AngularFireModule} from '@angular/fire';
import {environment} from '../environments/environment';
import {AngularFireDatabaseModule} from '@angular/fire/database';
import {AngularFirePerformanceModule, PerformanceMonitoringService} from '@angular/fire/performance';

@NgModule({
  declarations: [
    AppComponent,
    TexteditorComponent
  ],
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireDatabaseModule,
    AngularFirePerformanceModule
  ],
  providers: [
    PerformanceMonitoringService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
