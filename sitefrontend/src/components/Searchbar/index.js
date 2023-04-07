import Logo from '../../assets/images/full-logo.png'
import { Link } from 'react-router-dom'
import './index.scss'

const Searchbar = () => {
    return (
        <div className="search-bar">
            <Link className='logo' to='/'>
                <img src={Logo} alt="logo" />
            </Link>

            <input type="text" id="search" placeholder="Find a symbol" />    
        </div>
        
    )
}

export default Searchbar