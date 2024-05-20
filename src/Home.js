import React, { useState, useEffect } from "react";
import { ethers } from 'ethers';
import constants from './constants';

function Home() {
    const [currentAccount, setCurrentAccount] = useState("");
    const [contractInstance, setContractInstance] = useState(null);
    const [status, setStatus] = useState(false);
    const [isWinner, setIsWinner] = useState(false);
    const [players, setPlayers] = useState([]);
    const [entered, setEntered] = useState(false);

    useEffect(() => {
        const loadBlockchainData = async () => {
            if (typeof window.ethereum !== 'undefined') {
                const provider = new ethers.providers.Web3Provider(window.ethereum);
                try {
                    await window.ethereum.request({ method: 'eth_requestAccounts' });
                    const [account] = await provider.listAccounts();
                    setCurrentAccount(account);
                    
                    await loadContractData(provider, account);

                    window.ethereum.on('accountsChanged', async (accounts) => {
                        if (accounts.length > 0) {
                            setCurrentAccount(accounts[0]);
                            await loadContractData(provider, accounts[0]);
                        } else {
                            setCurrentAccount("");
                        }
                    });
                } catch (err) {
                    console.error("Error loading blockchain data: ", err);
                }
            } else {
                alert('Please install MetaMask to use this application');
            }
        };

        const loadContractData = async (provider, address) => {
            const signer = provider.getSigner();
            const contractIns = new ethers.Contract(constants.contractAddress, constants.contractAbi, signer);
            setContractInstance(contractIns);

            try {
                const status = await contractIns.status();
                setStatus(status);
                const winner = await contractIns.getWinner();
                setIsWinner(winner === address);

                const players = await contractIns.getPlayers();
                setPlayers(players);

                const entered = await contractIns.entered(address);
                setEntered(entered);
            } catch (err) {
                console.error("Error loading contract data: ", err);
            }
        };

        loadBlockchainData();
    }, []);

    const enterLottery = async () => {
        try {
            const amountToSend = ethers.utils.parseEther('0.001');
            const tx = await contractInstance.enter({ value: amountToSend });
            await tx.wait();

            const players = await contractInstance.getPlayers();
            setPlayers(players);

            const entered = await contractInstance.entered(currentAccount);
            setEntered(entered);
        } catch (err) {
            console.error("Error entering lottery: ", err);
        }
    };

    const claimPrize = async () => {
        try {
            const tx = await contractInstance.claimPrize();
            await tx.wait();
        } catch (err) {
            console.error("Error claiming prize: ", err);
        }
    };

    const renderButtonOrMessage = () => {
        if (status) {
            if (isWinner) {
                return <button className="claim-button" onClick={claimPrize}>Claim Prize</button>;
            } else {
                return <p>You are not the winner</p>;
            }
        } else {
            if (entered) {
                return <p>You have already entered the lottery</p>;
            } else {
                return <button className="enter-button" onClick={enterLottery}>Enter Lottery</button>;
            }
        }
    };

    return (
        <div className="container">
            <h1>Lottery Page</h1>
            <div className="button-container">
                {renderButtonOrMessage()}
            </div>
            <div>
                <h2>Participants</h2>
                <ul>
                    {players.map((player, index) => (
                        <li key={index}>{player}</li>
                    ))}
                </ul>
            </div>
        </div>
    );
}

export default Home;
