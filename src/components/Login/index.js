import './index.css'
import {Component} from 'react'
import {Redirect} from 'react-router-dom'
import Cookies from 'js-cookie'

class Login extends Component {
  state = {username: '', password: '', showErr: false, errorMsg: ''}

  onSubmitSuccess = jwtToken => {
    const {history} = this.props
    Cookies.set('jwt_token', jwtToken, {expires: 30})
    history.replace('/')
  }

  onSubmitFailure = errorMsg => {
    this.setState({showErr: true, errorMsg})
  }

  onSubmit = async event => {
    event.preventDefault()
    const {username, password} = this.state
    const userDetails = {username, password}
    const url = 'https://apis.ccbp.in/login'
    const options = {
      method: 'POST',
      body: JSON.stringify(userDetails),
    }
    const response = await fetch(url, options)
    const data = await response.json()
    if (response.ok === true) {
      this.onSubmitSuccess(data.jwt_token)
    } else {
      this.onSubmitFailure(data.error_msg)
    }
  }

  onChangeName = event => {
    this.setState({username: event.target.value})
  }

  onChangePwd = event => {
    this.setState({password: event.target.value})
  }

  render() {
    const {showErr, errorMsg, username, password} = this.state
    const jwtToken = Cookies.get('jwt_token')
    if (jwtToken !== undefined) {
      return <Redirect to="/" />
    }

    return (
      <div className="login-container">
        <img
          src="https://assets.ccbp.in/frontend/react-js/logo-img.png"
          alt="website logo"
          className="logo"
        />
        <form onSubmit={this.onSubmit} className="form">
          <label htmlFor="name">USERNAME</label>
          <input
            type="text"
            id="name"
            value={username}
            placeholder="Username"
            onChange={this.onChangeName}
          />
          <label htmlFor="pwd">PASSWORD</label>
          <input
            type="password"
            id="pwd"
            placeholder="Password"
            value={password}
            onChange={this.onChangePwd}
          />
          <button type="submit" className="login-btn">
            Login
          </button>
          {showErr && <p className="error">*{errorMsg}</p>}
        </form>
      </div>
    )
  }
}
export default Login
