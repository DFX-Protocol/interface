import { ARBITRUM, AVALANCHE, BASE_TESTNET, SEPOLIA } from "config/chains";
import { getContract } from "config/contracts";

const ARBITRUM_DFX = getContract(ARBITRUM, "DFX").toLowerCase();
const AVALANCHE_DFX = getContract(AVALANCHE, "DFX").toLowerCase();

type Exchange = {
  name: string;
  icon: string;
  links: { [key: number]: string };
};

export const EXTERNAL_LINKS = {
  [ARBITRUM]: {
    networkWebsite: "https://arbitrum.io/",
    buyDfx: {
      uniswap: `https://app.uniswap.org/#/swap?inputCurrency=ETH&outputCurrency=${ARBITRUM_DFX}`,
    },
  },
  [AVALANCHE]: {
    networkWebsite: "https://www.avax.network/",
    buyDfx: {
      traderjoe: `https://traderjoexyz.com/trade?outputCurrency=${AVALANCHE_DFX}`,
    },
  },
  [SEPOLIA]: {
    networkWebsite: "https://arbitrum.io/",
    buyDfx: {
      uniswap: `https://app.uniswap.org/#/swap?inputCurrency=ETH&outputCurrency=${ARBITRUM_DFX}`,
    },
  },
  // TODO: Update all external links
  [BASE_TESTNET]: {
    networkWebsite: "https://arbitrum.io/",
    buyDfx: {
      uniswap: `https://app.uniswap.org/#/swap?inputCurrency=ETH&outputCurrency=${ARBITRUM_DFX}`,
    },
  },
};

export const FIAT_GATEWAYS: Exchange[] = [
  {
    name: "Binance Connect",
    icon: "ic_binance.svg",
    links: {
      [ARBITRUM]: "https://www.binancecnt.com/en/buy-sell-crypto",
      [AVALANCHE]: "https://www.binancecnt.com/en/buy-sell-crypto",
      [BASE_TESTNET]: "https://www.binancecnt.com/en/buy-sell-crypto",
    },
  },
  {
    name: "Banxa",
    icon: "ic_banxa.svg",
    links: {
      [ARBITRUM]: "https://dfx.banxa.com/?coinType=DFX&fiatType=USD&fiatAmount=500&blockchain=arbitrum",
      [AVALANCHE]: "https://dfx.banxa.com/?coinType=DFX&fiatType=USD&fiatAmount=500&blockchain=avalanche",
    },
  },
  {
    name: "Transak",
    icon: "ic_tansak.svg",
    links: {
      [ARBITRUM]:
        "https://global.transak.com/?apiKey=28a15a9b-d94e-4944-99cc-6aa35b45cc74&networks=arbitrum&defaultCryptoCurrency=DFX&isAutoFillUserData=true&hideMenu=true&isFeeCalculationHidden=true",
    },
  },
];

export const DFX_FROM_ANY_NETWORKS: Exchange[] = [
  {
    name: "Bungee",
    icon: "ic_bungee.png",
    links: {
      [ARBITRUM]: `https://multitx.bungee.exchange/?toChainId=42161&toTokenAddress=${ARBITRUM_DFX}`,
      [AVALANCHE]: `https://multitx.bungee.exchange/?toChainId=43114&toTokenAddress=${AVALANCHE_DFX}`,
      [BASE_TESTNET]: `https://multitx.bungee.exchange/?toChainId=43114&toTokenAddress=${AVALANCHE_DFX}`,
    },
  },
  {
    name: "O3",
    icon: "ic_o3.png",
    links: {
      [ARBITRUM]: `https://o3swap.com/swap?dst_chain=42161&dst_token_hash=${ARBITRUM_DFX}`,
      [AVALANCHE]: `https://o3swap.com/swap?dst_chain=43114&dst_token_hash=${AVALANCHE_DFX}`,
    },
  },
];

