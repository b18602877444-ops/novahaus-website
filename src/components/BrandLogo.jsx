import logoHorizontal from '../../brand/final/Horizontal_Logo.svg'
import logoHorizontalWhite from '../../brand/final/Horizontal_White.svg'

function BrandLogo({ reversed = false, className = '' }) {
  return <img src={reversed ? logoHorizontalWhite : logoHorizontal} alt="NOVAHAUS" className={`brand-logo-asset ${className}`} />
}

export default BrandLogo
