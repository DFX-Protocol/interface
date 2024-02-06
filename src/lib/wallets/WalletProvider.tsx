import React from "react";
import "@rainbow-me/rainbowkit/styles.css";
import { connectorsForWallets, darkTheme, RainbowKitProvider, Theme, WalletList } from "@rainbow-me/rainbowkit";
import {
  ledgerWallet,
  rabbyWallet,
  injectedWallet,
  metaMaskWallet,
  walletConnectWallet,
  coinbaseWallet,
  rainbowWallet,
  imTokenWallet,
  zerionWallet,
  okxWallet,
} from "@rainbow-me/rainbowkit/wallets";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query' 

import { http, createConfig, WagmiProvider } from 'wagmi'

import { baseSepolia } from "wagmi/chains";

import merge from "lodash/merge";

const WALLET_CONNECT_PROJECT_ID = "f1faaa7f4d33b4a6e658266c2ec1e01f";
const APP_NAME = "DFX";

const walletTheme = merge(darkTheme(), {
  colors: {
    modalBackground: "#16182e",
    accentColor: "#9da5f2",
    menuItemBackground: "#808aff14",
  },
  radii: {
    modal: "4px",
    menuButton: "4px",
  },
} as Theme);

// const { chains, provider } = configureChains(
//   [baseSepolia],
//   [publicProvider()]
// );
// const chains = [baseSepolia];
// const recommendedWalletList: WalletList = [
//   {
//     groupName: "Recommended",
//     wallets: [
//       injectedWallet({ chains }),
//       safeWallet({ chains }),
//       rabbyWallet({ chains }),
//       metaMaskWallet({ chains, projectId: WALLET_CONNECT_PROJECT_ID }),
//       walletConnectWallet({ chains, projectId: WALLET_CONNECT_PROJECT_ID }),
//     ],
//   },
// ];

// const othersWalletList: WalletList = [
//   {
//     groupName: "Others",
//     wallets: [
//       coinbaseWallet({ appName: APP_NAME, chains }),
//       okxWallet({ chains, projectId: WALLET_CONNECT_PROJECT_ID }),
//       ledgerWallet({ chains, projectId: WALLET_CONNECT_PROJECT_ID }),
//       rainbowWallet({ chains, projectId: WALLET_CONNECT_PROJECT_ID }),
//       zerionWallet({ chains, projectId: WALLET_CONNECT_PROJECT_ID }),
//       imTokenWallet({ chains, projectId: WALLET_CONNECT_PROJECT_ID }),
//     ],
//   },
// ];

// const connectors = connectorsForWallets([...recommendedWalletList, ...othersWalletList]);
const queryClient = new QueryClient() 

export const wagmiConfig = createConfig({
  chains: [baseSepolia],
  transports: {
    [baseSepolia.id]: http(),
  },
})

// const wagmiClient = createClient({
//   autoConnect: true,
//   connectors,
//   provider,
// });

const appInfo = {
  appName: "DFX"
}

export default function WalletProvider({ children }) {
  return (
    <WagmiProvider config={wagmiConfig}>
       <QueryClientProvider client={queryClient}> 
          {/* <RainbowKitProvider appInfo={appInfo} initialChain={baseSepolia.id} theme={walletTheme} modalSize="compact"> */}
            { children }
          {/* </RainbowKitProvider> */}
        </QueryClientProvider>
    </WagmiProvider>
    // <WagmiConfig client={wagmiClient}>
    //   <RainbowKitProvider theme={walletTheme} chains={chains} modalSize="compact">
    //     {children}
    //   </RainbowKitProvider>
    // </WagmiConfig>
  );
}
