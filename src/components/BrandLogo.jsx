const logoMark = '/novahaus-mark.svg'

function BrandLogo({ reversed = false, className = '' }) {
  return <img src={logoMark} alt="NOVAHAUS" className={`brand-logo-asset ${className}`} />
}

export default BrandLogo
