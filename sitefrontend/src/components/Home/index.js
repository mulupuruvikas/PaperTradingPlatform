import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom'
import './index.scss';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import Searchbar from '../Searchbar/index';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons';


const Home = () => {

    //retrieve user id account of user from login page
    const location = useLocation();
    let usernumber = location.state.id;
    let totalStockValue = 0;

    //useStates for user info
    let [accountDetails, setAccountDetails] = useState([]);
    let [actives, setActives] = useState([]);
    let [allActivesAreEmpty, setAllActivesAreEmpty] = useState(false);
    let [items, setItems] = useState([]);
    let [allWatchlistArraysAreEmpty, setAllWatchlistArraysAreEmpty] = useState(false);
    let [positions, setPositions] = useState([]);
    let [allPositionsAreEmpty, setAllPositionsAreEmpty] = useState(false);
    let [assetValue, setAssetValue] = useState(0);

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

                return { p: price.toFixed(2), d: dollar_change.toFixed(2), dp: percent_change.toFixed(2), pc: response.data.pc.toFixed(2), o: response.data.o.toFixed(2)};
            });
    };

    //get account details
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get('http://localhost:8000/users/', {
                    params: { id: usernumber }
                });
                const filteredData = response.data.filter(item => item.id === usernumber);
                setAccountDetails(filteredData[0].portfolio);
            } catch (error) {
                console.error('Error fetching account details:', error);
            }
        };

        fetchData();
    }, []);

    //get positions
    useEffect(() => {
        axios.get('http://localhost:8000/positions/', {
            params: {
                user : Number(usernumber)
            }
        })
            .then((response) => {
                console.log(usernumber);
                const responseArray = response.data;
                console.log("Positions:", responseArray);
                let promises = [];
                const data = responseArray.map((element) => {
                    const promise = fetchStockData(element.symbol)
                    
                        .then((priceResponse) => {
                            const p = priceResponse.p;
                            const pc = priceResponse.pc;
                            const o = priceResponse.o;
                            return {
                                price: p,
                                symbol: element.symbol,
                                qty: element.num_shares,
                                cost: Number(element.num_shares) * Number(p),
                                profit_total: (Number(p) - Number(element.bought_at)).toFixed(2),
                                profit_day: (Number(p) - Number(pc)).toFixed(2),
                                profit_today: (Number(p) - Number(o)).toFixed(2),
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
                        let value = 0;
                        filteredData.forEach((element, index) => {
                            value += (Number(element.qty) * Number(element.price));
                        });
                        setAssetValue(value);
                        setPositions(filteredData);
                        setAllPositionsAreEmpty(filteredData.length === 0);
                    })
                    .catch((error) => {
                        console.error('Error fetching stock prices:', error);
                    });
            })
            .catch((error) => {
                console.error('Error fetching positions data:', error);
            });
    }, []);

    //get active order items
    useEffect(() => {
        axios.get('http://localhost:8000/active-orders/', {
            params: {
                user: Number(usernumber)
            }
        })
            .then((response) => {
                const responseArray = response.data;
                console.log(response.data);
                let promises = [];
                const data = responseArray.map((element) => {
                    const promise = fetchStockData(element.symbol)
                        .then((priceResponse) => {
                            const p = priceResponse.p;
                            
                            return {
                                id: element.id,
                                time: element.expiration_date,
                                symbol: element.symbol,
                                side: element.side,
                                qty: element.num_shares,
                                ask: element.ask,
                                price: p,
                                tif: element.tif,
                                type: element.type,
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
                        const filteredActives = results.filter((item) => item !== null);
                        setActives(filteredActives);
                        setAllActivesAreEmpty(filteredActives.length === 0);
                    })
                    .catch((error) => {
                        console.error('Error fetching stock prices:', error);
                    });
            })
            .catch((error) => {
                console.error('Error fetching active orders data:', error);
            });
    }, []);

    //get watchlist items
    useEffect(() => {
        axios.get('http://localhost:8000/watchlist/', {
            params: {
                user: Number(usernumber)
            }
        })
            .then((response) => {
                const responseArray = response.data;
                console.log("User ID:", usernumber);
                console.log("Watchlist:", response.data);
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
                        setAllWatchlistArraysAreEmpty(filteredData.length === 0);
                    })
                    .catch((error) => {
                        console.error('Error fetching stock prices:', error);
                    });
            })
            .catch((error) => {
                console.error('Error fetching watchlist data:', error);
            });
    }, []);

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

    const removeItem = (item) => {
        console.log('id to remove:', item.id);
        axios
            .delete(`http://localhost:8000/active-orders/${item.id}`)
            .then(response => {
                console.log('Deleted:', response.data);
                // Add any necessary logic after the successful deletion
            })
            .catch(error => {
                console.error('Error deleting:', error);
            });
    };

    console.log("Actives", actives);

    return (
        <div className="home-page">
            <div className="search-bar">
                <Searchbar id={usernumber } />
            </div>
            <div className="page-contents">
                <div className="mainblock">
                    <div className="account-details">
                        <h1>Account Summary</h1> <br></br>
                        <div className="left-column">
                            <p>Account Value</p>
                            <p>Option Buying Power</p>
                            <p>Stock Buying Power</p>
                        </div>
                        <div className="right-column">
                            <p>{'$' + (Number(accountDetails.cash) + Number(assetValue)).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                            <p>{'$' + ((Number(accountDetails.cash) + Number(assetValue)) * 1.5).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                            <p>{'$' + ((Number(accountDetails.cash) + Number(assetValue)) * 1.5).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                        </div>
                        <div className="bottom-column">
                            <div className="bottom-stats-label">
                                <p style={{ marginRight: -60 }} >Cash</p>
                                <p style={{ color: 'slateblue' }} onClick={resetPortfolio()}><b>Reset</b></p>
                                <p style={{ textAlign: 'center' }}> P/L Total $</p>
                                <p style={{ textAlign: 'right' }}>P/L Total %</p>
                            </div>
                            <div className="bottom-stats">
                                <h2>{'$' + Number(accountDetails.cash).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</h2>
                                <h2 style={{ textAlign: 'center', marginLeft: 45 }}> {'$' + (Number(accountDetails.cash) + Number(assetValue) - 200000).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</h2>
                                <h2 style={{ textAlign: 'right' }}> {(((Number(accountDetails.cash) + Number(assetValue) - 200000) / 200000).toFixed(2)) + '%'}</h2>
                            </div>
                        </div>
                    </div>
                    <div className="watchlist">
                        <h1>My Watchlist</h1>
                        <div className="watchtable">
                            {allWatchlistArraysAreEmpty ? (
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
                    <div className="activeorders">
                        <h1 style={{ marginTop: 7 }}>Active</h1>
                        <div className="activetable">
                            {allActivesAreEmpty ? (
                                <p>No active orders.</p>
                            ) : (
                                <table>
                                    <thead>
                                        <tr>
                                            <th style={{ textAlign: 'left', borderRight: '1px solid #454545' }}>Symbol</th>
                                            <th>Expiration</th>
                                            <th>Side</th>
                                            <th>Qty</th>
                                            <th>Price</th>
                                            <th>Ask</th>
                                            <th>TIF</th>
                                            <th>Type</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {actives.map((item, index) => (
                                            <tr key={item.id} className={index % 2 === 0 ? 'even-row' : 'odd-row'}>
                                                <td style={{ textAlign: 'left' }}>{item.symbol.toUpperCase()}</td>
                                                <td>{new Date(item.time).toLocaleDateString()}</td>
                                                <td>{item.side}</td>
                                                <td>{item.qty}</td>
                                                <td>{item.price}</td>
                                                <td>{item.ask}</td>
                                                <td>{item.tif}</td>
                                                <td>{item.type}</td>
                                                <td style={{ backgroundColor: '#1d1d1e' }}><FontAwesomeIcon className="xicon" icon={faXmark} color="#fff" onClick={() => removeItem(item)} /></td>
                                            </tr>
                                        ))}
                                            
                                    </tbody>
                                </table>
                            )}
                        </div>
                    </div>
                    <div className="positions">
                        <h1>Positions</h1>
                        <div className="positiontable">
                            {allPositionsAreEmpty ? (
                                <p>No positions.</p>
                            ) : (
                                <table>
                                    <thead>
                                        <tr>
                                            <th style={{ textAlign: 'left', borderRight: '1px solid #454545' }}>Symbol</th>

                                            <th>Qty</th>
                                            <th>P/L Open</th>
                                            <th>P/L Day</th>
                                            <th>P/L Total</th>
                                            <th>Cost</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {positions.map((item, index) => (
                                            <tr key={item.id} className={index % 2 === 0 ? 'even-row' : 'odd-row'}>
                                                <td style={{ textAlign: 'left' }}>{item.symbol.toUpperCase()}</td>
                                                <td>{item.qty}</td>
                                                <td>{item.profit_today}</td>
                                                <td>{item.profit_day}</td>
                                                <td>{item.profit_total}</td>
                                                <td>{item.cost}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            )}
                        </div>
                    </div>
                </div>

            </div>
        </div>
    )
}

export default Home

   