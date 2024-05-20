import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import constants from './constants';

function PickWinner() {
    const [owner, setOwner] = useState('');
    const [contractInstance, setContractInstance] = useState(null);
    const [currentAccount, setCurrentAccount] = useState('');
    const [isOwnerConnected, setIsOwnerConnected] = useState(false);
    const [winner, setWinner] = useState('');
    const [status, setStatus] = useState(false);
    const [claimed, setClaimed] = useState(false);

    useEffect(() => {
        const loadBlockchainData = async () => {
            if (typeof window.ethereum !== 'undefined') {
                const provider = new ethers.providers.Web3Provider(window.ethereum);
                try {
                    const signer = provider.getSigner();
                    const address = await signer.getAddress();
                    setCurrentAccount(address);

                    window.ethereum.on('accountsChanged', (accounts) => {
                        if (accounts.length > 0) {
                            setCurrentAccount(accounts[0]);
                        } else {
                            setCurrentAccount('');
                        }
                    });

                    const contractIns = new ethers.Contract(constants.contractAddress, constants.contractAbi, signer);
                    setContractInstance(contractIns);

                    // Fetch initial data after contract instance is set
                    const status = await contractIns.status();
                    setStatus(status);

                    const winner = await contractIns.getWinner();
                    setWinner(winner);

                    const owner = await contractIns.getManager();
                    setOwner(owner);

                    const claimed = await contractIns.claimed();
                    setClaimed(claimed);

                    setIsOwnerConnected(owner === address);
                } catch (err) {
                    console.error(err);
                }
            } else {
                alert('Please install MetaMask to use this application');
            }
        };

        loadBlockchainData();
    }, []); // Empty dependency array ensures this runs once on component mount

    useEffect(() => {
        if (contractInstance) {
            const checkOwner = async () => {
                const owner = await contractInstance.getManager();
                setOwner(owner);
                setIsOwnerConnected(owner === currentAccount);
            };

            checkOwner();
        }
    }, [contractInstance, currentAccount]);

    const pickWinner = async () => {
        try {
            const tx = await contractInstance.pickWinner();
            await tx.wait();
            const winner = await contractInstance.getWinner();
            setWinner(winner);
            setStatus(true);
        } catch (err) {
            console.error("Error picking winner: ", err);
        }
    };

    const resetLottery = async () => {
        try {
            const tx = await contractInstance.resetLottery();
            await tx.wait();
            setWinner('');
            setStatus(false);
            setClaimed(false);
        } catch (err) {
            console.error("Error resetting lottery: ", err);
        }
    };

    return (
        <div className='container'>
            <h1>Result Page</h1>
            <div className='button-container'>
                {status ? (
                    <p>Lottery Winner is: {winner}</p>
                ) : (
                    isOwnerConnected ? (
                        <button className="enter-button" onClick={pickWinner}>Pick Winner</button>
                    ) : (
                        <p>You are not the owner</p>
                    )
                )}
                {isOwnerConnected && status && claimed && (
                    <button className="reset-button" onClick={resetLottery}>Reset Lottery</button>
                )}
            </div>
        </div>
    );
}

export default PickWinner;
