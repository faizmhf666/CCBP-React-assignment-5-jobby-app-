import {FaStar, FaExternalLinkAlt} from 'react-icons/fa'
import {MdLocationOn} from 'react-icons/md'
import {BsBriefcase} from 'react-icons/bs'

const JobDescription = props => {
  const {jobsDetailsData} = props
  const {
    companyLogoUrl,
    companyWebsiteUrl,
    employmentType,
    jobDescription,
    location,
    packagePerAnnum,
    title,
    rating,
  } = jobsDetailsData
  return (
    <div>
      <div>
        <img src={companyLogoUrl} alt="job details company logo" />
        <div>
          <h1>{title}</h1>
          <p>
            <FaStar /> {rating}
          </p>
          <div>
            <div>
              <MdLocationOn />
              <p>{location}</p>
              <BsBriefcase />
              <p>{employmentType}</p>
            </div>
            <div>
              <p>{packagePerAnnum}</p>
            </div>
            <div>
              <div>
                <h1>Description</h1>
                <h1>
                  <a href={companyWebsiteUrl}>
                    Visit
                    <FaExternalLinkAlt />
                  </a>
                </h1>
              </div>
              <p>{jobDescription}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
export default JobDescription
