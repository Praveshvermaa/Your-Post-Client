import React from 'react'
import { Link } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserCircle, faHome } from '@fortawesome/free-solid-svg-icons';

function Footer() {
  return (
    <div className='h-12 mt-20 fixed bottom-0 w-full flex justify-around items-center bg-zinc-900 text-white font-semibold text-lg text-center '>
      <Link to={'/feed'}><FontAwesomeIcon icon={faHome} size="2x" className=" text-white" /> </Link>
      <Link to={'/'}> <FontAwesomeIcon icon={faUserCircle} size="2x" className="ytext-white" /> </Link>
    </div>
  )
}

export default Footer
