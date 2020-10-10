import {Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges} from '@angular/core';
import {FormControl} from '@angular/forms';
import {debounceTime} from 'rxjs/operators';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-texteditor',
  templateUrl: './texteditor.component.html',
  styleUrls: ['./texteditor.component.css']
})
export class TexteditorComponent implements OnInit, OnDestroy, OnChanges {
  row = 8;
  inputCtrl = new FormControl('');
  inputSubscription: Subscription;
  debounceTime = 250;
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
        // only emit event if value is different
        if (this.value === data) {
          return;
        }
        this.changed.emit(data);
        this.value = data;
      });
  }

  ngOnDestroy(): void {
    this.inputSubscription.unsubscribe();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.hasOwnProperty('value')) {
      const valueChange = changes.value;
      if (!valueChange.isFirstChange()) {
        this.value = valueChange.currentValue;
        this.inputCtrl.setValue(valueChange.currentValue, { emitEvent: false});
      }
    }
  }
}
