import Web3 from "web3";
import LUPIArtifact from "../../build/contracts/LowestUniquePositiveInteger.json";

const App = {
  web3: null,
  account: null,
  contract: null,

  start: async function() {
    const { web3 } = this;
    try {
      // get contract instance
      const networkId = await web3.eth.net.getId();
      const deployedNetwork = LUPIArtifact.networks[networkId];
      this.contract = new web3.eth.Contract(
        LUPIArtifact.abi,
        deployedNetwork.address,
      );

      // get accounts
      const accounts = await web3.eth.getAccounts();
      this.account = accounts[0];

      this.getInput();
    } catch (error) {
      console.error("Could not connect to contract or chain.");
    }
  },

  getInput: async function() {
    const { getInput } = this.contract.methods;
    const input = await getInput().call();

    // TODO: if we haven't commit any input yet, this would show 0

    const previousElement = document.getElementById("previous-input");
    previousElement.innerHTML = input
  },

  commitInput: async function() {
    const { commitInput } = this.contract.methods;
    // input validation
    const inputStr = document.getElementById("input").value;
    const input = Math.floor(Number(inputStr));
    if (input == Infinity || String(input) !== inputStr || input <= 0) {
      this.setStatus("Please input a positive integer");
      return;
    }

    this.setStatus("Initiating transaction... (please wait)");
    try {
      const result = await commitInput(input).send({from: this.account});
      this.setStatus("Transaction complete!");
      this.getInput();
    } catch (error) {
      console.log(error);
    }
  },

  setStatus: (message) => {
    const status = document.getElementById("status");
    status.innerHTML = message;
  },
};

window.App = App;

window.addEventListener("load", async () => {
  if (window.ethereum) {
    // modern dapp browsers
    // use MetaMask's provider
    App.web3 = new Web3(ethereum);
    try {
      // get permission to access accounts
      await ethereum.enable();
    } catch (error) {
      // User denied account access...
      console.warn("Please enable account access.")
    }
  } else if (window.web3) {
    // legacy dapp browsers
    App.web3 = new Web3(web3.currentProvider);
  } else {
    console.warn(
      "No web3 detected. Falling back to http://127.0.0.1:8545.",
    );
    // fallback - use your fallback strategy (local node / hosted node + in-dapp id mgmt / fail)
    App.web3 = new Web3(
      new Web3.providers.HttpProvider("http://127.0.0.1:8545"),
    );
  }

  App.start();
});
