import { NavLink } from 'react-router-dom'
import './index.scss'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHome, faBriefcase, faLineChart } from '@fortawesome/free-solid-svg-icons'

const Sidebar = () => (
    <div className='nav-bar'>
        <nav>
            <NavLink exact="true" activeclassnamnpme="active" to="/portfolio">
                <FontAwesomeIcon icon={faHome} color="#4d4d4e" /> &nbsp; Home
            </NavLink>
            <NavLink exact="true" activeclassname="active" className="about-link" to="/portfolio/trade">
                <FontAwesomeIcon icon={faLineChart} color="#4d4d4e" /> &nbsp; Trade
            </NavLink>
            <NavLink exact="true" activeclassname="active" className="contact-link" to="/portfolio/account">
                <FontAwesomeIcon icon={faBriefcase} color="#4d4d4e" /> &nbsp; Portfolio
            </NavLink>
        </nav>
    </div>
)

export default Sidebar