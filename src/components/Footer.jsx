import React from 'react'
import { Link } from 'react-router-dom'
import { Home, UserCircle } from 'lucide-react'

function Footer() {
  return (
    <div className='h-14 mt-20 fixed bottom-0 w-full flex justify-around items-center glass border-t border-white/[0.06] z-40'>
      <Link 
        to={'/feed'} 
        className="p-2.5 rounded-xl hover:bg-violet-500/10 transition-all duration-200 group"
      >
        <Home className="h-6 w-6 text-muted-foreground group-hover:text-violet-400 transition-colors duration-200" />
      </Link>
      <Link 
        to={'/'} 
        className="p-2.5 rounded-xl hover:bg-violet-500/10 transition-all duration-200 group"
      >
        <UserCircle className="h-6 w-6 text-muted-foreground group-hover:text-violet-400 transition-colors duration-200" />
      </Link>
    </div>
  )
}

export default Footer
