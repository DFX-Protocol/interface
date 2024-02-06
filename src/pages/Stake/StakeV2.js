import React, { useState, useCallback } from "react";
import { Trans, t } from "@lingui/macro";
import useWallet from "lib/wallets/useWallet";
import { useConnectModal } from "@rainbow-me/rainbowkit";

import Modal from "components/Modal/Modal";
import Checkbox from "components/Checkbox/Checkbox";
import Tooltip from "components/Tooltip/Tooltip";
import Footer from "components/Footer/Footer";

import Vault from "abis/Vault.json";
import ReaderV2 from "abis/ReaderV2.json";
import Vester from "abis/Vester.json";
import RewardRouter from "abis/RewardRouter.json";
import RewardReader from "abis/RewardReader.json";
import Token from "abis/Token.json";
import DlpManager from "abis/DlpManager.json";

import { ethers } from "ethers";
import {
  DLP_DECIMALS,
  USD_DECIMALS,
  BASIS_POINTS_DIVISOR,
  PLACEHOLDER_ACCOUNT,
  getBalanceAndSupplyData,
  getDepositBalanceData,
  getVestingData,
  getStakingData,
  getProcessedData,
  getPageTitle,
} from "lib/legacy";
import { useDfxPrice, useTotalDfxStaked, useTotalDfxSupply } from "domain/legacy";
import { ARBITRUM, getChainName, getConstant } from "config/chains";

import useSWR from "swr";

import { getContract } from "config/contracts";

import "./StakeV2.css";
import SEO from "components/Common/SEO";
import StatsTooltip from "components/StatsTooltip/StatsTooltip";
import StatsTooltipRow from "components/StatsTooltip/StatsTooltipRow";
import { getServerUrl } from "config/backend";
import { callContract, contractFetcher } from "lib/contracts";
import { useLocalStorageSerializeKey } from "lib/localStorage";
import { helperToast } from "lib/helperToast";
import { approveTokens } from "domain/tokens";
import { bigNumberify, expandDecimals, formatAmount, formatAmountFree, formatKeyAmount, parseValue } from "lib/numbers";
import { useChainId } from "lib/chains";
import ExternalLink from "components/ExternalLink/ExternalLink";
import DFXAprTooltip from "components/Stake/DFXAprTooltip";
import Button from "components/Button/Button";

const { AddressZero } = ethers.constants;

function StakeModal(props) {
  const {
    isVisible,
    setIsVisible,
    chainId,
    title,
    maxAmount,
    value,
    setValue,
    active,
    account,
    signer,
    stakingTokenSymbol,
    stakingTokenAddress,
    farmAddress,
    rewardRouterAddress,
    stakeMethodName,
    setPendingTxns,
  } = props;
  const [isStaking, setIsStaking] = useState(false);
  const [isApproving, setIsApproving] = useState(false);

  const { data: tokenAllowance } = useSWR(
    active && stakingTokenAddress && [active, chainId, stakingTokenAddress, "allowance", account, farmAddress],
    {
      fetcher: contractFetcher(signer, Token),
    }
  );

  let amount = parseValue(value, 18);
  const needApproval = farmAddress !== AddressZero && tokenAllowance && amount && amount.gt(tokenAllowance);

  const getError = () => {
    if (!amount || amount.eq(0)) {
      return t`Enter an amount`;
    }
    if (maxAmount && amount.gt(maxAmount)) {
      return t`Max amount exceeded`;
    }
  };

  const onClickPrimary = () => {
    if (needApproval) {
      approveTokens({
        setIsApproving,
        signer,
        tokenAddress: stakingTokenAddress,
        spender: farmAddress,
        chainId,
      });
      return;
    }

    setIsStaking(true);
    const contract = new ethers.Contract(rewardRouterAddress, RewardRouter.abi, signer);

    callContract(chainId, contract, stakeMethodName, [amount], {
      sentMsg: t`Stake submitted!`,
      failMsg: t`Stake failed.`,
      setPendingTxns,
    })
      .then(async (res) => {
        setIsVisible(false);
      })
      .finally(() => {
        setIsStaking(false);
      });
  };

  const isPrimaryEnabled = () => {
    const error = getError();
    if (error) {
      return false;
    }
    if (isApproving) {
      return false;
    }
    if (isStaking) {
      return false;
    }
    return true;
  };

  const getPrimaryText = () => {
    const error = getError();
    if (error) {
      return error;
    }
    if (isApproving) {
      return t`Approving ${stakingTokenSymbol}...`;
    }
    if (needApproval) {
      return t`Approve ${stakingTokenSymbol}`;
    }
    if (isStaking) {
      return t`Staking...`;
    }
    return t`Stake`;
  };

  return (
    <div className="StakeModal">
      <Modal isVisible={isVisible} setIsVisible={setIsVisible} label={title}>
        <div className="Exchange-swap-section">
          <div className="Exchange-swap-section-top">
            <div className="muted">
              <div className="Exchange-swap-usd">
                <Trans>Stake</Trans>
              </div>
            </div>
            <div className="muted align-right clickable" onClick={() => setValue(formatAmountFree(maxAmount, 18, 18))}>
              <Trans>Max: {formatAmount(maxAmount, 18, 4, true)}</Trans>
            </div>
          </div>
          <div className="Exchange-swap-section-bottom">
            <div>
              <input
                type="number"
                placeholder="0.0"
                className="Exchange-swap-input"
                value={value}
                onChange={(e) => setValue(e.target.value)}
              />
            </div>
            <div className="PositionEditor-token-symbol">{stakingTokenSymbol}</div>
          </div>
        </div>
        <div className="Exchange-swap-button-container">
          <Button variant="primary-action" className="w-100" onClick={onClickPrimary} disabled={!isPrimaryEnabled()}>
            {getPrimaryText()}
          </Button>
        </div>
      </Modal>
    </div>
  );
}

function UnstakeModal(props) {
  const {
    isVisible,
    setIsVisible,
    chainId,
    title,
    maxAmount,
    value,
    setValue,
    signer,
    unstakingTokenSymbol,
    rewardRouterAddress,
    unstakeMethodName,
    multiplierPointsAmount,
    reservedAmount,
    bonusDfxInFeeDfx,
    setPendingTxns,
  } = props;
  const [isUnstaking, setIsUnstaking] = useState(false);

  let amount = parseValue(value, 18);
  let burnAmount;

  if (
    multiplierPointsAmount &&
    multiplierPointsAmount.gt(0) &&
    amount &&
    amount.gt(0) &&
    bonusDfxInFeeDfx &&
    bonusDfxInFeeDfx.gt(0)
  ) {
    burnAmount = multiplierPointsAmount.mul(amount).div(bonusDfxInFeeDfx);
  }

  const shouldShowReductionAmount = true;
  let rewardReductionBasisPoints;
  if (burnAmount && bonusDfxInFeeDfx) {
    rewardReductionBasisPoints = burnAmount.mul(BASIS_POINTS_DIVISOR).div(bonusDfxInFeeDfx);
  }

  const getError = () => {
    if (!amount) {
      return t`Enter an amount`;
    }
    if (amount.gt(maxAmount)) {
      return t`Max amount exceeded`;
    }
  };

  const onClickPrimary = () => {
    setIsUnstaking(true);
    const contract = new ethers.Contract(rewardRouterAddress, RewardRouter.abi, signer);
    callContract(chainId, contract, unstakeMethodName, [amount], {
      sentMsg: t`Unstake submitted!`,
      failMsg: t`Unstake failed.`,
      successMsg: t`Unstake completed!`,
      setPendingTxns,
    })
      .then(async (res) => {
        setIsVisible(false);
      })
      .finally(() => {
        setIsUnstaking(false);
      });
  };

  const isPrimaryEnabled = () => {
    const error = getError();
    if (error) {
      return false;
    }
    if (isUnstaking) {
      return false;
    }
    return true;
  };

  const getPrimaryText = () => {
    const error = getError();
    if (error) {
      return error;
    }
    if (isUnstaking) {
      return t`Unstaking...`;
    }
    return t`Unstake`;
  };

  return (
    <div className="StakeModal">
      <Modal isVisible={isVisible} setIsVisible={setIsVisible} label={title}>
        <div className="Exchange-swap-section">
          <div className="Exchange-swap-section-top">
            <div className="muted">
              <div className="Exchange-swap-usd">
                <Trans>Unstake</Trans>
              </div>
            </div>
            <div className="muted align-right clickable" onClick={() => setValue(formatAmountFree(maxAmount, 18, 18))}>
              <Trans>Max: {formatAmount(maxAmount, 18, 4, true)}</Trans>
            </div>
          </div>
          <div className="Exchange-swap-section-bottom">
            <div>
              <input
                type="number"
                placeholder="0.0"
                className="Exchange-swap-input"
                value={value}
                onChange={(e) => setValue(e.target.value)}
              />
            </div>
            <div className="PositionEditor-token-symbol">{unstakingTokenSymbol}</div>
          </div>
        </div>
        {reservedAmount && reservedAmount.gt(0) && (
          <div className="Modal-note">
            You have {formatAmount(reservedAmount, 18, 2, true)} tokens reserved for vesting.
          </div>
        )}
        {burnAmount && burnAmount.gt(0) && rewardReductionBasisPoints && rewardReductionBasisPoints.gt(0) && (
          <div className="Modal-note">
            <Trans>
              Unstaking will burn&nbsp;
              <ExternalLink className="display-inline" href="https://docs.dfx.so">
                {formatAmount(burnAmount, 18, 4, true)} Multiplier Points
              </ExternalLink>
              .&nbsp;
              {shouldShowReductionAmount && (
                <span>Boost Percentage: -{formatAmount(rewardReductionBasisPoints, 2, 2)}%.</span>
              )}
            </Trans>
          </div>
        )}
        <div className="Exchange-swap-button-container">
          <Button variant="primary-action" className="w-100" onClick={onClickPrimary} disabled={!isPrimaryEnabled()}>
            {getPrimaryText()}
          </Button>
        </div>
      </Modal>
    </div>
  );
}

