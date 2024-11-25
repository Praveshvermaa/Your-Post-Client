import React from 'react'
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

function Upload() {
    const [file, setFile] = useState();
    const [caption, setCaption] = useState();
    const navigate = useNavigate();
    const token = localStorage.getItem('token')
    const onSubmit = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        // console.log(file)
        formData.append('postImage', file)
        formData.append('postCaption', caption)
       
        // console.log(formData.get('postImage'))

        const res = await axios.post("https://your-post-backend.onrender.com/api/upload", formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
                Authorization:`Bearer ${token}`
            },
        })
       
            navigate('/')
        


    }

    return (
        <div className='w-full h-[90vh] bg-blue-950 flex justify-center items-center'>
            <form onSubmit={onSubmit} className='bg-white w-96 p-8 rounded-lg shadow-lg flex flex-col justify-between'>
                <h2 className='text-xl font-bold text-center mb-4'>Upload Your Post</h2>
                
                <div className='mb-4'>
                    <label htmlFor="postImage" className='block text-sm font-medium text-gray-700 mb-1'>Upload Image:</label>
                    <input
                        type="file"
                        name="postImage"
                        onChange={(e) => setFile(e.target.files[0])}
                        className='block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-sky-500 file:text-white hover:file:bg-sky-600'
                        required
                    />
                </div>
                
                <div className='mb-4'>
                    <label htmlFor="caption" className='block text-sm font-medium text-gray-700 mb-1'>Enter Caption:</label>
                    <input
                        type="text"
                        id="caption"
                        onChange={(e) => setCaption(e.target.value)}
                        placeholder='Enter caption'
                        className='block w-full border border-gray-300 rounded-md shadow-sm focus:ring focus:ring-blue-500 focus:border-blue-500 p-2'
                        required
                    />
                </div>
                
                <div>
                    <input
                        type="submit"
                        className='w-full py-2 rounded bg-sky-500 text-white font-semibold active:opacity-50 hover:bg-sky-600 transition duration-200'
                    />
                </div>
                {/* <Link className='text-center text-blue-600 border-b border-blue-500' to={"/aigenerator"}>Generate using AI</Link>   */}
            </form>
        </div>
    )
}

export default Upload
