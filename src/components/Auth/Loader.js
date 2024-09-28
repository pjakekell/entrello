import React, { useState } from 'react'

export default function Loader ({ show, label, delay = 0 }) {
  const [countdown, setCountdown] = useState(false)

  if (!show) return <></>

  if (delay > 0)
    setTimeout(() => setCountdown(true), delay)

  if (!countdown) return <></>

  return (
    <div className="loader-wrap">
      <div className="loader"></div>
      { label
        && <div className="loader-label">{label}</div>
      }
    </div>
  )
}