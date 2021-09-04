import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';

@Component({
  selector: 'app-locker',
  templateUrl: './locker.component.html',
  styleUrls: ['./locker.component.css']
})
export class LockerComponent implements OnInit {
  @Output() cekPassword = new EventEmitter<string>();
  @Input() passwordInvalid = false;

  unlockForm = new FormGroup({
    password: new FormControl('', [
      Validators.required
    ])
  });

  constructor() { }

  ngOnInit(): void {
  }

  onSubmit(): void {
    if (this.unlockForm.invalid) {
      return;
    }
    this.cekPassword.emit(this.unlockForm.get('password').value as string);
  }
}
