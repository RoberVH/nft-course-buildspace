import { ethereum } from './ethereum'
import myEpicNft from "../utils/myEpicNFT.json";
import { ethers } from "ethers";


export const CONTRACT_ADDRESS = "0xDd5A285D6B9C5bB3B1438D03Df76C577041724c9";

 // Setup our listener.
export  const setupEventListener = async (setnftCookie, SetUrlOpenSea) => {
    // Most of this looks the same as our function askContractToMintNft
    try {
      //const { ethereum } = window;

      if (ethereum) {
        // Same stuff again
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const connectedContract = new ethers.Contract(CONTRACT_ADDRESS, myEpicNft.abi, signer);
       
        // This will essentially "capture" our event when our contract throws it.
        // If you're familiar with webhooks, it's very similar to that!
        connectedContract.on("NewEpicNFTMinted", (from, tokenId) => {
          console.log(from, tokenId.toNumber())
          setnftCookie(tokenId.toNumber())
          SetUrlOpenSea(`https://testnets.opensea.io/assets/${CONTRACT_ADDRESS}/${tokenId.toNumber()}` )
        });

        console.log("Setup event listener!")

      } else {
        console.log("Ethereum object doesn't exist!");
      }
    } catch (error) {
      console.log(error)
    }
  }