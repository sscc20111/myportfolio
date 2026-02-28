import { Routes, Route, useLocation } from 'react-router-dom'
import { CSSTransition, SwitchTransition } from "react-transition-group";
import { gsap } from "gsap";

import './App.css'

import Header from './components/header'
import { Main, About, Project, Guestbook, Sub4, Sub5 } from './pages/index';
import { useRef, useState, useEffect } from 'react';

function App() {
  const location = useLocation();
  const nodeRef = useRef(null);
  const motionRef = useRef<{width: string, height: string} | null>(null);
  const timeLineRef = useRef<gsap.core.Timeline | null>(null);

  const motionBoxRef = useRef<HTMLDivElement>(null);

  // 페이지 이동 시 그리드 애니메이션 역재생
  const locationFunc = (size: string) => {
    console.log('width: ', motionBoxRef.current?.offsetWidth, ' > ', wrapSize[size].width, 'height: ', motionBoxRef.current?.offsetHeight, ' > ', wrapSize[size].height);
    // console.log(window.innerWidth + "px");
    const wrap = document.querySelector(".motionWrap");
    timeLineRef.current?.timeScale(2).reverse()
    .then(() => {
      gsap.fromTo(
        wrap, 
        { width: motionBoxRef.current?.offsetWidth + 'px', height: motionBoxRef.current?.offsetHeight + 'px' }, 
        { width: wrapSize[size].width, height: wrapSize[size].height, 
          duration: 0.2, 
          ease: "power2.inOut" }
      );
    });
  }

  // 그리드 애니메이션 타임라인을 자식 컴포넌트에서 받아오는 함수
  const gridTest = (item: gsap.core.Timeline) => {
    timeLineRef.current = item;
  }

  const wrapSize: { [key: string]: {width: string | (() => string), height: string | (() => string)} } = {
    main: {width: Math.min(1000, window.innerWidth * 0.8) + "px", height: window.innerHeight + "px"},
    about: {width: window.innerWidth + "px", height: window.innerHeight + "px"},
    project: {width: Math.min(1500, window.innerWidth * 0.8) + "px", height: Math.min(780, window.innerHeight * 0.8) + "px"},
    guestbook: {width: window.innerWidth + "px", height: window.innerHeight + "px"},
    contact: {width: Math.min(800, window.innerWidth * 0.8) + "px", height: window.innerHeight + "px"},
    making: {width: Math.min(1000, window.innerWidth * 0.8) + "px", height: window.innerHeight + "px"},
  }


  return (
    <>
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
                  <Route path="/" element={<Main gridProps={gridTest} location={locationFunc} ref={motionBoxRef} />} />
                  <Route path="/about" element={<About gridProps={gridTest} ref={motionBoxRef} />} />
                  <Route path="/project" element={<Project gridProps={gridTest} ref={motionBoxRef} />} />
                  <Route path="/guestbook" element={<Guestbook gridProps={gridTest} ref={motionBoxRef} />} />
                  {/* <Route path="/contact" element={<Sub4 gridProps={gridTest} ref={motionBoxRef} />} /> */}
                  {/* <Route path="/making" element={<Sub5 gridProps={gridTest} ref={motionBoxRef} />} /> */}
                </Routes>
              </div>
            </CSSTransition>
          </SwitchTransition>
        </div>

    </>
  )
}

export default App
