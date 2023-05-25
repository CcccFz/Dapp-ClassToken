import React, { useState } from 'react';
import { ethers } from 'ethers'
import { ERC20ABI } from '../abi/ERC20ABI'

export default function TransferERC20(props: {
  addressContract: string,
  currentAccount: string | undefined
}) {
  const addressContract = props.addressContract
  const currentAccount = props.currentAccount
  const [amount,setAmount] = useState<string>('100')
  const [toAddress, setToAddress] = useState<string>("")

  async function transfer(event: React.FormEvent) {
    event.preventDefault()
    if(!window.ethereum) return

    const provider = new ethers.BrowserProvider(window.ethereum)
    const signer = await provider.getSigner()
    const erc20 = new ethers.Contract(addressContract, ERC20ABI, signer)

    await erc20.transfer(toAddress, ethers.parseEther(amount))
      .then(tr => {
        console.log(`TransactionResponse TX hash: ${tr.hash}`)
        tr.wait().then((receipt: any)=>{console.log("Transfer receipt", receipt)})
      })
      .catch(e => console.log(e))
  }

  const handleChange = (value:string) => setAmount(value)

  return (
    <form onSubmit={transfer}>
      <div>
        <label htmlFor="amount">Amount: </label>
        <input type="number" defaultValue={amount} onChange={(e: any) => handleChange(e)}/>
      </div>
      <div>
        <label htmlFor="toaddress">To address: </label>
        <input id="toaddress" type="text" required onChange={(e) => setToAddress(e.target.value)} style={{width: '500px'}} />
      </div>
      <div>
        <button type="submit" disabled={!currentAccount}>Transfer</button>
      </div>
    </form>
  )
}
