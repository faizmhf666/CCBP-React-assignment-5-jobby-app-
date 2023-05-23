import {Component} from 'react'
import Cookies from 'js-cookie'
import {Redirect} from 'react-router-dom'
import Loader from 'react-loader-spinner'
import {BiSearch} from 'react-icons/bi'
import Navbar from '../Navbar'
import JobCard from '../JobCard'

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

const apiStatusCode = {
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}
const apiStatusCodeProfile = {
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

class Jobs extends Component {
  state = {
    apiStatus: apiStatusCode.initial,
    jobsList: [],
    searchInput: '',
    employmentType: [],
    userProfile: {},
    activeSalaryId: '',
    apiStatusProfile: '',
  }

  componentDidMount = () => {
    this.getJobDetails()
    this.getProfileData()
  }

  onSearchInput = event => {
    this.setState({searchInput: event.target.value})
  }

  onSearchSubmit = event => {
    event.preventDefault()
    this.getJobDetails()
  }

  getJobDetails = async () => {
    this.setState({
      apiStatus: apiStatusCode.inProgress,
    })
    const jwtToken = Cookies.get('jwt_token')
    const {searchInput, employmentType, activeSalaryId} = this.state
    const employmentTypeSelected = employmentType.join(',')
    const jobsUrl = `https://apis.ccbp.in/jobs?employment_type=${employmentTypeSelected}&minimum_package=${activeSalaryId}&search=${searchInput}`
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }
    const jobsUrlResponse = await fetch(jobsUrl, options)
    if (jobsUrlResponse.ok) {
      const fetchedData = await jobsUrlResponse.json()
      const jobsData = fetchedData.jobs.map(each => ({
        companyLogoUrl: each.company_logo_url,
        employmentType: each.employment_type,
        id: each.id,
        jobDescription: each.job_description,
        location: each.location,
        packagePerAnnum: each.package_per_annum,
        rating: each.rating,
        title: each.title,
      }))
      this.setState({jobsList: jobsData, apiStatus: apiStatusCode.success})
    } else {
      this.setState({apiStatus: apiStatusCode.failure})
    }
  }

  getProfileData = async () => {
    this.setState({
      apiStatus: apiStatusCode.inProgress,
      apiStatusProfile: apiStatusCodeProfile.inProgress,
    })
    const profileUrl = 'https://apis.ccbp.in/profile'
    const jwtToken = Cookies.get('jwt_token')
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }
    const profileUrlResponse = await fetch(profileUrl, options)
    if (profileUrlResponse.ok) {
      const data = await profileUrlResponse.json()
      const profileData = {
        name: data.profile_details.name,
        profileImageUrl: data.profile_details.profile_image_url,
        bio: data.profile_details.short_bio,
      }
      this.setState({
        userProfile: profileData,
        apiStatusProfile: apiStatusCodeProfile.success,
      })
    } else {
      this.setState({
        apiStatusProfile: apiStatusCodeProfile.failure,
      })
    }
  }

  onClickRetryProfile = () => {
    this.getProfileData()
  }

  changeEmploymentType = event => {
    const {employmentType} = this.state
    const checkList = employmentType.includes(event.target.id)
    if (checkList !== true) {
      this.setState(
        prevState => ({
          employmentType: [...prevState.employmentType, event.target.id],
        }),
        this.getJobDetails,
      )
    } else {
      const filterList = employmentType.filter(each => each !== event.target.id)
      this.setState({employmentType: filterList}, this.getJobDetails)
    }
  }

  getEmploymentTypeList = () => (
    <ul>
      <h1>Type of Employment</h1>
      {employmentTypesList.map(each => (
        <li key={each.employmentTypeId}>
          <input
            type="checkbox"
            id={each.employmentTypeId}
            onChange={this.changeEmploymentType}
            value={each.employmentTypeId}
          />
          <label htmlFor={each.employmentTypeId}>{each.label}</label>
        </li>
      ))}
    </ul>
  )

  changeSalaryRange = event => {
    this.setState({activeSalaryId: event.target.id}, this.getJobDetails)
  }

  getSalaryRangeList = () => {
    const {activeSalaryId} = this.state
    console.log(activeSalaryId)
    return (
      <ul>
        <h1>Salary Range</h1>
        {salaryRangesList.map(each => (
          <li key={each.salaryRangeId}>
            <input
              type="radio"
              id={each.salaryRangeId}
              onChange={this.changeSalaryRange}
              checked={activeSalaryId === each.salaryRangeId}
            />
            <label htmlFor={each.salaryRangeId}>{each.label}</label>
          </li>
        ))}
      </ul>
    )
  }

  renderLoadingView = () => (
    <div className="loader-container" data-testid="loader">
      <Loader type="ThreeDots" color="#ffffff" height="50" width="50" />
    </div>
  )

  renderJobCards = () => {
    const {jobsList} = this.state
    const noJobs = jobsList.length === 0
    return (
      <div>
        {noJobs ? (
          <div>
            <img
              src="https://assets.ccbp.in/frontend/react-js/no-jobs-img.png"
              alt="no jobs"
            />
            <h1>No Jobs Found</h1>
            <p>We could not find any jobs. Try other filters</p>
          </div>
        ) : (
          <ul>
            {jobsList.map(each => (
              <JobCard jobDetails={each} key={each.id} />
            ))}
          </ul>
        )}
      </div>
    )
  }

  onClickRetry = () => {
    this.getJobDetails()
  }

  renderFailView = () => (
    <div>
      <img
        src="https://assets.ccbp.in/frontend/react-js/failure-img.png"
        alt="failure view"
      />
      <h1>Oops! Something Went Wrong</h1>
      <p>we cannot seem to find the page you are looking for</p>
      <button type="button" onClick={this.onClickRetry}>
        Retry
      </button>
    </div>
  )

  profileCard = () => {
    const {userProfile} = this.state
    return (
      <div>
        <img src={userProfile.profileImageUrl} alt="profile" />
        <h1>{userProfile.name}</h1>
        <p>{userProfile.bio}</p>
      </div>
    )
  }

  renderProfileFailView = () => (
    <div>
      <button type="button" onClick={this.onClickRetryProfile}>
        Retry
      </button>
    </div>
  )

  renderProfileView = () => {
    const {apiStatusProfile} = this.state
    switch (apiStatusProfile) {
      case apiStatusCodeProfile.inProgress:
        return this.renderLoadingView()
      case apiStatusCodeProfile.failure:
        return this.renderProfileFailView()
      case apiStatusCodeProfile.success:
        return this.profileCard()
      default:
        return null
    }
  }

  renderResultView = () => {
    const {apiStatus} = this.state
    switch (apiStatus) {
      case apiStatusCode.inProgress:
        return this.renderLoadingView()
      case apiStatusCode.failure:
        return this.renderFailView()
      case apiStatusCode.success:
        return this.renderJobCards()
      default:
        return null
    }
  }

  render() {
    const {searchInput} = this.state
    const jwtToken = Cookies.get('jwt_token')
    if (jwtToken === undefined) {
      return <Redirect to="/login" />
    }
    return (
      <div>
        <Navbar />
        <div>{this.renderProfileView()}</div>
        <div>
          {this.getEmploymentTypeList()}
          {this.getSalaryRangeList()}
        </div>
        <div>
          <form onSubmit={this.onSearchSubmit}>
            <input
              type="search"
              onChange={this.onSearchInput}
              value={searchInput}
            />
            <button
              type="button"
              data-testid="searchButton"
              onClick={this.onSearchSubmit}
            >
              <BiSearch />
            </button>
          </form>
          <div>{this.renderResultView()}</div>
        </div>
      </div>
    )
  }
}

export default Jobs
