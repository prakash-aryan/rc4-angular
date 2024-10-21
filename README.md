# RC4 Cipher Application

## Overview

This project is an interactive web application that demonstrates the RC4 (Rivest Cipher 4) encryption algorithm. It allows users to encrypt and decrypt messages using the RC4 cipher, visualize the Key Scheduling Algorithm (KSA) and Pseudo-Random Generation Algorithm (PRGA) steps, and learn about the algorithm's features and security considerations.

![Screenshot from 2024-10-22 00-19-27](https://github.com/user-attachments/assets/c124fca1-5569-4256-bc81-9b6a05d44fbc)


## Features

- Interactive RC4 encryption and decryption
- Adjustable 'n' value for plaintext and key length (multiple of 4n bits)
- Real-time input validation for binary strings
- Visualization of KSA and PRGA steps
- Detailed explanations of the RC4 algorithm and its processes
- Responsive design for various screen sizes
- Dark mode UI for better readability

## Technologies Used

- Angular 18
- TypeScript
- HTML5
- CSS3
- Font Awesome for icons

## Prerequisites

Before you begin, ensure you have met the following requirements:

- Node.js (v14.0.0 or later)
- npm (v6.0.0 or later)
- Angular CLI (v16.0.0 or later)

## Installation

To install the RC4 Cipher Application, follow these steps:

1. Clone the repository:
   ```
   git clone git@github.com:prakash-aryan/rc4-angular.git
   ```

2. Navigate to the project directory:
   ```
   cd rc4-cipher-app
   ```

3. Install the dependencies:
   ```
   npm install
   ```

## Usage

To run the application locally:

1. Start the development server:
   ```
   ng serve
   ```

2. Open your web browser and navigate to `http://localhost:4200`

3. Use the interface to input plaintext and key in binary format, adjust the 'n' value, and perform encryption or decryption.

4. Explore the KSA and PRGA steps by expanding the respective sections.

## How It Works

The RC4 Cipher Application implements the RC4 algorithm, which consists of two main parts:

1. **Key Scheduling Algorithm (KSA)**: Initializes the permutation in the state vector S using the key.
2. **Pseudo-Random Generation Algorithm (PRGA)**: Generates the keystream which is then XORed with the plaintext to produce the ciphertext.

The application allows users to input plaintext and key in binary format, performs the encryption/decryption, and displays the results. It also provides detailed explanations of each step in the process.

## Security Considerations

While this application demonstrates the RC4 algorithm, it's important to note that RC4 has known vulnerabilities and is not recommended for use in new systems. Some security considerations include:

- Weak keys can lead to predictable outputs
- The first few bytes of the keystream can reveal information about the key
- It's susceptible to related-key attacks

For production systems, modern encryption algorithms like AES or ChaCha20 are recommended.
