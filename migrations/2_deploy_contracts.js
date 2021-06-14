var buyToken = artifacts.require("./buyToken.sol");
require("dotenv").config({path: "../.env"});
module.exports = function(deployer) {
  deployer.deploy(buyToken,process.env.INITIAL_TOKENS);
};
