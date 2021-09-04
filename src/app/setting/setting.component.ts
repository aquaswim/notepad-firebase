import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormControl, FormGroup} from '@angular/forms';
import {SettingModel} from './setting.model';

@Component({
  selector: 'app-setting',
  templateUrl: './setting.component.html',
  styleUrls: ['./setting.component.css']
})
export class SettingComponent implements OnInit {
  @Output() changed = new EventEmitter<SettingModel>();
  @Input() isProtected: boolean;

  settingForm = new FormGroup({
    isProtected: new FormControl('false'),
    password: new FormControl('')
  });

  constructor() {
  }

  ngOnInit(): void {
    this.settingForm.get('isProtected').setValue(this.isProtected ? 'true' : 'false');
  }

  onSubmit(): void {
    const isProtected = this.settingForm.get('isProtected').value === 'true';
    if (isProtected && !this.settingForm.get('password').value) {
      alert('Setting is invalid');
      return;
    }
    this.changed.emit({
      password: isProtected ? this.settingForm.get('password').value : null,
      isProtected
    });
  }
}
