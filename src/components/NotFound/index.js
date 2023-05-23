import Navbar from '../Navbar'

const NotFound = () => {
  const imageUrlNotFound =
    'https://assets.ccbp.in/frontend/react-js/jobby-app-not-found-img.png'
  return (
    <div className="not-found-container">
      <Navbar />
      <img src={imageUrlNotFound} alt="not found" />
      <h1>Page Not Found</h1>
      <p>We are sorry, the page you requested could not be found </p>
    </div>
  )
}
export default NotFound
