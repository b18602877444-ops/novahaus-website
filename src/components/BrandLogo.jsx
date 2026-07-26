const logoMark = '/novahaus-mark.png'

function BrandLogo({ reversed = false, className = '' }) {
  return <img src={logoMark} alt="NOVAHAUS" width="383" height="601" loading={reversed ? 'lazy' : 'eager'} decoding="async" className={`brand-logo-asset ${className}`} />
}

export default BrandLogo
