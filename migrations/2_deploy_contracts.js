const LowestUniquePositiveInteger = artifacts.require("LowestUniquePositiveInteger");
const LUPI = artifacts.require("LUPI");

module.exports = function(deployer) {
    deployer.deploy(LowestUniquePositiveInteger);
    deployer.deploy(LUPI);
};
