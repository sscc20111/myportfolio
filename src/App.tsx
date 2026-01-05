import { Routes, Route } from 'react-router-dom'
import './App.css'

import Header from './components/header'
import { Main, Sub1, Sub2, Sub3, Sub4 } from './pages'

function App() {

  return (
    <>
      <div className='body container mx-auto w-full max-w-96'>
        <Header />
        <div className='contentsBody'>
          <Routes>
            <Route path='/' element={<Main />} />
            <Route path='/sub1' element={<Sub1 />} />
            <Route path='/sub2' element={<Sub2 />} />
            <Route path='/sub3' element={<Sub3 />} />
            <Route path='/sub4' element={<Sub4 />} />
          </Routes>
        </div>
      </div>

    </>
  )
}

export default App
