import React, { useState } from "react"
import { Link } from "react-router-dom"
import axios from "axios";
import { useNavigate } from "react-router-dom";
function singup(){
  const[loading,setLoading] = useState(false)

  const [username,setUserName] = useState();
  const [name,setName] = useState();
  const [email,setEmail] = useState();
  const [password,setPassword] = useState();
  const navigate = useNavigate();
  const onSubmit = async (e)=>{
    setLoading(true);
    e.preventDefault();
    try {
      if(!username){
        alert("username is not found")
        setLoading(false)
        return
      }
      if(!name){
        alert("name is not found")
        setLoading(false)
        return;
      }
      if(!email){
        alert("email is not found")
        setLoading(false)
        return;
      }
      if(!password){
        alert("password is not found")
        setLoading(false)
        return ;
      }
      
      
      const response = await axios.post('https://your-post-backend.onrender.com/api/auth/register',{username,name,email,password});
      if(response.data.success){
        alert(response.data.message);
        
        navigate('/login',{replace:true})
      }
      else{
        alert(response.data.message);
      }
      setLoading(false)
    } catch (error) {
      console.log('error',error)
    }

  }
  
    return (
        <div className='bg-violet-800 w-full h-[90vh] flex justify-center items-center overflow-hidden'>
      <div className='bg-white outline-none shadow-2xl h-1/2  md:h-3/4 md:w-1/4 p-2 rounded-md flex items-center flex-col justify-evenly'>
      { loading?<div className='text-red-600 font-semibold text-sm text-center'>Please wait ! it will take time</div>:""}

      <h3 className='text-lg font-bold text-slate-900'>Sing Up</h3>
     
      <form onSubmit={onSubmit} className='flex flex-col items-center gap-3'>
        <input onChange={(e)=>setUserName(e.target.value)} value={username} type="text" className='border-b-2 p-2  border-b-slate-900 ' placeholder='Username' />
        <input  onChange={(e)=>setName(e.target.value)} value={name} type="text" className='border-b-2 p-2  border-b-slate-900 ' placeholder='Name' />
        <input onChange={(e)=>setEmail(e.target.value)} value={email} type="text" className='border-b-2 p-2  border-b-slate-900 ' placeholder='Email' />
        <input onChange={(e)=>setPassword(e.target.value)} value={password} type="password" placeholder='Password' className='border-b-2 p-2 border-b-slate-900' />
        <button className='w-full bg-purple-500 p-1 text-white font'>{loading?"loading":"Sing Up"}</button>
      </form>
      <div>
       <p>Already have an account? <Link to={"/login"} className='text-blue-600 font-bold'>Login</Link> </p>
      </div>

      </div>
      
    </div>
    )
}
export default singup