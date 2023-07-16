import { Outlet } from 'react-router-dom'
import Searchbar from '../Searchbar/index';
import './index.scss';

const Layout = () => {
    return (
        <div className="App">
            <Searchbar />
            <div className='page'>
                <Outlet />
            </div>
        </div>
    )
}

export default Layout