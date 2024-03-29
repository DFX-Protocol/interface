import { ethers } from "ethers";
import { ARBITRUM, ARBITRUM_TESTNET, AVALANCHE, AVALANCHE_FUJI, MAINNET, TESTNET, HEDERA_TESTNET, SEPOLIA, BASE_TESTNET } from "./chains";

const { AddressZero } = ethers.constants;

export const XGMT_EXCLUDED_ACCOUNTS = [
  "0x330eef6b9b1ea6edd620c825c9919dc8b611d5d5",
  "0xd9b1c23411adbb984b1c4be515fafc47a12898b2",
  "0xa633158288520807f91ccc98aa58e0ea43acb400",
  "0xffd0a93b4362052a336a7b22494f1b77018dd34b",
];

const CONTRACTS = {
  [MAINNET]: {
    // bsc mainnet
    Treasury: "0xa44E7252a0C137748F523F112644042E5987FfC7",
    BUSD: "0xe9e7cea3dedca5984780bafc599bd69add087d56",
    GMT: "0x99e92123eB77Bc8f999316f622e5222498438784",
    Vault: "0xc73A8DcAc88498FD4b4B1b2AaA37b0a2614Ff67B",
    Router: "0xD46B23D042E976F8666F554E928e0Dc7478a8E1f",
    Reader: "0x087A618fD25c92B61254DBe37b09E5E8065FeaE7",
    AmmFactory: "0xBCfCcbde45cE874adCB698cC183deBcF17952812",
    AmmFactoryV2: "0xcA143Ce32Fe78f1f7019d7d551a6402fC5350c73",
    OrderBook: "0x1111111111111111111111111111111111111111",
    OrderBookReader: "0x1111111111111111111111111111111111111111",
    DfxMigrator: "0xDEF2af818514c1Ca1A9bBe2a4D45E28f260063f9",
    USDG: "0x85E76cbf4893c1fbcB34dCF1239A91CE2A4CF5a7",
    NATIVE_TOKEN: "0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c",
    XGMT: "0xe304ff0983922787Fd84BC9170CD21bF78B16B10",
    GMT_USDG_PAIR: "0xa41e57459f09a126F358E118b693789d088eA8A0",
    XGMT_USDG_PAIR: "0x0b622208fc0691C2486A3AE6B7C875b4A174b317",
    GMT_USDG_FARM: "0x3E8B08876c791dC880ADC8f965A02e53Bb9C0422",
    XGMT_USDG_FARM: "0x68D7ee2A16AB7c0Ee1D670BECd144166d2Ae0759",
    USDG_YIELD_TRACKER: "0x0EF0Cf825B8e9F89A43FfD392664131cFB4cfA89",
    XGMT_YIELD_TRACKER: "0x82A012A9b3003b18B6bCd6052cbbef7Fa4892e80",
    GMT_USDG_FARM_TRACKER_XGMT: "0x08FAb024BEfcb6068847726b2eccEAd18b6c23Cd",
    GMT_USDG_FARM_TRACKER_NATIVE: "0xd8E26637B34B2487Cad1f91808878a391134C5c2",
    XGMT_USDG_FARM_TRACKER_XGMT: "0x026A02F7F26C1AFccb9Cba7C4df3Dc810F4e92e8",
    XGMT_USDG_FARM_TRACKER_NATIVE: "0x22458CEbD14a9679b2880147d08CA1ce5aa40E84",
    AUTO: "0xa184088a740c695E156F91f5cC086a06bb78b827",
    AUTO_USDG_PAIR: "0x0523FD5C53ea5419B4DAF656BC1b157dDFE3ce50",
    AUTO_USDG_FARM: "0xE6958298328D02051769282628a3b4178D0F3A47",
    AUTO_USDG_FARM_TRACKER_XGMT: "0x093b8be41c1A30704De84a9521632f9a139c08bd",
    AUTO_USDG_FARM_TRACKER_NATIVE: "0x23ed48E5dce3acC7704d0ce275B7b9a0e346b63A",
    GMT_DFX_IOU: "0x47052469970C2484729875CC9E2dd2683fcE71fb",
    XGMT_DFX_IOU: "0xeB3733DFe3b68C9d26898De2493A3Bb59FDb4A7B",
    GMT_USDG_DFX_IOU: "0x481312655F81b5e249780A6a49735335BF6Ca7f4",
    XGMT_USDG_DFX_IOU: "0x8095F1A92526C304623483018aA28cC6E62EB1e1",
    USDT: AddressZero,
    BTC: AddressZero,
    BNB: AddressZero,
  },
  [TESTNET]: {
    // bsc testnet
    Vault: "0x1B183979a5cd95FAF392c8002dbF0D5A1C687D9a",
    Router: "0x10800f683aa564534497a5b67F45bE3556a955AB",
    Reader: "0x98D4742F1B6a821bae672Cd8721283b91996E454",
    AmmFactory: "0x6725f303b657a9451d8ba641348b6761a6cc7a17",
    AmmFactoryV2: "0x1111111111111111111111111111111111111111",
    OrderBook: "0x9afD7B4f0b58d65F6b2978D3581383a06b2ac4e9",
    OrderBookReader: "0x0713562970D1A802Fa3FeB1D15F9809943982Ea9",
    DfxMigrator: "0xDEF2af818514c1Ca1A9bBe2a4D45E28f260063f9",
    USDG: "0x2D549bdBf810523fe9cd660cC35fE05f0FcAa028",
    GMT: "0xedba0360a44f885ed390fad01aa34d00d2532817",
    NATIVE_TOKEN: "0x612777Eea37a44F7a95E3B101C39e1E2695fa6C2",
    XGMT: "0x28cba798eca1a3128ffd1b734afb93870f22e613",
    GMT_USDG_PAIR: "0xe0b0a315746f51932de033ab27223d85114c6b85",
    XGMT_USDG_PAIR: "0x0108de1eea192ce8448080c3d90a1560cf643fa0",
    GMT_USDG_FARM: "0xbe3cB06CE03cA692b77902040479572Ba8D01b0B",
    XGMT_USDG_FARM: "0x138E92195D4B99CE3618092D3F9FA830d9A69B4b",
    USDG_YIELD_TRACKER: "0x62B49Bc3bF252a5DB26D88ccc7E61119e3179B4f",
    XGMT_YIELD_TRACKER: "0x5F235A582e0993eE9466FeEb8F7B4682993a57d0",
    GMT_USDG_FARM_TRACKER_XGMT: "0x4f8EE3aE1152422cbCaFACd4e3041ba2D859913C",
    GMT_USDG_FARM_TRACKER_NATIVE: "0xd691B26E544Fe370f39A776964c991363aF72e56",
    XGMT_USDG_FARM_TRACKER_XGMT: "0xfd5617CFB082Ba9bcD62d654603972AE312bC695",
    XGMT_USDG_FARM_TRACKER_NATIVE: "0x0354387DD85b7D8aaD1611B3D167A384d6AE0c28",
    GMT_DFX_IOU: "0x47052469970C2484729875CC9E2dd2683fcE71fb",
    XGMT_DFX_IOU: "0xeB3733DFe3b68C9d26898De2493A3Bb59FDb4A7B",
    GMT_USDG_DFX_IOU: "0x481312655F81b5e249780A6a49735335BF6Ca7f4",
    XGMT_USDG_DFX_IOU: "0x8095F1A92526C304623483018aA28cC6E62EB1e1",
  },
  [ARBITRUM_TESTNET]: {
    // arbitrum testnet
    Vault: "0xBc9BC47A7aB63db1E0030dC7B60DDcDe29CF4Ffb",
    Router: "0xe0d4662cdfa2d71477A7DF367d5541421FAC2547",
    VaultReader: "0xFc371E380262536c819D12B9569106bf032cC41c",
    Reader: "0x2E093c70E3A7E4919611d2555dFd8D697d2fC0a1",
    DlpManager: "0xD875d99E09118d2Be80579b9d23E83469077b498",
    RewardRouter: "0x0000000000000000000000000000000000000000",
    RewardReader: "0x0000000000000000000000000000000000000000",
    NATIVE_TOKEN: "0xB47e6A5f8b33b3F17603C83a0535A9dcD7E32681",
    DLP: "0xb4f81Fa74e06b5f762A104e47276BA9b2929cb27",
    DFX: "0x0000000000000000000000000000000000000000",
    ES_DFX: "0x0000000000000000000000000000000000000000",
    BN_DFX: "0x0000000000000000000000000000000000000000",
    USDG: "0xBCDCaF67193Bf5C57be08623278fCB69f4cA9e68",
    ES_DFX_IOU: "0x0000000000000000000000000000000000000000",
    StakedDfxTracker: "0x0000000000000000000000000000000000000000",
    BonusDfxTracker: "0x0000000000000000000000000000000000000000",
    FeeDfxTracker: "0x0000000000000000000000000000000000000000",
    StakedDlpTracker: "0x0000000000000000000000000000000000000000",
    FeeDlpTracker: "0x0000000000000000000000000000000000000000",

    StakedDfxDistributor: "0x0000000000000000000000000000000000000000",
    StakedDlpDistributor: "0x0000000000000000000000000000000000000000",

    DfxVester: "0x0000000000000000000000000000000000000000",
    DlpVester: "0x0000000000000000000000000000000000000000",

    OrderBook: "0xebD147E5136879520dDaDf1cA8FBa48050EFf016",
    OrderBookReader: "0xC492c8d82DC576Ad870707bb40EDb63E2026111E",

    PositionRouter: "0xB4bB78cd12B097603e2b55D2556c09C17a5815F8",
    PositionManager: "0x168aDa266c2f10C1F37973B213d6178551030e44",

    // UniswapDfxEthPool: "0x80A9ae39310abf666A87C743d6ebBD0E8C42158E",
    ReferralStorage: "0x0000000000000000000000000000000000000000",
    ReferralReader: "0x0000000000000000000000000000000000000000",

    Multicall: "0xcA11bde05977b3631167028862bE2a173976CA11",
  },
  [ARBITRUM]: {
    // arbitrum mainnet
    Vault: "0x489ee077994B6658eAfA855C308275EAd8097C4A",
    Router: "0xaBBc5F99639c9B6bCb58544ddf04EFA6802F4064",
    VaultReader: "0xfebB9f4CAC4cD523598fE1C5771181440143F24A",
    Reader: "0x2b43c90D1B727cEe1Df34925bcd5Ace52Ec37694",
    DlpManager: "0x3963FfC9dff443c2A94f21b129D429891E32ec18",
    RewardRouter: "0xA906F338CB21815cBc4Bc87ace9e68c87eF8d8F1",
    DlpRewardRouter: "0xB95DB5B167D75e6d04227CfFFA61069348d271F5",
    RewardReader: "0x8BFb8e82Ee4569aee78D03235ff465Bd436D40E0",
    NATIVE_TOKEN: "0x82aF49447D8a07e3bd95BD0d56f35241523fBab1",
    DLP: "0x4277f8F2c384827B5273592FF7CeBd9f2C1ac258",
    DFX: "0xfc5A1A6EB076a2C7aD06eD22C90d7E710E35ad0a",
    ES_DFX: "0xf42Ae1D54fd613C9bb14810b0588FaAa09a426cA",
    BN_DFX: "0x35247165119B69A40edD5304969560D0ef486921",
    USDG: "0x45096e7aA921f27590f8F19e457794EB09678141",
    ES_DFX_IOU: "0x6260101218eC4cCfFF1b778936C6f2400f95A954",
    StakedDfxTracker: "0x908C4D94D34924765f1eDc22A1DD098397c59dD4",
    BonusDfxTracker: "0x4d268a7d4C16ceB5a606c173Bd974984343fea13",
    FeeDfxTracker: "0xd2D1162512F927a7e282Ef43a362659E4F2a728F",
    StakedDlpTracker: "0x1aDDD80E6039594eE970E5872D247bf0414C8903",
    FeeDlpTracker: "0x4e971a87900b931fF39d1Aad67697F49835400b6",

    StakedDfxDistributor: "0x23208B91A98c7C1CD9FE63085BFf68311494F193",
    StakedDlpDistributor: "0x60519b48ec4183a61ca2B8e37869E675FD203b34",

    DfxVester: "0x199070DDfd1CFb69173aa2F7e20906F26B363004",
    DlpVester: "0xA75287d2f8b217273E7FCD7E86eF07D33972042E",

    OrderBook: "0x09f77E8A13De9a35a7231028187e9fD5DB8a2ACB",
    OrderExecutor: "0x7257ac5D0a0aaC04AA7bA2AC0A6Eb742E332c3fB",
    OrderBookReader: "0xa27C20A7CF0e1C68C0460706bB674f98F362Bc21",

    PositionRouter: "0xb87a436B93fFE9D75c5cFA7bAcFff96430b09868",
    PositionManager: "0x75E42e6f01baf1D6022bEa862A28774a9f8a4A0C",

    UniswapDfxEthPool: "0x80A9ae39310abf666A87C743d6ebBD0E8C42158E",
    ReferralStorage: "0xe6fab3f0c7199b0d34d7fbe83394fc0e0d06e99d",
    ReferralReader: "0x8Aa382760BCdCe8644C33e6C2D52f6304A76F5c8",

    Timelock: "0x8A68a039D555599Fd745f9343e8dE20C9eaFca75",

    Multicall: "0xcA11bde05977b3631167028862bE2a173976CA11",
  },
  [AVALANCHE]: {
    // avalanche
    Vault: "0x9ab2De34A33fB459b538c43f251eB825645e8595",
    Router: "0x5F719c2F1095F7B9fc68a68e35B51194f4b6abe8",
    VaultReader: "0x66eC8fc33A26feAEAe156afA3Cb46923651F6f0D",
    Reader: "0x2eFEE1950ededC65De687b40Fd30a7B5f4544aBd",
    DlpManager: "0xD152c7F25db7F4B95b7658323c5F33d176818EE4",
    RewardRouter: "0x82147C5A7E850eA4E28155DF107F2590fD4ba327",
    DlpRewardRouter: "0xB70B91CE0771d3f4c81D87660f71Da31d48eB3B3",
    RewardReader: "0x04Fc11Bd28763872d143637a7c768bD96E44c1b6",
    NATIVE_TOKEN: "0xB31f66AA3C1e785363F0875A1B74E27b85FD66c7",
    DLP: "0x01234181085565ed162a948b6a5e88758CD7c7b8",
    DFX: "0x62edc0692BD897D2295872a9FFCac5425011c661",
    ES_DFX: "0xFf1489227BbAAC61a9209A08929E4c2a526DdD17",
    BN_DFX: "0x8087a341D32D445d9aC8aCc9c14F5781E04A26d2",
    USDG: "0xc0253c3cC6aa5Ab407b5795a04c28fB063273894",
    ES_DFX_IOU: "0x6260101218eC4cCfFF1b778936C6f2400f95A954", // placeholder address

    StakedDfxTracker: "0x2bD10f8E93B3669b6d42E74eEedC65dd1B0a1342",
    BonusDfxTracker: "0x908C4D94D34924765f1eDc22A1DD098397c59dD4",
    FeeDfxTracker: "0x4d268a7d4C16ceB5a606c173Bd974984343fea13",
    StakedDlpTracker: "0x9e295B5B976a184B14aD8cd72413aD846C299660",
    FeeDlpTracker: "0xd2D1162512F927a7e282Ef43a362659E4F2a728F",

    StakedDfxDistributor: "0xfc5A1A6EB076a2C7aD06eD22C90d7E710E35ad0a",
    StakedDlpDistributor: "0xDd593Cf40734199afc9207eBe9ffF23dA4Bf7720",

    DfxVester: "0x472361d3cA5F49c8E633FB50385BfaD1e018b445",
    DlpVester: "0x62331A7Bd1dfB3A7642B7db50B5509E57CA3154A",

    OrderBook: "0x4296e307f108B2f583FF2F7B7270ee7831574Ae5",
    OrderExecutor: "0x4296e307f108B2f583FF2F7B7270ee7831574Ae5",
    OrderBookReader: "0xccFE3E576f8145403d3ce8f3c2f6519Dae40683B",

    PositionRouter: "0xffF6D276Bc37c61A23f06410Dce4A400f66420f8",
    PositionManager: "0xA21B83E579f4315951bA658654c371520BDcB866",

    TraderJoeDfxAvaxPool: "0x0c91a070f862666bbcce281346be45766d874d98",
    ReferralStorage: "0x827ed045002ecdabeb6e2b0d1604cf5fc3d322f8",
    ReferralReader: "0x505Ce16D3017be7D76a7C2631C0590E71A975083",

    Timelock: "0x8Ea12810271a0fD70bBEB8614B8735621abC3718",

    Multicall: "0xcA11bde05977b3631167028862bE2a173976CA11",
  },

  [AVALANCHE_FUJI]: {
    Vault: AddressZero,
    Router: AddressZero,
    VaultReader: AddressZero,
    Reader: AddressZero,
    DlpManager: AddressZero,
    RewardRouter: AddressZero,
    RewardReader: AddressZero,
    NATIVE_TOKEN: "0x1D308089a2D1Ced3f1Ce36B1FcaF815b07217be3",
    DLP: AddressZero,
    DFX: AddressZero,
    ES_DFX: AddressZero,
    BN_DFX: AddressZero,
    USDG: AddressZero,
    ES_DFX_IOU: AddressZero,

    StakedDfxTracker: AddressZero,
    BonusDfxTracker: AddressZero,
    FeeDfxTracker: AddressZero,
    StakedDlpTracker: AddressZero,
    FeeDlpTracker: AddressZero,

    StakedDfxDistributor: AddressZero,
    StakedDlpDistributor: AddressZero,

    DfxVester: AddressZero,
    DlpVester: AddressZero,

    OrderBook: AddressZero,
    OrderExecutor: AddressZero,
    OrderBookReader: AddressZero,

    PositionRouter: AddressZero,
    PositionManager: AddressZero,

    TraderJoeDfxAvaxPool: AddressZero,
    ReferralStorage: AddressZero,
    ReferralReader: AddressZero,
  },

  // TODO: Update contract addresses
  [HEDERA_TESTNET]: {
    // hedera testnet
    Vault: "0xBc9BC47A7aB63db1E0030dC7B60DDcDe29CF4Ffb",
    Router: "0xe0d4662cdfa2d71477A7DF367d5541421FAC2547",
    VaultReader: "0xFc371E380262536c819D12B9569106bf032cC41c",
    Reader: "0x2E093c70E3A7E4919611d2555dFd8D697d2fC0a1",
    DlpManager: "0xD875d99E09118d2Be80579b9d23E83469077b498",
    RewardRouter: "0x0000000000000000000000000000000000000000",
    RewardReader: "0x0000000000000000000000000000000000000000",
    GlpRewardRouter: "0xB95DB5B167D75e6d04227CfFFA61069348d271F5",
    NATIVE_TOKEN: "0x0000000000000000000000000000000000000000",
    DLP: "0xb4f81Fa74e06b5f762A104e47276BA9b2929cb27",
    DFX: "0x0000000000000000000000000000000000000000",
    ES_DFX: "0x0000000000000000000000000000000000000000",
    BN_DFX: "0x0000000000000000000000000000000000000000",
    USDG: "0xBCDCaF67193Bf5C57be08623278fCB69f4cA9e68",
    ES_DFX_IOU: "0x0000000000000000000000000000000000000000",
    StakedDfxTracker: "0x0000000000000000000000000000000000000000",
    BonusDfxTracker: "0x0000000000000000000000000000000000000000",
    FeeDfxTracker: "0x0000000000000000000000000000000000000000",
    StakedDlpTracker: "0x0000000000000000000000000000000000000000",
    FeeDlpTracker: "0x0000000000000000000000000000000000000000",

    StakedDfxDistributor: "0x0000000000000000000000000000000000000000",
    StakedDlpDistributor: "0x0000000000000000000000000000000000000000",

    DfxVester: "0x0000000000000000000000000000000000000000",
    DlpVester: "0x0000000000000000000000000000000000000000",

    OrderBook: "0xebD147E5136879520dDaDf1cA8FBa48050EFf016",
    OrderBookReader: "0xC492c8d82DC576Ad870707bb40EDb63E2026111E",

    PositionRouter: "0xB4bB78cd12B097603e2b55D2556c09C17a5815F8",
    PositionManager: "0x168aDa266c2f10C1F37973B213d6178551030e44",

    // UniswapDfxEthPool: "0x80A9ae39310abf666A87C743d6ebBD0E8C42158E",
    ReferralStorage: "0x0000000000000000000000000000000000000000",
    ReferralReader: "0x0000000000000000000000000000000000000000",

    Multicall: "0xcA11bde05977b3631167028862bE2a173976CA11",
  },

  [SEPOLIA]: {
    UniswapGmxEthPool: "0x80A9ae39310abf666A87C743d6ebBD0E8C42158E", // FIX THIS
    Vault: "0xef1DC06d1CE18c5c549d5341A8f297cae5eA1ce9",
    Router: "0xCfC1957a84A05575230B771dBa4f61E2ec24704B",
    VaultReader: "0xD0f4B110bc15237CBf4b398dc8544Ef1Aa6D09c8",
    Reader: "0x647E39f4511EE37dC6E0F023e2eEFbD0da5F856E",
    DlpManager: "0xc2697a710af128e4Fdb6BEd48Ff6a98FA0ac90C8",
    RewardRouter: "0x56aee90ce2b9af28Bf888a6EB3F6e495F0eF12eC",
    GlpRewardRouter: "0x2a642f83f8A1e9156fB13913755163335EdD5269",
    RewardReader: "0xb233B59Dd71519E2fc0997736030C89dfb7F3974",
    DLP: "0x7618453e788AeB1411BE4b20393648b252728267",
    DFX: "0x56B75b36AAbdCdf53bCF6aE8976A472ed7d14455",
    ES_DFX: "0x7A3DA9355c8da416Bc5Bfc103D727d3867f0C7cA",
    BN_DFX: "0x292f166e54e16eC2690f6C225eDC771BE8c442FC",
    USDG: "0x59D49D0B90DE7bD2942237E7b03c4Ae6636EdF06",
    ES_DFX_IOU: "0x2C598726eB1C82Cfd22E5C719d25C9bA0ff845A9",
    StakedDfxTracker: "0xAdEbf341638CAB2BA3cEaEb105F8880A9db823CA",
    BonusDfxTracker: "0x55a73C4D62fab2e10C7e7b497E0fb6C3567815Af",
    FeeDfxTracker: "0xB87a105752cc8ecb62aE7017baf493E3Ffade2E7",
    StakedDlpTracker: "0xa00bfB375554904F0579fAEa905Bdb16fFEA48e2",
    FeeDlpTracker: "0xF632F679A9564D7631BDde348E550C690a96bc11",
    StakedDfxDistributor: "0xc170C45A8Ef042d4A91463Bf933B44421eB78dAF",
    StakedDlpDistributor: "0xf23b28F40348d57Af13F5cc7172fc4e0FCe98237",
    DfxVester: "0x53Ce6A2247634652FABCe247eD111074C99eed3f",
    DlpVester: "0x30D01173DDeB2f4eBC51E4Fd74b86F8403935DEc",
    OrderBook: "0xC8a190dFe5609f4f452AF1A40F93aF189127d7eD",
    OrderExecutor: "0x53A5f58035cfca0F2038807e9073e782A18C6A91",
    OrderBookReader: "0xA2af2F9D35e02cfe3313C6126d7541dC89aAc2cb",
    PositionRouter: "0xa595dcc3F281D13A7Ed9392c239c033fE3CbfC51",
    PositionManager: "0x1c908a02c0341170917a12B0c71633398C3fa4C7",
    ReferralStorage: "0xB5cC90bc6067b4485c35d1F15741CF7A3a4D6F4E",
    ReferralReader: "0x7f11dd0313F429eE502fFD8B743710915304E343",
    Timelock: "0x0457417595268d5678f5650A7193fc2506D79A3a",
    USDT: "0x278ce1e55BB6d32b4923b11a7D2bb94e5b446cbc",
    USDC: "0x870ea900Ed521a26c37BfcA3b3Fa4437d193779C",
    DAI: "0x27679434AFC292eA8b109ecb2175122Ec8728883",
    BTC: "0xe9F13d1C1DFC8791220a779622eec65F8FbAbb15",
    BNB: "0x3B1d2A15F7f153518ecB27a47F4464107596964a",
    NATIVE_TOKEN: "0x9edB04b4d8Eb93B270198F142db8Ab32DC75F41e",
    Multicall: "0xcA11bde05977b3631167028862bE2a173976CA11"
  },
  [BASE_TESTNET]: {
    Vault: "0xE0d3c0DAD1Defa860D9bd34603a804B463ce6AFa",
    Router: "0x2bf8f92F53D8FAf4282b3B4B1c7C479FB6c5A420",
    VaultReader: "0x14cDd911E2926De4A31dab95c046ac4f69769C5e",
    Reader: "0xd2be8A37a1Ae659f6125D85cDaE0F9E0f6FE2807",
    DlpManager: "0xb26b96063fa5e8EC72B0e27B4F16d3E77Bf497c6",
    RewardRouter: "0x75bFdC6d3b8DDd2c747B132639589aD4070Ee42d",
    DlpRewardRouter: "0x7a3757D43792A01a1334Ae2106c8a76c70580E76",
    RewardReader: "0x37720561D707aaA2b205aDb81AdC24E33a699f64",
    DLP: "0x67e3DD7febAe62bC672C5a6429ee45A5282ae54e",
    DFX: "0x7eA5b3938DAcd7D42129f2B57816589731dcDceC",
    ES_DFX: "0x082fccd8F566FDf7c1708409Ec51C7Fc5b3f3ce8",
    BN_DFX: "0xbEA8Be252FfBeA07dF13F0adc6C9857446c6b82a",
    USDG: "0x85234953CB961B5E305591CBcE8Df067e79acb3B",
    ES_DFX_IOU: "0x652Cab79a1271417F79493ed0E4659e0fF07DDe9",
    StakedDfxTracker: "0x34954713E95329dCc44A184E1fBE5D1F1AC791f3",
    BonusDfxTracker: "0x6e75f9215292e629a9c8A161B49C7A8B494aD736",
    FeeDfxTracker: "0x12B83C89621474723dD3330c5183673bE071fB18",
    StakedDlpTracker: "0xE709fb7dC3321e53736003137B110E6c374CDa0a",
    FeeDlpTracker: "0x578c3740b0b2B19CE19bB909671AFB2D4C6149e6",
    StakedDfxDistributor: "0x5c933dB64DED2B3050CBF8A26DA155bcAd8B897A",
    StakedDlpDistributor: "0x4f61Bba59C609562D17bD80CB2920E0D7f9C721f",
    DfxVester: "0xcd29c00bB4EC1F2e76Cd5E754d84D1Fa7B28f6A6",
    DlpVester: "0x87897dCB0Be5a88a025bdd1Bdc28Fade86fdF707",
    OrderBook: "0x3D5118fed44dd371f0214300059BE7eC6A42aD64",
    OrderExecutor: "0xc760167980a1AACf5C91B00E05cD3A40529d8bb5",
    OrderBookReader: "0x5d074f7aBE40830aa0bd055c0147495989D9932D",
    PositionRouter: "0xC712C41839488F1b69B859001590c07b77433424",
    PositionManager: "0xb37E930cC9E68143644C57d84Bd6a74D707b7d4B",
    ReferralStorage: "0x24Dd05a4c15B707522a2e0254B81322df751428f",
    ReferralReader: "0x3A81fA58e50542Be5bD54Db26f8bE78aB7f1F7c7",
    Timelock: "0x6D6De0FcB531ead5B887c66dFce97A68C43b99d2",
    USDT: "0xe6698aaEb7F71655511f014daA1Bd4162aB7cF52",
    USDC: "0x8d1610fC290e84bAb05316E75Fd716dB7f3033e0",
    DAI: "0xAE7BD344982bD507D3dcAa828706D558cf281F13",
    LINK: "0xe6cfc709F13C9d04cB27dcf29337BB63a7715e43",
    BTC: "0x5f9B4E76121b5eee8382DdEF1D39E84d753cB67E",
    NATIVE_TOKEN: "0x4200000000000000000000000000000000000006",
    Multicall: "0xcA11bde05977b3631167028862bE2a173976CA11"
  }
};

export function getContract(chainId: number, name: string): string {
  if (!CONTRACTS[chainId]) {
    throw new Error(`Unknown chainId ${chainId}`);
  }

  if (!CONTRACTS[chainId][name]) {
    throw new Error(`Unknown contract "${name}" for chainId ${chainId}`);
  }

  return CONTRACTS[chainId][name];
}
