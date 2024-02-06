import { Chain } from "wagmi";

export const baseSepolia = {
    id: 84532,
    network: "base-sepolia",
    name: "Base Sepolia",
    nativeCurrency: {
        name: "Base Sepolia",
        symbol: "ETH",
        decimals: 18,
   },
    rpcUrls: {
        default: {
            http:  ["https://sepolia.base.org"],
       },
        public: {
            http:  ["https://sepolia.base.org"],
       },
   },
    blockExplorers: {
        etherscan: {
            name: "Basescan",
            url: "https://sepolia.basescan.org",
       },
        default: {
            name: "Basescan",
            url: "https://sepolia.basescan.org",
       },
   },
   contracts: {
     multicall3: {
       address: "0xcA11bde05977b3631167028862bE2a173976CA11",
       blockCreated: 1059647,
     },
   },
 } as Chain;