import { 
  // ARBITRUM, 
  // ARBITRUM_TESTNET, 
  // AVALANCHE, 
  // AVALANCHE_FUJI, 
  BASE_TESTNET, 
  // HEDERA_TESTNET, 
  SEPOLIA } from "config/chains";
// import arbitrum from "img/ic_arbitrum_24.svg";
// import avalanche from "img/ic_avalanche_24.svg";
// import avalancheTestnet from "img/ic_avalanche_testnet_24.svg";
// import hedera from "img/ic_hedera_24.svg";
import sepolia from "img/ic_sepolia_24.svg";
import base from "img/ic_base_24.svg";

import dfxIcon from "img/ic_dfx.svg";
import dlpIcon from "img/ic_dlp.svg";
// import gmxArbitrum from "img/ic_gmx_arbitrum.svg";
import dfxHedera from "img/ic_dfx_hedera.svg";
import dlpHedera from "img/ic_dlp_hedera.svg";
import dfxBaseTestnet from "img/ic_dfx_base_white.svg";
import dlpBaseTestnet from "img/ic_dlp_base_white.svg";
// import gmxAvax from "img/ic_gmx_avax.svg";
// import dlpArbitrum from "img/ic_dlp_arbitrum.svg";
// import dlpAvax from "img/ic_dlp_avax.svg";

const ICONS = {
  // [ARBITRUM]: {
  //   network: arbitrum,
  //   dfx: gmxArbitrum,
  //   dlp: dlpArbitrum,
  // },
  // [AVALANCHE]: {
  //   network: avalanche,
  //   dfx: gmxAvax,
  //   dlp: dlpAvax,
  // },
  // [ARBITRUM_TESTNET]: {
  //   network: arbitrum,
  // },
  // [HEDERA_TESTNET]: {
  //   network: hedera,
  //   dfx: dfxHedera,
  //   dlp: dlpHedera,
  // },
  // [AVALANCHE_FUJI]: {
  //   network: avalancheTestnet,
  // },
  [SEPOLIA]: {
    network: sepolia,
    dfx: dfxHedera,
    dlp: dlpHedera,
  },
  [BASE_TESTNET]: {
    network: base,
    dfx: dfxBaseTestnet,
    dlp: dlpBaseTestnet,
  },

  common: {
    dfx: dfxIcon,
    dlp: dlpIcon,
  },
};

export function getIcon(chainId: number | "common", label: string) {
  if (chainId in ICONS) {
    if (label in ICONS[chainId]) {
      return ICONS[chainId][label];
    }
  }
}
export function getIcons(chainId: number | "common") {
  if (!chainId) return;
  if (chainId in ICONS) {
    return ICONS[chainId];
  }
}
