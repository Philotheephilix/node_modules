# StockRoot - Supply Chain Management Platform

StockRoot is a blockchain-based supply chain management platform that enables end-to-end tracking of products from production to purchase. The platform uses smart contracts to tokenize real-world assets and provide transparency throughout the supply chain.

## Contract Addresses

### Main Contracts (Rootstock Testnet)
- **TokenFactory**: `0xf88C501cBA1DB713c080F886c74DB87ffd616FB2`
- **SampleTokenFactory**: `0xA94B41B5038196ED019453FCC82Ea8fD0764767c`

## Features

- **End-to-End Tracking**: Track products from production to purchase
- **Role-Based Access**: Different dashboards for producers, suppliers, retailers, consumers, and government
- **Tokenized Assets**: Products are represented as ERC-20 tokens
- **Identity Verification**: Self Protocol integration for secure identity verification
- **Blockchain Integration**: Built on Rootstock Testnet with Alchemy API integration

## Tech Stack

- **Frontend**: Next.js, React, TypeScript, Tailwind CSS
- **Smart Contracts**: Solidity, Hardhat
- **Blockchain**: Rootstock Testnet
- **Identity**: Self Protocol
- **API**: Alchemy

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- MetaMask or another Web3 wallet
- Rootstock Testnet configured in your wallet

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/stockroot.git
   cd stockroot
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. Create a `.env` file based on `.env.example`:
   ```
   PRIVATE_KEY=your_private_key
   INFURA_API_KEY=your_infura_api_key
   ETHERSCAN_API_KEY=your_etherscan_api_key
   NEXT_PUBLIC_RPC_URL=https://rpc.testnet.rootstock.io/your_api_key
   NEXT_PUBLIC_TOKEN_FACTORY_ADDRESS=0xf88C501cBA1DB713c080F886c74DB87ffd616FB2
   ```

4. Compile smart contracts:
   ```bash
   npm run compile
   # or
   yarn compile
   # or
   pnpm compile
   ```

5. Start the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   ```

6. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

- `/app`: Next.js application code
  - `/dashboard`: Role-based dashboards
    - `/consumer`: Consumer dashboard
    - `/producer`: Producer dashboard
    - `/retail`: Retailer dashboard
    - `/supplier`: Supplier dashboard
    - `/government`: Government dashboard
  - `/api`: API routes
  - `/self`: Self Protocol integration
- `/contracts`: Smart contracts
  - `TokenFactory.sol`: Main token factory contract
  - `SupplyChainToken.sol`: Token contract for supply chain assets
  - `SampleTokenFactory.sol`: Simplified token factory for testing
  - `SampleSupplyToken.sol`: Simplified token contract for testing
- `/components`: Reusable UI components
- `/public`: Static assets

## Smart Contracts

### TokenFactory

The main contract that manages the creation and tracking of supply chain tokens. It includes role-based access control and inventory tracking.

### SupplyChainToken

An ERC-20 token that represents a product in the supply chain. It includes metadata about the product and transfer restrictions based on roles.

### SampleTokenFactory

A simplified version of the TokenFactory contract for testing and development.

### SampleSupplyToken

A simplified version of the SupplyChainToken contract for testing and development.

## Deployment

To deploy the contracts to the Rootstock Testnet:

```bash
npx hardhat run scripts/deploy.js --network rootstock
```

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgements

- [OpenZeppelin](https://openzeppelin.com/) for smart contract libraries
- [Self Protocol](https://self.id/) for identity verification
- [Alchemy](https://www.alchemy.com/) for blockchain API
- [Rootstock](https://www.rsk.co/) for the blockchain network

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
