import primaryLogo from '../../brand/logo/NOVAHAUS_Horizontal.svg'
import whiteLogo from '../../brand/logo/NOVAHAUS_Horizontal_White.svg'

function BrandLogo({ reversed = false, className = '' }) {
  return <img src={reversed ? whiteLogo : primaryLogo} alt="NOVAHAUS" className={className} />
}

export default BrandLogo
