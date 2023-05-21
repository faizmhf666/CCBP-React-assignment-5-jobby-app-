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
  initial: 'INITIAL',
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
    salaryRange: '',
  }

  componentDidMount = () => {
    this.getJobDetails()
  }

  getJobDetails = async () => {
    this.setState({apiStatus: apiStatusCode.inProgress})
    const jwtToken = Cookies.get('jwt_token')
    const {searchInput, employmentType, salaryRange} = this.state
    const employmentTypeSelected = employmentType.join()
    const url = `https://apis.ccbp.in/jobs?employment_type=${employmentTypeSelected}&minimum_package=${salaryRange}&search=${searchInput}`
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }
    const response = await fetch(url, options)
    if (response.ok) {
      const fetchedData = await response.json()
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

  renderLoadingView = () => (
    <div className="loader-container" data-testid="loader">
      <Loader type="ThreeDots" color="#ffffff" height="50" width="50" />
    </div>
  )

  renderJobCards = () => {
    const {jobsList} = this.state
    return (
      <div>
        <ul>
          {jobsList.map(each => (
            <JobCard jobDetails={each} key={each.id} />
          ))}
        </ul>
      </div>
    )
  }

  renderFailView = () => (
    <div>
      <img
        src="https://assets.ccbp.in/frontend/react-js/failure-img.png"
        alt="failure view"
      />
    </div>
  )

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
    const jwtToken = Cookies.get('jwt_token')
    if (jwtToken === undefined) {
      return <Redirect to="/login" />
    }
    return (
      <div>
        <Navbar />
        <div>
          <input type="search" />
          <BiSearch />
          <div>{this.renderResultView()}</div>
        </div>
      </div>
    )
  }
}

export default Jobs
