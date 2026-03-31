import { useEffect, useState } from 'react'



import './AuroraBackground.css';

export default function AuroraBackground() {



  return (
    <div className="aurora-root" aria-hidden="true">
      <div className="aurora-blob aurora-b1" />
      <div className="aurora-blob aurora-b2" />
      <div className="aurora-blob aurora-b3" />
      <div className="aurora-blob aurora-b4" />
      <div className="aurora-geo  aurora-geo-1" />
      <div className="aurora-geo  aurora-geo-2" />
      <div className="aurora-scan" />
      <div className="aurora-scan aurora-scan-2" />
      <div className="aurora-grid" />
    </div>
  )
}
