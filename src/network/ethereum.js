
export const ContractAddress = '0x6e672bFfAD98F32788535de63D3146fBCc34A188';
export const { ethereum } = window
export const networks = {
  1:'Mainnet',
  3:'Ropsten', 
  4:'Rinkeby',
  5:'Goerli',
  42: 'Kovan',
  80001: 'Mumbai'
}

/*******************************************************************
* checkMMaskExist 
*       Check if Metamask is present on browser 
*       returns: 
*            ethereum: Metamask's ethereum object if exists / null if not
*****************************************************************/

 export const checkMMaskExist = () => {
    if (!ethereum) {
      return undefined
    }
    else {
       return ethereum 
      }
}

 /*******************************************************************
 *  checkMMAccounts - 
 *        Check if we already  have  permissions to Metamask account
 *       returns: 
 *            object with properties:
 *            opcode: true, value: accounts[0]: Metamask's Account connected if there is one 
 *            opcode: false  errorCode: error code from Metamask if not
 * 
 *****************************************************************/
  export const checkMMAccounts = async () => {
    try {
      if (ethereum) {
        const accounts = await ethereum.request({method: 'eth_accounts'})
        if (accounts.length > 0) {
          return {opcode: true, value: accounts}
          } else {
          return {opcode: false, errorCode:'No account connected', value:''}
        }
      }
    } catch (error) {
       console.log('There is not account connected', error)
       return {opcode: false, errorCode: error.code, value:''}
    }
    }
  
/*******************************************************************
* connectMetamaskAccount - 
*     Request connection to  MetaMask account
*     user authorize and connects accounts: returns object with properties:
*             if denies access: print error to console and returns null
 *            opcode: true, value: Metamask's Account connected if there is one 
 *            opcode: false  errorCode: error code from Metamask if not
*****************************************************************/
export const connectMetamaskAccount = async (setCurrentAccount) => {
  if (!ethereum) {
    alert("This DApp requires Metamask but found none, please install it")
    return{opcode: false, errorCode: -1}
  }
try {
    const accounts = await ethereum.request({method: 'eth_requestAccounts'})
    setCurrentAccount(accounts[0])
    return {opcode: true, value: accounts[0]}
    } catch (error) {
        console.log("Can't establish connection to Metamask Accounts, error!:", error, error.code, typeof error.code)
        return{opcode: false, errorCode: error.code}
    }
}
