import React from 'react'
import Header from './Header'

const Account = () => {
  return (
    <>
      <Header name={window.location.pathname} />
      <div>Account</div>
    </>
  )
}

export default Account