function VesterDepositModal(props) {
  const {
    isVisible,
    setIsVisible,
    chainId,
    title,
    maxAmount,
    value,
    setValue,
    balance,
    vestedAmount,
    averageStakedAmount,
    maxVestableAmount,
    signer,
    stakeTokenLabel,
    reserveAmount,
    maxReserveAmount,
    vesterAddress,
    setPendingTxns,
  } = props;
  const [isDepositing, setIsDepositing] = useState(false);

  let amount = parseValue(value, 18);

  let nextReserveAmount = reserveAmount;

  let nextDepositAmount = vestedAmount;
  if (amount) {
    nextDepositAmount = vestedAmount.add(amount);
  }

  let additionalReserveAmount = bigNumberify(0);
  if (amount && averageStakedAmount && maxVestableAmount && maxVestableAmount.gt(0)) {
    nextReserveAmount = nextDepositAmount.mul(averageStakedAmount).div(maxVestableAmount);
    if (nextReserveAmount.gt(reserveAmount)) {
      additionalReserveAmount = nextReserveAmount.sub(reserveAmount);
    }
  }

  const getError = () => {
    if (!amount || amount.eq(0)) {
      return t`Enter an amount`;
    }
    if (maxAmount && amount.gt(maxAmount)) {
      return t`Max amount exceeded`;
    }
    if (nextReserveAmount.gt(maxReserveAmount)) {
      return t`Insufficient staked tokens`;
    }
  };

  const onClickPrimary = () => {
    setIsDepositing(true);
    const contract = new ethers.Contract(vesterAddress, Vester.abi, signer);

    callContract(chainId, contract, "deposit", [amount], {
      sentMsg: t`Deposit submitted!`,
      failMsg: t`Deposit failed!`,
      successMsg: t`Deposited!`,
      setPendingTxns,
    })
      .then(async (res) => {
        setIsVisible(false);
      })
      .finally(() => {
        setIsDepositing(false);
      });
  };

  const isPrimaryEnabled = () => {
    const error = getError();
    if (error) {
      return false;
    }
    if (isDepositing) {
      return false;
    }
    return true;
  };

  const getPrimaryText = () => {
    const error = getError();
    if (error) {
      return error;
    }
    if (isDepositing) {
      return t`Depositing...`;
    }
    return t`Deposit`;
  };

  return (
    <SEO title={getPageTitle("Earn")}>
      <div className="StakeModal">
        <Modal isVisible={isVisible} setIsVisible={setIsVisible} label={title} className="non-scrollable">
          <div className="Exchange-swap-section">
            <div className="Exchange-swap-section-top">
              <div className="muted">
                <div className="Exchange-swap-usd">
                  <Trans>Deposit</Trans>
                </div>
              </div>
              <div
                className="muted align-right clickable"
                onClick={() => setValue(formatAmountFree(maxAmount, 18, 18))}
              >
                <Trans>Max: {formatAmount(maxAmount, 18, 4, true)}</Trans>
              </div>
            </div>
            <div className="Exchange-swap-section-bottom">
              <div>
                <input
                  type="number"
                  placeholder="0.0"
                  className="Exchange-swap-input"
                  value={value}
                  onChange={(e) => setValue(e.target.value)}
                />
              </div>
              <div className="PositionEditor-token-symbol">esDFX</div>
            </div>
          </div>
          <div className="VesterDepositModal-info-rows">
            <div className="Exchange-info-row">
              <div className="Exchange-info-label">
                <Trans>Wallet</Trans>
              </div>
              <div className="align-right">{formatAmount(balance, 18, 2, true)} esDFX</div>
            </div>
            <div className="Exchange-info-row">
              <div className="Exchange-info-label">
                <Trans>Vault Capacity</Trans>
              </div>
              <div className="align-right">
                <Tooltip
                  handle={`${formatAmount(nextDepositAmount, 18, 2, true)} / ${formatAmount(
                    maxVestableAmount,
                    18,
                    2,
                    true
                  )}`}
                  position="right-bottom"
                  renderContent={() => {
                    return (
                      <div>
                        <p className="text-white">
                          <Trans>Vault Capacity for your Account:</Trans>
                        </p>
                        <StatsTooltipRow
                          showDollar={false}
                          label={t`Deposited`}
                          value={`${formatAmount(vestedAmount, 18, 2, true)} esDFX`}
                        />
                        <StatsTooltipRow
                          showDollar={false}
                          label={t`Max Capacity`}
                          value={`${formatAmount(maxVestableAmount, 18, 2, true)} esDFX`}
                        />
                      </div>
                    );
                  }}
                />
              </div>
            </div>
            <div className="Exchange-info-row">
              <div className="Exchange-info-label">
                <Trans>Reserve Amount</Trans>
              </div>
              <div className="align-right">
                <Tooltip
                  handle={`${formatAmount(
                    reserveAmount && reserveAmount.gte(additionalReserveAmount)
                      ? reserveAmount
                      : additionalReserveAmount,
                    18,
                    2,
                    true
                  )} / ${formatAmount(maxReserveAmount, 18, 2, true)}`}
                  position="right-bottom"
                  renderContent={() => {
                    return (
                      <>
                        <StatsTooltipRow
                          label={t`Current Reserved`}
                          value={formatAmount(reserveAmount, 18, 2, true)}
                          showDollar={false}
                        />
                        <StatsTooltipRow
                          label={t`Additional reserve required`}
                          value={formatAmount(additionalReserveAmount, 18, 2, true)}
                          showDollar={false}
                        />
                        {amount && nextReserveAmount.gt(maxReserveAmount) && (
                          <>
                            <br />
                            <Trans>
                              You need a total of at least {formatAmount(nextReserveAmount, 18, 2, true)}{" "}
                              {stakeTokenLabel} to vest {formatAmount(amount, 18, 2, true)} esDFX.
                            </Trans>
                          </>
                        )}
                      </>
                    );
                  }}
                />
              </div>
            </div>
          </div>
          <div className="Exchange-swap-button-container">
            <Button variant="primary-action" className="w-100" onClick={onClickPrimary} disabled={!isPrimaryEnabled()}>
              {getPrimaryText()}
            </Button>
          </div>
        </Modal>
      </div>
    </SEO>
  );
}

function VesterWithdrawModal(props) {
  const { isVisible, setIsVisible, chainId, title, signer, vesterAddress, setPendingTxns } = props;
  const [isWithdrawing, setIsWithdrawing] = useState(false);

  const onClickPrimary = () => {
    setIsWithdrawing(true);
    const contract = new ethers.Contract(vesterAddress, Vester.abi, signer);

    callContract(chainId, contract, "withdraw", [], {
      sentMsg: t`Withdraw submitted.`,
      failMsg: t`Withdraw failed.`,
      successMsg: t`Withdrawn!`,
      setPendingTxns,
    })
      .then(async (res) => {
        setIsVisible(false);
      })
      .finally(() => {
        setIsWithdrawing(false);
      });
  };

  return (
    <div className="StakeModal">
      <Modal isVisible={isVisible} setIsVisible={setIsVisible} label={title}>
        <Trans>
          <div>
            This will withdraw and unreserve all tokens as well as pause vesting.
            <br />
            <br />
            esDFX tokens that have been converted to DFX will remain as DFX tokens.
            <br />
            <br />
            To claim DFX tokens without withdrawing, use the "Claim" button under the Total Rewards section.
            <br />
            <br />
          </div>
        </Trans>
        <div className="Exchange-swap-button-container">
          <Button variant="primary-action" className="w-100" onClick={onClickPrimary} disabled={isWithdrawing}>
            {!isWithdrawing && "Confirm Withdraw"}
            {isWithdrawing && "Confirming..."}
          </Button>
        </div>
      </Modal>
    </div>
  );
}

