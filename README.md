# 📡 Yield Ticker

> Real-time Bloomberg-style terminal for DeFi yield. Track live vault flows, APY momentum, and whale movements across 60+ chains powered by LI.FI Earn — with one-click deposits built in.

---

## Table of Contents

- [Overview](#overview)
- [Why Yield Ticker](#why-yield-ticker)
- [Features](#features)
- [How It Works](#how-it-works)
- [LI.FI Earn Integration](#lifi-earn-integration)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Usage Guide](#usage-guide)
- [Folder Structure](#folder-structure)
- [Hackathon Track](#hackathon-track)
- [Roadmap](#roadmap)
- [License](#license)

---

## Overview

Yield Ticker is a professional-grade, real-time yield intelligence terminal built on top of [LI.FI Earn](https://docs.li.fi/earn/overview). It gives DeFi users and treasury managers the same kind of data density and signal clarity that Bloomberg terminals give TradFi traders — but for on-chain yield.

No more tab-hopping across Morpho, Aave, Euler, Pendle, and Ethena dashboards. No more manually comparing APYs chain by chain. Yield Ticker aggregates everything into one live, scannable interface — and when you spot an opportunity, you deposit in one click.

---

## Why Yield Ticker

DeFi yield is fragmented. There are 20+ vault protocols, 60+ chains, and thousands of individual vaults — but no unified view of where capital is flowing, which vaults are gaining momentum, and where whales are moving. Most existing dashboards are:

- **Static** — they show a snapshot, not a live feed
- **Single-chain** — they don't show cross-chain capital rotation
- **Deposit-only** — they show data but make you leave to act on it

Yield Ticker solves all three. It is a live data layer with embedded execution.

---

## Features

### 🟢 Live Vault Feed
- Real-time ticker of deposit and withdrawal events across all LI.FI-supported vaults
- Scrolling feed styled like a financial market terminal
- Each event shows: vault name, protocol, chain, amount, wallet (truncated), and timestamp

### 📊 APY Momentum Tracker
- Tracks APY changes over time for each vault
- Shows 1h, 6h, and 24h APY delta (rising / falling / stable)
- Color-coded momentum indicators — green for rising, red for falling, grey for stable
- Sortable by current APY, momentum score, or TVL

### 🐋 Whale Detector
- Flags deposits and withdrawals above configurable thresholds (default: $50,000+)
- Dedicated whale activity panel with real-time alerts
- Shows whale wallet address, amount, vault, and chain
- Optional sound alert on whale detection

### 🌐 Cross-Chain Capital Rotation Map
- Visual heatmap of capital inflows vs outflows per chain over the last 24 hours
- Highlights which chains are gaining liquidity and which are bleeding it
- Helps users anticipate APY movements before they happen

### ⚡ One-Click Composer Entry
- Every vault row has a "Deposit" button
- Uses LI.FI Earn Composer for single-transaction swap + deposit
- No leaving the terminal — spot the opportunity, act on it instantly
- Supports any input token via LI.FI's cross-chain routing

### 🔍 Vault Discovery & Filtering
- Filter vaults by: chain, protocol, token, minimum APY, TVL range
- Search bar for quick vault lookup
- Watchlist feature to pin your favourite vaults to the top

### 📈 Vault Detail Drawer
- Click any vault to open a side drawer with full details
- Historical APY chart (7-day)
- Protocol risk metadata (audit status, age, TVL history)
- Recent large transactions
- Direct deposit input with Composer integration

---

## How It Works

```
User Opens Yield Ticker
        │
        ▼
LI.FI Earn API ──► Vault Discovery (protocols, chains, APY, TVL)
        │
        ▼
WebSocket / Polling Layer ──► Real-time event feed (deposits, withdrawals)
        │
        ▼
Signal Processing Engine
  ├── APY Delta Calculator    (1h / 6h / 24h momentum)
  ├── Whale Threshold Filter  ($50k+ transactions flagged)
  └── Chain Flow Aggregator   (net inflow/outflow per chain)
        │
        ▼
Terminal UI
  ├── Live Ticker Feed
  ├── APY Momentum Table
  ├── Whale Alert Panel
  ├── Capital Rotation Heatmap
  └── One-Click Deposit (LI.FI Composer)
```

### Data Pipeline

1. **Vault Discovery** — On app load, Yield Ticker fetches all available vaults from the LI.FI Earn API, including protocol metadata, supported chains, current APY, and TVL.

2. **Live Event Polling** — The app polls the LI.FI Earn API at a configurable interval (default: 15 seconds) to fetch the latest deposit and withdrawal transactions. Events are pushed into a rolling feed.

3. **Signal Processing** — Each new batch of events is processed by three signal engines:
   - The **APY Delta Calculator** compares the current APY to snapshots from 1h, 6h, and 24h ago to compute momentum.
   - The **Whale Filter** checks each transaction against the configured threshold and routes qualifying events to the whale panel.
   - The **Chain Flow Aggregator** maintains a rolling 24h net flow tally per chain for the rotation map.

4. **Rendering** — All signals feed into a React state tree and render in real time across the terminal panels.

5. **Execution** — When a user clicks "Deposit", the Composer widget opens pre-filled with the selected vault's contract details, and LI.FI handles the swap-and-deposit routing.

---

## LI.FI Earn Integration

Yield Ticker is built entirely on top of **LI.FI Earn**. Here is how each API capability is used:

| LI.FI Earn Feature | How Yield Ticker Uses It |
|---|---|
| **Vault Discovery** | Powers the full vault list — protocols, chains, APY, TVL |
| **APY Data** | Used for the momentum tracker and historical APY charts |
| **Transaction Feed** | Powers the live ticker and whale detector |
| **Composer (one-click deposit)** | Embedded directly in vault rows and the detail drawer |
| **Multi-chain Support (60+ chains)** | Powers the cross-chain capital rotation map |
| **Multi-protocol Support (20+ vaults)** | Enables cross-protocol APY comparison in one view |

API Docs: https://docs.li.fi/earn/overview

---

## Tech Stack

| Layer | Technology |
|---|---|
| **Framework** | Next.js(App Router) |
| **Language** | TypeScript |
| **Styling** | Tailwind CSS |
| **Charts** | Recharts |
| **State Management** | Zustand |
| **Data Fetching** | TanStack Query (React Query) |
| **Wallet Connection** | RainbowKit + wagmi |
| **LI.FI Integration** | LI.FI Earn API + Composer SDK |
| **Deployment** | Vercel |

---

## Getting Started

### Prerequisites

- Node.js v18+
- npm or yarn
- A wallet (MetaMask or any WalletConnect-compatible wallet) for live deposits

### Installation

```bash
# Clone the repository
git clone https://github.com/teewa56/yield-ticker.git
cd yield-ticker

# Install dependencies
npm install

# Copy environment variables
cp .env.example .env.local

# Start the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the terminal.

---

## Environment Variables

```env
# LI.FI API
NEXT_PUBLIC_LIFI_API_KEY=your_lifi_api_key_here
NEXT_PUBLIC_LIFI_API_URL=https://li.quest/v1

# Whale Detection Threshold (in USD)
NEXT_PUBLIC_WHALE_THRESHOLD=50000

# Polling Interval (in milliseconds)
NEXT_PUBLIC_POLL_INTERVAL=15000

# WalletConnect Project ID (for RainbowKit)
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_walletconnect_project_id
```

---

## Usage Guide

### Reading the Terminal

- **Top Bar** — Global stats: total TVL tracked, number of active vaults, chains online, and a live event counter.
- **Left Panel (Live Feed)** — Scrolling real-time deposit/withdrawal events. Deposits are green, withdrawals are red. Whale events are highlighted with a 🐋 badge.
- **Center Panel (APY Table)** — All vaults sorted by APY momentum by default. Each row shows protocol, chain, token, current APY, APY delta (1h/6h/24h), TVL, and a Deposit button.
- **Right Panel (Whale Alerts)** — Dedicated feed of large transactions only ($50k+). Includes wallet address, amount, vault, and time elapsed.
- **Bottom Panel (Capital Rotation Map)** — Heatmap of net capital flow per chain over 24 hours.

### Making a Deposit

1. Connect your wallet using the "Connect Wallet" button in the top right.
2. Find a vault in the APY table — filter or sort as needed.
3. Click **Deposit** on any vault row.
4. The Composer drawer opens pre-filled with the vault details.
5. Enter your deposit amount and input token.
6. Confirm the transaction — LI.FI handles the swap + deposit in one transaction.

### Configuring Alerts

- Click the ⚙️ settings icon to open preferences.
- Adjust the whale detection threshold.
- Toggle sound alerts on/off.
- Set your preferred polling interval.
- Save a watchlist of vaults you want pinned to the top.

---

## Folder Structure

```
yield-ticker/
├── public/
│   ├── fonts/                        # Custom terminal fonts
│   └── favicon.ico
│
── app/                          # Next.js App Router
│   ├── layout.tsx                # Root layout (providers, fonts)
│   ├── page.tsx                  # Main terminal page
│   └── globals.css               # Global styles + CSS variables
│   │
├── components/
|   ├── terminal/
|   │   ├── TopBar.tsx            # Global stats bar
|   │   ├── LiveFeed.tsx          # Scrolling deposit/withdrawal ticker
|   │   ├── APYTable.tsx          # Vault list with momentum indicators
|   │   ├── WhalePanel.tsx        # Large transaction alert feed
|   │   ├── RotationMap.tsx       # Cross-chain capital heatmap
|   │   └── VaultDrawer.tsx       # Vault detail side drawer
|   │
├── composer/
|   │   ├── ComposerWidget.tsx    # LI.FI one-click deposit widget
|   │   └── DepositButton.tsx     # Deposit CTA on vault rows
|   │
├── ui/
|   │   ├── Badge.tsx             # Status / chain / protocol badges
|   │   ├── MomentumIndicator.tsx # APY delta arrows + colors
|   │   ├── WhaleBadge.tsx        # Whale flag component
|   │   ├── ChainIcon.tsx         # Chain logo renderer
|   │   └── ProtocolIcon.tsx      # Protocol logo renderer
|   │
└── layout/
|       ├── Sidebar.tsx           # Watchlist + filter sidebar
|       └── SettingsModal.tsx     # User preferences modal
├── hooks/
|   ├── useVaults.ts              # Fetch + cache vault list from LI.FI
|   ├── useLiveFeed.ts            # Poll live deposit/withdrawal events
|   ├── useAPYMomentum.ts         # Compute APY delta over time windows
|   ├── useWhaleDetector.ts       # Filter events by threshold
|   └── useChainFlows.ts          # Aggregate net flows per chain
│   │
├── lib/
|   ├── lifi/
|   │   ├── client.ts             # LI.FI Earn API client + typed fetchers
|   │   ├── composer.ts           # Composer integration helpers
|   │   └── types.ts              # LI.FI API response types
|   │
|   ├── signals/
|   │   ├── apyDelta.ts           # APY momentum calculation logic
|   │   ├── whaleFilter.ts        # Whale detection logic
|   │   └── chainAggregator.ts    # Cross-chain flow aggregation
|   │
|   └── utils.ts                  # Shared helpers (formatting, math)
├── store/
|   ├── terminalStore.ts          # Zustand store for terminal state
|   ├── watchlistStore.ts         # Persisted watchlist state
|   └── settingsStore.ts          # User preferences state
│   │
└── types/
│       ├── vault.ts                  # Vault and event type definitions
│       └── chain.ts                  # Chain type definitions
│
├── .env.example                      # Environment variable template
├── .env.local                        # Local environment variables (gitignored)
├── next.config.ts                    # Next.js configuration
├── tailwind.config.ts                # Tailwind configuration
├── tsconfig.json                     # TypeScript configuration
├── package.json
└── README.md
```

---

## Hackathon Track

**Primary Track: 🏗️ Yield Builder**

Yield Ticker is a yield intelligence product that directly solves the fragmentation problem in DeFi yield. It integrates deeply with the LI.FI Earn API for vault discovery, real-time data, and one-click Composer execution.

**Also eligible for: 🃏 Open Track** — the Bloomberg terminal concept applied to DeFi yield is a novel product category not covered by existing tools.

---

## Roadmap

These are features planned beyond the hackathon submission:

- **Yield Alerts** — set APY threshold alerts via Telegram or email
- **Portfolio Tracker** — connect wallet to see all active vault positions in one view
- **AI Yield Advisor** — natural language query layer ("show me the safest USDC vault above 6% on Arbitrum")
- **Historical Analytics** — longer APY history charts per vault
- **Mobile App** — React Native version of the terminal for on-the-go monitoring

---

## License

MIT License. See [LICENSE](./LICENSE) for details.

---

*Built for DeFi Mullet Hackathon #1 — Builder Edition. Powered by [LI.FI Earn](https://docs.li.fi/earn/overview).*