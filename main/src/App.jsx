import React from 'react';

import Homepage from './components/Homepage';
import { BrowserRouter, Route, Routes } from 'react-router';
import Login from './components/Login';
import SignUp from './components/Signup';
import MovieDetail from './components/MovieDetail';
import UserLists from './components/UserLists';


// 
const App = () => {


  return (
    <BrowserRouter>
      <Routes>
        <Route index element={<Homepage />} />
        <Route path='/login' element={<Login />} />
        <Route path='/signup' element={<SignUp />} />
        <Route path='/movie/:id' element={<MovieDetail />} />
        <Route path='/lists' element={<UserLists />} />
      </Routes>
    </BrowserRouter>
  )


}

export default App 