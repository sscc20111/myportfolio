import { useEffect, useRef } from "react";
import { NavLink } from "react-router-dom";
import { gsap } from "gsap";

import '../styles/main.css'
import Grid1 from '../assets/images/Grid1.png'
import Grid2 from '../assets/images/Grid2.png'
import Grid3 from '../assets/images/Grid3.png'
const images = [Grid1, Grid2, Grid3];


const Main = ({gridProps, locationFunc, ref}: {gridProps: (timeline: gsap.core.Timeline) => void, locationFunc: (size: string) => void, ref: React.Ref<HTMLDivElement>}) => {
    const tl = useRef<gsap.core.Timeline | null>(null);
    const randomDelay = (ms: number) => Math.random() * ms / 1000;
    
    const introMotion = () => {
        const gridWrap = document.querySelector(".gridWrap");
        const gridBox = document.querySelectorAll(".gridBox");
        const textCover = document.querySelectorAll(".textBox .cover");
        const text = document.querySelectorAll(".textBox .textWrap");
        const imgCover = document.querySelectorAll(".imgBox .cover");
        const imgFigure = document.querySelectorAll(".imgBox figure img");

        // Timeline 생성
        tl.current = gsap.timeline({ defaults: { duration: 0.5, ease: "power2.inOut" } });

        // gap 모션
        tl.current.to(gridWrap, { gap: "20px" }, "gapMotion");
        tl.current.to(gridBox, { gap: "20px" }, "gapMotion");

        // columns 모션
        tl.current.addLabel("columns", "gapMotion+=0.3"); // gap 모션(0.5s) 끝난 후 0.3s 뒤에 시작

        tl.current.fromTo(gridBox[0], { gridTemplateColumns: "1fr 1fr" }, { gridTemplateColumns: "3fr 2fr", delay: randomDelay(500) }, "columns");
        tl.current.fromTo(gridBox[1], { gridTemplateColumns: "13fr 14fr" }, { gridTemplateColumns: "2fr 3fr", delay: randomDelay(500) }, "columns");
        tl.current.fromTo(gridBox[2], { gridTemplateColumns: "1fr 1fr" }, { gridTemplateColumns: "7fr 8fr", delay: randomDelay(500) }, "columns");

        // cover 애니메이션
        tl.current.addLabel("cover", "columns+=0.5"); // columns 모션(0.5s) 끝난 후 0.5s 뒤에 시작
        text.forEach((txt) => {
            tl.current!.to(txt, { opacity: 1, delay: 0.5}, "cover");
        });
        // text cover 애니메이션
        textCover.forEach((cover) => {
            tl.current!.to(cover, { left: "calc(100% - 392px)", delay: randomDelay(500) }, "cover");
        });
        // img cover 랜덤 방향 애니메이션
        imgCover.forEach((cover) => {
            const dir = Math.random() < 0.5 ? { left: "100%" } : { right: "100%" };
            tl.current!.to(cover, { ...dir, delay: randomDelay(500) }, "cover");
        });

        // // 이미지 scale 애니메이션
        tl.current.to(imgFigure, { scale: 1, transformOrigin: "center" }, "+=0.3");

        gridProps(tl.current);
    }
    useEffect(() => {
        introMotion();
    }, []);

    return(
        <div className='mainpage motionWrap' ref={ref}>
            <div className="gridWrap">
                <div className="gridBox">
                    <div className="textBox">
                        <span className="cover"></span>
                        <div className="textWrap">
                            <NavLink to="/about" onClick={() => locationFunc('about')}>About</NavLink>
                            <NavLink to="/project" onClick={() => locationFunc('project')}>Projects</NavLink>
                            <NavLink to="/guestbook" onClick={() => locationFunc('guestbook')}>GuestBook</NavLink>
                        </div>
                    </div>
                    <div className="imgBox">
                        <span className="cover"></span>
                        <figure>
                            <img src={images[0]} />
                        </figure>
                    </div>
                </div>
                <div className="gridBox">
                    <div className="textBox">
                        <span className="cover"></span>
                        <div className="textWrap">
                            <h2>Front-end</h2>
                            <h2>Development</h2>
                            <NavLink to="/contact" onClick={() => locationFunc('contact')}>Contact</NavLink>
                        </div>
                    </div>
                    <div className="imgBox">
                        <span className="cover"></span>
                        <figure>
                            <img src={images[1]} />
                        </figure>
                    </div>
                </div>
                <div className="gridBox">
                    <div className="textBox">
                        <span className="cover"></span>
                        <div className="textWrap">
                            <NavLink to="/making" onClick={() => locationFunc('making')}>Making</NavLink>
                            <h2>남민우</h2>
                            <h2>NamMinwoo</h2>
                        </div>
                    </div>
                    <div className="imgBox">
                        <span className="cover"></span>
                        <figure>
                            <img src={images[2]} />
                        </figure>
                    </div>
                </div>
            </div>
        </div>
    )
};

export default Main;