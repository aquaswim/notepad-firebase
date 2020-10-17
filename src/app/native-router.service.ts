import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class NativeRouterService {
  constructor() {}

  getCurrentPath(): string[]{
    return window
      .location
      .pathname
      .trim()
      .split('/')
      .filter(str => Boolean(str)); // remove falsy values
  }

  redirectTo(target: string): void {
    window.location.replace(target);
  }
}
