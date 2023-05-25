import React, { useEffect,useState } from 'react'
import { ethers } from 'ethers'
import { ERC20ABI } from '../abi/ERC20ABI'

export default function ReadERC20(props: {
  addressContract: string,
  currentAccount: string | undefined
}) {
  const addressContract = props.addressContract
  const currentAccount = props.currentAccount

  const [balance, setBalance] = useState<number|undefined>(undefined)
  const [totalSupply, setTotalSupply] = useState<string>()
  const [symbol, setSymbol] = useState<string>("")

  useEffect(() => {
    if(!window.ethereum) return

    const provider = new ethers.BrowserProvider(window.ethereum)
    const erc20 = new ethers.Contract(addressContract, ERC20ABI, provider);

    erc20.symbol().then((ret: string) => {
      setSymbol(ret)
    }).catch((err) => console.log(err));

    erc20.totalSupply().then((ret: string) => {
      setTotalSupply(ethers.formatEther(ret))
    }).catch((err) => console.log(err));
  }, [addressContract])

  useEffect(() => {
    if(!window.ethereum) return
    if(!currentAccount) return

    const provider = new ethers.BrowserProvider(window.ethereum)
    const erc20 = new ethers.Contract(addressContract, ERC20ABI, provider)

    const queryTokenBalance = (window: Window) => {
      erc20.balanceOf(currentAccount)
      .then((ret: string) => {
        setBalance(Number(ethers.formatEther(ret)))
      })
      .catch((err) => console.log(err));
    }

    queryTokenBalance(window)
    console.log(`listening for Transfer...`)

    const fromMe = erc20.filters.Transfer(currentAccount, null)
    erc20.on(fromMe, (from, to, amount, event) => {
      console.log('Event | Transfer | sent', { from, to, amount, event })
      queryTokenBalance(window)
    })

    const toMe = erc20.filters.Transfer(null, currentAccount)
    erc20.on(toMe, (from, to, amount, event) => {
      console.log('Event | Transfer | received', { from, to, amount, event })
      queryTokenBalance(window)
    })

    return () => {
      erc20.removeAllListeners(toMe)
      erc20.removeAllListeners(fromMe)
    }
  }, [currentAccount, addressContract])

  return (
    <div style={{marginTop: '50px'}}>
        <h1>ERC20 Contract: {addressContract}</h1>
        <h2>token totalSupply: {totalSupply} {symbol}</h2>
        <h3>ClassToken in current account: {balance} </h3>
    </div>
  )
}
