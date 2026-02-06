import { useEffect, useRef } from "react";
import { gsap } from "gsap";

import '../styles/sub1.css'

const sub_01 = ({gridProps}: {gridProps: (timeline: gsap.core.Timeline) => void}) => {
    const tl = useRef<gsap.core.Timeline | null>(null);
    const randomDelay = (ms: number) => Math.random() * ms / 1000;
    
    useEffect(() => {
        const wrap = document.querySelector("#root");
        const gridWrap = document.querySelector(".widePage");
        const gridBox = document.querySelectorAll(".gridBox");
        const textCover = document.querySelectorAll(".textBox .cover");
        const imgCover = document.querySelectorAll(".imgBox .cover");

        // Timeline 생성
        tl.current = gsap.timeline({ defaults: { duration: 0.5, ease: "power2.inOut" } });

        // wrap maxWidth 모션
        tl.current.to(wrap, {maxWidth: "1500px"}, "startMotion");
        tl.current.to(gridWrap, {height: "80%"}, "startMotion");

        // gap 모션
        tl.current.addLabel("gapMotion", "startMotion+=0.3"); // gap 모션(0.5s) 끝난 후 0.3s 뒤에 시작
        tl.current.to(gridWrap, { gap: "20px" }, "gapMotion");
        tl.current.to(gridBox, { gap: "20px" }, "gapMotion");

        // columns 모션
        tl.current.addLabel("columns", "gapMotion+=0.3"); // gap 모션(0.5s) 끝난 후 0.3s 뒤에 시작
        tl.current.fromTo(gridBox[0], { gridTemplateColumns: "1fr 1fr 1fr" }, { gridTemplateColumns: "10fr 12fr 9fr", delay: randomDelay(500) }, "columns");
        tl.current.fromTo(gridBox[1], { gridTemplateColumns: "13fr 14fr 13fr" }, { gridTemplateColumns: "10fr 8fr 13fr", delay: randomDelay(500) }, "columns");

        // text cover 애니메이션
        tl.current.addLabel("cover", "columns+=0.5"); // gap 모션(0.5s) 끝난 후 0.3s 뒤에 시작
        textCover.forEach((cover) => {
            tl.current!.to(cover, { zIndex: 0, left: "calc(100% - 392px)", delay: randomDelay(500) }, "cover");
        });

        // img cover 랜덤 방향 애니메이션
        imgCover.forEach((cover) => {
            const dir = Math.random() < 0.5 ? { left: "100%" } : { right: "100%" };
            tl.current!.to(cover, { ...dir, delay: randomDelay(500) }, "cover");
        });

        gridProps(tl.current);
    }, []);

    return(
        <div className='sub_01 subpage'>
            <div className="gridWrap">
                <div className="widePage">
                    <div className="gridBox">
                        <div className="imgBox">
                            <span className="cover"></span>
                            <figure>
                                <img src="https://images.unsplash.com/photo-1506744038136-46273834b3fb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8bmF0dXJlfGVufDB8fDB8fHww&auto=format&fit=crop&w=800&q=60" /> 
                            </figure>
                        </div>
                        <div className="textBox">
                            <span className="cover"></span>
                            <div className="textWrap">
                                <h2>Sub Page 01</h2>
                            </div>
                        </div>
                        <div className="imgBox">
                            <span className="cover"></span>
                            <figure>
                                <img src="https://images.unsplash.com/photo-1506744038136-46273834b3fb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8bmF0dXJlfGVufDB8fDB8fHww&auto=format&fit=crop&w=800&q=60" /> 
                            </figure>
                        </div>
                    </div>
                    <div className="gridBox">
                        <div className="textBox">
                            <span className="cover"></span>
                            <div className="textWrap">
                                <h2>Sub Page 01</h2>
                            </div>
                        </div>
                        <div className="imgBox">
                            <span className="cover"></span>
                            <figure>
                                <img src="https://images.unsplash.com/photo-1506744038136-46273834b3fb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8bmF0dXJlfGVufDB8fDB8fHww&auto=format&fit=crop&w=800&q=60" /> 
                            </figure>
                        </div>
                        <div className="textBox">
                            <span className="cover"></span>
                            <div className="textWrap">
                                <h2>Sub Page 01</h2>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
};

export default sub_01;