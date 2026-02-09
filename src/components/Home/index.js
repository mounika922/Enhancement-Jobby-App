import './index.css'
import {Link} from 'react-router-dom'
import Header from '../Header'

const Home = () => (
  <div>
    <Header />
    <div className="home-container">
      <h1>Find the Job That Fits Your Life</h1>
      <p>
        Millions of people are searching for jobs, salary information,comapny
        reviews,Find the job that fits your abilities and potential
      </p>
      <Link to="/jobs">
        <button type="button">Find Jobs</button>
      </Link>
    </div>
  </div>
)

export default Home
