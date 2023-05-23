import {Link} from 'react-router-dom'
import Navbar from '../Navbar'

const Home = props => {
  const onClickFindJobs = () => {
    const {history} = props
    history.replace('/jobs')
  }
  return (
    <div>
      <Navbar />
      <div className="home-container">
        <h1 className="home-heading">Find The Job That Fits Your Life</h1>
        <p className="home-description">
          Millions of people are searching for jobs, salary information, company
          reviews. Find the job that fits your abilities and potential.
        </p>
        <Link to="/jobs">
          <button type="button" className="home-btn" onClick={onClickFindJobs}>
            Find Jobs
          </button>
        </Link>
      </div>
    </div>
  )
}
export default Home
