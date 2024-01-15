import React from "react";
import { Trans } from "@lingui/macro";
import Footer from "components/Footer/Footer";
import "./Buy.css";
import TokenCard from "components/TokenCard/TokenCard";
import buyDFXIcon from "img/buy_gmx.svg";
import SEO from "components/Common/SEO";
import { getPageTitle } from "lib/legacy";

export default function BuyDFXDLP() {
  return (
    <SEO title={getPageTitle("Buy DLP or DFX")}>
      <div className="BuyDFXDLP page-layout">
        <div className="BuyDFXDLP-container default-container">
          <div className="section-title-block">
            <div className="section-title-icon">
              <img src={buyDFXIcon} alt="buyDFXIcon" />
            </div>
            <div className="section-title-content">
              <div className="Page-title">
                <Trans>Buy DFX or DLP</Trans>
              </div>
            </div>
          </div>
          <TokenCard />
        </div>
        <Footer />
      </div>
    </SEO>
  );
}
