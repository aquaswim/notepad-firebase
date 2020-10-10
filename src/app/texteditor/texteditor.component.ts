import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {FormControl} from '@angular/forms';
import {debounceTime} from 'rxjs/operators';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-texteditor',
  templateUrl: './texteditor.component.html',
  styleUrls: ['./texteditor.component.css']
})
export class TexteditorComponent implements OnInit, OnDestroy {
  row = 8;
  inputCtrl = new FormControl('');
  inputSubscription: Subscription;
  debounceTime = 1000;
  @Input() value: string;
  @Input() isLoading = false;
  @Output() changed = new EventEmitter<string>();

  constructor() { }

  ngOnInit(): void {
    this.inputCtrl.setValue(this.value);
    this.inputSubscription = this.inputCtrl
      .valueChanges
      .pipe(debounceTime(this.debounceTime))
      .subscribe((data: string) => {
        this.changed.emit(data);
      });
  }

  ngOnDestroy(): void {
    this.inputSubscription.unsubscribe();
  }
}
