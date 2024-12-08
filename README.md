# Automated Insurance Claim System using Lit Protocol

## Overview
This project is a decentralized insurance claim system that uses zk-SNARKs, Lit Protocol, and blockchain technology to automate the verification and claim distribution process. By combining zero-knowledge proofs, secure identity verification, and decentralized automation, we streamline the process for users to claim insurance benefits efficiently and securely.

---

## Features
- **Privacy-Preserving Verification**: User eligibility is verified using zk-SNARKs to ensure the privacy of sensitive data.
- **Automated Claim Distribution**: The AI agent of the Lit Protocol handles claim distribution automatically upon verification.
- **Decentralized Identity Management**: Integration with Privado ensures secure identity verification.
- **Seamless Integration**: Uses Akave for secure data storage and Polygon zkEVM for decentralized execution.

---

## How It Works
### 1. User Onboarding
- The user’s identity is verified using decentralized identity solutions such as Privado.
- A Decentralized Identifier (DID) is generated for each user, which links their Electronic Health Record (EHR).

### 2. Eligibility Verification
- The hospital generates a zk-SNARK proof based on the user's EHR.
- The proof and public signals are submitted to the smart contract on Polygon zkEVM for verification.

### 3. Automated Claim Distribution
- Upon successful verification, the Lit Protocol AI agent initiates the transaction automatically.
- The insurance claim amount is transferred to the user’s wallet without any manual intervention.

---

## Technologies Used
### Blockchain
- **Polygon zkEVM**: For decentralized and scalable execution of zk-SNARK proofs.

### Privacy & Identity
- **zk-SNARKs**: To verify eligibility without exposing sensitive data.
- **Privado**: For secure and decentralized identity verification.

### Automation
- **Lit Protocol**: To automate claim transactions using AI agents.

### Data Storage
- **Akave**: For securely storing project-related data.

---

## Installation

### Backend Setup
1. Clone the repository:
   ```bash
   git clone https://github.com/JijoJohny/Zk-Claim.git
   cd insurance-claim-system/backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   - Create a `.env` file and add the following:
     ```env
     MONGOdb_URL = ''
     PRIVATE_KEY=''
     RPC_URL='https://rpc.cardona.zkevm-rpc.com'
     CONTRACT_ADDRESS='0xdC94B0D15D97c42c5F84609f200C16dAa7EC301D'
     ETHEREUM_PRIVATE_KEY = ''


     ```

4. Start the backend application:
   ```bash
   node app.js
   ```

### Frontend Setup
1. Navigate to the frontend directory:
   ```bash
   cd ZK-Claim/frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the frontend application:
   ```bash
   npm start
   ```

---

## Contributors
- **Anjana KJ** (Project Lead)
- **Jijo Johny**
- **Anson Antony**

---

## License
This project is licensed under the MIT License.

---

## Acknowledgments
- Special thanks to **Polygon** for their zkEVM and developer support.
- **Lit Protocol** team for their guidance on automation and integration.
- **Akave** for secure data storage solutions.

