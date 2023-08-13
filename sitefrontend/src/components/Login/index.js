import React, { useState } from 'react';
import axios from 'axios';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import jwt_decode from "jwt-decode";
import './index.scss';



const Login = () => {

    const navigate = useNavigate();
    const [activeOrders, setActiveOrders] = useState([]);

    const fetchStockData = async (symbol) => {
        const apiKey = 'cie9nspr01qmfas4b65gcie9nspr01qmfas4b660';
        const now = Math.floor(Date.now() / 1000);
        const ninetyDaysAgo = now - (7776000);

        const apiUrl = `https://finnhub.io/api/v1/stock/candle?symbol=${symbol}&resolution=D&from=${ninetyDaysAgo}&to=${now}&token=${apiKey}`;

        try {
            const response = await axios.get(apiUrl);
            return response.data;
        } catch (error) {
            console.error('Error fetching stock data:', error);
            return null;
        }
    };

    //
    // DELETE all expired active orders
    //
    useEffect(() => {
        // Delete request
        const today = new Date();
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, '0'); // Adding 1 to month because it is zero-indexed
        const day = String(today.getDate() - 1).padStart(2, '0');
        const startDate = `${year}-${month}-${day}`;

        const ninetyDaysAgo = new Date(today); // Create a new Date object
        ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90); // Subtract 90 days

        const y = ninetyDaysAgo.getFullYear();
        const m = String(ninetyDaysAgo.getMonth() + 1).padStart(2, '0'); // Adding 1 to month because it is zero-indexed
        const d = String(ninetyDaysAgo.getDate()).padStart(2, '0');

        const endDate = `${y}-${m}-${d}`;
        axios.delete('http://localhost:8000/active-orders/delete/', {
            data: {
                expiration_start_date: endDate,
                expiration_end_date: startDate,
            },
        })
            .then((response) => {
                // Handle success response here (if needed)
                console.log('Active orders deleted successfully:', response);
            })
            .catch((error) => {
                // Handle error here
                console.error('Error deleting active orders:', error);
            });

        axios.get('http://localhost:8000/active-orders/')
            .then(response => {
                const activeOrders = response.data;

                // Map over activeOrders to do more things with each order
                const processedOrders = activeOrders.map(order => {
                    const formattedOrder = {
                        ...order,
                        formattedDate: new Date(order.date).toLocaleDateString(),
                        totalAmount: order.price * order.quantity,
                        // ... add more properties or calculations as needed ...
                    };

                    //Go through each active order. Check if it needs to be filled. If it does, (if buy) check if there are negative shares and if sell, check if the account has positive shares. Else, add to the positions

                    // Call the fetchStockData function for each order symbol
                    return fetchStockData(order.symbol)
                        .then(stockData => {
                            console.log("order", order);
                            if (order.side === 'BUY' && (order.type === 'MOC' || order.type === 'MARKET')) {
                                //delete the active order
                                const user = order.user;
                                const symbol = order.symbol;
                                const bought_at = stockData.c[stockData.c.length - 1];
                                const num_shares = order.num_shares;

                                axios
                                    .delete(`http://localhost:8000/active-orders/${order.id}`)
                                    .then(response => {
                                        console.log('Deleted:', response.data);
                                        // Add any necessary logic after the successful deletion
                                    })
                                    .catch(error => {
                                        console.error('Error deleting:', error);
                                    });

                                axios.get('http://localhost:8000/users/', {
                                    params: {
                                        id: user
                                    }
                                })
                                    .then((res) => {
                                        const portfolio = res.data[0].portfolio;
                                        const cash_amt = portfolio.cash;
                                        axios.patch(`http://localhost:8000/portfolios/${portfolio.id}/`, {
                                            cash: cash_amt + (num_shares * bought_at)
                                        })
                                            .then((response) => {
                                                // Handle success response here
                                                console.log('Portfolio updated:', response.data);
                                            })
                                            .catch((error) => {
                                                // Handle error here
                                                console.error('Error updating Portfolio:', error);
                                            });
                                    })
                                    .catch((error) => {
                                        console.error('Error fetching user id:', error);
                                    });

                                //check if there are positions in the account already with this stock
                                axios.get('http://localhost:8000/positions/', {
                                    params: {
                                        user: order.user,
                                        symbol: order.symbol
                                    }
                                })
                                    .then((res) => {
                                        const position = res.data;
                                        if (position.length === 0) {
                                            //make a new position
                                            axios
                                                .post('http://localhost:8000/positions/', {
                                                    user: user,
                                                    symbol: symbol,
                                                    bought_at: bought_at,
                                                    num_shares: num_shares,
                                                })
                                                .then(response => {
                                                    console.log('Created:', response.data);
                                                })
                                                .catch(error => {
                                                    console.error('Error creating:', error);
                                                })
                                        } else {
                                            const currvalue = Math.abs(position[0].num_shares) * position[0].bought_at;
                                            const additional = bought_at * num_shares;
                                            const new_bought = (additional + currvalue) / (Math.abs(position[0].num_shares) * num_shares);
                                            axios.patch(`http://localhost:8000/positions/${position[0].id}/`, {
                                                bought_at: new_bought,
                                                num_shares: position[0].num_shares + num_shares
                                            })
                                                .then((response) => {
                                                    // Handle success response here
                                                    console.log('Position updated:', response.data);
                                                    if (position[0].num_shares - num_shares === 0) {
                                                        console.log("REACHED ZERO");
                                                        axios
                                                            .delete(`http://localhost:8000/positions/${position[0].id}`)
                                                            .then(response => {
                                                                console.log('Deleted:', response.data);
                                                                // Add any necessary logic after the successful deletion
                                                            })
                                                            .catch(error => {
                                                                console.error('Error deleting:', error);
                                                            });
                                                    } else {
                                                        console.log("HAS NOT REACHED ZERO");
                                                    }
                                                })
                                                .catch((error) => {
                                                    // Handle error here
                                                    console.error('Error updating position:', error);
                                                });
                                        }
                                    })
                                    .catch((error) => {
                                        console.error('Error fetching user id:', error);
                                    });
                            } else if (order.side === 'BUY' && (order.type === 'LIMIT' || order.type === 'LOC' || order.type === 'STOPLIMIT')) {
                                // Do something else if the order type is not 'MARKET' or 'MOC'
                                if (order.tif === 'Day' || order.tif === 'GTC') {
                                    console.log("pass");
                                    const user = order.user;
                                    const symbol = order.symbol;
                                    const bought_at = stockData.c[stockData.c.length - 1];
                                    const num_shares = order.num_shares;
                                    if (stockData.h[stockData.h.length - 1] > order.ask && stockData.l[stockData.l.length - 1]) {

                                        axios.get('http://localhost:8000/users/', {
                                            params: {
                                                id: user
                                            }
                                        })
                                            .then((res) => {
                                                const portfolio = res.data[0].portfolio;
                                                const cash_amt = portfolio.cash;
                                                axios.patch(`http://localhost:8000/portfolios/${portfolio.id}/`, {
                                                    cash: cash_amt + (num_shares * bought_at)
                                                })
                                                    .then((response) => {
                                                        // Handle success response here
                                                        console.log('Portfolio updated:', response.data);
                                                    })
                                                    .catch((error) => {
                                                        // Handle error here
                                                        console.error('Error updating Portfolio:', error);
                                                    });
                                            })
                                            .catch((error) => {
                                                console.error('Error fetching user id:', error);
                                            });

                                        axios
                                            .delete(`http://localhost:8000/active-orders/${order.id}`)
                                            .then(response => {
                                                console.log('Deleted:', response.data);
                                                // Add any necessary logic after the successful deletion
                                            })
                                            .catch(error => {
                                                console.error('Error deleting:', error);
                                            });

                                        //check if there are positions in the account already with this stock
                                        axios.get('http://localhost:8000/positions/', {
                                            params: {
                                                user: order.user,
                                                symbol: order.symbol
                                            }
                                        })
                                            .then((res) => {
                                                const position = res.data;
                                                if (position.length === 0) {
                                                    //make a new position
                                                    axios
                                                        .post('http://localhost:8000/positions/', {
                                                            user: user,
                                                            symbol: symbol,
                                                            bought_at: bought_at,
                                                            num_shares: num_shares,
                                                        })
                                                        .then(response => {
                                                            console.log('Created:', response.data);
                                                        })
                                                        .catch(error => {
                                                            console.error('Error creating:', error);
                                                        })
                                                } else {
                                                    const currvalue = Math.abs(position[0].num_shares) * position[0].bought_at;
                                                    const additional = bought_at * num_shares;
                                                    const new_bought = (additional + currvalue) / (Math.abs(position[0].num_shares) * num_shares);
                                                    axios.patch(`http://localhost:8000/positions/${position[0].id}/`, {
                                                        bought_at: new_bought,
                                                        num_shares: position[0].num_shares + num_shares
                                                    })
                                                        .then((response) => {
                                                            // Handle success response here
                                                            console.log('Position updated:', response.data);
                                                            if (position[0].num_shares - num_shares === 0) {
                                                                console.log("REACHED ZERO");
                                                                axios
                                                                    .delete(`http://localhost:8000/positions/${position[0].id}`)
                                                                    .then(response => {
                                                                        console.log('Deleted:', response.data);
                                                                        // Add any necessary logic after the successful deletion
                                                                    })
                                                                    .catch(error => {
                                                                        console.error('Error deleting:', error);
                                                                    });
                                                            } else {
                                                                console.log("HAS NOT REACHED ZERO");
                                                            }
                                                        })
                                                        .catch((error) => {
                                                            // Handle error here
                                                            console.error('Error updating position:', error);
                                                        });
                                                }
                                            })
                                            .catch((error) => {
                                                console.error('Error fetching user id:', error);
                                            });
                                    } else {
                                        if (order.tif === 'GTC') {
                                            console.log("pass");
                                            function convertToUnixTime(dateString) {
                                                const [year, month, day] = dateString.split('-').map(Number);
                                                const dateObject = new Date(year, month - 1, day);
                                                const unixTime = dateObject.getTime();
                                                return unixTime;
                                            }
                                            //check the date for each othe dates since it started
                                            let i = stockData.c.length - 1;
                                            const date_ordered = convertToUnixTime(order.order_date.split('T')[0]) / 1000;
                                            console.log("Date ordered", date_ordered);
                                            console.log("Last date recorded", stockData.t[i]);
                                            while (stockData.t[i] > date_ordered) {
                                                const user = order.user;
                                                const symbol = order.symbol;
                                                const bought_at = stockData.c[stockData.c.length - 1];
                                                const num_shares = order.num_shares;
                                                if (stockData.h[i] > order.ask && stockData.l[i]) {
                                                    console.log("pass2");
                                                    axios.get('http://localhost:8000/users/', {
                                                        params: {
                                                            id: user
                                                        }
                                                    })
                                                        .then((res) => {
                                                            const portfolio = res.data[0].portfolio;
                                                            const cash_amt = portfolio.cash;
                                                            axios.patch(`http://localhost:8000/portfolios/${portfolio.id}/`, {
                                                                cash: cash_amt - (num_shares * bought_at)
                                                            })
                                                                .then((response) => {
                                                                    // Handle success response here
                                                                    console.log('Portfolio updated:', response.data);
                                                                })
                                                                .catch((error) => {
                                                                    // Handle error here
                                                                    console.error('Error updating Portfolio:', error);
                                                                });
                                                        })
                                                        .catch((error) => {
                                                            console.error('Error fetching user id:', error);
                                                        });

                                                    axios
                                                        .delete(`http://localhost:8000/active-orders/${order.id}`)
                                                        .then(response => {
                                                            console.log('Deleted:', response.data);
                                                            // Add any necessary logic after the successful deletion
                                                        })
                                                        .catch(error => {
                                                            console.error('Error deleting:', error);
                                                        });

                                                    //check if there are positions in the account already with this stock
                                                    axios.get('http://localhost:8000/positions/', {
                                                        params: {
                                                            user: order.user,
                                                            symbol: order.symbol
                                                        }
                                                    })
                                                        .then((res) => {
                                                            const position = res.data;
                                                            if (position.length === 0) {
                                                                //make a new position
                                                                axios
                                                                    .post('http://localhost:8000/positions/', {
                                                                        user: user,
                                                                        symbol: symbol,
                                                                        bought_at: bought_at,
                                                                        num_shares: num_shares,
                                                                    })
                                                                    .then(response => {
                                                                        console.log('Created:', response.data);
                                                                    })
                                                                    .catch(error => {
                                                                        console.error('Error creating:', error);
                                                                    })
                                                            } else {
                                                                const currvalue = Math.abs(position[0].num_shares) * position[0].bought_at;
                                                                const additional = bought_at * num_shares;
                                                                const new_bought = (additional + currvalue) / (Math.abs(position[0].num_shares) * num_shares);
                                                                axios.patch(`http://localhost:8000/positions/${position[0].id}/`, {
                                                                    bought_at: new_bought,
                                                                    num_shares: position[0].num_shares + num_shares
                                                                })
                                                                    .then((response) => {
                                                                        // Handle success response here
                                                                        console.log('Position updated:', response.data);
                                                                        if (position[0].num_shares - num_shares === 0) {
                                                                            console.log("REACHED ZERO");
                                                                            axios
                                                                                .delete(`http://localhost:8000/positions/${position[0].id}`)
                                                                                .then(response => {
                                                                                    console.log('Deleted:', response.data);
                                                                                    // Add any necessary logic after the successful deletion
                                                                                })
                                                                                .catch(error => {
                                                                                    console.error('Error deleting:', error);
                                                                                });
                                                                        } else {
                                                                            console.log("HAS NOT REACHED ZERO");
                                                                        }
                                                                    })
                                                                    .catch((error) => {
                                                                        // Handle error here
                                                                        console.error('Error updating position:', error);
                                                                    });
                                                            }
                                                        })
                                                        .catch((error) => {
                                                            console.error('Error fetching user id:', error);
                                                        });
                                                }
                                                i = i - 1;
                                            }
                                        } else {
                                            axios
                                                .delete(`http://localhost:8000/active-orders/${order.id}`)
                                                .then(response => {
                                                    console.log('Deleted:', response.data);
                                                    // Add any necessary logic after the successful deletion
                                                })
                                                .catch(error => {
                                                    console.error('Error deleting:', error);
                                                });
                                        }
                                    }
                                }
                            } else if (order.side === 'SELL' && (order.type === 'MARKET' || order.type === 'MOC')) {
                                const user = order.user;
                                const symbol = order.symbol;
                                const bought_at = stockData.c[stockData.c.length - 1];
                                const num_shares = order.num_shares;
                                console.log("NUM SHARES:", num_shares);

                                axios
                                    .delete(`http://localhost:8000/active-orders/${order.id}`)
                                    .then(response => {
                                        console.log('Deleted:', response.data);
                                        // Add any necessary logic after the successful deletion
                                    })
                                    .catch(error => {
                                        console.error('Error deleting:', error);
                                    });

                                axios.get('http://localhost:8000/users/', {
                                    params: {
                                        id: user
                                    }
                                })
                                    .then((res) => {
                                        const portfolio = res.data[0].portfolio;
                                        const cash_amt = portfolio.cash;
                                        axios.patch(`http://localhost:8000/portfolios/${portfolio.id}/`, {
                                            cash: cash_amt + (num_shares * bought_at)
                                        })
                                            .then((response) => {
                                                // Handle success response here
                                                console.log('Portfolio updated:', response.data);
                                            })
                                            .catch((error) => {
                                                // Handle error here
                                                console.error('Error updating Portfolio:', error);
                                            });
                                    })
                                    .catch((error) => {
                                        console.error('Error fetching user id:', error);
                                    });
                                //check if there are positions in the account already with this stock
                                axios.get('http://localhost:8000/positions/', {
                                    params: {
                                        user: order.user,
                                        symbol: order.symbol
                                    }
                                })
                                    .then((res) => {
                                        const position = res.data;
                                        if (position.length === 0) {
                                            //make a new position
                                            axios
                                                .post('http://localhost:8000/positions/', {
                                                    user: user,
                                                    symbol: symbol,
                                                    bought_at: bought_at,
                                                    num_shares: num_shares * -1,
                                                })
                                                .then(response => {
                                                    console.log('Created:', response.data);
                                                })
                                                .catch(error => {
                                                    console.error('Error creating:', error);
                                                })
                                        } else {
                                            const currvalue = Math.abs(position[0].num_shares) * position[0].bought_at;
                                            const additional = bought_at * num_shares;
                                            console.log(position[0].num_shares);
                                            console.log(num_shares);
                                            const new_bought = (additional + currvalue) / (Math.abs(position[0].num_shares) * num_shares);
                                            axios.patch(`http://localhost:8000/positions/${position[0].id}/`, {
                                                bought_at: new_bought,
                                                num_shares: position[0].num_shares - (num_shares)
                                            })
                                                .then((response) => {
                                                    // Handle success response here
                                                    console.log(position[0].num_shares);
                                                    console.log(num_shares);
                                                    console.log('Position updated:', response.data);
                                                    if (position[0].num_shares - num_shares === 0) {
                                                        console.log("REACHED ZERO");
                                                        axios
                                                            .delete(`http://localhost:8000/positions/${position[0].id}`)
                                                            .then(response => {
                                                                console.log('Deleted:', response.data);
                                                                // Add any necessary logic after the successful deletion
                                                            })
                                                            .catch(error => {
                                                                console.error('Error deleting:', error);
                                                            });
                                                    } else {
                                                        console.log("HAS NOT REACHED ZERO");
                                                    }
                                                })
                                                .catch((error) => {
                                                    // Handle error here
                                                    console.error('Error updating position:', error);
                                                });
                                        }
                                    })
                                    .catch((error) => {
                                        console.error('Error fetching user id:', error);
                                    });
                            } else if (order.side === 'SELL' && (order.type === 'LIMIT' || order.type === 'LOC' || order.type === 'STOPLIMIT')) {
                                // Do something else if the order type is not 'MARKET' or 'MOC'
                                if(order.tif === 'Day' || order.tidf === 'GTC') {
                                    const user = order.user;
                                    const symbol = order.symbol;
                                    const bought_at = stockData.c[stockData.c.length - 1];
                                    const num_shares = order.num_shares;
                                    if (stockData.h[stockData.h.length - 1] > order.ask && stockData.l[stockData.l.length - 1]) {
                                        axios
                                            .delete(`http://localhost:8000/active-orders/${order.id}`)
                                            .then(response => {
                                                console.log('Deleted:', response.data);
                                                // Add any necessary logic after the successful deletion
                                            })
                                            .catch(error => {
                                                console.error('Error deleting:', error);
                                            });
                                        axios.get('http://localhost:8000/users/', {
                                            params: {
                                                id: user
                                            }
                                        })
                                            .then((res) => {
                                                const portfolio = res.data[0].portfolio;
                                                const cash_amt = portfolio.cash;
                                                axios.patch(`http://localhost:8000/portfolios/${portfolio.id}/`, {
                                                    cash:  cash_amt + (num_shares * bought_at)
                                                })
                                                    .then((response) => {
                                                        // Handle success response here
                                                        console.log('Position updated:', response.data);
                                                    })
                                                    .catch((error) => {
                                                        // Handle error here
                                                        console.error('Error updating position:', error);
                                                    });
                                            })
                                            .catch((error) => {
                                                console.error('Error fetching user id:', error);
                                            });
                                        //check if there are positions in the account already with this stock
                                        axios.get('http://localhost:8000/positions/', {
                                            params: {
                                                user: order.user,
                                                symbol: order.symbol
                                            }
                                        })
                                            .then((res) => {
                                                const position = res.data;
                                                if (position.length === 0) {
                                                    //make a new position
                                                    axios
                                                        .post('http://localhost:8000/positions/', {
                                                            user: user,
                                                            symbol: symbol,
                                                            bought_at: bought_at,
                                                            num_shares: num_shares * -1,
                                                        })
                                                        .then(response => {
                                                            console.log('Created:', response.data);
                                                        })
                                                        .catch(error => {
                                                            console.error('Error creating:', error);
                                                        })
                                                } else {
                                                    const currvalue = Math.abs(position[0].num_shares) * position[0].bought_at;
                                                    const additional = bought_at * num_shares;
                                                    const new_bought = (additional + currvalue) / (Math.abs(position[0].num_shares) * num_shares);
                                                    axios.patch(`http://localhost:8000/positions/${position[0].id}/`, {
                                                        bought_at: new_bought,
                                                        num_shares: position[0].num_shares + (num_shares * -1)
                                                    })
                                                        .then((response) => {
                                                            // Handle success response here
                                                            console.log('Position updated:', response.data);
                                                            if (position[0].num_shares - num_shares === 0) {
                                                                console.log("REACHED ZERO");
                                                                axios
                                                                    .delete(`http://localhost:8000/positions/${position[0].id}`)
                                                                    .then(response => {
                                                                        console.log('Deleted:', response.data);
                                                                        // Add any necessary logic after the successful deletion
                                                                    })
                                                                    .catch(error => {
                                                                        console.error('Error deleting:', error);
                                                                    });
                                                            } else {
                                                                console.log("HAS NOT REACHED ZERO");
                                                            }
                                                        })
                                                        .catch((error) => {
                                                            // Handle error here
                                                            console.error('Error updating position:', error);
                                                        });
                                                }
                                            })
                                            .catch((error) => {
                                                console.error('Error fetching user id:', error);
                                            });
                                    } else {
                                        if (order.tif === 'GTC') {
                                            console.log("pass");
                                            function convertToUnixTime(dateString) {
                                                const [year, month, day] = dateString.split('-').map(Number);
                                                const dateObject = new Date(year, month - 1, day);
                                                const unixTime = dateObject.getTime();
                                                return unixTime;
                                            }
                                            //check the date for each othe dates since it started
                                            let i = stockData.c.length - 1;
                                            const date_ordered = convertToUnixTime(order.order_date.split('T')[0]) / 1000;
                                            console.log("Date ordered", date_ordered);
                                            console.log("Last date recorded", stockData.t[i]);
                                            while (stockData.t[i] > date_ordered) {
                                                const user = order.user;
                                                const symbol = order.symbol;
                                                const bought_at = stockData.c[stockData.c.length - 1];
                                                const num_shares = order.num_shares;
                                                if (stockData.h[i] > order.ask && stockData.l[i]) {
                                                    console.log("pass2");
                                                    axios.get('http://localhost:8000/users/', {
                                                        params: {
                                                            id: user
                                                        }
                                                    })
                                                        .then((res) => {
                                                            const portfolio = res.data[0].portfolio;
                                                            const cash_amt = portfolio.cash;
                                                            axios.patch(`http://localhost:8000/portfolios/${portfolio.id}/`, {
                                                                cash: cash_amt + (num_shares * bought_at)
                                                            })
                                                                .then((response) => {
                                                                    // Handle success response here
                                                                    console.log('Portfolio updated:', response.data);
                                                                })
                                                                .catch((error) => {
                                                                    // Handle error here
                                                                    console.error('Error updating Portfolio:', error);
                                                                });
                                                        })
                                                        .catch((error) => {
                                                            console.error('Error fetching user id:', error);
                                                        });

                                                    axios
                                                        .delete(`http://localhost:8000/active-orders/${order.id}`)
                                                        .then(response => {
                                                            console.log('Deleted:', response.data);
                                                            // Add any necessary logic after the successful deletion
                                                        })
                                                        .catch(error => {
                                                            console.error('Error deleting:', error);
                                                        });

                                                    //check if there are positions in the account already with this stock
                                                    axios.get('http://localhost:8000/positions/', {
                                                        params: {
                                                            user: order.user,
                                                            symbol: order.symbol
                                                        }
                                                    })
                                                        .then((res) => {
                                                            const position = res.data;
                                                            if (position.length === 0) {
                                                                //make a new position
                                                                axios
                                                                    .post('http://localhost:8000/positions/', {
                                                                        user: user,
                                                                        symbol: symbol,
                                                                        bought_at: bought_at,
                                                                        num_shares: num_shares,
                                                                    })
                                                                    .then(response => {
                                                                        console.log('Created:', response.data);
                                                                    })
                                                                    .catch(error => {
                                                                        console.error('Error creating:', error);
                                                                    })
                                                            } else {
                                                                const currvalue = Math.abs(position[0].num_shares) * position[0].bought_at;
                                                                const additional = bought_at * num_shares;
                                                                const new_bought = (additional + currvalue) / (Math.abs(position[0].num_shares) * num_shares);
                                                                axios.patch(`http://localhost:8000/positions/${position[0].id}/`, {
                                                                    bought_at: new_bought,
                                                                    num_shares: position[0].num_shares + num_shares
                                                                })
                                                                    .then((response) => {
                                                                        // Handle success response here
                                                                        console.log('Position updated:', response.data);
                                                                        if (position[0].num_shares - num_shares === 0) {
                                                                            console.log("REACHED ZERO");
                                                                            axios
                                                                                .delete(`http://localhost:8000/positions/${position[0].id}`)
                                                                                .then(response => {
                                                                                    console.log('Deleted:', response.data);
                                                                                    // Add any necessary logic after the successful deletion
                                                                                })
                                                                                .catch(error => {
                                                                                    console.error('Error deleting:', error);
                                                                                });
                                                                        } else {
                                                                            console.log("HAS NOT REACHED ZERO");
                                                                        }
                                                                    })
                                                                    .catch((error) => {
                                                                        // Handle error here
                                                                        console.error('Error updating position:', error);
                                                                    });
                                                            }
                                                        })
                                                        .catch((error) => {
                                                            console.error('Error fetching user id:', error);
                                                        });
                                                }
                                                i = i - 1;
                                            }
                                        } else {
                                            axios
                                                .delete(`http://localhost:8000/active-orders/${order.id}`)
                                                .then(response => {
                                                    console.log('Deleted:', response.data);
                                                    // Add any necessary logic after the successful deletion
                                                })
                                                .catch(error => {
                                                    console.error('Error deleting:', error);
                                                });
                                        }
                                        
                                    }
                            } else {
                                //check the date for each othe dats since it started

                            }
                            }
                            return { ...formattedOrder, stockData };
                        })
                        .catch(error => {
                            console.error(`Error fetching stock data for ${order.symbol}:`, error);
                            // If there's an error fetching stock data, return the order without it
                            return formattedOrder;
                        });
                });

                // Resolve all the promises in the processedOrders array
                Promise.all(processedOrders)
                    .then(finalProcessedOrders => {
                        console.log("Processed active orders:");
                        console.log(finalProcessedOrders);
                        // Process the finalProcessedOrders as needed...
                    })
                    .catch(error => {
                        console.error('Error processing active orders:', error);
                    });
            })
            .catch(error => {
                console.error('Error fetching active orders:', error);
            });

        /*global google */
        google.accounts.id.initialize({
            client_id: "758107152580-fo4ln9omnabm2k9sn4n3947h5frbhcvs.apps.googleusercontent.com",
            callback: handleCallbackResponse
        })



        google.accounts.id.renderButton(
            document.getElementById("signInDiv"),
            { theme: "outline", size: "large"}
        )
    }, []);





    //check all the active orders. If they should be filled, then delete the active order and create a position. If the expiration date has passed, delete the order as well.



    function handleCallbackResponse(response) {
        var userObject = jwt_decode(response.credential);
        var emailAddress = userObject.email;
        let userId = 2;

        axios.get('http://localhost:8000/users/', {
            params: {
                email: emailAddress
            }
        })
            .then((res) => {
                const users = res.data;
                if (users.length > 0) {
                    userId = users[0].id;
                    navigate("/portfolio", { state: { id: userId } });
                } else {
                    axios.post('http://localhost:8000/users/', {
                        email: emailAddress,
                        portfolio: {
                            value: 200000,
                            cash: 200000,
                            p_L: 0,
                            stock_buying_power: 300000,
                            option_buying_power: 200000
                        }
                    })
                        .then((res) => {
                            axios.get('http://localhost:8000/users/', {
                                params: {
                                    email: emailAddress
                                }
                            })
                                .then((res) => {
                                    console.log("Users:", users);
                                    userId = users[0].id;
                                    console.log("Sending to homepage");
                                    navigate("/portfolio", { state: { id: userId } });
                                })
                            .catch((error) => {
                                console.error('Error fetching user id:', error);
                            });
                        })
                        .catch((error) => {
                            console.error('Error making create request:', error);
                        });
                }
            })
            .catch((error) => {
                console.error('Error fetching users:', error);
            });

    }

    return (
        <div className="back">
            <div className="signinlayout">
                <img
                    src={process.env.PUBLIC_URL + '/full-logo.png'}
                    alt="home-logo"
                />
                <h1>Start trading now.</h1>
                <div className="login-button" id="signInDiv"></div>
            </div>
        </div>
    )
}

export default Login;