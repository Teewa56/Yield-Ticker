export type Chain =
  | 'ethereum'
  | 'arbitrum'
  | 'optimism'
  | 'polygon'
  | 'base'
  | 'avalanche'
  | 'bnb'
  | 'gnosis'
  | 'scroll'
  | 'linea'
  | 'zksync'
  | 'mantle'
  | 'blast'
  | 'mode'
  | 'fraxtal'
  | 'metis'
  | 'fantom'
  | 'celo'
  | 'moonbeam'
  | 'cronos'

export interface ChainInfo {
  id: number
  name: Chain
  displayName: string
  color: string
  nativeCurrency: string
  rpcUrl: string
  explorerUrl: string
  logoUri: string
}

export interface ChainFlow {
  chain: Chain
  chainId: number
  netFlowUsd: number
  inflowUsd: number
  outflowUsd: number
  txCount: number
  dominantProtocol: string
}

export const CHAIN_CONFIG: Record<Chain, ChainInfo> = {
  ethereum: {
    id: 1,
    name: 'ethereum',
    displayName: 'Ethereum',
    color: '#627EEA',
    nativeCurrency: 'ETH',
    rpcUrl: 'https://eth.llamarpc.com',
    explorerUrl: 'https://etherscan.io',
    logoUri: 'https://icons.llamao.fi/icons/chains/rsz_ethereum.jpg',
  },
  arbitrum: {
    id: 42161,
    name: 'arbitrum',
    displayName: 'Arbitrum',
    color: '#28A0F0',
    nativeCurrency: 'ETH',
    rpcUrl: 'https://arb1.arbitrum.io/rpc',
    explorerUrl: 'https://arbiscan.io',
    logoUri: 'https://icons.llamao.fi/icons/chains/rsz_arbitrum.jpg',
  },
  optimism: {
    id: 10,
    name: 'optimism',
    displayName: 'Optimism',
    color: '#FF0420',
    nativeCurrency: 'ETH',
    rpcUrl: 'https://mainnet.optimism.io',
    explorerUrl: 'https://optimistic.etherscan.io',
    logoUri: 'https://icons.llamao.fi/icons/chains/rsz_optimism.jpg',
  },
  polygon: {
    id: 137,
    name: 'polygon',
    displayName: 'Polygon',
    color: '#8247E5',
    nativeCurrency: 'MATIC',
    rpcUrl: 'https://polygon-rpc.com',
    explorerUrl: 'https://polygonscan.com',
    logoUri: 'https://icons.llamao.fi/icons/chains/rsz_polygon.jpg',
  },
  base: {
    id: 8453,
    name: 'base',
    displayName: 'Base',
    color: '#0052FF',
    nativeCurrency: 'ETH',
    rpcUrl: 'https://mainnet.base.org',
    explorerUrl: 'https://basescan.org',
    logoUri: 'https://icons.llamao.fi/icons/chains/rsz_base.jpg',
  },
  avalanche: {
    id: 43114,
    name: 'avalanche',
    displayName: 'Avalanche',
    color: '#E84142',
    nativeCurrency: 'AVAX',
    rpcUrl: 'https://api.avax.network/ext/bc/C/rpc',
    explorerUrl: 'https://snowtrace.io',
    logoUri: 'https://icons.llamao.fi/icons/chains/rsz_avalanche.jpg',
  },
  bnb: {
    id: 56,
    name: 'bnb',
    displayName: 'BNB Chain',
    color: '#F0B90B',
    nativeCurrency: 'BNB',
    rpcUrl: 'https://bsc-dataseed.binance.org',
    explorerUrl: 'https://bscscan.com',
    logoUri: 'https://icons.llamao.fi/icons/chains/rsz_binance.jpg',
  },
  gnosis: {
    id: 100,
    name: 'gnosis',
    displayName: 'Gnosis',
    color: '#48A9A6',
    nativeCurrency: 'xDAI',
    rpcUrl: 'https://rpc.gnosischain.com',
    explorerUrl: 'https://gnosisscan.io',
    logoUri: 'https://icons.llamao.fi/icons/chains/rsz_xdai.jpg',
  },
  scroll: {
    id: 534352,
    name: 'scroll',
    displayName: 'Scroll',
    color: '#FFDBB0',
    nativeCurrency: 'ETH',
    rpcUrl: 'https://rpc.scroll.io',
    explorerUrl: 'https://scrollscan.com',
    logoUri: 'https://icons.llamao.fi/icons/chains/rsz_scroll.jpg',
  },
  linea: {
    id: 59144,
    name: 'linea',
    displayName: 'Linea',
    color: '#61DFFF',
    nativeCurrency: 'ETH',
    rpcUrl: 'https://rpc.linea.build',
    explorerUrl: 'https://lineascan.build',
    logoUri: 'https://icons.llamao.fi/icons/chains/rsz_linea.jpg',
  },
  zksync: {
    id: 324,
    name: 'zksync',
    displayName: 'zkSync Era',
    color: '#8C8DFC',
    nativeCurrency: 'ETH',
    rpcUrl: 'https://mainnet.era.zksync.io',
    explorerUrl: 'https://explorer.zksync.io',
    logoUri: 'https://icons.llamao.fi/icons/chains/rsz_zksync%20era.jpg',
  },
  mantle: {
    id: 5000,
    name: 'mantle',
    displayName: 'Mantle',
    color: '#000000',
    nativeCurrency: 'MNT',
    rpcUrl: 'https://rpc.mantle.xyz',
    explorerUrl: 'https://explorer.mantle.xyz',
    logoUri: 'https://icons.llamao.fi/icons/chains/rsz_mantle.jpg',
  },
  blast: {
    id: 81457,
    name: 'blast',
    displayName: 'Blast',
    color: '#FCFC03',
    nativeCurrency: 'ETH',
    rpcUrl: 'https://rpc.blast.io',
    explorerUrl: 'https://blastscan.io',
    logoUri: 'https://icons.llamao.fi/icons/chains/rsz_blast.jpg',
  },
  mode: {
    id: 34443,
    name: 'mode',
    displayName: 'Mode',
    color: '#DFFE00',
    nativeCurrency: 'ETH',
    rpcUrl: 'https://mainnet.mode.network',
    explorerUrl: 'https://modescan.io',
    logoUri: 'https://icons.llamao.fi/icons/chains/rsz_mode.jpg',
  },
  fraxtal: {
    id: 252,
    name: 'fraxtal',
    displayName: 'Fraxtal',
    color: '#000000',
    nativeCurrency: 'frxETH',
    rpcUrl: 'https://rpc.frax.com',
    explorerUrl: 'https://fraxscan.com',
    logoUri: 'https://icons.llamao.fi/icons/chains/rsz_fraxtal.jpg',
  },
  metis: {
    id: 1088,
    name: 'metis',
    displayName: 'Metis',
    color: '#00CFFF',
    nativeCurrency: 'METIS',
    rpcUrl: 'https://andromeda.metis.io/?owner=1088',
    explorerUrl: 'https://andromeda-explorer.metis.io',
    logoUri: 'https://icons.llamao.fi/icons/chains/rsz_metis.jpg',
  },
  fantom: {
    id: 250,
    name: 'fantom',
    displayName: 'Fantom',
    color: '#1969FF',
    nativeCurrency: 'FTM',
    rpcUrl: 'https://rpc.ftm.tools',
    explorerUrl: 'https://ftmscan.com',
    logoUri: 'https://icons.llamao.fi/icons/chains/rsz_fantom.jpg',
  },
  celo: {
    id: 42220,
    name: 'celo',
    displayName: 'Celo',
    color: '#35D07F',
    nativeCurrency: 'CELO',
    rpcUrl: 'https://forno.celo.org',
    explorerUrl: 'https://celoscan.io',
    logoUri: 'https://icons.llamao.fi/icons/chains/rsz_celo.jpg',
  },
  moonbeam: {
    id: 1284,
    name: 'moonbeam',
    displayName: 'Moonbeam',
    color: '#53CBC9',
    nativeCurrency: 'GLMR',
    rpcUrl: 'https://rpc.api.moonbeam.network',
    explorerUrl: 'https://moonscan.io',
    logoUri: 'https://icons.llamao.fi/icons/chains/rsz_moonbeam.jpg',
  },
  cronos: {
    id: 25,
    name: 'cronos',
    displayName: 'Cronos',
    color: '#002D74',
    nativeCurrency: 'CRO',
    rpcUrl: 'https://evm.cronos.org',
    explorerUrl: 'https://cronoscan.com',
    logoUri: 'https://icons.llamao.fi/icons/chains/rsz_cronos.jpg',
  },
}
