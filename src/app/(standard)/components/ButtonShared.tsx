import './buttonShared.css'
interface Props {
  title: string
}

export const ButtonShared: React.FC<Props> = ({ title }) => {
  return (
    <>
      <button className="borde rounded px-5 py-2 button-shared">{title}</button>
    </>
  )
}
