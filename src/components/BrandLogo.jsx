// Approved NOVAHAUS C2 monogram: exact transparent crop from the selected C2 artwork.
const logoMark = '/novahaus-mark.png?v=c2'

function BrandLogo({ reversed = false, className = '' }) {
  return <img src={logoMark} alt="NOVAHAUS" width="383" height="601" loading={reversed ? 'lazy' : 'eager'} decoding="async" className={`brand-logo-asset ${className}`} />
}

export default BrandLogo
