import { Routes, Route, useLocation } from 'react-router-dom'
import { CSSTransition, SwitchTransition } from "react-transition-group";
import { gsap } from "gsap";

import './App.css'

import Header from './components/header'
import { Main, Sub1, Sub2, Sub3, Sub4, Sub5 } from './pages/index';
import { useRef, useState } from 'react';

function App() {
  const location = useLocation();
  const nodeRef = useRef(null);
  const [gridTimeline, setGridTimeline] = useState<gsap.core.Timeline | null>(null);

  const locationFunc = () => {
    gridTimeline?.timeScale(1.8).reverse();
    console.log('test');
  }
  const gridTest = (item: gsap.core.Timeline) => {
    setGridTimeline(item);
  }

  return (
    <>
      <div className='body container mx-auto w-full'>
        <Header location={locationFunc} />

        <div className='contentsBody'>
          <SwitchTransition mode='out-in'>
            <CSSTransition
              key={location.pathname}
              timeout={{ enter: 500, exit: 1500 }}
              classNames="motion"
              nodeRef={nodeRef}
            >
              <div ref={nodeRef} className='router-wrapper '>
                <Routes location={location}>
                  <Route path="/" element={<Main gridProps={gridTest} location={locationFunc} />} />
                  <Route path="/sub1" element={<Sub1 gridProps={gridTest} />} />
                  <Route path="/sub2" element={<Sub2 gridProps={gridTest} />} />
                  <Route path="/sub3" element={<Sub3 gridProps={gridTest} />} />
                  <Route path="/sub4" element={<Sub4 gridProps={gridTest} />} />
                  <Route path="/sub5" element={<Sub5 gridProps={gridTest} />} />
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
