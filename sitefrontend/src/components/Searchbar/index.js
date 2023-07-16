import './index.scss'
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Searchbar = (props) => {

    const [inputValue, setInputValue] = useState('');
    const navigate = useNavigate();

    const handleKeyPress = (event) => {
        if (event.key === 'Enter') {
            event.preventDefault();
            console.log('Input value:', inputValue);
            console.log('User ID:', props.id);
            navigate("/portfolio/trade", { state: { symbol: inputValue.toUpperCase(), id: props.id } });
            setInputValue('');
        }
    };

    const handleChange = (event) => {
        setInputValue(event.target.value);
    };

    const handleHomeClick = () => {
        navigate("/portfolio", { state: { id: props.id } });
        setInputValue('');
    }

    return (
        <div className="search-bar">
            <img
                src={process.env.PUBLIC_URL + '/full-logo.png'}
                onClick={handleHomeClick}
                alt="home-logo"
            />
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