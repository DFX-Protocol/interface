import { ARBITRUM, AVALANCHE, BASE_TESTNET, ETH_MAINNET, HEDERA_TESTNET, SEPOLIA } from "./chains";
import { isDevelopment } from "./env";
import { getSubgraphUrlKey } from "./localStorage";


const SUBGRAPH_URLS = {
  [ARBITRUM]: {
    // stats: "https://api.thegraph.com/subgraphs/name/gdev8317/gmx-arbitrum-stats
    stats: "https://api.thegraph.com/subgraphs/name/gmx-io/gmx-stats",
    referrals: "https://api.thegraph.com/subgraphs/name/gmx-io/gmx-arbitrum-referrals",
    nissohVault: "https://api.thegraph.com/subgraphs/name/nissoh/gmx-vault",
  },

  [AVALANCHE]: {
    // stats: "https://api.thegraph.com/subgraphs/name/gdev8317/gmx-avalanche-staging", // testing
    stats: "https://api.thegraph.com/subgraphs/name/gmx-io/gmx-avalanche-stats",
    referrals: "https://api.thegraph.com/subgraphs/name/gmx-io/gmx-avalanche-referrals",
  },

  [ETH_MAINNET]: {
    chainLink: "https://api.thegraph.com/subgraphs/name/deividask/chainlink",
  },
  // TODO: Add hedera subgraph URL
  [HEDERA_TESTNET]: {
    // stats: "https://api.thegraph.com/subgraphs/name/gdev8317/gmx-arbitrum-stats
    stats: "https://api.thegraph.com/subgraphs/name/gmx-io/gmx-stats",
    referrals: "https://api.thegraph.com/subgraphs/name/gmx-io/gmx-arbitrum-referrals",
    nissohVault: "https://api.thegraph.com/subgraphs/name/nissoh/gmx-vault",
  },
  // TODO: Add sepolia subgraph URL
  [SEPOLIA]: {
    // stats: "https://api.thegraph.com/subgraphs/name/gdev8317/gmx-arbitrum-stats
    stats: "https://api.thegraph.com/subgraphs/name/gmx-io/gmx-stats",
    referrals: "https://api.thegraph.com/subgraphs/name/gmx-io/gmx-arbitrum-referrals",
    nissohVault: "https://api.thegraph.com/subgraphs/name/nissoh/gmx-vault",
  },
  [BASE_TESTNET]: {
    // stats: "http://localhost:8000/subgraphs/name/dfx-stats",
    // referrals: "http://localhost:8000/subgraphs/name/dfx-referrals"
    stats: "https://api.thegraph.com/subgraphs/name/gmx-io/gmx-stats",
    referrals: "https://api.thegraph.com/subgraphs/name/gmx-io/gmx-arbitrum-referrals",
    // nissohVault: "https://api.thegraph.com/subgraphs/name/nissoh/gmx-vault",
  },
};

export function getSubgraphUrl(chainId: number, subgraph: string) {
  if (isDevelopment()) {
    const localStorageKey = getSubgraphUrlKey(chainId, subgraph);
    const url = localStorage.getItem(localStorageKey);
    if (url) {
      // eslint-disable-next-line no-console
      console.warn("%s subgraph on chain %s url is overriden: %s", subgraph, chainId, url);
      return url;
    }
  }

  return SUBGRAPH_URLS[chainId][subgraph];
}
