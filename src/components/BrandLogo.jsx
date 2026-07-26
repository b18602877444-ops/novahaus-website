import primaryLogo from '../../brand/final/Horizontal_Logo.svg'
import whiteLogo from '../../brand/final/Horizontal_White.svg'

function BrandLogo({ reversed = false, className = '' }) {
  return <img src={reversed ? whiteLogo : primaryLogo} alt="NOVAHAUS" className={className} />
}

export default BrandLogo
