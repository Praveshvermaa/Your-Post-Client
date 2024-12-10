
import { createRoot } from 'react-dom/client'

import './index.css'
import { createBrowserRouter,Route,createRoutesFromElements,RouterProvider } from 'react-router-dom'
import Layout from './components/Layout.jsx'
import Login from './components/Login.jsx'
import SignUp from './components/SingUp.jsx'
import Home from './components/Home.jsx'
import Upload from './components/Upload.jsx'
import Feed from './components/Feed.jsx'
import AIGenerate from './components/AIGenerate.jsx'
import User from './components/User.jsx'
import ProfileViewer from './components/ProfileViewer.jsx'
import Dashboard from './components/DashBoard.jsx'


const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path='/' element={<Layout/>}>
      <Route path='' element={<Home/>}/>
      <Route path='login' element={<Login/>}/>
      <Route path='signup' element={<SignUp/>}/>
      <Route path='upload' element={<Upload/>}   />
      <Route path='feed' element={<Feed/>}/> 
      <Route path='aigenerator' element={<AIGenerate/>}/> 
      <Route path='user/:userId' element={<User/>}/>
      <Route path='profileviewer' element={<ProfileViewer/>}/>
      <Route path='dashboard' element={<Dashboard/>}/>

    </Route>
  )
)

createRoot(document.getElementById('root')).render(
  <>
    <RouterProvider router={router}/>
  </>,
)
