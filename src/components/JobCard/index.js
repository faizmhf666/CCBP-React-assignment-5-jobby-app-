import {Link} from 'react-router-dom'
import {FaStar} from 'react-icons/fa'
import {MdLocationOn} from 'react-icons/md'
import {BsBriefcase} from 'react-icons/bs'

const JobCard = props => {
  const {jobDetails} = props
  const {
    companyLogoUrl,
    employmentType,
    id,
    jobDescription,
    location,
    rating,
    packagePerAnnum,
    title,
  } = jobDetails
  return (
    <li>
      <Link to={`/jobs/${id}`}>
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
            </div>
          </div>
        </div>
        <hr />
        <div>
          <h1>Description</h1>
          <p>{jobDescription}</p>
        </div>
      </Link>
    </li>
  )
}
export default JobCard
