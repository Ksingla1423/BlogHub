import React from 'react'
import logo from '../assets/tlogo.svg'

function Logo({width = '100px'}) {
  return (
    <img src={logo} alt="Logo" style={{ width }} />
  )
}

export default Logo