function CompoundModal(props) {
  const {
    isVisible,
    setIsVisible,
    rewardRouterAddress,
    active,
    account,
    signer,
    chainId,
    setPendingTxns,
    totalVesterRewards,
    nativeTokenSymbol,
    wrappedTokenSymbol,
  } = props;
  const [isCompounding, setIsCompounding] = useState(false);
  const [shouldClaimDfx, setShouldClaimDfx] = useLocalStorageSerializeKey(
    [chainId, "StakeV2-compound-should-claim-dfx"],
    true
  );
  const [shouldStakeDfx, setShouldStakeDfx] = useLocalStorageSerializeKey(
    [chainId, "StakeV2-compound-should-stake-dfx"],
    true
  );
  const [shouldClaimEsDfx, setShouldClaimEsDfx] = useLocalStorageSerializeKey(
    [chainId, "StakeV2-compound-should-claim-es-dfx"],
    true
  );
  const [shouldStakeEsDfx, setShouldStakeEsDfx] = useLocalStorageSerializeKey(
    [chainId, "StakeV2-compound-should-stake-es-dfx"],
    true
  );
  const [shouldStakeMultiplierPoints, setShouldStakeMultiplierPoints] = useState(true);
  const [shouldClaimWeth, setShouldClaimWeth] = useLocalStorageSerializeKey(
    [chainId, "StakeV2-compound-should-claim-weth"],
    true
  );
  const [shouldConvertWeth, setShouldConvertWeth] = useLocalStorageSerializeKey(
    [chainId, "StakeV2-compound-should-convert-weth"],
    true
  );

  const dfxAddress = getContract(chainId, "DFX");
  const stakedDfxTrackerAddress = getContract(chainId, "StakedDfxTracker");

  const [isApproving, setIsApproving] = useState(false);

  const { data: tokenAllowance } = useSWR(
    active && [active, chainId, dfxAddress, "allowance", account, stakedDfxTrackerAddress],
    {
      fetcher: contractFetcher(signer, Token),
    }
  );

  const needApproval = shouldStakeDfx && tokenAllowance && totalVesterRewards && totalVesterRewards.gt(tokenAllowance);

  const isPrimaryEnabled = () => {
    return !isCompounding && !isApproving && !isCompounding;
  };

  const getPrimaryText = () => {
    if (isApproving) {
      return t`Approving DFX...`;
    }
    if (needApproval) {
      return t`Approve DFX`;
    }
    if (isCompounding) {
      return t`Compounding...`;
    }
    return t`Compound`;
  };

  const onClickPrimary = () => {
    if (needApproval) {
      approveTokens({
        setIsApproving,
        signer,
        tokenAddress: dfxAddress,
        spender: stakedDfxTrackerAddress,
        chainId,
      });
      return;
    }

    setIsCompounding(true);

    const contract = new ethers.Contract(rewardRouterAddress, RewardRouter.abi, signer);
    callContract(
      chainId,
      contract,
      "handleRewards",
      [
        shouldClaimDfx || shouldStakeDfx,
        shouldStakeDfx,
        shouldClaimEsDfx || shouldStakeEsDfx,
        shouldStakeEsDfx,
        shouldStakeMultiplierPoints,
        shouldClaimWeth || shouldConvertWeth,
        shouldConvertWeth,
      ],
      {
        sentMsg: t`Compound submitted!`,
        failMsg: t`Compound failed.`,
        successMsg: t`Compound completed!`,
        setPendingTxns,
      }
    )
      .then(async (res) => {
        setIsVisible(false);
      })
      .finally(() => {
        setIsCompounding(false);
      });
  };

  const toggleShouldStakeDfx = (value) => {
    if (value) {
      setShouldClaimDfx(true);
    }
    setShouldStakeDfx(value);
  };

  const toggleShouldStakeEsDfx = (value) => {
    if (value) {
      setShouldClaimEsDfx(true);
    }
    setShouldStakeEsDfx(value);
  };

  const toggleConvertWeth = (value) => {
    if (value) {
      setShouldClaimWeth(true);
    }
    setShouldConvertWeth(value);
  };

  return (
    <div className="StakeModal">
      <Modal isVisible={isVisible} setIsVisible={setIsVisible} label={t`Compound Rewards`}>
        <div className="CompoundModal-menu">
          <div>
            <Checkbox
              isChecked={shouldStakeMultiplierPoints}
              setIsChecked={setShouldStakeMultiplierPoints}
              disabled={true}
            >
              <Trans>Stake Multiplier Points</Trans>
            </Checkbox>
          </div>
          <div>
            <Checkbox isChecked={shouldClaimDfx} setIsChecked={setShouldClaimDfx} disabled={shouldStakeDfx}>
              <Trans>Claim DFX Rewards</Trans>
            </Checkbox>
          </div>
          <div>
            <Checkbox isChecked={shouldStakeDfx} setIsChecked={toggleShouldStakeDfx}>
              <Trans>Stake DFX Rewards</Trans>
            </Checkbox>
          </div>
          <div>
            <Checkbox isChecked={shouldClaimEsDfx} setIsChecked={setShouldClaimEsDfx} disabled={shouldStakeEsDfx}>
              <Trans>Claim esDFX Rewards</Trans>
            </Checkbox>
          </div>
          <div>
            <Checkbox isChecked={shouldStakeEsDfx} setIsChecked={toggleShouldStakeEsDfx}>
              <Trans>Stake esDFX Rewards</Trans>
            </Checkbox>
          </div>
          <div>
            <Checkbox isChecked={shouldClaimWeth} setIsChecked={setShouldClaimWeth} disabled={shouldConvertWeth}>
              <Trans>Claim {wrappedTokenSymbol} Rewards</Trans>
            </Checkbox>
          </div>
          <div>
            <Checkbox isChecked={shouldConvertWeth} setIsChecked={toggleConvertWeth}>
              <Trans>
                Convert {wrappedTokenSymbol} to {nativeTokenSymbol}
              </Trans>
            </Checkbox>
          </div>
        </div>
        <div className="Exchange-swap-button-container">
          <Button variant="primary-action" className="w-100" onClick={onClickPrimary} disabled={!isPrimaryEnabled()}>
            {getPrimaryText()}
          </Button>
        </div>
      </Modal>
    </div>
  );
}

function ClaimModal(props) {
  const {
    isVisible,
    setIsVisible,
    rewardRouterAddress,
    signer,
    chainId,
    setPendingTxns,
    nativeTokenSymbol,
    wrappedTokenSymbol,
  } = props;
  const [isClaiming, setIsClaiming] = useState(false);
  const [shouldClaimDfx, setShouldClaimDfx] = useLocalStorageSerializeKey(
    [chainId, "StakeV2-claim-should-claim-dfx"],
    true
  );
  const [shouldClaimEsDfx, setShouldClaimEsDfx] = useLocalStorageSerializeKey(
    [chainId, "StakeV2-claim-should-claim-es-dfx"],
    true
  );
  const [shouldClaimWeth, setShouldClaimWeth] = useLocalStorageSerializeKey(
    [chainId, "StakeV2-claim-should-claim-weth"],
    true
  );
  const [shouldConvertWeth, setShouldConvertWeth] = useLocalStorageSerializeKey(
    [chainId, "StakeV2-claim-should-convert-weth"],
    true
  );

  const isPrimaryEnabled = () => {
    return !isClaiming;
  };

  const getPrimaryText = () => {
    if (isClaiming) {
      return t`Claiming...`;
    }
    return t`Claim`;
  };

  const onClickPrimary = () => {
    setIsClaiming(true);

    const contract = new ethers.Contract(rewardRouterAddress, RewardRouter.abi, signer);
    callContract(
      chainId,
      contract,
      "handleRewards",
      [
        shouldClaimDfx,
        false, // shouldStakeDfx
        shouldClaimEsDfx,
        false, // shouldStakeEsDfx
        false, // shouldStakeMultiplierPoints
        shouldClaimWeth,
        shouldConvertWeth,
      ],
      {
        sentMsg: t`Claim submitted.`,
        failMsg: t`Claim failed.`,
        successMsg: t`Claim completed!`,
        setPendingTxns,
      }
    )
      .then(async (res) => {
        setIsVisible(false);
      })
      .finally(() => {
        setIsClaiming(false);
      });
  };

  const toggleConvertWeth = (value) => {
    if (value) {
      setShouldClaimWeth(true);
    }
    setShouldConvertWeth(value);
  };

  return (
    <div className="StakeModal">
      <Modal isVisible={isVisible} setIsVisible={setIsVisible} label={t`Claim Rewards`}>
        <div className="CompoundModal-menu">
          <div>
            <Checkbox isChecked={shouldClaimDfx} setIsChecked={setShouldClaimDfx}>
              <Trans>Claim DFX Rewards</Trans>
            </Checkbox>
          </div>
          <div>
            <Checkbox isChecked={shouldClaimEsDfx} setIsChecked={setShouldClaimEsDfx}>
              <Trans>Claim esDFX Rewards</Trans>
            </Checkbox>
          </div>
          <div>
            <Checkbox isChecked={shouldClaimWeth} setIsChecked={setShouldClaimWeth} disabled={shouldConvertWeth}>
              <Trans>Claim {wrappedTokenSymbol} Rewards</Trans>
            </Checkbox>
          </div>
          <div>
            <Checkbox isChecked={shouldConvertWeth} setIsChecked={toggleConvertWeth}>
              <Trans>
                Convert {wrappedTokenSymbol} to {nativeTokenSymbol}
              </Trans>
            </Checkbox>
          </div>
        </div>
        <div className="Exchange-swap-button-container">
          <Button variant="primary-action" className="w-100" onClick={onClickPrimary} disabled={!isPrimaryEnabled()}>
            {getPrimaryText()}
          </Button>
        </div>
      </Modal>
    </div>
  );
}

