import {Component, OnInit} from '@angular/core';
import {NativeRouterService} from './native-router.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  title = 'firenote 🔥';
  masterLoading = true;
  isLoading = false;
  id: string;

  constructor(private router: NativeRouterService) {}

  onChange(text: string): void {
    this.isLoading = true;
    setTimeout(() => {
      this.isLoading = false;
      console.log('saved', text);
    }, 500);
  }

  ngOnInit(): void {
    this.id = this.getCurrentId();
    this.masterLoading = false;
  }

  private getCurrentId(): string {
    const paths = this.router.getCurrentPath();
    if (paths.length !== 1) {
      this.router.redirectTo('/testing');
    }
    return paths[0];
  }
}
