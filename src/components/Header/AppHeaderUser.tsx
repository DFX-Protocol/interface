import AddressDropdown from "../AddressDropdown/AddressDropdown";
import ConnectWalletButton from "../Common/ConnectWalletButton";
import { HeaderLink } from "./HeaderLink";
import connectWalletImg from "img/ic_wallet_24.svg";

import "./Header.css";
import { isHomeSite, getAccountUrl } from "lib/legacy";
import cx from "classnames";
import { Trans } from "@lingui/macro";
import NetworkDropdown from "../NetworkDropdown/NetworkDropdown";
import LanguagePopupHome from "../NetworkDropdown/LanguagePopupHome";
import { getChainName, BASE_TESTNET } from "config/chains";
import { useChainId } from "lib/chains";
import { isDevelopment } from "config/env";
import { getIcon } from "config/icons";
import useWallet from "lib/wallets/useWallet";
import { useConnectModal } from "@rainbow-me/rainbowkit";

type Props = {
  openSettings: () => void;
  small?: boolean;
  disconnectAccountAndCloseSettings: () => void;
  redirectPopupTimestamp: number;
  showRedirectModal: (to: string) => void;
};

const NETWORK_OPTIONS = [
  {
    label: getChainName(BASE_TESTNET),
    value: BASE_TESTNET,
    icon: getIcon(BASE_TESTNET, "network"),
    color: "#E841424D",
  },
];

if (isDevelopment()) {
  // NETWORK_OPTIONS.push({
  //   label: getChainName(ARBITRUM_TESTNET),
  //   value: ARBITRUM_TESTNET,
  //   icon: getIcon(ARBITRUM_TESTNET, "network"),
  //   color: "#264f79",
  // });
}

export function AppHeaderUser({
  openSettings,
  small,
  disconnectAccountAndCloseSettings,
  redirectPopupTimestamp,
  showRedirectModal,
}: Props) {
  const { chainId } = useChainId();
  const { active, account } = useWallet();
  const { openConnectModal } = useConnectModal();
  const showConnectionOptions = !isHomeSite();

  const selectorLabel = getChainName(chainId);

  if (!active || !account) {
    return (
      <div className="App-header-user">
        <div className={cx("App-header-trade-link", { "homepage-header": isHomeSite() })}>
          <HeaderLink
            className="default-btn"
            to="/trade"
            redirectPopupTimestamp={redirectPopupTimestamp}
            showRedirectModal={showRedirectModal}
          >
            {isHomeSite() ? <Trans>Launch App</Trans> : <Trans>Trade</Trans>}
          </HeaderLink>
        </div>

        {showConnectionOptions && openConnectModal? (
          <>
            <ConnectWalletButton onClick={openConnectModal} imgSrc={connectWalletImg}>
              {small ? <Trans>Connect</Trans> : <Trans>Connect Wallet</Trans>}
            </ConnectWalletButton>
            <NetworkDropdown
              small={small}
              networkOptions={NETWORK_OPTIONS}
              selectorLabel={selectorLabel}
              openSettings={openSettings}
            />
          </>
        ) : (
          <LanguagePopupHome />
        )}
      </div>
    );
  }

  const accountUrl = getAccountUrl(chainId, account);

  return (
    <div className="App-header-user">
      <div className="App-header-trade-link">
        <HeaderLink
          className="default-btn"
          to="/trade"
          redirectPopupTimestamp={redirectPopupTimestamp}
          showRedirectModal={showRedirectModal}
        >
          <Trans>Trade</Trans>
        </HeaderLink>
      </div>

      {showConnectionOptions ? (
        <>
          <div className="App-header-user-address">
            <AddressDropdown
              account={account}
              accountUrl={accountUrl}
              disconnectAccountAndCloseSettings={disconnectAccountAndCloseSettings}
            />
          </div>
          <NetworkDropdown
            small={small}
            networkOptions={NETWORK_OPTIONS}
            selectorLabel={selectorLabel}
            openSettings={openSettings}
          />
        </>
      ) : (
        <LanguagePopupHome />
      )}
    </div>
  );
}
