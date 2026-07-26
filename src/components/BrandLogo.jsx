import logoBlack from '../../brand/final/Logo_Black.png'

function BrandLogo({ reversed = false, className = '' }) {
  return <img src={logoBlack} alt="NOVAHAUS" className={`brand-logo-asset ${className}`} />
}

export default BrandLogo
