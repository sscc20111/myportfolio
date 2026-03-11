import { useEffect, useRef, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { EffectCreative, Navigation } from 'swiper/modules';
import { gsap } from "gsap";

import 'swiper/css';
import 'swiper/css/effect-creative';
import 'swiper/css/navigation';
import '../styles/project.css';

import thumbnail1 from '../assets/images/projects/thumbnail1.png';
import thumbnail2 from '../assets/images/projects/thumbnail2.png';
import thumbnail3 from '../assets/images/projects/thumbnail3.png';
import thumbnail4 from '../assets/images/projects/thumbnail4.png';
import thumbnail5 from '../assets/images/projects/thumbnail5.png';

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
        cases: 'Work Project',
        title: '충만법무법인',
        period: '2022.07 - 2022.08',
        role: 'Frontend / Publishing',
        stack: ['PHP', 'MSQL', 'Fullpage.js', 'Swiper.js'],
        summary: '법무법인 웹사이트 프로젝트로, Fullpage.js와 Swiper.js를 활용하여 사용자 경험을 향상시켰습니다.',
        image: thumbnail1,
    },
    {
        cases: 'Work Project',
        title: '이안',
        period: '2022.03 - 2022.05',
        role: 'Frontend / Publishing',
        stack: ['PHP', 'MSQL', 'SVG-animation'],
        summary: 'SVG 애니메이션을 강조하여 브랜드의 아이덴티티를 시각적으로 표현하였습니다.',
        image: thumbnail2,
    },
    {
        cases: 'Work Project',
        title: '휴콥(wow\'m)',
        period: '2022.03 - 2022.05',
        role: 'Frontend / Publishing',
        stack: ['PHP', 'MSQL', 'Fullpage.js', 'Swiper.js'],
        summary: 'fullpage.js의 유료 기능이였던 페럴렉스를 javascript로 직접 구현하여, 스크롤에 따른 이미지의 위치와 크기 변화를 통해 입체감을 주었습니다.',
        image: thumbnail3,
    },
    {
        cases: 'Work Project',
        title: '무이림',
        period: '2022.05 - 2022.06',
        role: 'Frontend / Publishing',
        stack: ['PHP', 'MSQL', 'Swiper.js'],
        summary: '숙소의 정적인 이미지를 강조한 웹사이트 입니다. Swiper.js를 활용하여 사용자 경험을 향상시켰습니다.',
        image: thumbnail4,
    },
    {
        cases: 'Portfolio Project',
        title: 'Cultural Life',
        period: '',
        role: 'Frontend / Backend',
        stack: ['PHP', 'React', 'API', 'axios'],
        summary: '공공데이터 포털에서 제공하는 API를 활용하여, 문화생활과 관련된 다양한 정보를 사용자에게 제공하는 웹 애플리케이션입니다. React를 사용하여 사용자 친화적인 인터페이스를 구현하였으며, axios를 통해 API와의 원활한 통신을 보장하였습니다.',
        image: thumbnail5,
    },
    {
        cases: 'Portfolio Project',
        title: 'GuestBook',
        period: '',
        role: 'Frontend / Backend',
        stack: ['React', 'Supabase', 'GSAP', 'Masonry'],
        summary: '사용자 인터랙션과 애니메이션을 강조한 게스트북 프로젝트입니다. React와 Supabase를 활용하여 실시간 데이터베이스와의 연동을 구현하였으며, GSAP과 Masonry를 사용하여 동적인 레이아웃과 애니메이션 효과를 제공하였습니다.',
        image: thumbnail2,
    },
    {
        cases: 'Portfolio Project',
        title: 'Canvas.js',
        period: '',
        role: 'Frontend',
        stack: ['React Hooks', 'Canvas 2D API', 'GSAP', '수학'],
        summary: '정적인 UI를 넘어, 프론트엔드에서 ‘시각적 경험(Visual Experience)’을 직접 구현하는 프로젝트입니다. 캔버스 애니메이션과 인터랙션을 활용하여, 각 프로젝트에 어울리는 독특한 시각적 효과를 구현하였습니다.',
        image: thumbnail1,
    },
    {
        cases: 'Toy Project',
        title: 'Todo List',
        period: '',
        role: 'UI / React',
        stack: ['React', 'JavaScript', 'CSS'],
        summary: '간단한 할 일 목록을 관리할 수 있는 Todo List 프로젝트입니다. React를 사용하여 사용자 인터페이스를 구현하였으며, 상태 관리를 통해 동적인 기능을 제공하였습니다.',
        image: thumbnail4,
    },
    {
        cases: 'Toy Project',
        title: 'Card Game',
        period: '',
        role: 'UI / React',
        stack: ['React', 'JavaScript'],
        summary: '사용자 인터랙션을 중심으로 한 카드 게임 프로젝트입니다. React를 활용하여 게임 로직과 UI를 구현하였으며, JavaScript를 통해 동적인 게임 기능을 제공하였습니다.',
        image: thumbnail5,
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
        const header = document.querySelector(".header");
        const item = document.querySelectorAll(".projectBox > div");

        tl.current = gsap.timeline({ defaults: { duration: 0.5, ease: "power2.inOut" } });
        tl.current.fromTo(wrap, {background: "linear-gradient(to bottom left, #b89569, #b89569)"}, {background: "linear-gradient(to bottom left, #ecdbc4, #c2a680)"}, "start");
        tl.current.to(item, { opacity: 1 }, "start+=0.3");
        tl.current.to(header, { opacity: 1, duration: 0.2, ease: "power2.inOut" }, "start+=0.3");
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