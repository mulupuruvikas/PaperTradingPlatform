import './index.scss'
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Searchbar = () => {

    const [inputValue, setInputValue] = useState('');
    const navigate = useNavigate();

    const handleKeyPress = (event) => {
        if (event.key === 'Enter') {
            event.preventDefault();
            console.log('Input value:', inputValue);
            navigate("/portfolio/trade", { state: { symbol: inputValue } });
            setInputValue('');
        }
    };

    const handleChange = (event) => {
        setInputValue(event.target.value);
    };

    return (
        <div className="search-bar">
            <input
                type="text"
                id="search"
                placeholder=" Find a symbol"
                value={inputValue}
                onChange={handleChange}
                onKeyDown={handleKeyPress}
            />
        </div>
        
    )
}

export default Searchbar