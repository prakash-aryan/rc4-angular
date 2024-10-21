import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class RC4CipherService {
  private n: number = 1;
  private stateVector: number[] = [];
  private keyStream: number[] = [];
  private ksa_steps: string = '';
  private prga_steps: string = '';

  constructor() { }

  setN(n: number) {
    this.n = n;
  }

  private binaryToDecimal(binary: string): number {
    return parseInt(binary, 2) || 0;
  }

  private decimalToBinary(decimal: number, width: number): string {
    return decimal.toString(2).padStart(width, '0');
  }

  private ksa(keyVector: number[]): void {
    this.stateVector = Array.from({ length: 256 }, (_, i) => i);
    let j = 0;
    this.ksa_steps = '';

    for (let i = 0; i < 256; i++) {
      j = (j + this.stateVector[i] + keyVector[i % keyVector.length]) % 256;
      [this.stateVector[i], this.stateVector[j]] = [this.stateVector[j], this.stateVector[i]];
      this.ksa_steps += `${i}  ${JSON.stringify(this.stateVector)}\n`;
    }

    this.ksa_steps += `\nThe initial permutation array is : ${JSON.stringify(this.stateVector)}\n`;
  }

  private prga(length: number): void {
    let i = 0;
    let j = 0;
    this.keyStream = [];
    this.prga_steps = '';

    for (let k = 0; k < length; k++) {
      i = (i + 1) % 256;
      j = (j + this.stateVector[i]) % 256;
      [this.stateVector[i], this.stateVector[j]] = [this.stateVector[j], this.stateVector[i]];
      const t = (this.stateVector[i] + this.stateVector[j]) % 256;
      this.keyStream.push(this.stateVector[t]);
      this.prga_steps += `${k}  ${JSON.stringify(this.stateVector)}\n`;
    }

    this.prga_steps += `Key stream : ${JSON.stringify(this.keyStream)}\n`;
  }

  private xor(text: number[], keyStream: number[]): number[] {
    return text.map((t, i) => t ^ keyStream[i]);
  }

  encrypt(plaintext: string, key: string): { ciphertext: string, steps: { ksa: string, prga: string } } {
    const plaintextVector = plaintext.match(new RegExp(`.{1,8}`, 'g'))?.map(chunk => this.binaryToDecimal(chunk)) || [];
    const keyVector = key.match(new RegExp(`.{1,8}`, 'g'))?.map(chunk => this.binaryToDecimal(chunk)) || [];

    this.ksa(keyVector);
    this.prga(plaintextVector.length);

    const encrypted = this.xor(plaintextVector, this.keyStream);
    const ciphertext = encrypted.map(b => this.decimalToBinary(b, 8)).join('');

    return {
      ciphertext,
      steps: {
        ksa: this.ksa_steps,
        prga: this.prga_steps
      }
    };
  }

  decrypt(ciphertext: string, key: string): { plaintext: string, steps: { ksa: string, prga: string } } {
    const ciphertextVector = ciphertext.match(new RegExp(`.{1,8}`, 'g'))?.map(chunk => this.binaryToDecimal(chunk)) || [];
    const keyVector = key.match(new RegExp(`.{1,8}`, 'g'))?.map(chunk => this.binaryToDecimal(chunk)) || [];

    this.ksa(keyVector);
    this.prga(ciphertextVector.length);

    const decrypted = this.xor(ciphertextVector, this.keyStream);
    const plaintext = decrypted.map(b => this.decimalToBinary(b, 8)).join('');

    return {
      plaintext,
      steps: {
        ksa: this.ksa_steps,
        prga: this.prga_steps
      }
    };
  }
}