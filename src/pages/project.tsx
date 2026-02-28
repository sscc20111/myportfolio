import { useEffect, useRef, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { EffectCreative, Navigation } from 'swiper/modules';
import { gsap } from "gsap";

import 'swiper/css';
import 'swiper/css/effect-creative';
import 'swiper/css/navigation';
import '../styles/project.css';

import grid1 from '../assets/images/Grid1.png';
import grid2 from '../assets/images/Grid2.png';
import grid3 from '../assets/images/Grid3.png';

import Canvas from '../components/canvas/canvas';

type ProjectItem = {
    cases: string;
    title: string;
    period: string;
    role: string;
    stack: string[];
    summary: string;
    image: string;
};

const Projects: ProjectItem[] = [
    {
        cases: 'Portfolio Project',
        title: 'Canvas.js',
        period: '2023.10 - 2023.12',
        role: 'Frontend',
        stack: ['React Hooks', 'Canvas 2D API', 'GSAP', '수학'],
        summary: '정적인 UI를 넘어, 프론트엔드에서 ‘시각적 경험(Visual Experience)’을 직접 구현하는 프로젝트입니다. 캔버스 애니메이션과 인터랙션을 활용하여, 각 프로젝트에 어울리는 독특한 시각적 효과를 구현하였습니다.',
        image: grid1,
    },
    {
        cases: 'Portfolio Project',
        title: 'GuestBook',
        period: '2023.10 - 2023.12',
        role: 'Frontend / Backend',
        stack: ['PHP', 'MySQL', 'axios', 'GSAP'],
        summary: '백엔드 기술을 활용하여, 방문자들이 직접 메시지를 남길 수 있는 인터랙티브한 방명록 프로젝트입니다. GSAP을 활용한 애니메이션 효과로, 사용자 경험을 향상시키고, 각 메시지가 독특한 시각적 효과로 표현되도록 구현하였습니다.',
        image: grid2,
    },
    {
        cases: 'Toy Project',
        title: 'Cultural Life',
        period: '2024.08 - 2024.12',
        role: 'Frontend / Backend',
        stack: ['API', 'MySQL', 'axios'],
        summary: '',
        image: grid3,
    },
    {
        cases: 'Toy Project',
        title: 'Todo List',
        period: '2024.05 - 2024.07',
        role: 'UI / React',
        stack: ['Three.js', 'Vite', 'CSS Modules'],
        summary: 'Immersive product narrative with flexible layouts and responsive grids.',
        image: grid1,
    },
    {
        cases: 'Toy Project',
        title: 'Card Game',
        period: '2024.01 - 2024.03',
        role: 'Design System',
        stack: ['React', 'JavaScript'],
        summary: 'Magazine-inspired layouts with layered backgrounds and interactive details.',
        image: grid3,
    },
];


const Project = ({gridProps, ref}: {gridProps: (timeline: gsap.core.Timeline) => void, ref: React.Ref<HTMLDivElement>}) => {
    const [activeIndex, setActiveIndex] = useState(0);
    const [swiperInstance, setSwiperInstance] = useState<any>(null);
    const activeProject = Projects[activeIndex] ?? Projects[0];

    const prevRef = useRef(null);
    const nextRef = useRef(null);

    const tl = useRef<gsap.core.Timeline | null>(null);

    const introMotion = () => {
        const wrap = document.querySelector(".projectBox");
        const item = document.querySelectorAll(".projectBox > div");


        tl.current = gsap.timeline({ defaults: { duration: 0.5, ease: "power2.inOut" } });
        tl.current.fromTo(wrap, {background: "linear-gradient(to bottom left, #b89569, #b89569)"}, {background: "linear-gradient(to bottom left, #ecdbc4, #c2a680)"}, "start");
        tl.current.to(item, { opacity: 1 }, "start+=0.3");

        gridProps(tl.current);
    
    };

    useEffect(()=>{
        introMotion();
    },[]);
    useEffect(() => {
        if (!swiperInstance || !prevRef.current || !nextRef.current) return;

        if (typeof swiperInstance.params.navigation === 'object' && swiperInstance.params.navigation) {
            swiperInstance.params.navigation.prevEl = prevRef.current;
            swiperInstance.params.navigation.nextEl = nextRef.current;
        }

        swiperInstance.navigation.destroy();
        swiperInstance.navigation.init();
        swiperInstance.navigation.update();
    }, [swiperInstance]);


    return(
        <div className='project motionWrap' ref={ref}>
            <div className="gridWrap">
                <div className="projectBox">
                    <div className="leftBox">
                        <div className='canvasBox'>
                            <Canvas images={activeProject.image} />
                        </div>
                    </div>
                    <Swiper
                        className="rightBox"
                        spaceBetween={32}
                        effect={'creative'}
                        speed={900}
                        allowTouchMove={false}
                        creativeEffect={{
                            prev: {
                                shadow: false,
                                translate: ['-12%', 0, -200],
                                rotate: [0, 0, -2],
                                opacity: 0,
                            },
                            next: {
                                shadow: false,
                                translate: ['12%', 0, -200],
                                rotate: [0, 0, 2],
                                opacity: 0,
                            },
                        }}
                        onSlideChange={(swiper) => setActiveIndex(swiper.realIndex)}
                        onSwiper={setSwiperInstance}
                        modules={[EffectCreative, Navigation]}
                    >
                        {Projects.map((project) => (
                            <SwiperSlide key={project.title}>
                                <div className="textBox">
                                    <span className='cases'>{project.cases}</span>
                                    <h2>{project.title}</h2>
                                    <span className="duration">{project.period}</span>
                                    <p className="projectSummary">{project.summary}</p>
                                    <h3>{project.role}</h3>
                                    <div className="projectStack">
                                        {project.stack.map((item) => (
                                            <span key={item}>{item}</span>
                                        ))}
                                    </div>
                                </div>
                            </SwiperSlide>
                        ))}
                    </Swiper>
                    <div className='navigationBtn'>
                        <button ref={prevRef} className={"navBtn prevBtn" + (activeIndex === 0 ? " disabled" : "")}></button>
                        <button ref={nextRef} className={"navBtn nextBtn" + (activeIndex === Projects.length - 1 ? " disabled" : "")}></button>
                    </div>
                </div>
            </div>
        </div>
    )
};

export default Project;