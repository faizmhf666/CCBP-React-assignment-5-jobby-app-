import {Component} from 'react'
import Loader from 'react-loader-spinner'
import Cookies from 'js-cookie'

const apiStatusCode = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

export default class JobItems extends Component {
  state = {
    apiStatus: apiStatusCode.initial,
    jobsDetailsList: [],
    similarJobsList: [],
  }

  getJobItemsData = async () => {
    const {match} = this.props
    const {params} = match
    const {id} = params

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
      const jobDetailsData = data.job_details.map(each => ({
        companyLogoUrl: each.company_logo_url,
        companyWebsiteUrl: each.company_website_url,
        employmentType: each.employment_type,
        id: each.id,
        jobDescription: each.job_description,
        skills: each.skills.map(skill => ({
          skillImage: skill.image_url,
          skillName: skill.name,
        })),
        lifeAtCompany: each.life_at_company.map(life => ({
          description: life.description,
          lifeImage: life.url,
        })),
        location: each.location,
        packagePerAnnum: each.package_per_annum,
        rating: each.rating,
      }))
      const similarJobData = data.similar_jobs.map(each => ({
        companyLogoUrl: each.company_logo_url,
        employmentType: each.employment_type,
        id: each.id,
        jobDescription: each.job_description,
        location: each.location,
        rating: each.rating,
        title: each.title,
      }))
    } else if (response.status === 404) {
      this.setState({apiStatus: apiStatusCode.failure})
    }
  }

  renderLoadingView = () => (
    <div className="loader-container" data-testid="loader">
      <Loader type="ThreeDots" color="#ffffff" height="50" width="50" />
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
    return (
      <div>
        <p>,ASDHJKFG</p>
      </div>
    )
  }
}
