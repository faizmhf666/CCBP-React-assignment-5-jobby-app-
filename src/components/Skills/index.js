const Skills = props => {
  const {skillSet} = props
  const {skillImage, skillName} = skillSet
  return (
    <li>
      <img src={skillImage} alt={skillName} />
      <p>{skillName}</p>
    </li>
  )
}
export default Skills
