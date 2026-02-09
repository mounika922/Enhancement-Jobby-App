import './index.css'
import {Component} from 'react'
import {BsSearch} from 'react-icons/bs'
import Loader from 'react-loader-spinner'
import {Link} from 'react-router-dom'
import Cookies from 'js-cookie'
import Header from '../Header'

const employmentTypesList = [
  {
    label: 'Full Time',
    employmentTypeId: 'FULLTIME',
  },
  {
    label: 'Part Time',
    employmentTypeId: 'PARTTIME',
  },
  {
    label: 'Freelance',
    employmentTypeId: 'FREELANCE',
  },
  {
    label: 'Internship',
    employmentTypeId: 'INTERNSHIP',
  },
]

const salaryRangesList = [
  {
    salaryRangeId: '1000000',
    label: '10 LPA and above',
  },
  {
    salaryRangeId: '2000000',
    label: '20 LPA and above',
  },
  {
    salaryRangeId: '3000000',
    label: '30 LPA and above',
  },
  {
    salaryRangeId: '4000000',
    label: '40 LPA and above',
  },
]

const locationList = [
  {label: 'Hyderabad', locationId: 'HYDERABAD'},
  {label: 'Bangalore', locationId: 'BANGALORE'},
  {label: 'Chennai', locationId: 'CHENNAI'},
  {label: 'Delhi', locationId: 'DELHI'},
  {label: 'Mumbai', locationId: 'MUMBAI'},
]

const apiProfileConst = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  in_progress: 'IN_PROGRESS',
}

class Jobs extends Component {
  state = {
    searchValue: '',
    profile: '',
    apiProfile: apiProfileConst.initial,
    apiJob: apiProfileConst.initial,
    salaryId: '',
    employType: [],
    jobsList: [],
    locationType: [],
  }

  componentDidMount() {
    this.getProfile()
    this.getJobs()
  }

