import { useEffect, useRef, useState } from 'react';
import type { ReactElement } from 'react';
import { gsap } from "gsap";

import '../styles/about.css';
import 임시 from '../assets/images/about01.png'
import icon1 from '../assets/images/email.svg'
import icon2 from '../assets/images/phone.svg'

const About = ({gridProps, ref}: {gridProps: (timeline: gsap.core.Timeline) => void, ref: React.Ref<HTMLDivElement>}) => {
    const tl = useRef<gsap.core.Timeline | null>(null);
    const tl2 = useRef<gsap.core.Timeline | null>(null);
    const header = document.querySelector(".header"); 

    const [isAnimating, setIsAnimating] = useState(false);
    const [itemToggle,setItemToggle] = useState(true);
    const item = (itemToggle: boolean) => itemToggle ? ".itemWrap.item1" : ".itemWrap.item2";
    
    const randomDelay = (ms: number) => Math.random() * ms / 1000;
    
    // 인트로 모션 함수
    const introMotion = () => {
        const itemsWrap = document.querySelector(".itemWrap.itemCover");
        const items = document.querySelectorAll(".itemWrap.itemCover > div");

        // Timeline 생성
        tl.current = gsap.timeline({ defaults: { duration: 0.5, ease: "power2.inOut" } });
    
        // wrap maxWidth 모션
        // tl.current.to(wrap, {maxWidth: "100%"}, "start");
        items.forEach((item) => {
            tl.current!.to(item, { backgroundColor: "#c09b6e", borderColor: "#c09b6e" }, "start");
        });

        // 각 아이템에 대해 clip-path 모션 적용
        tl.current.addLabel("clip", "start+=0.5");
        items.forEach((item) => {
            tl.current!.fromTo(item, { clipPath: "inset(0% 0% 0% 0%)" }, { clipPath: "inset(100% 0% 0% 0%)", delay: randomDelay(500) }, "clip");
        });

        // 초기화 모션
        tl.current.addLabel("done", "clip+=1");
        tl.current.to(itemsWrap, {zIndex: 0, duration: 0}, "done");
        tl.current.to(header, { opacity: 1, duration: 0.2, ease: "power2.inOut" }, "done");
        
        //page outro 모션 gridprops
        gridProps(tl.current);
    };

    // 토글 모션 함수
    const toggleMotion = () => {
        if (isAnimating) return; // 애니메이션이 진행 중이면 함수 종료
        setItemToggle(!itemToggle); // 아이템 토글
        
        const itemsWrap = document.querySelector(item(itemToggle));
        const otherItemsWrap = document.querySelector(item(!itemToggle));
        const items = document.querySelectorAll(item(itemToggle) + " > div");

        // Timeline 생성
        tl2.current = gsap.timeline({ 
            defaults: { duration: 0.5, ease: "power2.inOut" },
            onComplete: () => {
                setIsAnimating(false);
            }
        });
        
        // 각 아이템에 대해 clip-path 모션 적용
        items.forEach((item) => {
            tl2.current!.fromTo(item, { clipPath: "inset(0% 0% 0% 0%)" }, { clipPath: "inset(100% 0% 0% 0%)", delay: randomDelay(500) }, "toggleMotion");
        });
        
        // 초기화 모션
        tl2.current.addLabel("done", "toggleMotion+=1.5"); // gap 모션(0.5s) 끝난 후 0.3s 뒤에 시작
        items.forEach((item) => {
            tl2.current!.to(item, { clipPath: "inset(0% 0% 0% 0%)", duration: 0 }, "done");
        });
        tl2.current.to(itemsWrap, {zIndex: 1, duration: 0}, "done");
        tl2.current.to(otherItemsWrap, {zIndex: 2, duration: 0}, "done");
    };

    // 아이템 토글
    const toggle = () => {
        if (isAnimating) return; // 애니메이션이 진행 중이면 함수 종료
        setIsAnimating(!isAnimating); // 애니메이션 진행 상태 토글
        toggleMotion(); // 토글모션 호출
    };

    const createButtonMotion = (button: HTMLElement) => {
        const rect = button.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        const maxDistance = 200;
        const minDistance = 50;
        const maxRotation = -15;

        const handleMouseMove = (e: MouseEvent) => {
            const dx = e.clientX - centerX;
            const dy = e.clientY - centerY;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance <= minDistance) {
                gsap.to(button, { transform: "rotate(0deg)", duration: 0.3, ease: "power2.out" });
            } else if (distance < maxDistance) {
                const ratio = (distance - minDistance) / (maxDistance - minDistance);
                const rotation = maxRotation * ratio;
                gsap.to(button, { transform: `rotate(${rotation}deg)`, duration: 0.3, ease: "power2.out" });
            }
        };
        return handleMouseMove;
    };

    useEffect(() => {
        introMotion(); //인트로 모션
    }, []);

    useEffect(() => {
        const timeout = setTimeout(() => {
            const button = document.querySelector(item(itemToggle) + " .button") as HTMLElement | null;
            if (!button) return;

            const handler = createButtonMotion(button);
            gsap.to(button, { transform: `rotate(-15deg)`, duration: 0.3, ease: "power2.out" });
            window.addEventListener("mousemove", handler);

            // cleanup에서 접근할 수 있도록 handler를 저장
            cleanupHandler = handler;
        }, 1500);

        let cleanupHandler: ((e: MouseEvent) => void) | null = null;

        return () => {
            clearTimeout(timeout);
            if (cleanupHandler) {
            window.removeEventListener("mousemove", cleanupHandler);
            }
        };
    }, [itemToggle]);

    const Item1Content = () => {
        return (
        <>
            <h2>About</h2>
            <div className="leftBox">
                <div className="introBox">
                    <h3>Creative Developer</h3>
                    <ul>
                        <li>
                            <span className='icon'><img src={icon1} alt="email icon" /></span>
                            <p>sscc20111@naver.com</p>
                        </li>
                        <li>
                            <span className='icon'><img src={icon2} alt="phone icon" /></span>
                            <p>010-9255-9404</p>
                        </li>
                    </ul>
                    <p>안녕하세요, 프론트엔드 개발자 남민우입니다.<br/>
<br/>
                    저는 퍼블리셔로서의 경험을 바탕으로<br/>
                    사용자에게 최상의 경험을 제공 하기 위해 노력하는 개발자입니다.<br/>
<br/>
                    작업의 효율성과 생산성을 중요하게 생각하며<br/>
                    끊임없이 진화하는 IT 시장에 발맞춰 항상 새로운 지식을 습득하고 싶습니다.<br/>
                    제 노력과 열정을 통해 뛰어난 웹 개발자로서 성장하고 싶습니다.<br/>
                    </p>
                </div>
            </div>
            <div className="rightBox">
                <div className='imgBox'><img src={임시} alt="about" /></div>
            </div>
        </>)
    };
    const Item2Content = () => {
        return (
        <>
            <h2>Experience</h2>
            <div className="leftBox">
                <div>
                    <h3>Career</h3>
                    <h4>(주)이프론트<span>(2021.11.24 ~ 2022.12.30)</span></h4>
                    <ul>
                        <li><p>와우엠</p> <span>(기업홍보, Fullpage개발(Parallax), 게시판 관리)</span></li>
                        <li><p>이안</p> <span>(기업홍보, svg모션, 게시판 관리)</span></li>
                        <li><p>충만법무법인</p> <span>(기업홍보, 상담접수)</span></li>
                        <li><p>무이림</p> <span>(숙박업체, 객실홍보, 예약관리)</span></li>
                        <li><p>칸디자인</p> <span>(기업홍보)</span></li>
                        <li><p>피도텍</p> <span>(기업홍보, Fullpage개발, 게시판 관리)</span></li>
                        <li><p>앞썬</p> <span>(기업홍보, 상품관리, 게시판 관리)</span></li>
                    </ul>
                </div>
                <div>
                    <h3>Other</h3>
                    <ul>
                        <li><p>아이엠티주식회사</p><span>(2018.04 - 2019.08)</span></li>
                        <li><p>기아(주)AutoLand광명</p><span>(2017.07 - 2018.01)</span></li>
                    </ul>
                </div>
            </div>
            <div className="rightBox">
                <h3>Skill</h3>
                <ul className='skillList'>
                    <li>
                        <h5>Language</h5>
                        <ul>
                            <li>HTML5</li>
                            <li>CSS3</li>
                            <li>JQuery</li>
                            <li>JavaScript</li>
                            <li>TypeScript</li>
                        </ul>
                    </li>
                    <li>
                        <h5>Framework</h5>
                        <ul>
                            <li>React</li>
                            <li>Next.js</li>
                            <li>Bootstrap</li>
                            <li>Tailwind CSS</li>
                        </ul>
                    </li>
                    <li>
                        <h5>Backend</h5>
                        <ul>
                            <li>PHP</li>
                            <li>MySQL</li>
                        </ul>
                    </li>
                    <li>
                        <h5>Design</h5>
                        <ul>
                            <li>Figma</li>
                            <li>Photoshop</li>
                        </ul>
                    </li>
                    <li>
                        <h5>Library</h5>
                        <ul>
                            <li>GSAP</li>
                            <li>Swiper</li>
                            <li></li>
                        </ul>
                    </li>
                    <li></li>
                </ul>
            </div>
        </>)
    };

    const renderGridItems = (content: ReactElement | null) => {
        if (!content) return Array.from({ length: 18 }, (_, i) => (
            <div key={i} className="moitionWrap"></div>
        ));
        return Array.from({ length: 18 }, (_, i) => (
            <div key={i} className={"moitionWrap" + (i === 5 ? " button" : "")} onClick={i === 5 ? toggle : undefined}>
                <div className='contentsWrap'>
                    <div className="contentsBox">{content}</div>
                </div>
            </div>
        ));
    };
    return(
        <div className='about motionWrap' ref={ref}>
            <div className="aboutWrap">
                <div className='itemWrap itemCover'>
                    {renderGridItems(null)}
                </div>
                <div className='itemWrap item1'>
                    {renderGridItems(<Item1Content />)}
                </div>
                <div className='itemWrap item2'>
                    {renderGridItems(<Item2Content />)}
                </div>
            </div>
        </div>
    )
};

export default About;