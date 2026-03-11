import { useRef, useState, useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom'
import { CSSTransition, SwitchTransition } from "react-transition-group";
import { gsap } from "gsap";

import './App.css'
import './styles/common.css'

import Header from './components/header'
import { Main, About, Project, Guestbook, Contact, Making } from './pages/index';
import {fetchPost} from './scripts/fetch';

type Project = {
    id: number;
    content: string;
    date: string;
    password: string;
};

function App() {
  const location = useLocation();
  const nodeRef = useRef(null);
  const timeLineRef = useRef<gsap.core.Timeline | null>(null);
  const motionBoxRef = useRef<HTMLDivElement>(null);

  const [guestbook, setGuestbook] = useState<Project[] | null>(null);

  useEffect(() => {
    fetchPost(setGuestbook);
    console.log(location);
    console.log('test');
  }, []);

  // 페이지 이동 시 그리드 애니메이션 역재생
  const locationFunc = (size: string) => {
    const wrap = document.querySelector(".motionWrap");
    const header = document.querySelector(".header");
    timeLineRef.current?.timeScale(2).reverse()
    .then(() => {
      gsap.fromTo(
        wrap, 
        { width: motionBoxRef.current?.offsetWidth + 'px', height: motionBoxRef.current?.offsetHeight + 'px' }, 
        { width: wrapSize[size].width, height: wrapSize[size].height, 
          duration: 0.2, 
          ease: "power2.inOut" }
      );
      gsap.to(header, { opacity: 0, duration: 0.2, ease: "power2.inOut" });
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
    contact: {width: Math.min(900, window.innerWidth * 0.9) + "px", height: Math.min(800, window.innerWidth * 0.9) + "px"},
    making: {width: Math.min(1000, window.innerWidth * 0.8) + "px", height: window.innerHeight + "px"},
  }


  return (
    <>
        <Header locationFunc={locationFunc} />

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
                  <Route path="/" element={<Main gridProps={gridTest} locationFunc={locationFunc} ref={motionBoxRef} />} />
                  <Route path="/about" element={<About gridProps={gridTest} ref={motionBoxRef} />} />
                  <Route path="/project" element={<Project gridProps={gridTest} ref={motionBoxRef} />} />
                  <Route path="/guestbook" element={<Guestbook gridProps={gridTest} ref={motionBoxRef} fetch={guestbook} />} />
                  <Route path="/contact" element={<Contact gridProps={gridTest} ref={motionBoxRef} />} />
                  {/* <Route path="/making" element={<Making gridProps={gridTest} ref={motionBoxRef} />} /> */}
                </Routes>
              </div>
            </CSSTransition>
          </SwitchTransition>
        </div>

    </>
  )
}

export default App
