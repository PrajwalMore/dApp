const buyTokens = artifacts.require("./buyToken.sol");
//const BN = web3.utils.BN;
const chai = require("./setupchai.js");
const expect = chai.expect;

//import {getWeb3} from "./getWeb3";
contract("buyTokens", accounts => {
   const [deployerAccount, recipient] = accounts;

   //this.web3=await getWeb3();
   beforeEach(async () => {
      instance = await buyTokens.new(process.env.INITIAL_TOKENS);
   });
   it("deployer should be owner of all tokens", async () => {
      let totalSupply = await instance.totalSupply();
      return expect(instance.balanceOf(deployerAccount)).to.eventually.be.a.bignumber.equal(totalSupply);
   });

   it("able to set price", async () => {
      //price before.  
      priceBefore = await instance.getPrice();
      //setting price.
      let price = 4;
      await instance.setPrice(price);
      //price after.
      priceAfter = await instance.getPrice();
      return expect(priceAfter).to.not.equal(priceBefore);
   });

   it("It't not possible to send more tokens than owner owns.", async () => {
      let totalSupply = await instance.totalSupply();
      expect(instance.sendToken(recipient, totalSupply + 1)).to.eventually.be.rejected;
      //token amount is same because of tranfer failure. 
      return expect(instance.balanceOf(deployerAccount)).to.eventually.be.a.bignumber.equal(totalSupply);
   });
   it("able to send tokens.", async () => {
      let recipientBalanceBefore = await instance.balanceOf(recipient);
      //sending tokens.
      instance.sendToken(recipient,5);
      return expect(instance.balanceOf(recipient)).to.not.equal(recipientBalanceBefore);
   });




});
