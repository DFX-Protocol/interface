import React from "react";

import useSWR from "swr";

import {
  PLACEHOLDER_ACCOUNT,
  getBalanceAndSupplyData,
  getDepositBalanceData,
  getVestingData,
  getStakingData,
  getProcessedData,
} from "lib/legacy";

import Vault from "abis/Vault.json";
import ReaderV2 from "abis/ReaderV2.json";
import RewardReader from "abis/RewardReader.json";
import Token from "abis/Token.json";
import DlpManager from "abis/DlpManager.json";

import { useWeb3React } from "@web3-react/core";

import { useDfxPrice } from "domain/legacy";

import { getContract } from "config/contracts";
import { getServerUrl } from "config/backend";
import { contractFetcher } from "lib/contracts";
import { formatKeyAmount } from "lib/numbers";

export default function APRLabel({ chainId, label }) {
  let { active } = useWeb3React();

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

  const dfxVesterAddress = getContract(chainId, "DfxVester");
  const dlpVesterAddress = getContract(chainId, "DlpVester");

  const vesterAddresses = [dfxVesterAddress, dlpVesterAddress];

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
    [`StakeV2:walletBalances:${active}`, chainId, readerAddress, "getTokenBalancesWithSupplies", PLACEHOLDER_ACCOUNT],
    {
      fetcher: contractFetcher(undefined, ReaderV2, [walletTokens]),
    }
  );

  const { data: depositBalances } = useSWR(
    [`StakeV2:depositBalances:${active}`, chainId, rewardReaderAddress, "getDepositBalances", PLACEHOLDER_ACCOUNT],
    {
      fetcher: contractFetcher(undefined, RewardReader, [depositTokens, rewardTrackersForDepositBalances]),
    }
  );

  const { data: stakingInfo } = useSWR(
    [`StakeV2:stakingInfo:${active}`, chainId, rewardReaderAddress, "getStakingInfo", PLACEHOLDER_ACCOUNT],
    {
      fetcher: contractFetcher(undefined, RewardReader, [rewardTrackersForStakingInfo]),
    }
  );

  const { data: stakedDfxSupply } = useSWR(
    [`StakeV2:stakedDfxSupply:${active}`, chainId, dfxAddress, "balanceOf", stakedDfxTrackerAddress],
    {
      fetcher: contractFetcher(undefined, Token),
    }
  );

  const { data: aums } = useSWR([`StakeV2:getAums:${active}`, chainId, dlpManagerAddress, "getAums"], {
    fetcher: contractFetcher(undefined, DlpManager),
  });

  const { data: nativeTokenPrice } = useSWR(
    [`StakeV2:nativeTokenPrice:${active}`, chainId, vaultAddress, "getMinPrice", nativeTokenAddress],
    {
      fetcher: contractFetcher(undefined, Vault),
    }
  );

  const { data: vestingInfo } = useSWR(
    [`StakeV2:vestingInfo:${active}`, chainId, readerAddress, "getVestingInfo", PLACEHOLDER_ACCOUNT],
    {
      fetcher: contractFetcher(undefined, ReaderV2, [vesterAddresses]),
    }
  );

  const { dfxPrice } = useDfxPrice(chainId, {}, active);

  const dfxSupplyUrl = getServerUrl(chainId, "/gmx_supply");
  const { data: dfxSupply } = useSWR([dfxSupplyUrl], {
    fetcher: (...args) => fetch(...args).then((res) => res.text()),
  });

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

  return <>{`${formatKeyAmount(processedData, label, 2, 2, true)}%`}</>;
}
