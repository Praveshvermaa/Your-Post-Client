import React from 'react'
import axiosInstance from '@/utils/axiosInstance';

function uploadPost() {
    const [file,setFile] = useState();
    const [caption,SetCaption] = useState();
    const onSubmit = async (e)=>{
        e.preventDefault();
        
        const formData = new FormData();
       // console.log(file)
        formData.append('postImage',file)
        formData.append('postCaption',caption)
        formData.append('email',localStorage.getItem("email"))
       // console.log(formData.get('postImage'))
      
        const res = await axiosInstance.post("/api/upload",formData,{
          headers:{
            'Content-Type': 'multipart/form-data',
          },
        })
      
      
      }
      

  return (
    <div className='flex-col items-center justify-evenly bg-blue-950 '>
       <form onSubmit={onSubmit} className='bg-white' action="">
        <input type="file" onChange={(e)=>setFile(e.target.files[0])} name='postImage' className='text-white'/>
        <input type="text" onChange={(e)=>SetCaption(e.target.value)} placeholder='enter caption ' />
        <input type="submit" className='px-2 py-1 rounded bg-sky-500' />
       </form>
    </div>
  )
}

export default uploadPost