export const BUY_NATIVE_TOKENS: Exchange[] = [
  {
    name: "Bungee",
    icon: "ic_bungee.png",
    links: {
      [ARBITRUM]: `https://multitx.bungee.exchange/?fromChainId=1&fromTokenAddress=0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee&toChainId=42161&toTokenAddress=0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee `,
      [AVALANCHE]: `https://multitx.bungee.exchange/?fromChainId=1&fromTokenAddress=0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee&toChainId=43114&toTokenAddress=0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee`,
    },
  },
  {
    name: "O3",
    icon: "ic_o3.png",
    links: {
      [ARBITRUM]:
        "https://o3swap.com/swap?src_chain=1&dst_chain=42161&dst_token_hash=0x0000000000000000000000000000000000000000",
      [AVALANCHE]:
        "https://o3swap.com/swap?src_chain=1&dst_chain=43114&dst_token_hash=0x0000000000000000000000000000000000000000",
    },
  },
  {
    name: "Banxa",
    icon: "ic_banxa.svg",
    links: {
      [ARBITRUM]: "https://dfx.banxa.com/?coinType=ETH&fiatType=USD&fiatAmount=500&blockchain=arbitrum",
      [AVALANCHE]: "https://dfx.banxa.com/?coinType=AVAX&fiatType=USD&fiatAmount=500&blockchain=avalanche",
      [BASE_TESTNET]: "https://dfx.banxa.com/?coinType=AVAX&fiatType=USD&fiatAmount=500&blockchain=avalanche",
    },
  },
  {
    name: "Transak",
    icon: "ic_tansak.svg",
    links: {
      [ARBITRUM]:
        "https://global.transak.com/?apiKey=28a15a9b-d94e-4944-99cc-6aa35b45cc74&networks=arbitrum&isAutoFillUserData=true&hideMenu=true&isFeeCalculationHidden=true",
      [AVALANCHE]:
        "https://global.transak.com/?apiKey=28a15a9b-d94e-4944-99cc-6aa35b45cc74&networks=avaxcchain&defaultCryptoCurrency=AVAX&isAutoFillUserData=true&hideMenu=true&isFeeCalculationHidden=true",
    },
  },
];

export const TRANSFER_EXCHANGES: Exchange[] = [
  {
    name: "Binance",
    icon: "ic_binance.svg",
    links: {
      [ARBITRUM]: "https://www.binance.com/en/trade/",
      [AVALANCHE]: "https://www.binance.com/en/trade/",
      [BASE_TESTNET]: "https://www.binance.com/en/trade/",
    },
  },
  {
    name: "Synapse",
    icon: "ic_synapse.svg",
    links: {
      [ARBITRUM]: "https://synapseprotocol.com/?inputCurrency=ETH&outputCurrency=ETH&outputChain=42161",
      [AVALANCHE]: "https://synapseprotocol.com/",
    },
  },
  {
    name: "Arbitrum",
    icon: "ic_arbitrum_24.svg",
    links: {
      [ARBITRUM]: "https://bridge.arbitrum.io/",
    },
  },
  {
    name: "Avalanche",
    icon: "ic_avax_30.svg",
    links: {
      [AVALANCHE]: "https://bridge.avax.network/",
    },
  },
  {
    name: "Hop",
    icon: "ic_hop.svg",
    links: { [ARBITRUM]: "https://app.hop.exchange/send?token=ETH&sourceNetwork=ethereum&destNetwork=arbitrum" },
  },
  {
    name: "Bungee",
    icon: "ic_bungee.png",
    links: {
      [ARBITRUM]:
        "https://multitx.bungee.exchange/?fromChainId=1&fromTokenAddress=0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee&toChainId=42161&toTokenAddress=0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee",
      [AVALANCHE]:
        "https://multitx.bungee.exchange/?fromChainId=1&fromTokenAddress=0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee&toChainId=43114&toTokenAddress=0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee",
    },
  },
  {
    name: "Multichain",
    icon: "ic_multichain.svg",
    links: {
      [ARBITRUM]: "https://app.multichain.org/#/router",
      [AVALANCHE]: "https://app.multichain.org/#/router",
    },
  },
  {
    name: "O3",
    icon: "ic_o3.png",
    links: {
      [ARBITRUM]:
        "https://o3swap.com/swap?src_chain=1&dst_chain=42161&dst_token_hash=0x0000000000000000000000000000000000000000",
      [AVALANCHE]:
        "https://o3swap.com/swap?src_chain=1&dst_chain=43114&dst_token_hash=0x0000000000000000000000000000000000000000",
    },
  },
  {
    name: "Across",
    icon: "ic_across.svg",
    links: { [ARBITRUM]: "https://across.to/bridge?from=1&to=42161&asset=ETH" },
  },
];

