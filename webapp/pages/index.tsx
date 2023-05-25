import { useState, useEffect} from 'react'
import { ethers } from 'ethers';
import ReadERC20 from '../components/ReadERC20';
import TransferERC20 from '../components/TransferERC20';

const addressContract = '0x5FbDB2315678afecb367f032d93F642f64180aa3';

export default function Home() {
  const [balance, setBalance] = useState<string | undefined>()
  const [currentAccount, setCurrentAccount] = useState<string | undefined>()
  const [chainId, setChainId] = useState<number | undefined>()
  const [chainname, setChainName] = useState<string | undefined>()

  useEffect(() => {
    if(!currentAccount || !ethers.isAddress(currentAccount)) return
    if(!window.ethereum) return

    const provider = new ethers.BrowserProvider(window.ethereum)

    provider.getBalance(currentAccount)
      .then((ret: any) => {
        setBalance(ethers.formatEther(ret))
      })

    provider.getNetwork()
      .then((ret: any) => {
        console.log(1111111111, ret)
        setChainId(ret.chainId)
        setChainName(ret.name)
      })

  }, [currentAccount])

  const onClickConnect = () => {
    if (!window.ethereum) {
      console.log("please install MetaMask")
      return
    }

    const provider = new ethers.BrowserProvider(window.ethereum)

    provider.send("eth_requestAccounts", [])
      .then((accounts: any) => {
        if(accounts.length > 0) setCurrentAccount(accounts[0])
      })
      .catch(e => console.log(e))
  }

  const onClickDisconnect = () => {
    console.log("onClickDisConnect")
    setBalance(undefined)
    setCurrentAccount(undefined)
  }

  return (
    <div id="app">
      <div>
        {currentAccount
          ? <button onClick={onClickDisconnect}>
              Account: {currentAccount}
            </button>
          : <button onClick={onClickConnect}>
              Connect MetaMask
            </button>
        }
      </div>
      <div>
        {currentAccount
          ? <>
              <h1>Account info</h1>
              <div>ETH Balance of current account: {balance}</div>
              <div>Chain Info: ChainId {chainId} name {chainname}</div>
            </>
          : <></>
        }
      </div>

      <ReadERC20 
        addressContract={addressContract}
        currentAccount={currentAccount}
      />

      <TransferERC20 
        addressContract={addressContract}
        currentAccount={currentAccount}
      />
    </div>
  )
}
