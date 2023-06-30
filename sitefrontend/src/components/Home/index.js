import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom'
import './index.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faDollarSign, faStar, faBriefcase } from '@fortawesome/free-solid-svg-icons';
import { useLocation } from 'react-router-dom';
import axios from 'axios';

const Home = () => {

    //retrieve user id account of user from login page
    const location = useLocation();
    let usernumber = location.state.id;
    let allArraysEmpty = true;
    let totalStockValue = 0;

    //make a get request for the watchlist items

    let [items, setItems] = useState([]);
    let [allArraysAreEmpty, setAllArraysAreEmpty] = useState(false);

    const fetchStockData = (symbol) => {
        const apiKey = 'cie9nspr01qmfas4b65gcie9nspr01qmfas4b660';
        const apiUrl = `https://finnhub.io/api/v1/quote?symbol=${symbol}&token=${apiKey}`;

        return axios.get(apiUrl)
            .then((response) => {
                const price = response.data.c;
                const dollar_change = response.data.d;
                const percent_change = response.data.dp;

                if (!price) {
                    throw new Error('Invalid response or missing price data');
                }

                return { p: price.toFixed(2), d: dollar_change.toFixed(2), dp: percent_change.toFixed(2)};
            });
    };

    useEffect(() => {
        axios.get('http://localhost:8000/watchlist/', {
            params: {
                user: usernumber
            }
        })
            .then((response) => {
                const responseArray = response.data;
                let promises = [];

                const data = responseArray.map((element) => {
                    const promise = fetchStockData(element.symbol)
                        .then((priceResponse) => {
                            const p = priceResponse.p;
                            const d = priceResponse.d;
                            const dp = priceResponse.dp;
                            return {
                                symbol: element.symbol,
                                price: p,
                                dollar_change: d,
                                percent_change: dp
                            };
                        })
                        .catch((error) => {
                            console.error(`Error fetching stock price for ${element.symbol}:`, error);
                            return null;
                        });

                    promises.push(promise);
                });

                Promise.all(promises)
                    .then((results) => {
                        const filteredData = results.filter((item) => item !== null);
                        setItems(filteredData);
                        setAllArraysAreEmpty(filteredData.length === 0);
                    })
                    .catch((error) => {
                        console.error('Error fetching stock prices:', error);
                    });
            })
            .catch((error) => {
                console.error('Error fetching watchlist data:', error);
            });
    }, []);

    function getAccountValue() {
        let value = 0;
        return ('$' + value);

    }
    function getOptionBuyingPower() {

    }
    function getStockBuyingPower() {

    }

    function resetPortfolio() {

    }

    function getDollarChange() {
        let value = 0.01;
        return ('$' + value);
    }

    function getPercentChange() {
        let value = 0.01;
        return (value + '%');
    }


    return (
        <div className="container home-page">
            <div className="mainblock">
                <div className="account-details">
                    <h1>Account Summary</h1> <br></br>
                    <div className="left-column">
                        <p>Account Value</p>
                        <p>Option Buying Power</p>
                        <p>Stock Buying Power</p>
                    </div>
                    <div className="right-column">
                        <p>{getAccountValue()}</p>
                        <p>Hello{getOptionBuyingPower()}</p>
                        <p>Hello{getStockBuyingPower()}</p>
                    </div>
                    <div className="bottom-column">
                        <div className="bottom-stats-label">
                            <p style={{marginRight: -60}} >Cash</p>
                            <p style={{ color: 'slateblue' }} onClick={resetPortfolio()}><b>Reset</b></p>
                            <p style={{textAlign: 'center'}}> P/L Day $</p>
                            <p style={{textAlign: 'right'}}>P/L Day %</p>
                        </div>
                        <div className="bottom-stats">
                            <h2>$100,000.00</h2>
                            <h2 style={{ textAlign: 'center', marginLeft: 45 }}> {getDollarChange()}</h2>
                            <h2 style={{ textAlign: 'right' }}> {getPercentChange()}</h2>
                        </div>
                    </div>
                </div>
                <div className="watchlist">
                    <h1>My Watchlist</h1>
                    <div className="watchtable">
                        {allArraysAreEmpty ? (
                            <p>No elements in the watchlist.</p>
                        ) : (
                            <table>
                                <thead>
                                    <tr>
                                        <th style={{ textAlign: 'left', borderRight: '1px solid #454545' }}>Symbol</th>
                                        <th>Price</th>
                                        <th>P/L Day ($)</th>
                                        <th>P/L Day (%)</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {items.map((item, index) => (
                                        <tr key={item.id} className={index % 2 === 0 ? 'even-row' : 'odd-row'}>
                                            <td style={{ textAlign: 'left' }}>{item.symbol}</td>
                                            <td>{item.price}</td>
                                            <td>{item.dollar_change}</td>
                                            <td>{item.percent_change}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </div>
                </div>
                
            </div>
            <div className="rightblock">
                <div className="portfoliotitle">
                    <h1>Active</h1>
                    <h1>Positions</h1>
                </div>
            </div>
            <div className="bottomblock">
                
            </div>
        </div>
    )
}

export default Home

   