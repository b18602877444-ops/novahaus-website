const logoMark = '/novahaus-mark.png'

function BrandLogo({ reversed = false, className = '' }) {
  return <img src={logoMark} alt="NOVAHAUS" className={`brand-logo-asset ${className}`} />
}

export default BrandLogo
