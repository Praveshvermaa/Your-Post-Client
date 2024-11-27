import React, { useEffect, useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { Link } from 'react-router-dom';
import { AiFillDelete } from 'react-icons/ai';

function Home() {
  const[deleteLoading,setDeleteLoading] = useState(true);
  const [profileImage, setProfileImage] = useState();
  const [editImage, seteditImage] = useState();
  const [posts, setPosts] = useState([]);
  const reference = useRef(null)
  const [userdetails, setUserdetails] = useState();
  const navigate = useNavigate()
  const token = localStorage.getItem('token');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [loading, setLoading] = useState(true);

 

  const handleMenuToggle = () => setIsMenuOpen(!isMenuOpen);

  const userDetails = async () => {

    const res = await axios.get("http://localhost:3000/api/userdetails", {
      headers: { Authorization: `Bearer ${token}` }
    });
    if (res.data.success) {
      setLoading(false);
     setPosts(res.data.user.posts);
      
      setUserdetails(res.data.user)
      seteditImage(res.data.user.profile_picture)
    }


    else {
      alert("User is not found || please login first")
    }


  }
 

  useEffect(() => {

    if (!localStorage.getItem("token")) {
      navigate('/login')
    }
    userDetails()
   

  }, [setPosts])
  const logout = () => {
    localStorage.removeItem("token")
    navigate('/login')
  }
  const updateProfilePicture = async (e) => {

    reference.current.click();

  }

  useEffect(() => {
    if (profileImage){
      const func = async () => {
        const formdata = new FormData();
        formdata.append('profileImage', profileImage)

        const res = await axios.post('http://localhost:3000/api/editpicture', formdata, {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${token}`,
          }
        })
        if (res.data.success) {

          seteditImage(res.data.user.profile_picture)

        }
        else {
          alert("Something went wrong")
        }
      }
      func();
    }




  }, [profileImage])
  const deletePost = async (id)=>{
    try {
      setDeleteLoading(false);
      const res = await axios.post("http://localhost:3000/api/deletePost",{id},{
        headers:{
           Authorization: `Bearer ${token}`
        }
        
      })
     
      setDeleteLoading(true);
      if(res.data.success){
        setPosts(res.data.updateduser.posts);
      }
      else{
        alert("Something went wrong");
      }
    } catch (error) {
      console.log(error);
      
    }
   

  }
  
  


  return (
    <div className=' w-full h-auto mb-12 '>
      <div className='relative bg-zinc-900 w-full flex flex-col items-center justify-center  h-72' >
        <div className='flex flex-col items-center  '><img src={`${editImage}`} alt='pic' className='object-contain rounded-full  bg-white w-24 h-24' />
          <button onClick={updateProfilePicture} className='px-1 py-1 text-white bg-sky-400 font-bold text-xs'>Edit Picture</button>
          <input className='hidden' name='profileImage' onChange={(e) => setProfileImage(e.target.files[0])} ref={reference} type="file" />
        </div>
        <div className='text-white text-center text-2xl font-bold'>@{userdetails?.username}</div>
        <div className='text-white text-center'>{userdetails?.email}</div>
        <div className='flex justify-center gap-3'>
          
          <Link to={"/upload"} className='bg-sky-400 text-white rounded-sm px-2 py-1 font-bold m-1 outline-none'>Upload Post </Link>
        </div>
        <div>
        <button   className="text-3xl absolute top-5 right-12 text-white  focus:outline-none hover:text-gray-400"
          onClick={handleMenuToggle}>≡</button>
           {isMenuOpen && (
        <div className="absolute top-12 right-6  font-bold  text-white">
          <ul className="flex flex-col items-center space-y-2 py-4">
            <li
              className="cursor-pointer text-white hover:text-gray-400"
              onClick={() => {
                navigate("/profileviewer");
                setIsMenuOpen(false); // Close menu after navigating
              }}
            >
              Profile Viewers
            </li>
            <li
              className="cursor-pointer text-white  hover:text-gray-400"
              onClick={() => {
                logout();
                setIsMenuOpen(false); // Close menu after navigating
              }}
            >
              Logout
            </li>
          </ul>
        </div>
      )}

        </div>
       

      </div>
      { deleteLoading?<div></div>:<div className='text-red-600 font-semibold text-sm text-center'>Please wait ! file is deleting </div>}


{
  loading ? 
    <p className="text-center mt-2 text-lg">Loading posts...</p>
  : <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 mt-4 gap-6">
    
    
  {posts && posts.map((post) =>(
    <div key={post._id} className="overflow-hidden rounded-lg shadow-lg bg-gray-100">
      <div className="w-full h-64 flex items-center justify-center bg-gray-200">
        <img
          src={post.postImage}
          alt="post"
          className="w-full h-full object-contain"
        />
      </div>
      <div className="p-4">
        <div className='flex justify-between'>
          <span className="text-sm text-gray-800 font-semibold mb-2">-: {post.postCaption}</span>
          <span onClick={()=>deletePost(post._id)} className='cursor-pointer text-red-500 size-8'>{deleteLoading?<AiFillDelete />:"..."}</span>
        </div>
        <p className="text-xs text-gray-500">{new Date(post.CreatedAt).toLocaleString()}</p>
      </div>
    </div>
  ))}
</div>
}
     





    </div>
  )
}

export default Home
