import twitterLogo from "./assets/twitter-logo.svg";
import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import {
  checkMMaskExist,
  checkMMAccounts,
  connectMetamaskAccount,
  ethereum,
  networks,
} from "./network/ethereum";
import { setupEventListener } from './network/contract'
import { frmatAccount } from "./utils/utilities";
import myEpicNft from "./utils/myEpicNFT.json";
import { exclamationIcon } from './utils/exclamation'
import {hourGlass} from './utils/hourGlass'
import "./styles/App.css";

// Constants
const TWITTER_HANDLE = "_buildspace";
const TWITTER_LINK = `https://twitter.com/${TWITTER_HANDLE}`;
const MY_TWITTER_LINK = `https://twitter.com/RoberVH`;
const TOTAL_MINT_COUNT = 50;

const App = () => {
  // state vars ******************************************
  const [metamaskStatus, setMetamaskStatus] = useState(false);
  const [currAccount, setCurrentAccount] = useState("");
  const [networkFlag, setNetworkFlag] = useState(false);
  const [ minning, setMinning] = useState(false)
  const [nftCookieId, setnftCookieId] = useState('')
  const [urlOpenSea, SetUrlOpenSea] = useState('')
  const [transacction, setTx] = useState('')

  // Utility methods
  const reloadBrowser = () => {
    window.location.reload();
  };

  const handleMinting = () => {
    setnftCookieId('')
    SetUrlOpenSea('')
    setTx('')
    askContractToMintNft(setMinning)
  }

  const handleGotoGallery = () => {
    const  windowConfig = "menubar=yes,location=yes,resizable=yes,scrollbars=yes,status=yes";
    window.open('https://testnets.opensea.io/collection/fortunecookies-v4',windowConfig)
  }

  const askContractToMintNft = async (setMinning) => {
    const CONTRACT_ADDRESS = "0xDd5A285D6B9C5bB3B1438D03Df76C577041724c9";
    setMinning(true)
    try {
      // const { ethereum } = window;

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const connectedContract = new ethers.Contract(
          CONTRACT_ADDRESS,
          myEpicNft.abi,
          signer
        );

        console.log("Going to pop wallet now to pay gas...");
        let nftTxn = await connectedContract.makeAnEpicNFT();

        console.log("Mining...please wait.");
        await nftTxn.wait();

        console.log(
          `Mined, see transaction: https://rinkeby.etherscan.io/tx/${nftTxn.hash}`
        );
        setTx(`Mined, see transaction: https://rinkeby.etherscan.io/tx/${nftTxn.hash}`)
      } else {
        console.log("Ethereum object doesn't exist!");
      }
    } catch (error) {
      console.log(error);
    } finally {
      setMinning(false)
    }
  };

  // Render Methods *******************************************

  const DisplayCurrAccount = () => (
    <div>{currAccount ? <label>{frmatAccount(currAccount)}</label> : null}</div>
  );

  const NoMetamaskAlert = () => (
    <div className="no-metamask-alert-class">
      <label> 📡 &nbsp;&nbsp; Please install Metamask to use this Dapp </label>
    </div>
  );

  const renderNotConnectedContainer = () => (
    <button
      className="cta-button connect-wallet-button"
      onClick={() => connectMetamaskAccount(setCurrentAccount)}
    >
      Connect to Wallet
    </button>
  );

  const renderMintButton = () => 
    <span>
    { minning ? <button
      className="cta-button mint-button"
      >
        {hourGlass}
         &nbsp;&nbsp;
        Minning, this could take some time...
    </button>
    :
    <button
      className=" cta-button connect-wallet-button"
      onClick={handleMinting}
    >
       Mint an NFT Cookie
    </button>
    }
  </span>
  ;

  // on Load methods *******************************************
  // Check browser has Metamask, set UI flag metamaskStatus accordingly to prevent any functionality if no metamask
  // do it each time Dapp loads
  useEffect(() => {
    function checkMM() {
      if (checkMMaskExist()) {
        setMetamaskStatus(true);
        ethereum.on("chainChanged", reloadBrowser);
        ethereum.on("accountsChanged", reloadBrowser);
      }
    }
    checkMM();
    return (
      () => {
        ethereum.removeListener("chainChanged", reloadBrowser);
        ethereum.removeListener("accountsChanged");
      },
      reloadBrowser
    );
  }, []);

  // In case we have Metamask, check if already an account is connected and update eth account ********
  // We try to set listener here , and just here is enough as this is going to be called in wahatever case,
  // if user activated connect wallet or if is coming back to site when already was connected from previous visits
  useEffect(() => {
    async function getEthAccount() {
      let result = await checkMMAccounts();
      if (!result) return
      console.log('..',ethereum.networkVersion)
      setNetworkFlag(ethereum.networkVersion === '4')        
      const { opcode, errorCode, value } = await checkMMAccounts();
      if (opcode ) {
        setCurrentAccount(value[0]);
        // Setup listener! This is for the case where a user comes to our site
        // and ALREADY had their wallet connected + authorized.
        setupEventListener(setnftCookieId, SetUrlOpenSea)         
       } else console.log("Errorcc:", errorCode);
    }
    getEthAccount();
  }, []);

  return (
    <div className="App">
      {metamaskStatus ? (
        <div className="container">
          <div className="header-container">
            <DisplayCurrAccount />
            <p className="header gradient-text">
              Fortune Cookies NFT Collection
            </p>
            <p className="sub-text">
              Ancient wisdom engraved forever in an NFT
            </p>
            {currAccount ? renderMintButton() : renderNotConnectedContainer()}
            {networkFlag ? null: <p className = "alert-network">{exclamationIcon} &nbsp;This Dapp only works on Rinkeby Network, but you are on {networks[ethereum.networkVersion] || 'Unknown'}</p>
            }
            <button
              style = {{marginLeft:'1rem'}}
              className=" cta-button connect-wallet-button"
              onClick={handleGotoGallery}
            >
              🌊 View Collection on OpenSea
            </button>            
          </div>
          {nftCookieId &&
          <div className="msj-minted-class">
            <p>
              You have a NFT cookie!, it's cookie {nftCookieId} of {TOTAL_MINT_COUNT}
            </p> 
            <p>
              It has been sent to you Wallet. Wait max of 10 minutes and check it here: 
            </p>
            <br></br>
            <a
              className="opensea-button"
              href={urlOpenSea}
              target="_blank"
              rel="noreferrer"
            >Go to OpenSea (testnet)</a>
            </div>
          }
          <div className="footer-container">
            <img
              alt="Twitter Logo"
              className="twitter-logo"
              src={twitterLogo}
            />
            <a
              className="footer-text"
              href={TWITTER_LINK}
              target="_blank"
              rel="noreferrer"
            >{`built on @${TWITTER_HANDLE}`}</a>
            <img
              alt="Twitter Logo"
              className="twitter-logo footer-text-mytwiter"
              src={twitterLogo}
            />
            <a
              className="footer-text"
              href={MY_TWITTER_LINK}
              target="_blank"
              rel="noreferrer"
            >{`author: RoberVH`}</a>            
          </div>
        </div>
      ) : (
        <NoMetamaskAlert />
      )}
    </div>
  );
};

export default App;
