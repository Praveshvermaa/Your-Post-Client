import axios from 'axios';
import React, { useState } from 'react'
import {Link, replace} from 'react-router-dom'
import { useNavigate } from 'react-router-dom';

function Login() {
  const navigate = useNavigate();
  const[loading,setLoading] = useState(false)
  const [email,setEmail] = useState();
  const [password,setPassword] = useState();
  const onSubmit = async (e)=>{
    e.preventDefault();
    setLoading(true);
    if(!email) {
      alert("email is not found")
      setLoading(false)
      return
    }
    if(!password){
      setLoading(false)
      alert("Password is not found")
      return
    }
    const response = await axios.post("https://your-post-backend.onrender.com/api/auth/login",{email,password})
    if(response.data.success){
      localStorage.setItem("token",response.data.token);
      navigate('/',{replace:true})
    }
    else{
      alert(response.data.message);
    }
    setLoading(false);

  }
  return (
    <div className='bg-violet-800 w-full h-[90vh] flex justify-center items-center overflow-hidden'>
      <div className='bg-white outline-none shadow-2xl h-1/2  md:h-3/4 md:w-1/4 p-2 rounded-md flex items-center flex-col justify-evenly'>
      <h3 className='text-lg font-bold text-slate-900'>Login</h3>
      <form onSubmit={onSubmit} className='flex flex-col items-center gap-7'>
        <input onChange={(e)=>setEmail(e.target.value)} value={email} type="text" className='border-b-2 p-2  border-b-slate-900 ' placeholder='Email' />
        <input onChange={(e)=>setPassword(e.target.value)} value={password} type="text" placeholder='Password' className='border-b-2 p-2 border-b-slate-900' />
        <button className='w-full hover:opacity-40 bg-purple-500 p-1 text-white font'>{loading?"loading":"Login"}</button>
      </form>
      <div>
       <p>Don't have an account? <Link to={"/singup"} className='text-blue-600 font-bold'>Sing UP</Link> </p>
      </div>

      </div>
      
    </div>
  )
}

export default Login
