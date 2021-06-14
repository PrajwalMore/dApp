import React, { Component } from "react";
import buyToken from "./contracts/buyToken.json";
import getWeb3 from "./getWeb3";

import "./App.css";

class App extends Component {
  state = {loaded:false, storageValue: 0, web3: null, accounts: null, contract: null ,userTokens:0};

  componentDidMount = async () => {
    try {
      // Get network provider and web3 instance.
      this.web3 = await getWeb3();

      // Use web3 to get the user's accounts.
      this.accounts = await this.web3.eth.getAccounts();

      // Get the contract instance.
      const networkId = await this.web3.eth.net.getId();
      const deployedNetwork = buyToken.networks[networkId];
      this.instance = new this.web3.eth.Contract( buyToken.abi, deployedNetwork && deployedNetwork.address,);

     
      this.setState({ loaded:true, /*this.accounts, contract: this.instance*/}, this.tokensYouHave);
      this.tokensYouHave();
    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`,
      );
      console.error(error);
    }
  };

  ///////////////////////////

  tokensYouHave=async()=>{
    let bal=await this.instance.methods.balanceOf(this.accounts[0]).call();
    bal=this.web3.utils.fromWei(bal,"ether");
    this.setState({userTokens:bal});
    console.log("balance", bal);
  }

  render() {
    if (!this.state.loaded) {
      return <div>Loading Web3, accounts, and contract...</div>;
    }
    return (
      <div className="App">
        
        <p>
          address {this.accounts[0]} has {this.state.userTokens} tokens!.
        </p>
        <p>Send token to this address</p>
        
        {/* <div>The stored value is: {this.state.storageValue}</div> */}
      </div>
    );
  }
}

export default App;