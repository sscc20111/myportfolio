import { Routes, Route, useLocation } from 'react-router-dom'
import { CSSTransition, SwitchTransition } from "react-transition-group";

import './App.css'

import Header from './components/header'
import { Main, Sub1, Sub2, Sub3, Sub4, Sub5 } from './pages/index';
import { useRef, useState } from 'react';

function App() {
  const location = useLocation();
  const nodeRef = useRef(null);
  const [test,settest] = useState(false);

  const testFunc = () => {
    console.log('App test');
    settest(!test);
  }

  return (
    <>
      <div className='body container mx-auto w-full'>
        <Header />
              <button style={{position:'absolute', top:'100px', right:'10px', zIndex:1000}} onClick={() =>settest(!test)}>Test {test.toString()}</button>

        <div className='contentsBody'>
          <SwitchTransition mode='out-in'>
            <CSSTransition
              key={location.pathname}
              timeout={{ enter: 300, exit: 1000 }}
              classNames="motion"
              nodeRef={nodeRef}
              onExit={() => {
                testFunc();
                console.log("페이지 나가기 시작");
              }}

            >
              <div ref={nodeRef} className='router-wrapper fade-enter'>
                <Routes location={location}>
                  <Route path="/" element={<Main test={test} />} />
                  <Route path="/sub1" element={<Sub1 />} />
                  <Route path="/sub2" element={<Sub2 />} />
                  <Route path="/sub3" element={<Sub3 />} />
                  <Route path="/sub4" element={<Sub4 />} />
                  <Route path="/sub5" element={<Sub5 />} />
                </Routes>
              </div>
            </CSSTransition>
          </SwitchTransition>
        </div>
      </div>

    </>
  )
}

export default App
