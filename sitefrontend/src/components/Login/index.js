import Logo from '../../assets/images/full-logo.png'
import { Link } from 'react-router-dom'
import './index.scss'

const Login = () => {

    const handleSignInClick = () => {
        console.log('Clicked.')
    }

    return (
        <div className="layout" >
            <div className="login">
                <img src={Logo} alt="logo" />
                <div className="inputs">
                    <p>Username: </p>
                    <input type="text" id="username" placeholder=" Enter username" />
                    <p>Password: </p>
                    <input type="text" id="password" placeholder=" Enter password" />
                </div>
                <Link className='sign-in' to='/portfolio' id="sign-in">
                    <button onClick={handleSignInClick}><b>Sign in</b></button>
                </Link>
            </div>
        </div>
    )
}

export default Login