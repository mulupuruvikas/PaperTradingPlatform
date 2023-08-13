import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom';
import PropTypes from "prop-types";
import { ChartCanvas, Chart } from "react-stockcharts";
import {
    CandlestickSeries,
} from "react-stockcharts/lib/series";
import { XAxis, YAxis } from "react-stockcharts/lib/axes";
import { discontinuousTimeScaleProvider } from "react-stockcharts/lib/scale";
import { fitWidth } from "react-stockcharts/lib/helper";
import { last } from "react-stockcharts/lib/utils";
import './index.scss'
import Searchbar from '../Searchbar/index';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons';

/* eslint-disable react-hooks/rules-of-hooks */

const Trade = () => {
    const location = useLocation();
    const symbol = location.state.symbol;
    const usernumber = location.state.id;
    const apiKey = 'cie9nspr01qmfas4b65gcie9nspr01qmfas4b660';
    const detailsURL = `https://finnhub.io/api/v1/stock/profile2?symbol=${symbol}&token=${apiKey}`;
    const [stockData, setStockData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [companyInfo, setCompanyInfo] = useState([]);
    const [inWatchlist, setInWatchlist] = useState(false);
    const [watchlistButtonText, setWatchlistButtonText] = useState("Add to Watchlist");
    const [showPopup, setShowPopup] = useState(false);
    const [selectedTypeOption, setSelectedTypeOption] = useState('LIMIT');
    const [selectedTifOption, setSelectedTifOption] = useState('Day');
    const [numShares, setNumShares] = useState(100);
    const [askPrice, setAskPrice] = useState(100);
    const [isToggleOn, setIsToggleOn] = useState(false);
    const [activationPrice, setActivationPrice] = useState(100);

    //Checks if item is already in the user's watchlist
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get('http://localhost:8000/watchlist/', {
                    params: { user: usernumber, symbol: symbol }
                });
                if (response.data.length === 0) {
                    setWatchlistButtonText("Add to Watchlist");
                } else {
                    setWatchlistButtonText("Remove from Watchlist");
                }
            } catch (error) {
                console.error('Error fetching account details:', error);
            }
        };

        fetchData();
    }, [symbol, usernumber]); 

    //Stock data from the last year
    useEffect(() => {
        const fetchStockData = async () => {
            try {
                const url = `https://finnhub.io/api/v1/stock/candle?symbol=${symbol}&resolution=D&from=${Math.floor(
                    (Date.now() - 31536000 * 1000) / 1000
                )}&to=${Math.floor(Date.now() / 1000)}&token=${apiKey}`;
                const response = await axios.get(url);

                const data = response.data;
                const resultData = [];

                //converts to an array of 252 elements, with each element representing a single day's attributes of the stock
                for (let i = 0; i < data.c.length; i++) {
                    const element = {
                        date: new Date(data.t[i] * 1000),
                        close: data.c[i],
                        high: data.h[i],
                        low: data.l[i],
                        volume: data.v[i],
                        open: data.o[i],
                    };
                    resultData.push(element);
                }

                setStockData(resultData);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching: ", error);
            }
        };

        fetchStockData();
    }, [symbol]);

    //Fetches company information
    useEffect(() => {
        const fetchCompanyInfo = async () => {
            try {
                const response = await axios.get(detailsURL);
                setCompanyInfo(response.data);
            } catch (error) {
                console.error("Error fetching company information: ", error);
            }
        };

        fetchCompanyInfo();
    }, [symbol, detailsURL]);

    if (loading) {
        return <div>Loading...</div>;
    }

    const candlesAppearance = {
        wickStroke: function fill(d) {
            return d.close > d.open ? "#0D9B0D" : "#8B0000";
        },
        fill: function fill(d) {
            return d.close > d.open ? "#0D9B0D" : "#8B0000";
        },
        stroke: function fill(d) {
            return d.close > d.open ? "#0D9B0D" : "#8B0000";
        },
        candleStrokeWidth: 1,
        widthRatio: 0.8,
        opacity: 1,
    };

    const xScaleProvider = discontinuousTimeScaleProvider.inputDateAccessor(
        (d) => d.date
    );
    const { data: chartData, xScale, xAccessor, displayXAccessor } =
        xScaleProvider(stockData);
    const xExtents = [
        xAccessor(last(chartData)),
        xAccessor(chartData[chartData.length - 100]),
    ];

    const handleChartMouseWheel = (event) => {
        if (event.ctrlKey || event.metaKey) {
            event.preventDefault();
        }
    };

    const handleChartMouseDown = (event) => {
        if (event.ctrlKey || event.metaKey) {
            event.preventDefault();
        }
    };
    const axisLabelStyle = {
        fill: "blue", // Set the desired label color
        fontSize: 12, // Set the desired label font size
        fontWeight: "bold", // Set the desired label font weight
    };

    const createWatchlistItem = () => {
        axios
            .post('http://localhost:8000/watchlist/', {
                user: usernumber,
                symbol: symbol,
            })
            .then(response => {
                console.log('Created:', response.data);
                setWatchlistButtonText("Remove from Watchlist");
            })
            .catch(error => {
                console.error('Error creating:', error);
            });
    };

    const deleteWatchlistItem = () => {
        axios
            .get('http://localhost:8000/watchlist/', {
                params: { user: usernumber, symbol: symbol }
            })
            .then(response => {
                const itemId = response.data[0].id;
                console.log("Response data:", itemId);
                axios
                    .delete(`http://localhost:8000/watchlist/${itemId}`)
                    .then(response => {
                        console.log('Deleted:', response.data);
                        setWatchlistButtonText("Add to Watchlist");
                    })
                    .catch(error => {
                        console.error('Error deleting:', error);
                    });
            })
            .catch(error => {
                console.error('Error fetching account details:', error);
            });
    };

    const watchlistButtonClick = () => {
        // Toggle the button text based on the current value
        setWatchlistButtonText(prevButtonText =>
            prevButtonText === 'Add to Watchlist' ? createWatchlistItem() : deleteWatchlistItem()
        );
    };


    const profitLossPercentage = ((Number(stockData[stockData.length - 1].close) - Number(stockData[stockData.length - 1].open)) / Number(stockData[stockData.length - 1].open) * 100).toFixed(2);
    const isPositive = profitLossPercentage > 0;

    const handleTypeChange = (event) => {
        setSelectedTypeOption(event.target.value);
    };
    const handleTifChange = (event) => {
        setSelectedTifOption(event.target.value);
    };

    const handleNumShares = (event) => {
        const inputNumber = event.target.value;
        setNumShares(inputNumber);
    };

    const handlePrice = (event) => {
        const inputNumber = event.target.value;
        setAskPrice(inputNumber);
    };

    const handleActivationPrice = (event) => {
        const inputNumber = event.target.value;
        setActivationPrice(inputNumber);
    };

    const handleToggleChange = (event) => {
        setIsToggleOn(event.target.checked);
    };

    const handleXClick = (event) => {
        setShowPopup(false);
    };

    const handleNewOrder = (event) => {
        console.log("Entered event handler");
        const currentDate = new Date();
        const formattedCurrentDate = new Date(currentDate.getTime()).toISOString().slice(0, 10) + ' 00:00:00';
        console.log(formattedCurrentDate);

        // For formattedDate90Days
        const futureDate90Days = new Date(currentDate.getTime() + (90 * 24 * 60 * 60 * 1000));
        const formattedDate90Days = futureDate90Days.toISOString().slice(0, 10) + ' 00:00:00';
        console.log(formattedDate90Days);

        // For formattedDate1Day
        const futureDate1Day = new Date(currentDate);
        futureDate1Day.setDate(currentDate.getDate() + 1);
        const formattedDate1Day = futureDate1Day.toISOString().slice(0, 10) + ' 00:00:00';
        console.log(formattedDate1Day);


        axios.get('http://localhost:8000/users/', {
            params: {
                id: usernumber
            }
        })
            .then((res) => {
                const cash = res.data[0].positions.cash;
                const s = isToggleOn ? 'BUY' : 'SELL';
                if (s === 'SELL') {
                    if ((numShares * askPrice) > (cash * 2) || (selectedTypeOption === 'STOPLIMIT' && activationPrice < askPrice)) {
                        return;
                    }
        }
            })
            .catch((error) => {
                console.error('Error fetching user id:', error);
            });

        //determine whether order is too big to process
        

        //GET request for user details
        axios.get('http://localhost:8000/users/', {
            params: {
                id: usernumber
            }
        })
            .then((res) => {
                console.log(res.data[0].portfolio.cash);
            })
            .catch((error) => {
                console.error('Error fetching user id:', error);
            });

        // Make the POST request with URL params
        axios.post('http://localhost:8000/active-orders/', {
            user: usernumber,
            status: 'W',
            side: isToggleOn ? 'BUY' : 'SELL',
            tif: selectedTifOption,
            type: selectedTypeOption,
            expiration_date: selectedTifOption === 'GTC' ? formattedDate90Days : formattedDate1Day,
            order_date: formattedCurrentDate,
            num_shares: numShares,
            symbol: symbol,
            ask: askPrice,
            activation_price: activationPrice
        })
            .then(response => {
                // Handle the successful response
                console.log('New ActiveOrder created:', response.data);
            })
            .catch(error => {
                // Handle the error
                console.error('Error creating ActiveOrder:', error);
            });
        setShowPopup(false);
    }

    return (
        <div className="trade-page">
            <div className="search-bar">
                <Searchbar id={usernumber} />
            </div>
            <div className="page-contents">
                <div className="chart-block">
                    <h1><b>{symbol}</b></h1>
                    <h2>{companyInfo.name}</h2>
                    {stockData.length > 0 ? (
                        <div className="chart">
                            <ChartCanvas
                                height={375}
                                ratio={1}
                                width={800}
                                margin={{ left: 50, right: 50, top: 10, bottom: 30 }}
                                type="svg"
                                seriesName="MSFT"
                                data={chartData}
                                xScale={xScale}
                                xAccessor={xAccessor}
                                displayXAccessor={displayXAccessor}
                                xExtents={xExtents}
                                onWheel={handleChartMouseWheel}
                                onMouseDown={handleChartMouseDown}
                            >
                                <Chart id={1} yExtents={(d) => [d.high, d.low]}>
                                    <XAxis axisAt="bottom" orient="bottom" ticks={6} stroke="white" tickStroke="white" tickLabelFill="white" tickLabelStyle={axisLabelStyle} />
                                    <YAxis axisAt="left" orient="left" ticks={5} tickStroke="white" tickLabelFill="white" />
                                    <CandlestickSeries {...candlesAppearance} />
                                </Chart>
                            </ChartCanvas>
                        </div>
                    ) : (
                        <div>No data available</div>
                    )}
                </div>
                <div className="price">
                    <div className="dollar">
                        <h1>${Number(stockData[stockData.length - 1].close).toFixed(2)}</h1>
                    </div>
                    <div className="percent">
                        <h1 style={{ color: isPositive ? 'green' : 'red' }}>{profitLossPercentage + '%'}</h1>
                    </div>
                </div>
                <div className="company-details">
                    <div className="label-column">
                        <p>Company Name</p>
                        <p>Country</p>
                        <p>Exchange</p>
                        <p>Industry</p>
                        <p>Website</p>
                        <p>IPO</p>
                        <p>Currency</p>
                    </div>
                    <div className="info-column">
                        <p>{companyInfo.name}</p>
                        <p>{companyInfo.country}</p>
                        <p>{companyInfo.exchange}</p>
                        <p>{companyInfo.finnhubIndustry}</p>
                        <p>{companyInfo.weburl}</p>
                        <p>{companyInfo.ipo}</p>
                        <p>{companyInfo.currency}</p>
                    </div>
                </div>
                <div className="buttons">
                    <button className="buy" onClick={() => setShowPopup(true)}><b>Buy</b></button>
                    <button className="sell" onClick={() => setShowPopup(true)}><b>Sell</b></button>
                    <button className="add" onClick={watchlistButtonText === "Add to Watchlist" ? createWatchlistItem : deleteWatchlistItem}>
                        <b>{watchlistButtonText}</b>
                    </button>
                </div>
                {showPopup && (
                    <div className="popup">
                        <div className="shorthand">
                            <h1>{isToggleOn ? 'BUY' : 'SELL'} {numShares} {symbol} @ {askPrice} {selectedTypeOption} {selectedTypeOption !== 'STOPLIMIT' ? '' : activationPrice} {selectedTifOption}</h1>
                            <div className="x">
                                <FontAwesomeIcon className="xicon" icon={faXmark} color="#fff" onClick={handleXClick} />
                            </div>
                        </div>

                        <label className="toggle">
                            <input type="checkbox" onChange={handleToggleChange} />
                            <span className="slider"></span>
                            <span className="labels" data-on="BUY" data-off="SELL">
                            </span>
                        </label>
                        <div className="count">
                            <h2 className="sharestitle">Share Count: </h2>
                            <input className="sharecount" type="number" value={numShares} onChange={handleNumShares} />
                        </div>

                        <div className="pricebox">
                            {selectedTypeOption !== 'MARKET' && selectedTypeOption !== 'MOC' ? (
                                <>
                                    <h2 className="askprice">Ask Price: </h2>
                                    <input className="priceinput" type="number" value={askPrice} onChange={handlePrice} />
                                </>
                            ) : null}
                        </div>

                        <div className="activationbox">
                            {selectedTypeOption === 'STOPLIMIT' ? (
                                <>
                                    <h2 className="askprice">Activation Price: </h2>
                                    <input className="activationinput" type="number" value={activationPrice} onChange={handleActivationPrice} />
                                </>
                            ) : null}
                        </div>

                        <select className="type" value={selectedTypeOption} onChange={handleTypeChange}>
                            <option value="LIMIT">LIMIT</option>
                            <option value="MARKET">MARKET</option>
                            <option value="MOC">MOC</option>
                            <option value="LOC">LOC</option>
                            <option value="STOP">STOP</option>
                            <option value="STOPLIMIT">STOPLIMIT</option>
                        </select>
                        <select className="tif" value={selectedTifOption} onChange={handleTifChange}>
                            <option value="Day">Day</option>
                            <option value="GTC">GTC</option>
                        </select>

                        <div className="orderbuttons">
                            <button className="deleteorder" onClick={handleXClick}><b>Delete</b></button>
                            <button className="createorder" onClick={handleNewOrder}><b>Create</b></button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Trade;
