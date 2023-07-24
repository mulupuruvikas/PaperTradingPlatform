import './index.scss'
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRightFromBracket } from '@fortawesome/free-solid-svg-icons';

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

    const handleLogout = () => {
        navigate("/");
    }

    return (
        <div className="search-bar">
            <img
                src={process.env.PUBLIC_URL + '/logo.ico'}
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
            <FontAwesomeIcon className="logout" icon={faArrowRightFromBracket} color="#fff" onClick={handleLogout} />
        </div>
        
    )
}

export default Searchbar