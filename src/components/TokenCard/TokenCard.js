import React, { useCallback } from "react";
import { Link } from "react-router-dom";
import { Trans } from "@lingui/macro";

import { isHomeSite } from "lib/legacy";

import useWallet from "lib/wallets/useWallet";

import APRLabel from "../APRLabel/APRLabel";
import { HeaderLink } from "../Header/HeaderLink";
import { SEPOLIA, ARBITRUM } from "config/chains";
import { switchNetwork } from "lib/wallets";
import { useChainId } from "lib/chains";
import ExternalLink from "components/ExternalLink/ExternalLink";
import { getIcon } from "config/icons";

const dlpIcon = getIcon("common", "dlp");
const dfxIcon = getIcon("common", "dfx");

export default function TokenCard({ showRedirectModal, redirectPopupTimestamp }) {
  const isHome = isHomeSite();
  const { chainId } = useChainId();
  const { active } = useWallet();

  const changeNetwork = useCallback(
    (network) => {
      if (network === chainId) {
        return;
      }
      if (!active) {
        setTimeout(() => {
          return switchNetwork(network, active);
        }, 500);
      } else {
        return switchNetwork(network, active);
      }
    },
    [chainId, active]
  );

  const BuyLink = ({ className, to, children, network }) => {
    if (isHome && showRedirectModal) {
      return (
        <HeaderLink
          to={to}
          className={className}
          redirectPopupTimestamp={redirectPopupTimestamp}
          showRedirectModal={showRedirectModal}
        >
          {children}
        </HeaderLink>
      );
    }

    return (
      <Link to={to} className={className} onClick={() => changeNetwork(network)}>
        {children}
      </Link>
    );
  };

  return (
    <div className="Home-token-card-options">
      <div className="Home-token-card-option">
        <div className="Home-token-card-option-icon">
          <img src={dfxIcon} width="40" alt="DFX Icons" /> DFX
        </div>
        <div className="Home-token-card-option-info">
          <div className="Home-token-card-option-title">
            <Trans>DFX is the utility and governance token. Accrues 30% of the platform's generated fees.</Trans>
          </div>
          <div className="Home-token-card-option-apr">
            <Trans>Arbitrum APR:</Trans> <APRLabel chainId={ARBITRUM} label="dfxAprTotal" />,{" "}
            <Trans>Sepolia APR:</Trans> <APRLabel chainId={SEPOLIA} label="dfxAprTotal" key="SEPOLIA" />
          </div>
          <div className="Home-token-card-option-action">
            <div className="buy">
              <BuyLink to="/buy_dfx" className="default-btn" network={ARBITRUM}>
                <Trans>Buy on Arbitrum</Trans>
              </BuyLink>
              <BuyLink to="/buy_dfx" className="default-btn" network={SEPOLIA}>
                <Trans>Buy on Sepolia Testnet</Trans>
              </BuyLink>
            </div>
            <ExternalLink href="https://docs.dfx.so" className="default-btn read-more">
              <Trans>Read more</Trans>
            </ExternalLink>
          </div>
        </div>
      </div>
      <div className="Home-token-card-option">
        <div className="Home-token-card-option-icon">
          <img src={dlpIcon} width="40" alt="DLP Icon" /> DLP
        </div>
        <div className="Home-token-card-option-info">
          <div className="Home-token-card-option-title">
            <Trans>DLP is the liquidity provider token. Accrues 70% of the platform's generated fees.</Trans>
          </div>
          <div className="Home-token-card-option-apr">
            <Trans>Arbitrum APR:</Trans> <APRLabel chainId={ARBITRUM} label="dlpAprTotal" key="ARBITRUM" />,{" "}
            <Trans>Sepolia APR:</Trans> <APRLabel chainId={SEPOLIA} label="dlpAprTotal" key="SEPOLIA" />
          </div>
          <div className="Home-token-card-option-action">
            <div className="buy">
              <BuyLink to="/buy_dlp" className="default-btn" network={ARBITRUM}>
                <Trans>Buy on Arbitrum</Trans>
              </BuyLink>
              <BuyLink to="/buy_dlp" className="default-btn" network={SEPOLIA}>
                <Trans>Buy on Sepolia Testnet</Trans>
              </BuyLink>
            </div>
            <a
              href="https://docs.dfx.so"
              target="_blank"
              rel="noreferrer"
              className="default-btn read-more"
            >
              <Trans>Read more</Trans>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
