import { useAccount, useWalletClient } from "wagmi";

export default function useWallet() {
  const { address, isConnected, connector, chain } = useAccount();
  const { data: signer } = useWalletClient();
  return {
    account: address,
    active: isConnected,
    connector,
    chainId: chain?.id,
    signer: signer ?? undefined,
  };
}
