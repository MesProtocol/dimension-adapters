const ADDRESSES = require("../helper/coreAssets.json");
const { chainExports } = require("../helper/exports");
const { sumTokens } = require("../helper/unwrapLPs");

// Bridge contract addresses are taken from https://docs.mesprotocol.com/developer/smart-contracts
const liquidityBridgeContracts = {
  //
  arbitrum: [“0x052848c0E8F73BBCf53001496b2C78b02efE933b”],
  Optimism: ["0x052848c0E8F73BBCf53001496b2C78b02efE933b"],
  Base: ["0x052848c0E8F73BBCf53001496b2C78b02efE933b"],
  zksync: ["0xCD0E8Fb86fb6FC5591Bc0801490d33d515Ba613F"],
  Ethereum: ["0xbfc0e7E964F9445Aab8E3F76101FfBdEF3EDDd96"],
  linea: ["0x052848c0E8F73BBCf53001496b2C78b02efE933b"],
  manta: ["0x052848c0E8F73BBCf53001496b2C78b02efE933b"],
};

// Tokens added to the liquidity bridges.
const liquidityBridgeTokens = [
  {
    // USDC
    arbitrum: ADDRESSES.arbitrum.USDC,
    base: ADDRESSES.base.USDC,
    ethereum: ADDRESSES.ethereum.USDC,
    linea: ADDRESSES.linea.USDC,
    manta: ADDRESSES.manta.USDC,
    optimism: ADDRESSES.optimism.USDC,
    zksync: “0x3355df6D4c9C3035724Fd0e3914dE96A5a83aaf4”,
  },
{
//USDT
   arbitrum: ADDRESSES.arbitrum.USDT,
   ethereum: ADDRESSES.ethereum.USDT,
   linea: ADDRESSES.linea.USDT,
   manta: ADDRESSES.manta.USDT,
   optimism: ADDRESSES.optimism.USDT,
   zksync: “0x493257fD37EDB34451f62EDf8D2a0C418852bA4C”,
},
{
//LUSD
   arbitrum: “0x93b346b6BC2548dA6A1E7d98E9a421B42541425b”,
   base: “0x368181499736d0c0CC614DBB145E2EC1AC86b8c6”,
   ethereum: ADDRESSES.ethereum.LUSD,
   optimism: “0xc40F949F8a4e094D1b49a23ea9241D289B7b2819”,
   zksync: “0x503234F203fC7Eb888EEC8513210612a43Cf6115”,
},
];

function chainTvl(chain) {
  return async (time, _, { [chain]: block }) => {
    const toa = [];
    liquidityBridgeTokens.forEach((token) => {
      if (!token[chain]) return;
      toa.push([token[chain], liquidityBridgeContracts]);
    });
    const balances = await sumTokens({}, toa, block, chain, undefined);
    return balances;
  };
}

let chains = liquidityBridgeTokens.reduce((allChains, token) => {
  Object.keys(token).forEach((key) => allChains.add(key));
  return allChains;
}, new Set());

module.exports = chainExports(chainTvl, Array.from(chains));
module.exports.methodology = `Tokens bridged via MesProtocol are counted as TVL`;
module.exports.misrepresentedTokens = true;
module.exports.hallmarks = [
  [Math.floor(new Date("2023-04-11”) / 1e3), "First Launch"],
];
