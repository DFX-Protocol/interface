import { createClient } from "./utils";
import { ARBITRUM, ARBITRUM_TESTNET, AVALANCHE, ETH_MAINNET, HEDERA_TESTNET } from "config/chains";

export const chainlinkClient = createClient(ETH_MAINNET, "chainLink");

export const arbitrumGraphClient = createClient(ARBITRUM, "stats");
export const arbitrumReferralsGraphClient = createClient(ARBITRUM, "referrals");
export const nissohGraphClient = createClient(ARBITRUM, "nissohVault");

export const hederaTestnetGraphClient = createClient(HEDERA_TESTNET, "stats");
export const hederaTestnetReferralsGraphClient = createClient(HEDERA_TESTNET, "referrals");
// export const nissohGraphClient = createClient(ARBITRUM, "nissohVault");


export const avalancheGraphClient = createClient(AVALANCHE, "stats");
export const avalancheReferralsGraphClient = createClient(AVALANCHE, "referrals");

export function getGmxGraphClient(chainId: number) {
  if (chainId === ARBITRUM) {
    return arbitrumGraphClient;
  } else if (chainId === AVALANCHE) {
    return avalancheGraphClient;
  } else if (chainId === ARBITRUM_TESTNET) {
    return null;
  } else if (chainId === HEDERA_TESTNET) {
    return hederaTestnetGraphClient;
  }

  throw new Error(`Unsupported chain ${chainId}`);
}
