const LifeAtCompany = props => {
  const {lifeAtCompanyDetails} = props
  const {lifeImage, description} = lifeAtCompanyDetails
  return (
    <div>
      <h1>Life At Company</h1>
      <div>
        <p>{description}</p>
        <img src={lifeImage} alt="life at company" />
      </div>
    </div>
  )
}
export default LifeAtCompany