export default function StakeV2({ setPendingTxns, connectWallet }) {
  const { active, signer, account } = useWallet();
  const { openConnectModal } = useConnectModal();
  const { chainId } = useChainId();

  const chainName = getChainName(chainId);

  const hasInsurance = true;

  const [isStakeModalVisible, setIsStakeModalVisible] = useState(false);
  const [stakeModalTitle, setStakeModalTitle] = useState("");
  const [stakeModalMaxAmount, setStakeModalMaxAmount] = useState(undefined);
  const [stakeValue, setStakeValue] = useState("");
  const [stakingTokenSymbol, setStakingTokenSymbol] = useState("");
  const [stakingTokenAddress, setStakingTokenAddress] = useState("");
  const [stakingFarmAddress, setStakingFarmAddress] = useState("");
  const [stakeMethodName, setStakeMethodName] = useState("");

  const [isUnstakeModalVisible, setIsUnstakeModalVisible] = useState(false);
  const [unstakeModalTitle, setUnstakeModalTitle] = useState("");
  const [unstakeModalMaxAmount, setUnstakeModalMaxAmount] = useState(undefined);
  const [unstakeModalReservedAmount, setUnstakeModalReservedAmount] = useState(undefined);
  const [unstakeValue, setUnstakeValue] = useState("");
  const [unstakingTokenSymbol, setUnstakingTokenSymbol] = useState("");
  const [unstakeMethodName, setUnstakeMethodName] = useState("");

  const [isVesterDepositModalVisible, setIsVesterDepositModalVisible] = useState(false);
  const [vesterDepositTitle, setVesterDepositTitle] = useState("");
  const [vesterDepositStakeTokenLabel, setVesterDepositStakeTokenLabel] = useState("");
  const [vesterDepositMaxAmount, setVesterDepositMaxAmount] = useState("");
  const [vesterDepositBalance, setVesterDepositBalance] = useState("");
  const [vesterDepositEscrowedBalance, setVesterDepositEscrowedBalance] = useState("");
  const [vesterDepositVestedAmount, setVesterDepositVestedAmount] = useState("");
  const [vesterDepositAverageStakedAmount, setVesterDepositAverageStakedAmount] = useState("");
  const [vesterDepositMaxVestableAmount, setVesterDepositMaxVestableAmount] = useState("");
  const [vesterDepositValue, setVesterDepositValue] = useState("");
  const [vesterDepositReserveAmount, setVesterDepositReserveAmount] = useState("");
  const [vesterDepositMaxReserveAmount, setVesterDepositMaxReserveAmount] = useState("");
  const [vesterDepositAddress, setVesterDepositAddress] = useState("");

  const [isVesterWithdrawModalVisible, setIsVesterWithdrawModalVisible] = useState(false);
  const [vesterWithdrawTitle, setVesterWithdrawTitle] = useState(false);
  const [vesterWithdrawAddress, setVesterWithdrawAddress] = useState("");

  const [isCompoundModalVisible, setIsCompoundModalVisible] = useState(false);
  const [isClaimModalVisible, setIsClaimModalVisible] = useState(false);

  const rewardRouterAddress = getContract(chainId, "RewardRouter");
  const rewardReaderAddress = getContract(chainId, "RewardReader");
  const readerAddress = getContract(chainId, "Reader");

  const vaultAddress = getContract(chainId, "Vault");
  const nativeTokenAddress = getContract(chainId, "NATIVE_TOKEN");
  const dfxAddress = getContract(chainId, "DFX");
  const esDfxAddress = getContract(chainId, "ES_DFX");
  const bnDfxAddress = getContract(chainId, "BN_DFX");
  const dlpAddress = getContract(chainId, "DLP");

  const stakedDfxTrackerAddress = getContract(chainId, "StakedDfxTracker");
  const bonusDfxTrackerAddress = getContract(chainId, "BonusDfxTracker");
  const feeDfxTrackerAddress = getContract(chainId, "FeeDfxTracker");

  const stakedDlpTrackerAddress = getContract(chainId, "StakedDlpTracker");
  const feeDlpTrackerAddress = getContract(chainId, "FeeDlpTracker");

  const dlpManagerAddress = getContract(chainId, "DlpManager");

  const stakedDfxDistributorAddress = getContract(chainId, "StakedDfxDistributor");
  const stakedDlpDistributorAddress = getContract(chainId, "StakedDlpDistributor");

  const dfxVesterAddress = getContract(chainId, "DfxVester");
  const dlpVesterAddress = getContract(chainId, "DlpVester");

  const vesterAddresses = [dfxVesterAddress, dlpVesterAddress];

  const excludedEsDfxAccounts = [stakedDfxDistributorAddress, stakedDlpDistributorAddress];

  const nativeTokenSymbol = getConstant(chainId, "nativeTokenSymbol");
  const wrappedTokenSymbol = getConstant(chainId, "wrappedTokenSymbol");

  const walletTokens = [dfxAddress, esDfxAddress, dlpAddress, stakedDfxTrackerAddress];
  const depositTokens = [
    dfxAddress,
    esDfxAddress,
    stakedDfxTrackerAddress,
    bonusDfxTrackerAddress,
    bnDfxAddress,
    dlpAddress,
  ];
  const rewardTrackersForDepositBalances = [
    stakedDfxTrackerAddress,
    stakedDfxTrackerAddress,
    bonusDfxTrackerAddress,
    feeDfxTrackerAddress,
    feeDfxTrackerAddress,
    feeDlpTrackerAddress,
  ];
  const rewardTrackersForStakingInfo = [
    stakedDfxTrackerAddress,
    bonusDfxTrackerAddress,
    feeDfxTrackerAddress,
    stakedDlpTrackerAddress,
    feeDlpTrackerAddress,
  ];

  const { data: walletBalances } = useSWR(
    [
      `StakeV2:walletBalances:${active}`,
      chainId,
      readerAddress,
      "getTokenBalancesWithSupplies",
      account || PLACEHOLDER_ACCOUNT,
    ],
    {
      fetcher: contractFetcher(signer, ReaderV2, [walletTokens]),
    }
  );

  const { data: depositBalances } = useSWR(
    [
      `StakeV2:depositBalances:${active}`,
      chainId,
      rewardReaderAddress,
      "getDepositBalances",
      account || PLACEHOLDER_ACCOUNT,
    ],
    {
      fetcher: contractFetcher(signer, RewardReader, [depositTokens, rewardTrackersForDepositBalances]),
    }
  );

  const { data: stakingInfo } = useSWR(
    [`StakeV2:stakingInfo:${active}`, chainId, rewardReaderAddress, "getStakingInfo", account || PLACEHOLDER_ACCOUNT],
    {
      fetcher: contractFetcher(signer, RewardReader, [rewardTrackersForStakingInfo]),
    }
  );

  const { data: stakedDfxSupply } = useSWR(
    [`StakeV2:stakedDfxSupply:${active}`, chainId, dfxAddress, "balanceOf", stakedDfxTrackerAddress],
    {
      fetcher: contractFetcher(signer, Token),
    }
  );

  const { data: aums } = useSWR([`StakeV2:getAums:${active}`, chainId, dlpManagerAddress, "getAums"], {
    fetcher: contractFetcher(signer, DlpManager),
  });

  const { data: nativeTokenPrice } = useSWR(
    [`StakeV2:nativeTokenPrice:${active}`, chainId, vaultAddress, "getMinPrice", nativeTokenAddress],
    {
      fetcher: contractFetcher(signer, Vault),
    }
  );

  const { data: esDfxSupply } = useSWR(
    [`StakeV2:esDfxSupply:${active}`, chainId, readerAddress, "getTokenSupply", esDfxAddress],
    {
      fetcher: contractFetcher(signer, ReaderV2, [excludedEsDfxAccounts]),
    }
  );

  const { data: vestingInfo } = useSWR(
    [`StakeV2:vestingInfo:${active}`, chainId, readerAddress, "getVestingInfo", account || PLACEHOLDER_ACCOUNT],
    {
      fetcher: contractFetcher(signer, ReaderV2, [vesterAddresses]),
    }
  );

  const { dfxPrice, dfxPriceFromArbitrum, dfxPriceFromAvalanche } = useDfxPrice(
    chainId,
    { arbitrum: chainId === ARBITRUM ? signer : undefined },
    active
  );

  let { total: totalDfxSupply } = useTotalDfxSupply();

  let { avax: avaxDfxStaked, arbitrum: arbitrumDfxStaked, total: totalDfxStaked } = useTotalDfxStaked();

  const dfxSupplyUrl = getServerUrl(chainId, "/gmx_supply");
  const { data: dfxSupply } = useSWR([dfxSupplyUrl], {
    fetcher: (...args) => fetch(...args).then((res) => res.text()),
  });

  const isDfxTransferEnabled = true;

  let esDfxSupplyUsd;
  if (esDfxSupply && dfxPrice) {
    esDfxSupplyUsd = esDfxSupply.mul(dfxPrice).div(expandDecimals(1, 18));
  }

  let aum;
  if (aums && aums.length > 0) {
    aum = aums[0].add(aums[1]).div(2);
  }

  const { balanceData, supplyData } = getBalanceAndSupplyData(walletBalances);
  const depositBalanceData = getDepositBalanceData(depositBalances);
  const stakingData = getStakingData(stakingInfo);
  const vestingData = getVestingData(vestingInfo);

  const processedData = getProcessedData(
    balanceData,
    supplyData,
    depositBalanceData,
    stakingData,
    vestingData,
    aum,
    nativeTokenPrice,
    stakedDfxSupply,
    dfxPrice,
    dfxSupply
  );

  let hasMultiplierPoints = false;
  let multiplierPointsAmount;
  if (processedData && processedData.bonusDfxTrackerRewards && processedData.bnDfxInFeeDfx) {
    multiplierPointsAmount = processedData.bonusDfxTrackerRewards.add(processedData.bnDfxInFeeDfx);
    if (multiplierPointsAmount.gt(0)) {
      hasMultiplierPoints = true;
    }
  }
  let totalRewardTokens;
  if (processedData && processedData.bnDfxInFeeDfx && processedData.bonusDfxInFeeDfx) {
    totalRewardTokens = processedData.bnDfxInFeeDfx.add(processedData.bonusDfxInFeeDfx);
  }

  let totalRewardTokensAndDlp;
  if (totalRewardTokens && processedData && processedData.dlpBalance) {
    totalRewardTokensAndDlp = totalRewardTokens.add(processedData.dlpBalance);
  }

  const bonusDfxInFeeDfx = processedData ? processedData.bonusDfxInFeeDfx : undefined;

  let stakedDfxSupplyUsd;
  if (!totalDfxStaked.isZero() && dfxPrice) {
    stakedDfxSupplyUsd = totalDfxStaked.mul(dfxPrice).div(expandDecimals(1, 18));
  }

  let totalSupplyUsd;
  if (totalDfxSupply && !totalDfxSupply.isZero() && dfxPrice) {
    totalSupplyUsd = totalDfxSupply.mul(dfxPrice).div(expandDecimals(1, 18));
  }

  let maxUnstakeableDfx = bigNumberify(0);
  if (
    totalRewardTokens &&
    vestingData &&
    vestingData.dfxVesterPairAmount &&
    multiplierPointsAmount &&
    processedData.bonusDfxInFeeDfx
  ) {
    const availableTokens = totalRewardTokens.sub(vestingData.dfxVesterPairAmount);
    const stakedTokens = processedData.bonusDfxInFeeDfx;
    const divisor = multiplierPointsAmount.add(stakedTokens);
    if (divisor.gt(0)) {
      maxUnstakeableDfx = availableTokens.mul(stakedTokens).div(divisor);
    }
  }

  const showStakeDfxModal = () => {
    if (!isDfxTransferEnabled) {
      helperToast.error(t`DFX transfers not yet enabled`);
      return;
    }

    setIsStakeModalVisible(true);
    setStakeModalTitle(t`Stake DFX`);
    setStakeModalMaxAmount(processedData.dfxBalance);
    setStakeValue("");
    setStakingTokenSymbol("DFX");
    setStakingTokenAddress(dfxAddress);
    setStakingFarmAddress(stakedDfxTrackerAddress);
    setStakeMethodName("stakeDfx");
  };

  const showStakeEsDfxModal = () => {
    setIsStakeModalVisible(true);
    setStakeModalTitle(t`Stake esDFX`);
    setStakeModalMaxAmount(processedData.esDfxBalance);
    setStakeValue("");
    setStakingTokenSymbol("esDFX");
    setStakingTokenAddress(esDfxAddress);
    setStakingFarmAddress(AddressZero);
    setStakeMethodName("stakeEsDfx");
  };

  const showDfxVesterDepositModal = () => {
    let remainingVestableAmount = vestingData.dfxVester.maxVestableAmount.sub(vestingData.dfxVester.vestedAmount);
    if (processedData.esDfxBalance.lt(remainingVestableAmount)) {
      remainingVestableAmount = processedData.esDfxBalance;
    }

    setIsVesterDepositModalVisible(true);
    setVesterDepositTitle(t`DFX Vault`);
    setVesterDepositStakeTokenLabel("staked DFX + esDFX + Multiplier Points");
    setVesterDepositMaxAmount(remainingVestableAmount);
    setVesterDepositBalance(processedData.esDfxBalance);
    setVesterDepositEscrowedBalance(vestingData.dfxVester.escrowedBalance);
    setVesterDepositVestedAmount(vestingData.dfxVester.vestedAmount);
    setVesterDepositMaxVestableAmount(vestingData.dfxVester.maxVestableAmount);
    setVesterDepositAverageStakedAmount(vestingData.dfxVester.averageStakedAmount);
    setVesterDepositReserveAmount(vestingData.dfxVester.pairAmount);
    setVesterDepositMaxReserveAmount(totalRewardTokens);
    setVesterDepositValue("");
    setVesterDepositAddress(dfxVesterAddress);
  };

  const showDlpVesterDepositModal = () => {
    let remainingVestableAmount = vestingData.dlpVester.maxVestableAmount.sub(vestingData.dlpVester.vestedAmount);
    if (processedData.esDfxBalance.lt(remainingVestableAmount)) {
      remainingVestableAmount = processedData.esDfxBalance;
    }

    setIsVesterDepositModalVisible(true);
    setVesterDepositTitle(t`DLP Vault`);
    setVesterDepositStakeTokenLabel("staked DLP");
    setVesterDepositMaxAmount(remainingVestableAmount);
    setVesterDepositBalance(processedData.esDfxBalance);
    setVesterDepositEscrowedBalance(vestingData.dlpVester.escrowedBalance);
    setVesterDepositVestedAmount(vestingData.dlpVester.vestedAmount);
    setVesterDepositMaxVestableAmount(vestingData.dlpVester.maxVestableAmount);
    setVesterDepositAverageStakedAmount(vestingData.dlpVester.averageStakedAmount);
    setVesterDepositReserveAmount(vestingData.dlpVester.pairAmount);
    setVesterDepositMaxReserveAmount(processedData.dlpBalance);
    setVesterDepositValue("");
    setVesterDepositAddress(dlpVesterAddress);
  };

  const showDfxVesterWithdrawModal = () => {
    if (!vestingData || !vestingData.dfxVesterVestedAmount || vestingData.dfxVesterVestedAmount.eq(0)) {
      helperToast.error(t`You have not deposited any tokens for vesting.`);
      return;
    }

    setIsVesterWithdrawModalVisible(true);
    setVesterWithdrawTitle(t`Withdraw from DFX Vault`);
    setVesterWithdrawAddress(dfxVesterAddress);
  };

  const showDlpVesterWithdrawModal = () => {
    if (!vestingData || !vestingData.dlpVesterVestedAmount || vestingData.dlpVesterVestedAmount.eq(0)) {
      helperToast.error(t`You have not deposited any tokens for vesting.`);
      return;
    }

    setIsVesterWithdrawModalVisible(true);
    setVesterWithdrawTitle(t`Withdraw from DLP Vault`);
    setVesterWithdrawAddress(dlpVesterAddress);
  };

  const showUnstakeDfxModal = () => {
    if (!isDfxTransferEnabled) {
      helperToast.error(t`DFX transfers not yet enabled`);
      return;
    }
    setIsUnstakeModalVisible(true);
    setUnstakeModalTitle(t`Unstake DFX`);
    let maxAmount = processedData.dfxInStakedDfx;
    if (
      processedData.dfxInStakedDfx &&
      vestingData &&
      vestingData.dfxVesterPairAmount.gt(0) &&
      maxUnstakeableDfx &&
      maxUnstakeableDfx.lt(processedData.dfxInStakedDfx)
    ) {
      maxAmount = maxUnstakeableDfx;
    }
    setUnstakeModalMaxAmount(maxAmount);
    setUnstakeModalReservedAmount(vestingData.dfxVesterPairAmount);
    setUnstakeValue("");
    setUnstakingTokenSymbol("DFX");
    setUnstakeMethodName("unstakeDfx");
  };

  const showUnstakeEsDfxModal = () => {
    setIsUnstakeModalVisible(true);
    setUnstakeModalTitle(t`Unstake esDFX`);
    let maxAmount = processedData.esDfxInStakedDfx;
    if (
      processedData.esDfxInStakedDfx &&
      vestingData &&
      vestingData.dfxVesterPairAmount.gt(0) &&
      maxUnstakeableDfx &&
      maxUnstakeableDfx.lt(processedData.esDfxInStakedDfx)
    ) {
      maxAmount = maxUnstakeableDfx;
    }
    setUnstakeModalMaxAmount(maxAmount);
    setUnstakeModalReservedAmount(vestingData.dfxVesterPairAmount);
    setUnstakeValue("");
    setUnstakingTokenSymbol("esDFX");
    setUnstakeMethodName("unstakeEsDfx");
  };

  const renderMultiplierPointsLabel = useCallback(() => {
    return t`Multiplier Points APR`;
  }, []);

  const renderMultiplierPointsValue = useCallback(() => {
    return (
      <Tooltip
        handle={`100.00%`}
        position="right-bottom"
        renderContent={() => {
          return (
            <Trans>
              Boost your rewards with Multiplier Points.&nbsp;
              <ExternalLink href="https://docs.dfx.so">More info</ExternalLink>.
            </Trans>
          );
        }}
      />
    );
  }, []);

  let earnMsg;
  if (totalRewardTokensAndDlp && totalRewardTokensAndDlp.gt(0)) {
    let dfxAmountStr;
    if (processedData.dfxInStakedDfx && processedData.dfxInStakedDfx.gt(0)) {
      dfxAmountStr = formatAmount(processedData.dfxInStakedDfx, 18, 2, true) + " DFX";
    }
    let esDfxAmountStr;
    if (processedData.esDfxInStakedDfx && processedData.esDfxInStakedDfx.gt(0)) {
      esDfxAmountStr = formatAmount(processedData.esDfxInStakedDfx, 18, 2, true) + " esDFX";
    }
    let mpAmountStr;
    if (processedData.bonusDfxInFeeDfx && processedData.bnDfxInFeeDfx.gt(0)) {
      mpAmountStr = formatAmount(processedData.bnDfxInFeeDfx, 18, 2, true) + " MP";
    }
    let dlpStr;
    if (processedData.dlpBalance && processedData.dlpBalance.gt(0)) {
      dlpStr = formatAmount(processedData.dlpBalance, 18, 2, true) + " DLP";
    }
    const amountStr = [dfxAmountStr, esDfxAmountStr, mpAmountStr, dlpStr].filter((s) => s).join(", ");
    earnMsg = (
      <div>
        <Trans>
          You are earning {nativeTokenSymbol} rewards with {formatAmount(totalRewardTokensAndDlp, 18, 2, true)} tokens.
          <br />
          Tokens: {amountStr}.
        </Trans>
      </div>
    );
  }

  return (
    <div className="default-container page-layout">
      <StakeModal
        isVisible={isStakeModalVisible}
        setIsVisible={setIsStakeModalVisible}
        chainId={chainId}
        title={stakeModalTitle}
        maxAmount={stakeModalMaxAmount}
        value={stakeValue}
        setValue={setStakeValue}
        active={active}
        account={account}
        signer={signer}
        stakingTokenSymbol={stakingTokenSymbol}
        stakingTokenAddress={stakingTokenAddress}
        farmAddress={stakingFarmAddress}
        rewardRouterAddress={rewardRouterAddress}
        stakeMethodName={stakeMethodName}
        hasMultiplierPoints={hasMultiplierPoints}
        setPendingTxns={setPendingTxns}
        nativeTokenSymbol={nativeTokenSymbol}
        wrappedTokenSymbol={wrappedTokenSymbol}
      />
      <UnstakeModal
        setPendingTxns={setPendingTxns}
        isVisible={isUnstakeModalVisible}
        setIsVisible={setIsUnstakeModalVisible}
        chainId={chainId}
        title={unstakeModalTitle}
        maxAmount={unstakeModalMaxAmount}
        reservedAmount={unstakeModalReservedAmount}
        value={unstakeValue}
        setValue={setUnstakeValue}
        signer={signer}
        unstakingTokenSymbol={unstakingTokenSymbol}
        rewardRouterAddress={rewardRouterAddress}
        unstakeMethodName={unstakeMethodName}
        multiplierPointsAmount={multiplierPointsAmount}
        bonusDfxInFeeDfx={bonusDfxInFeeDfx}
      />
      <VesterDepositModal
        isVisible={isVesterDepositModalVisible}
        setIsVisible={setIsVesterDepositModalVisible}
        chainId={chainId}
        title={vesterDepositTitle}
        stakeTokenLabel={vesterDepositStakeTokenLabel}
        maxAmount={vesterDepositMaxAmount}
        balance={vesterDepositBalance}
        escrowedBalance={vesterDepositEscrowedBalance}
        vestedAmount={vesterDepositVestedAmount}
        averageStakedAmount={vesterDepositAverageStakedAmount}
        maxVestableAmount={vesterDepositMaxVestableAmount}
        reserveAmount={vesterDepositReserveAmount}
        maxReserveAmount={vesterDepositMaxReserveAmount}
        value={vesterDepositValue}
        setValue={setVesterDepositValue}
        signer={signer}
        vesterAddress={vesterDepositAddress}
        setPendingTxns={setPendingTxns}
      />
      <VesterWithdrawModal
        isVisible={isVesterWithdrawModalVisible}
        setIsVisible={setIsVesterWithdrawModalVisible}
        vesterAddress={vesterWithdrawAddress}
        chainId={chainId}
        title={vesterWithdrawTitle}
        signer={signer}
        setPendingTxns={setPendingTxns}
      />
      <CompoundModal
        active={active}
        account={account}
        setPendingTxns={setPendingTxns}
        isVisible={isCompoundModalVisible}
        setIsVisible={setIsCompoundModalVisible}
        rewardRouterAddress={rewardRouterAddress}
        totalVesterRewards={processedData.totalVesterRewards}
        wrappedTokenSymbol={wrappedTokenSymbol}
        nativeTokenSymbol={nativeTokenSymbol}
        signer={signer}
        chainId={chainId}
      />
      <ClaimModal
        active={active}
        account={account}
        setPendingTxns={setPendingTxns}
        isVisible={isClaimModalVisible}
        setIsVisible={setIsClaimModalVisible}
        rewardRouterAddress={rewardRouterAddress}
        totalVesterRewards={processedData.totalVesterRewards}
        wrappedTokenSymbol={wrappedTokenSymbol}
        nativeTokenSymbol={nativeTokenSymbol}
        signer={signer}
        chainId={chainId}
      />
      <div className="section-title-block">
        <div className="section-title-icon"></div>
        <div className="section-title-content">
          <div className="Page-title">
            <Trans>Earn</Trans>
          </div>
          <div className="Page-description">
            <Trans>
              Stake <ExternalLink href="https://docs.dfx.so">DFX</ExternalLink> and{" "}
              <ExternalLink href="https://docs.dfx.so">DLP</ExternalLink> to earn rewards.
            </Trans>
          </div>
          {earnMsg && <div className="Page-description">{earnMsg}</div>}
        </div>
      </div>
      <div className="StakeV2-content">
        <div className="StakeV2-cards">
          <div className="App-card StakeV2-dfx-card">
            <div className="App-card-title">DFX</div>
            <div className="App-card-divider"></div>
            <div className="App-card-content">
              <div className="App-card-row">
                <div className="label">
                  <Trans>Price</Trans>
                </div>
                <div>
                  {!dfxPrice && "..."}
                  {dfxPrice && (
                    <Tooltip
                      position="right-bottom"
                      className="nowrap"
                      handle={"$" + formatAmount(dfxPrice, USD_DECIMALS, 2, true)}
                      renderContent={() => (
                        <>
                          <StatsTooltipRow
                            label={t`Price on Avalanche`}
                            value={formatAmount(dfxPriceFromAvalanche, USD_DECIMALS, 2, true)}
                          />
                          <StatsTooltipRow
                            label={t`Price on Arbitrum`}
                            value={formatAmount(dfxPriceFromArbitrum, USD_DECIMALS, 2, true)}
                          />
                        </>
                      )}
                    />
                  )}
                </div>
              </div>
              <div className="App-card-row">
                <div className="label">
                  <Trans>Wallet</Trans>
                </div>
                <div>
                  {formatKeyAmount(processedData, "dfxBalance", 18, 2, true)} DFX ($
                  {formatKeyAmount(processedData, "dfxBalanceUsd", USD_DECIMALS, 2, true)})
                </div>
              </div>
              <div className="App-card-row">
                <div className="label">
                  <Trans>Staked</Trans>
                </div>
                <div>
                  {formatKeyAmount(processedData, "dfxInStakedDfx", 18, 2, true)} DFX ($
                  {formatKeyAmount(processedData, "dfxInStakedDfxUsd", USD_DECIMALS, 2, true)})
                </div>
              </div>
              <div className="App-card-divider"></div>
              <div className="App-card-row">
                <div className="label">
                  <Trans>APR</Trans>
                </div>
                <div>
                  <Tooltip
                    handle={`${formatKeyAmount(processedData, "dfxAprTotalWithBoost", 2, 2, true)}%`}
                    position="right-bottom"
                    renderContent={() => (
                      <DFXAprTooltip processedData={processedData} nativeTokenSymbol={nativeTokenSymbol} />
                    )}
                  />
                </div>
              </div>
              <div className="App-card-row">
                <div className="label">
                  <Trans>Rewards</Trans>
                </div>
                <div>
                  <Tooltip
                    handle={`$${formatKeyAmount(processedData, "totalDfxRewardsUsd", USD_DECIMALS, 2, true)}`}
                    position="right-bottom"
                    renderContent={() => {
                      return (
                        <>
                          <StatsTooltipRow
                            label={`${nativeTokenSymbol} (${wrappedTokenSymbol})`}
                            value={`${formatKeyAmount(
                              processedData,
                              "feeDfxTrackerRewards",
                              18,
                              4
                            )} ($${formatKeyAmount(processedData, "feeDfxTrackerRewardsUsd", USD_DECIMALS, 2, true)})`}
                            showDollar={false}
                          />
                          <StatsTooltipRow
                            label="Escrowed DFX"
                            value={`${formatKeyAmount(
                              processedData,
                              "stakedDfxTrackerRewards",
                              18,
                              4
                            )} ($${formatKeyAmount(
                              processedData,
                              "stakedDfxTrackerRewardsUsd",
                              USD_DECIMALS,
                              2,
                              true
                            )})`}
                            showDollar={false}
                          />
                        </>
                      );
                    }}
                  />
                </div>
              </div>
              <div className="App-card-row">
                <div className="label">{renderMultiplierPointsLabel()}</div>
                <div>{renderMultiplierPointsValue()}</div>
              </div>
              <div className="App-card-row">
                <div className="label">
                  <Trans>Boost Percentage</Trans>
                </div>
                <div>
                  <Tooltip
                    handle={`${formatAmount(processedData.boostBasisPoints, 2, 2, false)}%`}
                    position="right-bottom"
                    renderContent={() => {
                      return (
                        <div>
                          <Trans>
                            You are earning {formatAmount(processedData.boostBasisPoints, 2, 2, false)}% more{" "}
                            {nativeTokenSymbol} rewards using{" "}
                            {formatAmount(processedData.bnDfxInFeeDfx, 18, 4, 2, true)} Staked Multiplier Points.
                          </Trans>
                          <br />
                          <br />
                          <Trans>Use the "Compound" button to stake your Multiplier Points.</Trans>
                        </div>
                      );
                    }}
                  />
                </div>
              </div>
              <div className="App-card-divider"></div>
              <div className="App-card-row">
                <div className="label">
                  <Trans>Total Staked</Trans>
                </div>
                <div>
                  {!totalDfxStaked && "..."}
                  {totalDfxStaked && (
                    <Tooltip
                      position="right-bottom"
                      className="nowrap"
                      handle={
                        formatAmount(totalDfxStaked, 18, 0, true) +
                        " DFX" +
                        ` ($${formatAmount(stakedDfxSupplyUsd, USD_DECIMALS, 0, true)})`
                      }
                      renderContent={() => (
                        <StatsTooltip
                          showDollar={false}
                          title={t`Staked`}
                          avaxValue={avaxDfxStaked}
                          arbitrumValue={arbitrumDfxStaked}
                          total={totalDfxStaked}
                          decimalsForConversion={18}
                          symbol="DFX"
                        />
                      )}
                    />
                  )}
                </div>
              </div>
              <div className="App-card-row">
                <div className="label">
                  <Trans>Total Supply</Trans>
                </div>
                {!totalDfxSupply && "..."}
                {totalDfxSupply && (
                  <div>
                    {formatAmount(totalDfxSupply, 18, 0, true)} DFX ($
                    {formatAmount(totalSupplyUsd, USD_DECIMALS, 0, true)})
                  </div>
                )}
              </div>
              <div className="App-card-divider" />
              <div className="App-card-buttons m-0">
                <Button variant="semi-clear" to="/buy_dfx">
                  <Trans>Buy DFX</Trans>
                </Button>
                {active && (
                  <Button variant="semi-clear" onClick={() => showStakeDfxModal()}>
                    <Trans>Stake</Trans>
                  </Button>
                )}
                {active && (
                  <Button variant="semi-clear" onClick={() => showUnstakeDfxModal()}>
                    <Trans>Unstake</Trans>
                  </Button>
                )}
                {active && (
                  <Button variant="semi-clear" to="/begin_account_transfer">
                    <Trans>Transfer Account</Trans>
                  </Button>
                )}
              </div>
            </div>
          </div>
          <div className="App-card primary StakeV2-total-rewards-card">
            <div className="App-card-title">
              <Trans>Total Rewards</Trans>
            </div>
            <div className="App-card-divider"></div>
            <div className="App-card-content">
              <div className="App-card-row">
                <div className="label">
                  {nativeTokenSymbol} ({wrappedTokenSymbol})
                </div>
                <div>
                  {formatKeyAmount(processedData, "totalNativeTokenRewards", 18, 4, true)} ($
                  {formatKeyAmount(processedData, "totalNativeTokenRewardsUsd", USD_DECIMALS, 2, true)})
                </div>
              </div>
              <div className="App-card-row">
                <div className="label">DFX</div>
                <div>
                  {formatKeyAmount(processedData, "totalVesterRewards", 18, 4, true)} ($
                  {formatKeyAmount(processedData, "totalVesterRewardsUsd", USD_DECIMALS, 2, true)})
                </div>
              </div>
              <div className="App-card-row">
                <div className="label">
                  <Trans>Escrowed DFX</Trans>
                </div>
                <div>
                  {formatKeyAmount(processedData, "totalEsDfxRewards", 18, 4, true)} ($
                  {formatKeyAmount(processedData, "totalEsDfxRewardsUsd", USD_DECIMALS, 2, true)})
                </div>
              </div>
              <div className="App-card-row">
                <div className="label">
                  <Trans>Multiplier Points</Trans>
                </div>
                <div>{formatKeyAmount(processedData, "bonusDfxTrackerRewards", 18, 4, true)}</div>
              </div>
              <div className="App-card-row">
                <div className="label">
                  <Trans>Staked Multiplier Points</Trans>
                </div>
                <div>{formatKeyAmount(processedData, "bnDfxInFeeDfx", 18, 4, true)}</div>
              </div>
              <div className="App-card-row">
                <div className="label">
                  <Trans>Total</Trans>
                </div>
                <div>${formatKeyAmount(processedData, "totalRewardsUsd", USD_DECIMALS, 2, true)}</div>
              </div>
              <div className="App-card-footer">
                <div className="App-card-divider"></div>
                <div className="App-card-buttons m-0">
                  {active && (
                    <Button variant="semi-clear" onClick={() => setIsCompoundModalVisible(true)}>
                      <Trans>Compound</Trans>
                    </Button>
                  )}
                  {active && (
                    <Button variant="semi-clear" onClick={() => setIsClaimModalVisible(true)}>
                      <Trans>Claim</Trans>
                    </Button>
                  )}
                  {!active && (
                    <Button variant="semi-clear" onClick={openConnectModal}>
                      <Trans>Connect Wallet</Trans>
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>
          <div className="App-card">
            <div className="App-card-title">DLP ({chainName})</div>
            <div className="App-card-divider"></div>
            <div className="App-card-content">
              <div className="App-card-row">
                <div className="label">
                  <Trans>Price</Trans>
                </div>
                <div>${formatKeyAmount(processedData, "dlpPrice", USD_DECIMALS, 3, true)}</div>
              </div>
              <div className="App-card-row">
                <div className="label">
                  <Trans>Wallet</Trans>
                </div>
                <div>
                  {formatKeyAmount(processedData, "dlpBalance", DLP_DECIMALS, 2, true)} DLP ($
                  {formatKeyAmount(processedData, "dlpBalanceUsd", USD_DECIMALS, 2, true)})
                </div>
              </div>
              <div className="App-card-row">
                <div className="label">
                  <Trans>Staked</Trans>
                </div>
                <div>
                  {formatKeyAmount(processedData, "dlpBalance", DLP_DECIMALS, 2, true)} DLP ($
                  {formatKeyAmount(processedData, "dlpBalanceUsd", USD_DECIMALS, 2, true)})
                </div>
              </div>
              <div className="App-card-divider"></div>
              <div className="App-card-row">
                <div className="label">
                  <Trans>APR</Trans>
                </div>
                <div>
                  <Tooltip
                    handle={`${formatKeyAmount(processedData, "dlpAprTotal", 2, 2, true)}%`}
                    position="right-bottom"
                    renderContent={() => {
                      return (
                        <>
                          <StatsTooltipRow
                            label={`${nativeTokenSymbol} (${wrappedTokenSymbol}) APR`}
                            value={`${formatKeyAmount(processedData, "dlpAprForNativeToken", 2, 2, true)}%`}
                            showDollar={false}
                          />

                          {processedData?.dlpAprForEsDfx.gt(0) && (
                            <StatsTooltipRow
                              label="Escrowed DFX APR"
                              value={`${formatKeyAmount(processedData, "dlpAprForEsDfx", 2, 2, true)}%`}
                              showDollar={false}
                            />
                          )}

                          <br />

                          <Trans>
                            APRs are updated weekly on Wednesday and will depend on the fees collected for the week.{" "}
                            <br />
                            <br />
                            Historical DLP APRs can be checked in this{" "}
                            <ExternalLink href="https://dune.com/saulius/dfx-analytics">
                              community dashboard
                            </ExternalLink>
                            .
                          </Trans>
                        </>
                      );
                    }}
                  />
                </div>
              </div>
              <div className="App-card-row">
                <div className="label">
                  <Trans>Rewards</Trans>
                </div>
                <div>
                  <Tooltip
                    handle={`$${formatKeyAmount(processedData, "totalDlpRewardsUsd", USD_DECIMALS, 2, true)}`}
                    position="right-bottom"
                    renderContent={() => {
                      return (
                        <>
                          <StatsTooltipRow
                            label={`${nativeTokenSymbol} (${wrappedTokenSymbol})`}
                            value={`${formatKeyAmount(
                              processedData,
                              "feeDlpTrackerRewards",
                              18,
                              4
                            )} ($${formatKeyAmount(processedData, "feeDlpTrackerRewardsUsd", USD_DECIMALS, 2, true)})`}
                            showDollar={false}
                          />
                          <StatsTooltipRow
                            label="Escrowed DFX"
                            value={`${formatKeyAmount(
                              processedData,
                              "stakedDlpTrackerRewards",
                              18,
                              4
                            )} ($${formatKeyAmount(
                              processedData,
                              "stakedDlpTrackerRewardsUsd",
                              USD_DECIMALS,
                              2,
                              true
                            )})`}
                            showDollar={false}
                          />
                        </>
                      );
                    }}
                  />
                </div>
              </div>
              <div className="App-card-divider"></div>
              <div className="App-card-row">
                <div className="label">
                  <Trans>Total Staked</Trans>
                </div>
                <div>
                  {formatKeyAmount(processedData, "dlpSupply", 18, 2, true)} DLP ($
                  {formatKeyAmount(processedData, "dlpSupplyUsd", USD_DECIMALS, 2, true)})
                </div>
              </div>
              <div className="App-card-row">
                <div className="label">
                  <Trans>Total Supply</Trans>
                </div>
                <div>
                  {formatKeyAmount(processedData, "dlpSupply", 18, 2, true)} DLP ($
                  {formatKeyAmount(processedData, "dlpSupplyUsd", USD_DECIMALS, 2, true)})
                </div>
              </div>
              <div className="App-card-divider"></div>
              <div className="App-card-buttons m-0">
                <Button variant="semi-clear" to="/buy_dlp">
                  <Trans>Buy DLP</Trans>
                </Button>
                <Button variant="semi-clear" to="/buy_dlp#redeem">
                  <Trans>Sell DLP</Trans>
                </Button>
                {hasInsurance && (
                  <Button
                    variant="semi-clear"
                    to="https://app.insurace.io/Insurance/Cart?id=124&referrer=545066382753150189457177837072918687520318754040"
                  >
                    <Trans>Purchase Insurance</Trans>
                  </Button>
                )}
              </div>
            </div>
          </div>
          <div className="App-card">
            <div className="App-card-title">
              <Trans>Escrowed DFX</Trans>
            </div>
            <div className="App-card-divider"></div>
            <div className="App-card-content">
              <div className="App-card-row">
                <div className="label">
                  <Trans>Price</Trans>
                </div>
                <div>${formatAmount(dfxPrice, USD_DECIMALS, 2, true)}</div>
              </div>
              <div className="App-card-row">
                <div className="label">
                  <Trans>Wallet</Trans>
                </div>
                <div>
                  {formatKeyAmount(processedData, "esDfxBalance", 18, 2, true)} esDFX ($
                  {formatKeyAmount(processedData, "esDfxBalanceUsd", USD_DECIMALS, 2, true)})
                </div>
              </div>
              <div className="App-card-row">
                <div className="label">
                  <Trans>Staked</Trans>
                </div>
                <div>
                  {formatKeyAmount(processedData, "esDfxInStakedDfx", 18, 2, true)} esDFX ($
                  {formatKeyAmount(processedData, "esDfxInStakedDfxUsd", USD_DECIMALS, 2, true)})
                </div>
              </div>
              <div className="App-card-divider"></div>
              <div className="App-card-row">
                <div className="label">
                  <Trans>APR</Trans>
                </div>
                <div>
                  <Tooltip
                    handle={`${formatKeyAmount(processedData, "dfxAprTotalWithBoost", 2, 2, true)}%`}
                    position="right-bottom"
                    renderContent={() => (
                      <DFXAprTooltip processedData={processedData} nativeTokenSymbol={nativeTokenSymbol} />
                    )}
                  />
                </div>
              </div>
              <div className="App-card-row">
                <div className="label">{renderMultiplierPointsLabel()}</div>
                <div>{renderMultiplierPointsValue()}</div>
              </div>
              <div className="App-card-divider"></div>
              <div className="App-card-row">
                <div className="label">
                  <Trans>Total Staked</Trans>
                </div>
                <div>
                  {formatKeyAmount(processedData, "stakedEsDfxSupply", 18, 0, true)} esDFX ($
                  {formatKeyAmount(processedData, "stakedEsDfxSupplyUsd", USD_DECIMALS, 0, true)})
                </div>
              </div>
              <div className="App-card-row">
                <div className="label">
                  <Trans>Total Supply</Trans>
                </div>
                <div>
                  {formatAmount(esDfxSupply, 18, 0, true)} esDFX (${formatAmount(esDfxSupplyUsd, USD_DECIMALS, 0, true)}
                  )
                </div>
              </div>
              <div className="App-card-divider"></div>
              <div className="App-card-buttons m-0">
                {active && (
                  <Button variant="semi-clear" onClick={() => showStakeEsDfxModal()}>
                    <Trans>Stake</Trans>
                  </Button>
                )}
                {active && (
                  <Button variant="semi-clear" onClick={() => showUnstakeEsDfxModal()}>
                    <Trans>Unstake</Trans>
                  </Button>
                )}
                {!active && (
                  <Button variant="semi-clear" onClick={openConnectModal}>
                    <Trans> Connect Wallet</Trans>
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div>
        <div className="Tab-title-section">
          <div className="Page-title">
            <Trans>Vest</Trans>
          </div>
          <div className="Page-description">
            <Trans>
              Convert esDFX tokens to DFX tokens.
              <br />
              Please read the{" "}
              <ExternalLink href="https://docs.dfx.so">vesting details</ExternalLink> before
              using the vaults.
            </Trans>
          </div>
        </div>
        <div>
          <div className="StakeV2-cards">
            <div className="App-card StakeV2-dfx-card">
              <div className="App-card-title">
                <Trans>DFX Vault</Trans>
              </div>
              <div className="App-card-divider"></div>
              <div className="App-card-content">
                <div className="App-card-row">
                  <div className="label">
                    <Trans>Staked Tokens</Trans>
                  </div>
                  <div>
                    <Tooltip
                      handle={formatAmount(totalRewardTokens, 18, 2, true)}
                      position="right-bottom"
                      renderContent={() => {
                        return (
                          <>
                            <StatsTooltipRow
                              showDollar={false}
                              label="DFX"
                              value={formatAmount(processedData.dfxInStakedDfx, 18, 2, true)}
                            />

                            <StatsTooltipRow
                              showDollar={false}
                              label="esDFX"
                              value={formatAmount(processedData.esDfxInStakedDfx, 18, 2, true)}
                            />
                            <StatsTooltipRow
                              showDollar={false}
                              label="Multiplier Points"
                              value={formatAmount(processedData.bnDfxInFeeDfx, 18, 2, true)}
                            />
                          </>
                        );
                      }}
                    />
                  </div>
                </div>
                <div className="App-card-row">
                  <div className="label">
                    <Trans>Reserved for Vesting</Trans>
                  </div>
                  <div>
                    {formatKeyAmount(vestingData, "dfxVesterPairAmount", 18, 2, true)} /{" "}
                    {formatAmount(totalRewardTokens, 18, 2, true)}
                  </div>
                </div>
                <div className="App-card-row">
                  <div className="label">
                    <Trans>Vesting Status</Trans>
                  </div>
                  <div>
                    <Tooltip
                      handle={`${formatKeyAmount(vestingData, "dfxVesterClaimSum", 18, 4, true)} / ${formatKeyAmount(
                        vestingData,
                        "dfxVesterVestedAmount",
                        18,
                        4,
                        true
                      )}`}
                      position="right-bottom"
                      renderContent={() => {
                        return (
                          <div>
                            <Trans>
                              {formatKeyAmount(vestingData, "dfxVesterClaimSum", 18, 4, true)} tokens have been
                              converted to DFX from the{" "}
                              {formatKeyAmount(vestingData, "dfxVesterVestedAmount", 18, 4, true)} esDFX deposited for
                              vesting.
                            </Trans>
                          </div>
                        );
                      }}
                    />
                  </div>
                </div>
                <div className="App-card-row">
                  <div className="label">
                    <Trans>Claimable</Trans>
                  </div>
                  <div>
                    <Tooltip
                      handle={`${formatKeyAmount(vestingData, "dfxVesterClaimable", 18, 4, true)} DFX`}
                      position="right-bottom"
                      renderContent={() => (
                        <Trans>
                          {formatKeyAmount(vestingData, "dfxVesterClaimable", 18, 4, true)} DFX tokens can be claimed,
                          use the options under the Total Rewards section to claim them.
                        </Trans>
                      )}
                    />
                  </div>
                </div>
                <div className="App-card-divider"></div>
                <div className="App-card-buttons m-0">
                  {!active && (
                    <Button variant="semi-clear" onClick={openConnectModal}>
                      <Trans>Connect Wallet</Trans>
                    </Button>
                  )}
                  {active && (
                    <Button variant="semi-clear" onClick={() => showDfxVesterDepositModal()}>
                      <Trans>Deposit</Trans>
                    </Button>
                  )}
                  {active && (
                    <Button variant="semi-clear" onClick={() => showDfxVesterWithdrawModal()}>
                      <Trans>Withdraw</Trans>
                    </Button>
                  )}
                </div>
              </div>
            </div>
            <div className="App-card StakeV2-dfx-card">
              <div className="App-card-title">
                <Trans>DLP Vault</Trans>
              </div>
              <div className="App-card-divider"></div>
              <div className="App-card-content">
                <div className="App-card-row">
                  <div className="label">
                    <Trans>Staked Tokens</Trans>
                  </div>
                  <div>{formatAmount(processedData.dlpBalance, 18, 2, true)} DLP</div>
                </div>
                <div className="App-card-row">
                  <div className="label">
                    <Trans>Reserved for Vesting</Trans>
                  </div>
                  <div>
                    {formatKeyAmount(vestingData, "dlpVesterPairAmount", 18, 2, true)} /{" "}
                    {formatAmount(processedData.dlpBalance, 18, 2, true)}
                  </div>
                </div>
                <div className="App-card-row">
                  <div className="label">
                    <Trans>Vesting Status</Trans>
                  </div>
                  <div>
                    <Tooltip
                      handle={`${formatKeyAmount(vestingData, "dlpVesterClaimSum", 18, 4, true)} / ${formatKeyAmount(
                        vestingData,
                        "dlpVesterVestedAmount",
                        18,
                        4,
                        true
                      )}`}
                      position="right-bottom"
                      renderContent={() => {
                        return (
                          <div>
                            <Trans>
                              {formatKeyAmount(vestingData, "dlpVesterClaimSum", 18, 4, true)} tokens have been
                              converted to DFX from the{" "}
                              {formatKeyAmount(vestingData, "dlpVesterVestedAmount", 18, 4, true)} esDFX deposited for
                              vesting.
                            </Trans>
                          </div>
                        );
                      }}
                    />
                  </div>
                </div>
                <div className="App-card-row">
                  <div className="label">
                    <Trans>Claimable</Trans>
                  </div>
                  <div>
                    <Tooltip
                      handle={`${formatKeyAmount(vestingData, "dlpVesterClaimable", 18, 4, true)} DFX`}
                      position="right-bottom"
                      renderContent={() => (
                        <Trans>
                          {formatKeyAmount(vestingData, "dlpVesterClaimable", 18, 4, true)} DFX tokens can be claimed,
                          use the options under the Total Rewards section to claim them.
                        </Trans>
                      )}
                    />
                  </div>
                </div>
                <div className="App-card-divider"></div>
                <div className="App-card-buttons m-0">
                  {!active && (
                    <Button variant="semi-clear" onClick={openConnectModal}>
                      <Trans>Connect Wallet</Trans>
                    </Button>
                  )}
                  {active && (
                    <Button variant="semi-clear" onClick={() => showDlpVesterDepositModal()}>
                      <Trans>Deposit</Trans>
                    </Button>
                  )}
                  {active && (
                    <Button variant="semi-clear" onClick={() => showDlpVesterWithdrawModal()}>
                      <Trans>Withdraw</Trans>
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
