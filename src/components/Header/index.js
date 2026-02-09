import './index.css'
import {withRouter, Link} from 'react-router-dom'

import Cookies from 'js-cookie'

const Header = props => {
  const onLogout = () => {
    const {history} = props
    Cookies.remove('jwt_token')
    history.replace('/login')
  }

  return (
    <div>
      <nav className="nav-container">
        <Link to="/">
          <img
            src="https://assets.ccbp.in/frontend/react-js/logo-img.png"
            alt="website logo"
            className="logo"
          />
        </Link>
        <ul className="list-container">
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            {' '}
            <Link to="/jobs">Jobs</Link>
          </li>
          <li>
            {' '}
            <button type="button" className="logout" onClick={onLogout}>
              Logout
            </button>
          </li>
        </ul>
      </nav>
    </div>
  )
}
export default withRouter(Header)
