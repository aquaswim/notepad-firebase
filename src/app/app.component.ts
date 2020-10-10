import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'firenote 🔥';
  isLoading = false;

  onChange(text: string): void {
    this.isLoading = true;
    setTimeout(() => {
      this.isLoading = false;
      console.log('saved', text);
    }, 500);
  }
}
