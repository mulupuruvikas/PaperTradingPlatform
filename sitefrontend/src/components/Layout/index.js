import { Outlet } from 'react-router-dom'
import Sidebar from '../Sidebar/index';
import Searchbar from '../Searchbar/index';
import './index.scss';

const Layout = () => {
    return (
        <div className="App">
            <Sidebar />
            <Searchbar />
            <div className='page'>
                <Outlet />
            </div>
        </div>
    )
}

export default Layout