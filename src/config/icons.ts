import { ARBITRUM, ARBITRUM_TESTNET, AVALANCHE, AVALANCHE_FUJI, HEDERA_TESTNET } from "config/chains";
import arbitrum from "img/ic_arbitrum_24.svg";
import avalanche from "img/ic_avalanche_24.svg";
import avalancheTestnet from "img/ic_avalanche_testnet_24.svg";
import hedera from "img/ic_hedera_24.svg";

import dfxIcon from "img/ic_dfx.svg";
import dlpIcon from "img/ic_dlp.svg";
import gmxArbitrum from "img/ic_gmx_arbitrum.svg";
import dfxHedera from "img/ic_dfx_hedera.svg";
import dlpHedera from "img/ic_dlp_hedera.svg";
import gmxAvax from "img/ic_gmx_avax.svg";
import glpArbitrum from "img/ic_glp_arbitrum.svg";
import glpAvax from "img/ic_glp_avax.svg";

const ICONS = {
  [ARBITRUM]: {
    network: arbitrum,
    gmx: gmxArbitrum,
    glp: glpArbitrum,
  },
  [AVALANCHE]: {
    network: avalanche,
    gmx: gmxAvax,
    glp: glpAvax,
  },
  [ARBITRUM_TESTNET]: {
    network: arbitrum,
  },
  [HEDERA_TESTNET]: {
    network: hedera,
    gmx: dfxHedera,
    glp: dlpHedera,
  },
  [AVALANCHE_FUJI]: {
    network: avalancheTestnet,
  },
  // TODO: update icons
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
