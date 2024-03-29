import { createClient } from "./utils";
import { ARBITRUM, ARBITRUM_TESTNET, AVALANCHE, BASE_TESTNET, ETH_MAINNET, HEDERA_TESTNET, SEPOLIA } from "config/chains";

export const chainlinkClient = createClient(ETH_MAINNET, "chainLink");

export const arbitrumGraphClient = createClient(ARBITRUM, "stats");
export const arbitrumReferralsGraphClient = createClient(ARBITRUM, "referrals");
export const nissohGraphClient = createClient(ARBITRUM, "nissohVault");

export const hederaTestnetGraphClient = createClient(HEDERA_TESTNET, "stats");
export const hederaTestnetReferralsGraphClient = createClient(HEDERA_TESTNET, "referrals");
// export const nissohGraphClient = createClient(ARBITRUM, "nissohVault");

export const SepoliaGraphClient = createClient(SEPOLIA, "stats");
export const SepoliaReferralsGraphClient = createClient(SEPOLIA, "referrals");

export const BaseTestnetGraphClient = createClient(BASE_TESTNET, "stats");
export const BaseTestnetReferralsGraphClient = createClient(BASE_TESTNET, "referrals");


export const avalancheGraphClient = createClient(AVALANCHE, "stats");
export const avalancheReferralsGraphClient = createClient(AVALANCHE, "referrals");

export function getDfxGraphClient(chainId: number) {
  if (chainId === ARBITRUM) {
    return arbitrumGraphClient;
  } else if (chainId === AVALANCHE) {
    return avalancheGraphClient;
  } else if (chainId === ARBITRUM_TESTNET) {
    return null;
  } else if (chainId === HEDERA_TESTNET) {
    return hederaTestnetGraphClient;
  } else if (chainId === SEPOLIA) {
    return SepoliaGraphClient;
  } else if (chainId === BASE_TESTNET) {
    return BaseTestnetGraphClient;
  }

  throw new Error(`Unsupported chain ${chainId}`);
}
