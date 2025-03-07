import './buttonSharedIcon.css'
import { RowLeftSvg } from '../assets/RowLeftSvg'
import { CheckSvg } from '../assets/CheckSvg'

interface Props {
  title: string
  iconName: 'check' | 'row-left'
  style: 1 | 2
  disabled: boolean
}

export const ButtonSharedIcon: React.FC<Props> = ({ title, iconName, style, disabled }) => {
  let styleButton = style === 1 && 'style-primary'
  if (style === 2) styleButton = 'style-second'
  return (
    <>
      <button className={`${styleButton} button-icon`} disabled={disabled}>
        {iconName === 'check' && <CheckSvg />}
        {iconName === 'row-left' && <RowLeftSvg />}
        {title}
      </button>
    </>
  )
}
