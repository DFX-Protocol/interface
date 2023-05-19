import { ARBITRUM, ARBITRUM_TESTNET, AVALANCHE, AVALANCHE_FUJI, HEDERA_TESTNET } from "config/chains";
import arbitrum from "img/ic_arbitrum_24.svg";
import avalanche from "img/ic_avalanche_24.svg";
import avalancheTestnet from "img/ic_avalanche_testnet_24.svg";
import hedera from "img/ic_hedera_24.svg";

import gmxIcon from "img/ic_gmx_40.svg";
import glpIcon from "img/ic_glp_40.svg";
import gmxArbitrum from "img/ic_gmx_arbitrum.svg";
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
  },
  [AVALANCHE_FUJI]: {
    network: avalancheTestnet,
  },
  // TODO: update icons
  common: {
    gmx: gmxIcon,
    glp: glpIcon,
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
