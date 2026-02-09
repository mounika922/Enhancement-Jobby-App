import './index.css'
import {Component} from 'react'
import Loader from 'react-loader-spinner'
import Cookies from 'js-cookie'
import Header from '../Header'

const apiStatusConst = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  in_progress: 'IN_PROGRESS',
}

class JobItemDetails extends Component {
  state = {
    apiStatus: apiStatusConst.initial,
    jobDetails: {},
    skills: [],
    similarJobs: [],
    lifeCompany: {},
  }

  componentDidMount() {
    this.getJobItemDetails()
  }

  getJobItemDetails = async () => {
    const {match} = this.props
    const {params} = match
    const {id} = params
    this.setState({apiStatus: apiStatusConst.in_progress})
    const jwtToken = Cookies.get('jwt_token')
    const url = `https://apis.ccbp.in/jobs/${id}`
    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    }
    const response = await fetch(url, options)
    if (response.ok === true) {
      const data = await response.json()
      const updatedData = {
        companyLogoUrl: data.job_details.company_logo_url,
        companyWebsiteUrl: data.job_details.company_website_url,
        employmentType: data.job_details.employment_type,
        id: data.job_details.id,
        title: data.job_details.title,
        jobDescription: data.job_details.job_description,
        location: data.job_details.location,
        packagePerAnnum: data.job_details.package_per_annum,
        rating: data.job_details.rating,
      }
      const updatedSkills = data.job_details.skills.map(each => ({
        imageUrl: each.image_url,
        name: each.name,
      }))
      const updatedSimilarJob = data.similar_jobs.map(each => ({
        companyLogoUrl: each.company_logo_url,
        employmentType: each.employment_type,
        id: each.id,
        jobDescription: each.job_description,
        location: each.location,
        rating: each.rating,
        title: each.title,
      }))
      const updatedLife = {
        description: data.job_details.life_at_company.description,
        imageUrl: data.job_details.life_at_company.image_url,
      }
      this.setState({
        skills: updatedSkills,
        apiStatus: apiStatusConst.success,
        jobDetails: updatedData,
        lifeCompany: updatedLife,
        similarJobs: updatedSimilarJob,
      })
    } else {
      this.setState({apiStatus: apiStatusConst.failure})
    }
  }

  onSuccess = () => {
    const {jobDetails, similarJobs, skills, lifeCompany} = this.state
    return (
      <div className="jobdetails-container">
        <div>
          <img
            src={jobDetails.companyLogoUrl}
            alt="job details company logo"
            className="company-logo"
          />
          <div>
            <h1>{jobDetails.title}</h1>
            <div>
              <p>{jobDetails.rating}</p>
            </div>
          </div>
          <div>
            <div>
              <p>{jobDetails.location}</p>
              <p>{jobDetails.employmentType}</p>
            </div>
            <div>
              <p>{jobDetails.packagePerAnnum}</p>
            </div>
          </div>
          <hr className="line" />
          <div className="desc-link">
            <h1>Description</h1>
            <a href={jobDetails.companyWebsiteUrl}>Visit</a>
          </div>
          <p>{jobDetails.jobDescription}</p>
          <h1>Skills</h1>
          <ul className="skill-container">
            {skills.map(each => (
              <li key={each.name}>
                <img src={each.imageUrl} alt={each.name} />
                <p>{each.name}</p>
              </li>
            ))}
          </ul>

          <h1>Life at Company</h1>
          <div className="life-company-container">
            <p>{lifeCompany.description}</p>
            <img src={lifeCompany.imageUrl} alt="life at company" />
          </div>
        </div>
        <h1>Similar Jobs</h1>
        <ul>
          {similarJobs.map(each => (
            <li key={each.id}>
              <div className="similarjob-container">
                <img
                  src={each.companyLogoUrl}
                  alt="similar job company logo"
                  className="company-logo"
                />
                <div>
                  <h1>{each.title}</h1>
                  <div>
                    <p>{each.rating}</p>
                  </div>
                </div>
                <div>
                  <div>
                    <p>{each.location}</p>
                    <p>{each.employmentType}</p>
                  </div>
                  <div>
                    <p>{each.packagePerAnnum}</p>
                  </div>
                </div>
                <hr />
                <h1>Description</h1>
                <p>{each.jobDescription}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    )
  }

  onFailure = () => (
    <div>
      <img
        src="https://assets.ccbp.in/frontend/react-js/failure-img.png"
        alt="failure view"
      />
      <h1>Oops! something Went Wrong</h1>
      <p>We cannot seem to find the page you are looking for</p>
      <button type="button" onClick={this.getJobItemDetails}>
        Retry
      </button>
    </div>
  )

  onLoading = () => (
    <div className="loader-container" data-testid="loader">
      <Loader type="ThreeDots" color="#ffffff" height="50" width="50" />
    </div>
  )

  profileStatus = () => {
    const {apiStatus} = this.state
    switch (apiStatus) {
      case apiStatusConst.success:
        return this.onSuccess()
      case apiStatusConst.failure:
        return this.onFailure()
      case apiStatusConst.in_progress:
        return this.onLoading()
      default:
        return null
    }
  }

  render() {
    return (
      <div>
        <Header />
        <div className="container">{this.profileStatus()}</div>
      </div>
    )
  }
}
export default JobItemDetails
