import { Link } from 'react-router-dom'
import './index.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faDollarSign, faStar, faBriefcase } from '@fortawesome/free-solid-svg-icons'

const Home = () => {

    return (
        <div className="container home-page">
            <div className="account-summary">
                <h1>
                <FontAwesomeIcon icon={faDollarSign} color="#fff" />
                    &nbsp; &nbsp; &nbsp;
                    Account Summary
                </h1>
                <p1>
                    Account Value: <br></br>
                    Option Buying Power: <br></br>
                    Stock Buying Power:<br></br>
                </p1>
                <p2>
                    $sample value <br></br>
                    $sample options <br></br>
                    $sample stocks <br></br>
                </p2>
            </div>
            <div className="watchlist">
                <h1>
                    <FontAwesomeIcon icon={faStar} color="#fff" />
                    &nbsp; &nbsp; &nbsp;
                    Watchlist
                </h1>
            </div>
            <div className="positions">
                <h1>
                    <FontAwesomeIcon icon={faBriefcase} color="#fff" />
                    &nbsp; &nbsp; &nbsp;
                    Account Positions
                </h1>
            </div>
        </div>
    )
}

export default Home

   