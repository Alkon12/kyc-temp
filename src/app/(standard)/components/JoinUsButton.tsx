import './joinUsButton.css'
interface Props {
  onClick: () => void
}

const JoinUsButton: React.FC<Props> = ({ onClick }) => {
  return (
    <a onClick={onClick}>
      <div className="join-button_us">¡REGÍSTRATE AHORA!</div>
    </a>
  )
}

export default JoinUsButton
