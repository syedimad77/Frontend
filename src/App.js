import React from 'react'
import {Routes,Route,BrowserRouter} from "react-router-dom"
import Login from './components/Login'
import Generate from './components/Generate'
import Message from './components/Message'



const App = () => {
  return (
    <div className='container'>
      <BrowserRouter>~
      <Routes>
        <Route path='/' element={<Login/>}/>
        <Route path='/generate' element={<Generate/>}/>
        <Route path='/message' element={<Message/>}/>
      </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App
