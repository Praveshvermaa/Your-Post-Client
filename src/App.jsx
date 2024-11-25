import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import Login from './components/Login'
import SingUp from './components/SingUp'


function App() {
  return (
    <div className='bg-slate-800 h-screen w-full'> 
      <h1 className="text-3xl font-bold underline text-center">
    Hello world!
  </h1>
  <div><Login/></div>
  <div><SingUp/></div>

  </div>
   
  )
}

export default App