  getProfile = async () => {
    this.setState({apiProfile: apiProfileConst.in_progress})
    const jwtToken = Cookies.get('jwt_token')
    const url = 'https://apis.ccbp.in/profile'
    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    }
    const response = await fetch(url, options)
    if (response.ok === true) {
      const data = await response.json()
      const updatedProfile = {
        name: data.profile_details.name,
        profileImageUrl: data.profile_details.profile_image_url,
        shortBio: data.profile_details.short_bio,
      }
      this.setState({
        profile: updatedProfile,
        apiProfile: apiProfileConst.success,
      })
    } else {
      this.setState({apiProfile: apiProfileConst.failure})
    }
  }

  salaryRange = event => {
    this.setState({salaryId: event.target.value}, this.getJobs)
  }

  onClickEmployeeType = event => {
    const {employType} = this.state
    if (employType.includes(event.target.value)) {
      this.setState(
        {
          employType: employType.filter(each => each !== event.target.value),
        },
        this.getJobs,
      )
    } else {
      this.setState(
        {employType: [...employType, event.target.value]},
        this.getJobs,
      )
    }
  }

  onChangeSearch = event => {
    this.setState({searchValue: event.target.value})
  }

  onClickLocation = event => {
    const {locationType} = this.state

    if (locationType.includes(event.target.value)) {
      this.setState(
        {
          locationType: locationType.filter(
            each => each !== event.target.value,
          ),
        },
        this.getJobs,
      )
    } else {
      this.setState(
        {locationType: [...locationType, event.target.value]},
        this.getJobs,
      )
    }
  }

  successProfile = () => {
    const {profile} = this.state
    return (
      <div className="profile-container">
        <img src={profile.profileImageUrl} alt="profile" className="profile" />
        <h1 className="profile-name">{profile.name}</h1>
        <p>{profile.shortBio}</p>
      </div>
    )
  }

  failureProfile = () => (
    <div>
      <button type="button" onClick={this.getProfile}>
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
    const {apiProfile} = this.state
    switch (apiProfile) {
      case apiProfileConst.success:
        return this.successProfile()
      case apiProfileConst.failure:
        return this.failureProfile()
      case apiProfileConst.in_progress:
        return this.onLoading()
      default:
        return null
    }
  }

  getJobs = async () => {
    const {salaryId, employType, searchValue, locationType} = this.state
    const jwtToken = Cookies.get('jwt_token')
    this.setState({apiJob: apiProfileConst.in_progress})
    const url = `https://apis.ccbp.in/jobs?employment_type=${employType.join(
      ',',
    )}&minimum_package=${salaryId}&search=${searchValue}&location=${locationType.join(
      ',',
    )}`
    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    }
    const response = await fetch(url, options)
    if (response.ok === true) {
      const data = await response.json()
      let updatedJobData = data.jobs.map(each => ({
        companyLogoUrl: each.company_logo_url,
        companyWebsiteUrl: each.company_website_url,
        employmentType: each.employment_type,
        id: each.id,
        jobDescription: each.job_description,
        location: each.location,
        packagePerAnnum: each.package_per_annum,
        rating: each.rating,
        title: each.title,
      }))
      if (locationType.length > 0) {
        updatedJobData = updatedJobData.filter(job =>
          locationType.includes(job.location.toUpperCase()),
        )
      }
      this.setState({
        apiJob: apiProfileConst.success,
        jobsList: updatedJobData,
      })
    } else {
      this.setState({apiJob: apiProfileConst.failure})
    }
  }

  jobCard = each => (
    <li key={each.id}>
      <Link to={`/jobs/${each.id}`}>
        <div className="job-card">
          <div className="logo-heading">
            <img
              src={each.companyLogoUrl}
              alt="job details company logo"
              className="company-logo"
            />
            <div className="heading-container">
              <h1>{each.title}</h1>
              <div>
                <p>{each.rating}</p>
              </div>
            </div>
          </div>
          <div className="work-container">
            <div className="location-container">
              <p>{each.location}</p>
              <p>{each.employmentType}</p>
            </div>
            <div>
              <p>{each.packagePerAnnum}</p>
            </div>
          </div>
          <hr className="line" />
          <h1>Description</h1>
          <p>{each.jobDescription}</p>
        </div>
      </Link>
    </li>
  )

  onSuccessJob = () => {
    const {jobsList} = this.state
    return (
      <div>
        <ul>{jobsList.map(each => this.jobCard(each))}</ul>
      </div>
    )
  }

  onNoJobs = () => (
    <div>
      <img
        src="https://assets.ccbp.in/frontend/react-js/no-jobs-img.png"
        alt="no jobs"
        className="no-job-img"
      />
      <h1>No Jobs Found</h1>
      <p>We could not find any jobs. Try other filters</p>
    </div>
  )

  onFailureJob = () => (
    <div>
      <img
        src="https://assets.ccbp.in/frontend/react-js/failure-img.png"
        alt="failure view"
      />
      <h1>Oops! Something Went Wrong</h1>
      <p>We cannot seem to find the page you are looking for</p>
      <button type="button" onClick={this.getJobs}>
        Retry
      </button>
    </div>
  )

  onJobStatus = () => {
    const {apiJob, jobsList} = this.state
    switch (apiJob) {
      case apiProfileConst.success:
        return jobsList.length > 0 ? this.onSuccessJob() : this.onNoJobs()
      case apiProfileConst.failure:
        return this.onFailureJob()
      case apiProfileConst.in_progress:
        return this.onLoading()
      default:
        return null
    }
  }

  render() {
    const {searchValue} = this.state
    return (
      <div>
        <Header />

        <div className="job-container">
          <div className="left-container">
            {this.profileStatus()}
            <hr />
            <div>
              <h1 className="sub-heading">Type of Employment</h1>
              <ul>
                {employmentTypesList.map(each => (
                  <li key={each.employmentTypeId}>
                    <input
                      type="checkbox"
                      id={each.employmentTypeId}
                      value={each.employmentTypeId}
                      onChange={this.onClickEmployeeType}
                    />
                    <label htmlFor={each.employmentTypeId}>{each.label}</label>
                  </li>
                ))}
              </ul>
              <hr className="line" />
              <h1 className="sub-heading">Salary Range</h1>
              <ul>
                {salaryRangesList.map(each => (
                  <li key={each.salaryRangeId}>
                    <input
                      type="radio"
                      id={each.salaryRangeId}
                      value={each.salaryRangeId}
                      onChange={this.salaryRange}
                      name="salary"
                    />
                    <label htmlFor={each.salaryRangeId}>{each.label}</label>
                  </li>
                ))}
              </ul>
              <h1 className="sub-heading">Location</h1>
              <ul>
                {locationList.map(each => (
                  <li key={each.locationId}>
                    <input
                      id={each.locationId}
                      type="checkbox"
                      name="location"
                      value={each.locationId}
                      onChange={this.onClickLocation}
                    />
                    <label htmlFor={each.locationId}>{each.label}</label>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className="right-container">
            <div className="search-container">
              <input
                type="search"
                value={searchValue}
                onChange={this.onChangeSearch}
                className="input"
              />
              <button
                type="button"
                data-testid="searchButton"
                onClick={this.getJobs}
                className="search-btn"
              >
                <BsSearch />
              </button>
            </div>
            {this.onJobStatus()}
          </div>
        </div>
      </div>
    )
  }
}
export default Jobs
