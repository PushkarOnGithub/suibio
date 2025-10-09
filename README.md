# SUI-BIO // Decentralized Neural Identity

Sui-Bio is a futuristic, decentralized profile management system built on the **Sui Network**. It allows users to mint their own on-chain "neural identity" (biography and social links) and displays human-readable **SuiNS** names for a premium user experience.

![Sui-Bio Interface](public/og-image.png)

## 🚀 Features

- **On-Chain Profiles**: Mint and update your profile (name, bio, links) directly on the Sui blockchain.
- **SuiNS Integration**: Automatically resolves and displays your `.sui` name instead of a raw `0x...` address.
- **Tipping System**: Supporter-to-creator tipping in SUI directly through the profile interface.
- **Futuristic UI**: High-fidelity glassmorphism design with staggered animations and neon accents.
- **Real-time Synchronization**: Instant UI updates reflecting on-chain state changes using `@mysten/dapp-kit`.

## 🛠 Tech Stack

- **Smart Contract**: Move (Sui Framework 2024 Edition)
- **Frontend**: Next.js 15+ (App Router)
- **Blockchain Interaction**: `@mysten/sui`, `@mysten/dapp-kit`
- **State Management**: `@tanstack/react-query`
- **Styling**: Vanilla CSS with modern Glassmorphism patterns
- **Icons**: Lucide React

## 🏁 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18+)
- [Sui CLI](https://docs.sui.io/guides/developer/getting-started/sui-install) (for contract deployment)
- A Sui Wallet (e.g., Sui Wallet, Surf, or OKX)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/PushkarOnGithub/suibio.git
   cd suibio
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure environment variables:
   Create a `.env` file in the root and add your package ID:
   ```env
   NEXT_PUBLIC_PACKAGE_ID=0xYOUR_DEPLOYED_PACKAGE_ID
   ```

4. Run the development server:
   ```bash
   npm run dev
   ```

Open [http://localhost:3000](http://localhost:3000) to view your decentralized identity.

## 📦 Smart Contract

The core logic resides in the `sources/suibio.move` file. It defines the `Profile` object and functions for:
- `create_profile`: Minting a new identity.
- `update_bio`: Modifying user biography.
- `update_links`: Managing social connections.

To build the contract:
```bash
sui move build
```

## 📜 License

Distributed under the MIT License. See `LICENSE` for more information.

---
Built with ⚡ on Sui by [PushkarOnGithub](https://github.com/PushkarOnGithub)