export const CENTRALISED_EXCHANGES: Exchange[] = [
  {
    name: "Binance",
    icon: "ic_binance.svg",
    links: {
      [ARBITRUM]: "https://www.binance.com/en/trade/GMX_USDT",
      [AVALANCHE]: "https://www.binance.com/en/trade/GMX_USDT",
    },
  },
  {
    name: "Bybit",
    icon: "ic_bybit.svg",
    links: {
      [ARBITRUM]: "https://www.bybit.com/en-US/trade/spot/DFX/USDT",
      [AVALANCHE]: "https://www.bybit.com/en-US/trade/spot/DFX/USDT",
      [BASE_TESTNET]: "https://www.bybit.com/en-US/trade/spot/DFX/USDT",
    },
  },
  {
    name: "Kucoin",
    icon: "ic_kucoin.svg",
    links: {
      [ARBITRUM]: "https://www.kucoin.com/trade/DFX-USDT",
      [AVALANCHE]: "https://www.kucoin.com/trade/DFX-USDT",
    },
  },
  {
    name: "Huobi",
    icon: "ic_huobi.svg",
    links: {
      [ARBITRUM]: "https://www.huobi.com/en-us/exchange/gmx_usdt/",
      [AVALANCHE]: "https://www.huobi.com/en-us/exchange/gmx_usdt/",
    },
  },
];

export const DECENTRALISED_AGGRIGATORS: Exchange[] = [
  {
    name: "1inch",
    icon: "ic_1inch.svg",
    links: {
      [ARBITRUM]: "https://app.1inch.io/#/42161/unified/swap/ETH/DFX",
      [AVALANCHE]: "https://app.1inch.io/#/43114/unified/swap/AVAX/DFX",
    },
  },
  {
    name: "Matcha",
    icon: "ic_matcha.png",
    links: {
      [ARBITRUM]: `https://www.matcha.xyz/markets/42161/${ARBITRUM_DFX}`,
      [AVALANCHE]: `https://www.matcha.xyz/markets/43114/${AVALANCHE_DFX}`,
      [BASE_TESTNET]: `https://www.matcha.xyz/markets/43114/${AVALANCHE_DFX}`,
    },
  },
  {
    name: "Paraswap",
    icon: "ic_paraswap.svg",
    links: {
      [ARBITRUM]: `https://app.paraswap.io/#/${ARBITRUM_DFX}?network=arbitrum`,
      [AVALANCHE]: `https://app.paraswap.io/#/${AVALANCHE_DFX}?network=avalanche`,
    },
  },
  {
    name: "KyberSwap",
    icon: "ic_kyberswap.svg",
    links: {
      [ARBITRUM]: "https://kyberswap.com/swap/arbitrum/eth-to-dfx",
      [AVALANCHE]: "https://kyberswap.com/swap/avalanche/avax-to-dfx",
    },
  },
  {
    name: "OpenOcean",
    icon: "ic_openocean.svg",
    links: {
      [ARBITRUM]: "https://app.openocean.finance/CLASSIC#/ARBITRUM/ETH/DFX",
      [AVALANCHE]: "https://app.openocean.finance/CLASSIC#/AVAX/AVAX/DFX",
    },
  },
  {
    name: "DODO",
    icon: "ic_dodo.svg",
    links: {
      [ARBITRUM]: `https://app.dodoex.io/?from=ETH&to=${ARBITRUM_DFX}&network=arbitrum`,
      [AVALANCHE]: `https://app.dodoex.io/?from=AVAX&to=${AVALANCHE_DFX}&network=avalanche`,
    },
  },
  {
    name: "Slingshot",
    icon: "ic_slingshot.svg",
    links: { [ARBITRUM]: "https://app.slingshot.finance/swap/ETH?network=arbitrum" },
  },
  {
    name: "Yieldyak",
    icon: "ic_yield_yak.png",
    links: {
      [AVALANCHE]: `https://yieldyak.com/swap?outputCurrency=${AVALANCHE_DFX}`,
    },
  },
  {
    name: "Firebird",
    icon: "ic_firebird.png",
    links: {
      [ARBITRUM]: "https://app.firebird.finance/swap",
      [AVALANCHE]: "https://app.firebird.finance/swap",
    },
  },
  {
    name: "Odos",
    icon: "ic_odos.png",
    links: {
      [ARBITRUM]: "https://app.odos.xyz/swap/42161/ETH/DFX",
      [AVALANCHE]: "https://app.odos.xyz/swap/43114/AVAX/DFX",
    },
  },
];
