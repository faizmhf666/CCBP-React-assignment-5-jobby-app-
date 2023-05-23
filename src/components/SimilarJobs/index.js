import {FaStar} from 'react-icons/fa'
import {MdLocationOn} from 'react-icons/md'
import {BsBriefcase} from 'react-icons/bs'

const SimilarJobs = props => {
  const {similarJobsData} = props
  const {
    companyLogoUrl,
    employmentType,
    jobDescription,
    location,
    rating,
    title,
  } = similarJobsData
  return (
    <div>
      <div>
        <img src={companyLogoUrl} alt="similar job company logo" />
        <div>
          <h1>{title}</h1>
          <p>
            <FaStar /> {rating}
          </p>
        </div>
      </div>
      <div>
        <h1>Description</h1>
        <p>{jobDescription}</p>
      </div>
      <div>
        <p>
          <MdLocationOn />
          {location}
        </p>
        <p>
          <BsBriefcase />
          {employmentType}
        </p>
      </div>
    </div>
  )
}
export default SimilarJobs
