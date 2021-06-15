const buyTokens = artifacts.require("./buyToken.sol");
//const BN = web3.utils.BN;
const chai = require("./setupchai.js");
const expect = chai.expect;
const {
   balance,
   BN,           // Big Number support
   constants,    // Common constants, like the zero address and largest integers
   expectEvent,  // Assertions for emitted events
   expectRevert, // Assertions for transactions that should fail
} = require('@openzeppelin/test-helpers');


//import {getWeb3} from "./getWeb3";
contract("buyTokens", accounts => {
   const [deployerAccount, recipient] = accounts;

   //this.web3=await getWeb3();
   beforeEach(async () => {
      instance = await buyTokens.new(process.env.INITIAL_TOKENS);
   });
   // following first test is failing , BUT IF WE comment variable declarations from @openzeppelin/test-helpers then its not failing , what can be reason?.
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

   it("able to send tokens.", async () => {
      let recipientBalanceBefore = await instance.balanceOf(recipient);
      //sending tokens.
      instance.sendToken(recipient,5);
      return expect(instance.balanceOf(recipient)).to.not.equal(recipientBalanceBefore);
   });


   it("It's not possible to send more tokens than owner owns.", async () => {
      let totalSupply = await instance.totalSupply();
      await expectRevert(instance.sendToken(recipient, totalSupply + 1, { from: deployerAccount }), 'ERC20: transfer amount exceeds balance');

   });

   it('reverts when transferring tokens to the zero address', async function () {
      let etherVal = new BN(5);

      await expectRevert(
         instance.transfer(constants.ZERO_ADDRESS, etherVal, { from: deployerAccount }),
         'ERC20: transfer to the zero address',
      );
   });
   // it("emits event after sending tokens.", async () => {
   //    let etherVal = new BN(5);
   //    const receipt = instance.transfer(recipient, etherVal, { from: deployerAccount });
   //    console.log(deployerAccount);
   //    expectEvent(receipt, 'Transfer', {
   //       from: deployerAccount,
   //       to: recipient,
   //       value: etherVal,
   //    });
   // });


});
