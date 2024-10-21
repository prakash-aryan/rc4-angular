import { Component } from '@angular/core';
import { RC4CipherComponent } from './rc4-cipher.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RC4CipherComponent],
  template: '<app-rc4-cipher></app-rc4-cipher>',
  styles: [`
    :host {
      display: block;
      min-height: 100vh;
      background-color: #1e1e1e;
    }
  `]
})
export class AppComponent { }