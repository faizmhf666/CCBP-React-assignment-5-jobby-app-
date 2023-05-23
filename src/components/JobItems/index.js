import {Component} from 'react'
import {Redirect} from 'react-router-dom'
import Loader from 'react-loader-spinner'
import Cookies from 'js-cookie'
import Navbar from '../Navbar'
import SimilarJobs from '../SimilarJobs'
import LifeAtCompany from '../LifeAtCompany'
import Skills from '../Skills'
import JobDescription from '../JobDescription'

const apiStatusCode = {
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

class JobItems extends Component {
  state = {
    apiStatus: '',
    jobsDetailsList: [],
    lifeAtCompanyList: {},
    similarJobsList: [],
    skillsDataList: [],
  }

  componentDidMount() {
    this.getJobItemsData()
  }

  getJobItemsData = async () => {
    const {match} = this.props
    const {params} = match
    const {id} = params
    console.log(id)
    this.setState({
      apiStatus: apiStatusCode.inProgress,
    })
    const jwtToken = Cookies.get('jwt_token')
    const apiUrl = `https://apis.ccbp.in/jobs/${id}`
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }
    const response = await fetch(apiUrl, options)
    if (response.ok) {
      const data = await response.json()
      const jobDetailsData = {
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
      const skillsData = data.job_details.skills.map(skill => ({
        skillImage: skill.image_url,
        skillName: skill.name,
      }))
      const similarJobsData = data.similar_jobs.map(each => ({
        companyLogoUrl: each.company_logo_url,
        employmentType: each.employment_type,
        id: each.id,
        jobDescription: each.job_description,
        location: each.location,
        rating: each.rating,
        title: each.title,
      }))
      const lifeAtCompanyData = {
        description: data.job_details.life_at_company.description,
        lifeImage: data.job_details.life_at_company.image_url,
      }
      this.setState({
        jobsDetailsList: jobDetailsData,
        lifeAtCompanyList: lifeAtCompanyData,
        similarJobsList: similarJobsData,
        skillsDataList: skillsData,
        apiStatus: apiStatusCode.success,
      })
    } else {
      console.log('shit')
      this.setState({apiStatus: apiStatusCode.failure})
    }
  }

  renderDescriptionPortion = () => {
    const {jobsDetailsList} = this.state

    return <JobDescription jobsDetailsData={jobsDetailsList} />
  }

  renderSkillsPortion = () => {
    const {skillsDataList} = this.state
    console.log(skillsDataList)
    return (
      <div>
        <h1>Skills</h1>
        <ul>
          {skillsDataList.map(each => (
            <Skills skillSet={each} key={each.skillName} />
          ))}
        </ul>
      </div>
    )
  }

  renderLifeAtCompany = () => {
    const {lifeAtCompanyList} = this.state
    return (
      <>
        <LifeAtCompany lifeAtCompanyDetails={lifeAtCompanyList} />
      </>
    )
  }

  renderSimilarJobs = () => {
    const {similarJobsList} = this.state
    return (
      <div>
        <h1>Similar Jobs</h1>
        {similarJobsList.map(each => (
          <SimilarJobs similarJobsData={each} key={each.id} />
        ))}
      </div>
    )
  }

  renderWholeSection = () => (
    <div>
      <div>{this.renderDescriptionPortion()}</div>
      <div>{this.renderSkillsPortion()}</div>
      <div>{this.renderLifeAtCompany()}</div>
      <div>{this.renderSimilarJobs()}</div>
    </div>
  )

  onClickRetry = () => {
    this.getJobItemsData()
  }

  renderFailView = () => (
    <div>
      <img
        src="https://assets.ccbp.in/frontend/react-js/failure-img.png "
        alt="failure view"
      />
      <h1>Oops! Something Went Wrong</h1>
      <p>we cannot seem to find the page you are looking for</p>
      <div>
        <button type="button" onClick={this.onClickRetry}>
          Retry
        </button>
      </div>
    </div>
  )

  renderLoadingView = () => (
    <div className="loader-container" data-testid="loader">
      <Loader type="ThreeDots" color="#b35609" height="50" width="50" />
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
        return this.renderWholeSection()
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
        {this.renderResultView()}
      </div>
    )
  }
}

export default JobItems
