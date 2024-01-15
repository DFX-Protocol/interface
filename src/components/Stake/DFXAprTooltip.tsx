import { t, Trans } from "@lingui/macro";
import StatsTooltipRow from "components/StatsTooltip/StatsTooltipRow";
import { BigNumber } from "ethers";
import { formatKeyAmount } from "lib/numbers";

type Props = {
  processedData: {
    dfxAprForEsDfx: BigNumber;
    dfxAprForNativeToken: BigNumber;
    dfxAprForNativeTokenWithBoost: BigNumber;
    dfxBoostAprForNativeToken?: BigNumber;
  };
  nativeTokenSymbol: string;
};

function renderEscrowedDFXApr(processedData) {
  if (!processedData?.dfxAprForEsDfx?.gt(0)) return;
  return (
    <StatsTooltipRow
      label={t`Escrowed DFX APR`}
      showDollar={false}
      value={`${formatKeyAmount(processedData, "dfxAprForEsDfx", 2, 2, true)}%`}
    />
  );
}

export default function DFXAprTooltip({ processedData, nativeTokenSymbol }: Props) {
  return (
    <>
      {(!processedData.dfxBoostAprForNativeToken || processedData.dfxBoostAprForNativeToken.eq(0)) && (
        <StatsTooltipRow
          label={t`${nativeTokenSymbol} APR`}
          showDollar={false}
          value={`${formatKeyAmount(processedData, "dfxAprForNativeToken", 2, 2, true)}%`}
        />
      )}
      {processedData?.dfxBoostAprForNativeToken?.gt(0) ? (
        <div>
          <StatsTooltipRow
            label={t`${nativeTokenSymbol} Base APR`}
            showDollar={false}
            value={`${formatKeyAmount(processedData, "dfxAprForNativeToken", 2, 2, true)}%`}
          />
          <StatsTooltipRow
            label={t`${nativeTokenSymbol} Boosted APR`}
            showDollar={false}
            value={`${formatKeyAmount(processedData, "dfxBoostAprForNativeToken", 2, 2, true)}%`}
          />
          <div className="Tooltip-divider" />
          <StatsTooltipRow
            label={t`${nativeTokenSymbol} Total APR`}
            showDollar={false}
            value={`${formatKeyAmount(processedData, "dfxAprForNativeTokenWithBoost", 2, 2, true)}%`}
          />
          <br />
          {renderEscrowedDFXApr(processedData)}
          <br />
          <Trans>The Boosted APR is from your staked Multiplier Points.</Trans>
        </div>
      ) : (
        renderEscrowedDFXApr(processedData)
      )}
      <div>
        <br />
        <Trans>APRs are updated weekly on Wednesday and will depend on the fees collected for the week.</Trans>
      </div>
    </>
  );
}
