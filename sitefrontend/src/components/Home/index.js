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
                <p class="lefty">
                    Account Value: <br></br>
                    Option Buying Power: <br></br>
                    Stock Buying Power:<br></br>
                </p>
                <p class="righty">
                    $sample value <br></br>
                    $sample options <br></br> 
                    $sample stocks <br></br>
                </p>
                <p class="cash">
                    Cash:
                </p>
                <p class="cash-value">
                    $samplecash
                </p>
                <p class="reset"> <b>
                    Reset
                </b></p>
                <p class="profit-loss-day">
                    P/L Day
                </p>
                <p class="profits">
                    0%
                </p>
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

   