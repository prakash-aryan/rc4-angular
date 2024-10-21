import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RC4CipherService } from './rc4-cipher.service';
import { CommonModule } from '@angular/common';
import { trigger, state, style, animate, transition } from '@angular/animations';

@Component({
  selector: 'app-rc4-cipher',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="main-container">
      <div class="explanation left-explanation">
        <h3>RC4 Algorithm Overview</h3>
        <p>RC4 (Rivest Cipher 4) is a stream cipher designed in 1987 by Ron Rivest for RSA Security. It's widely used in protocols like SSL/TLS for secure communications.</p>
        <h4>Key features:</h4>
        <ul>
          <li>Variable key length (1 to 256 bytes)</li>
          <li>Byte-oriented operations</li>
          <li>Simple and fast</li>
          <li>Used in various protocols and standards</li>
        </ul>
        <h4>How RC4 Works:</h4>
        <p>RC4 operates in two stages:</p>
        <ol>
          <li><strong>Key Scheduling Algorithm (KSA):</strong> This stage initializes the permutation in the state vector S using the key.</li>
          <li><strong>Pseudo-Random Generation Algorithm (PRGA):</strong> This stage generates the keystream which is then XORed with the plaintext to produce the ciphertext.</li>
        </ol>
        <p>The strength of RC4 lies in its simplicity and speed, making it suitable for software implementations. However, it's important to note that RC4 has known vulnerabilities when not implemented correctly, especially in the way the IVs are handled in protocols like WEP.</p>
      </div>

      <div class="container">
        <h1 class="main-title">Welcome to RC4 Cipher App</h1>
        <div class="content">
          <h2 class="section-title">RC4 Cipher Application</h2>
          
          <div class="input-group">
            <label for="n">
              <i class="fas fa-hashtag"></i> n (Plaintext and Key length will be a multiple of 4n bits):
            </label>
            <input type="number" id="n" [(ngModel)]="n" (ngModelChange)="updateN()" min="1" max="8">
          </div>

          <div class="input-group">
            <label for="plaintext">
              <i class="fas fa-file-alt"></i> Plaintext (binary, multiple of {{n * 4}} bits):
            </label>
            <textarea id="plaintext" [(ngModel)]="plaintext" rows="3" [placeholder]="'Enter binary string (e.g., ' + '1'.repeat(n * 4) + ')'"></textarea>
          </div>

          <div class="input-group">
            <label for="key">
              <i class="fas fa-key"></i> Key (binary, multiple of {{n * 4}} bits):
            </label>
            <textarea id="key" [(ngModel)]="key" rows="3" [placeholder]="'Enter binary string (e.g., ' + '1'.repeat(n * 4) + ')'"></textarea>
          </div>

          <div class="button-group">
            <button (click)="encrypt()" class="btn btn-primary" [disabled]="!isValidInput()">
              <i class="fas fa-lock"></i> Encrypt
            </button>
            <button (click)="decrypt()" class="btn btn-secondary" [disabled]="!isValidInput()">
              <i class="fas fa-unlock"></i> Decrypt
            </button>
            <button (click)="reset()" class="btn btn-danger">
              <i class="fas fa-redo"></i> Reset
            </button>
          </div>

          <div class="output-group" *ngIf="ciphertext">
            <label for="ciphertext">
              <i class="fas fa-shield-alt"></i> Ciphertext (binary):
            </label>
            <textarea id="ciphertext" [(ngModel)]="ciphertext" rows="3" readonly></textarea>
          </div>

          <div class="output-group" *ngIf="decrypted">
            <label for="decrypted">
              <i class="fas fa-file-alt"></i> Decrypted text (binary):
            </label>
            <textarea id="decrypted" [(ngModel)]="decrypted" rows="3" readonly></textarea>
          </div>

          <div class="collapsible">
            <button (click)="toggleKSA()" class="btn btn-info">
              <i class="fas" [ngClass]="showKSA ? 'fa-chevron-up' : 'fa-chevron-down'"></i> KSA Steps
            </button>
            <div [@expandCollapse]="showKSA ? 'expanded' : 'collapsed'" class="collapse-content">
              <pre>{{ksa_steps}}</pre>
            </div>
          </div>

          <div class="collapsible">
            <button (click)="togglePRGA()" class="btn btn-info">
              <i class="fas" [ngClass]="showPRGA ? 'fa-chevron-up' : 'fa-chevron-down'"></i> PRGA Steps
            </button>
            <div [@expandCollapse]="showPRGA ? 'expanded' : 'collapsed'" class="collapse-content">
              <pre>{{prga_steps}}</pre>
            </div>
          </div>
        </div>
      </div>

      <div class="explanation right-explanation">
        <h3>RC4 Process Steps in Detail</h3>
        <ol>
          <li>
            <strong>Key Scheduling Algorithm (KSA):</strong>
            <p>The KSA initializes the permutation in the state vector S. This is done by:</p>
            <ul>
              <li>Initializing S to the identity permutation</li>
              <li>Using the secret key to produce the initial permutation of S</li>
              <li>The key is typically 40 to 2048 bits long</li>
            </ul>
          </li>
          <li>
            <strong>Pseudo-Random Generation Algorithm (PRGA):</strong>
            <p>The PRGA generates the keystream. For each byte of the keystream, the PRGA:</p>
            <ul>
              <li>Updates the permutation S</li>
              <li>Outputs a byte of the keystream K</li>
            </ul>
          </li>
          <li>
            <strong>XOR Operation:</strong>
            <p>The keystream is then XORed with the plaintext to produce the ciphertext. This process:</p>
            <ul>
              <li>Combines each byte of the plaintext with a byte of the keystream</li>
              <li>Is reversible, allowing for decryption</li>
            </ul>
          </li>
        </ol>
        <p>Decryption follows the same process, XORing the ciphertext with the keystream to recover the plaintext. The key aspect of RC4's security is that the same keystream should never be used more than once.</p>
        <h4>Security Considerations:</h4>
        <p>While RC4 is simple and fast, it has vulnerabilities:</p>
        <ul>
          <li>Weak keys can lead to predictable outputs</li>
          <li>The first few bytes of the keystream can reveal information about the key</li>
          <li>It's susceptible to related-key attacks</li>
        </ul>
        <p>For these reasons, many modern applications prefer AES or ChaCha20 over RC4.</p>
      </div>
    </div>
  `,
  styles: [`
    .main-container {
      display: flex;
      min-height: 100vh;
      background-color: #1e1e1e;
      color: #e0e0e0;
      font-family: 'Roboto', sans-serif;
    }
    .container {
      flex: 2;
      max-width: 800px;
      padding: 20px;
    }
    .explanation {
      flex: 1;
      padding: 20px;
      background-color: #2d2d2d;
      overflow-y: auto;
      max-height: 100vh;
    }
    .left-explanation, .right-explanation {
      border: 1px solid #444;
      border-radius: 5px;
      margin: 10px;
      padding: 15px;
    }
    .main-title {
      text-align: center;
      color: #ffffff;
      margin-bottom: 20px;
      font-size: 2.5rem;
      text-shadow: 2px 2px 4px rgba(0,0,0,0.5);
    }
    .content {
      background-color: #2d2d2d;
      border-radius: 10px;
      box-shadow: 0 4px 6px rgba(0,0,0,0.1);
      padding: 30px;
    }
    .section-title {
      text-align: center;
      color: #ffffff;
      margin-bottom: 20px;
      font-size: 1.8rem;
    }
    .input-group, .output-group {
      margin-bottom: 20px;
    }
    label {
      display: block;
      margin-bottom: 8px;
      color: #b0b0b0;
      font-weight: bold;
    }
    input[type="number"], textarea {
      width: 100%;
      padding: 10px;
      border: 1px solid #444;
      border-radius: 5px;
      font-size: 14px;
      background-color: #3a3a3a;
      color: #e0e0e0;
      transition: border-color 0.3s ease;
    }
    input[type="number"]:focus, textarea:focus {
      border-color: #0056b3;
      outline: none;
    }
    .button-group {
      display: flex;
      justify-content: space-between;
      margin-bottom: 20px;
    }
    .btn {
      padding: 10px 20px;
      border: none;
      border-radius: 5px;
      cursor: pointer;
      font-size: 16px;
      transition: all 0.3s ease;
    }
    .btn:not(:disabled):hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 6px rgba(0,0,0,0.1);
    }
    .btn:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }
    .btn-primary {
      background-color: #0056b3;
      color: white;
    }
    .btn-secondary {
      background-color: #28a745;
      color: white;
    }
    .btn-danger {
      background-color: #dc3545;
      color: white;
    }
    .btn-info {
      background-color: #17a2b8;
      color: white;
      width: 100%;
      text-align: left;
      margin-bottom: 10px;
    }
    .collapsible .collapse-content {
      background-color: #3a3a3a;
      border-radius: 5px;
      overflow: hidden;
    }
    pre {
      white-space: pre-wrap;
      word-wrap: break-word;
      font-size: 14px;
      color: #b0b0b0;
      margin: 0;
      padding: 15px;
    }
    h3, h4 {
      color: #ffffff;
      margin-top: 20px;
    }
    ul, ol {
      padding-left: 20px;
      margin-bottom: 15px;
    }
    p {
      margin-bottom: 15px;
    }
    @media (max-width: 1200px) {
      .main-container {
        flex-direction: column;
      }
      .explanation {
        max-height: none;
      }
    }
    @media (max-width: 768px) {
      .button-group {
        flex-direction: column;
      }
      .btn {
        margin-bottom: 10px;
        width: 100%;
      }
    }
  `],
  animations: [
    trigger('expandCollapse', [
      state('collapsed', style({ height: '0px', opacity: 0 })),
      state('expanded', style({ height: '*', opacity: 1 })),
      transition('expanded <=> collapsed', animate('300ms ease-in-out')),
    ]),
  ],
  providers: [RC4CipherService]
})
export class RC4CipherComponent {
  n: number = 1;
  plaintext: string = '';
  key: string = '';
  ciphertext: string = '';
  decrypted: string = '';
  ksa_steps: string = '';
  prga_steps: string = '';
  showKSA: boolean = false;
  showPRGA: boolean = false;

  constructor(private rc4Service: RC4CipherService) {}

  updateN() {
    this.rc4Service.setN(this.n);
  }

  encrypt() {
    const result = this.rc4Service.encrypt(this.plaintext, this.key);
    this.ciphertext = result.ciphertext;
    this.ksa_steps = result.steps.ksa;
    this.prga_steps = result.steps.prga;
  }

  decrypt() {
    const result = this.rc4Service.decrypt(this.ciphertext, this.key);
    this.decrypted = result.plaintext;
    this.ksa_steps = result.steps.ksa;
    this.prga_steps = result.steps.prga;
  }

  reset() {
    this.n = 1;
    this.plaintext = '';
    this.key = '';
    this.ciphertext = '';
    this.decrypted = '';
    this.ksa_steps = '';
    this.prga_steps = '';
    this.showKSA = false;
    this.showPRGA = false;
    this.rc4Service.setN(this.n);
  }

  toggleKSA() {
    this.showKSA = !this.showKSA;
  }

  togglePRGA() {
    this.showPRGA = !this.showPRGA;
  }

  isValidInput(): boolean {
    const isValidBinary = (str: string) => /^[01]+$/.test(str);
    return this.plaintext.length > 0 && this.key.length > 0 &&
           this.plaintext.length % (this.n * 4) === 0 &&
           this.key.length % (this.n * 4) === 0 &&
           isValidBinary(this.plaintext) && isValidBinary(this.key);
  }
}