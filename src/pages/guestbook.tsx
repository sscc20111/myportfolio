import React, { useEffect, useRef, useState } from 'react';
import { gsap } from "gsap";
import Masonry from 'masonry-layout';

import { fetchPost, addPost, deletePost, updatePost } from '../scripts/fetch';

import '../styles/guestbook.css'
import editSVG from '../assets/images/edit.svg'
import deleteSVG from '../assets/images/delete.svg'

type Project = {
    id: number;
    content: string;
    date: string;
    password: string;
};

const Guestbook = ({gridProps, ref, fetch}: {gridProps: (timeline: gsap.core.Timeline) => void, ref: React.Ref<HTMLDivElement>, fetch: Project[] | null}) => {
    const [coment,setComent] = useState('');
    const [password,setPassword] = useState('');
    const [editId, setEditId] = useState<number | null>(null);
    const [projects, setProjects] = useState<Project[] | null>(fetch);

    const tl = useRef<gsap.core.Timeline | null>(null);

    const introMotion = () => {
        const header = document.querySelector(".header");
        const items = document.querySelectorAll(".listItems .grid-item");
        const fadeItems = document.querySelectorAll(".guestbookHeader, .guestbookFooter");
        const listItemsElement = document.querySelector<HTMLDivElement>(".listItems");
        // Timeline 생성
        tl.current = gsap.timeline({ defaults: { duration: 0.5, ease: "power2.inOut" } });

        // 페이지 진입 모션
        fadeItems.forEach(item => {
            tl.current?.fromTo(item, { opacity: 0 }, { opacity: 1 }, "start");
        });

        tl.current.addLabel("list", "start+=0.5");
        tl.current.fromTo(items, { opacity: 0, y: 20 }, { opacity: 1, y: 0, stagger: 0.1, onComplete: () => {
            if (listItemsElement) {
                listItemsElement.classList.add("done");
            }
        } }, "list");
        tl.current.to(header, { opacity: 1, duration: 0.2, ease: "power2.inOut" }, "list");

        gridProps(tl.current);
    };

    //상대시간 반환
    const getRelativeTime = (postDate: string) => {
        const now = new Date();
        const postDateObj = new Date(postDate);    

        let diffMs = now.getTime() - postDateObj.getTime(); // 밀리초 차이
        if (diffMs < 0) diffMs = 0;

        const diffSec = diffMs / 1000;
        const diffMin = diffSec / 60;
        const diffHour = diffMin / 60;
        const diffDay = diffHour / 24;

        if (diffMin < 60) {
            return `${Math.floor(diffMin)} min ago`;
        }

        if (diffHour < 24) {
            return `${Math.floor(diffHour)} hours ago`;
        }

        if (diffDay < 30) {
            return `${Math.floor(diffDay)} days ago`;
        }
    };

    // 생성
    const addHandle = async () => {
        const { success } = await addPost(coment, password);

        if (success) {
            // 새로운 ID 생성 (실제 DB에서는 자동으로 생성되므로, 여기서는 임시로 생성)
            const lastId = projects && projects.length > 0  ?  projects[projects.length - 1].id : 0;
            const newId = lastId + 1;
            
            // 새로운 댓글을 프로젝트 리스트에 추가
            setProjects((prevProjects) => [...(prevProjects || []),{   
                id: newId, // 임시 ID 생성
                content: coment,
                date: new Date().toString(), // 현재 시간
                password: password
            },]);

            // 입력 필드 초기화
            setComent('');
            setPassword('');

        } else {
            console.log("글 작성 실패");
        }
    }

    // 업데이트
    const updateMode = async (id: number, content: string, password: string) => {
        setEditId(id);
        setComent(content);
        setPassword(password);
    };

    // 삭제
    const deleteHandle = async (id: number) => {
        const { success } = await deletePost(id); // 예시로 ID 1을 삭제
        if (success) {
            // 삭제 성공 시 프로젝트 리스트에서 해당 ID를 가진 항목 제거
            setProjects(prev => prev ? prev.filter(item => item.id !== id) : prev);

        } else {
            console.log("글 삭제 실패");
        }
    };

    const updateHandle = async (id: number, content: string, password: string) => {
        const { success } = await updatePost(id, content, password);
        if (success) {
            // 업데이트 성공 시 프로젝트 리스트에서 해당 ID를 가진 항목 업데이트
            setProjects(prev => prev ? prev.map(item => item.id === id ? { ...item, content, password } : item) : prev);

            // 입력 필드 초기화
            setEditId(null);
            setComent('');
            setPassword('');
        } else {
            console.log("글 수정 실패");
        }
    };

    // Masonry 레이아웃을 적용할 그리드 요소에 대한 참조
    const gridRef = useRef<HTMLDivElement>(null);
    const masonryRef = useRef<any>(null);

    // 프로젝트 데이터가 변경될 때마다 Masonry 레이아웃을 재계산
    useEffect(() => {
        if (!gridRef.current || !projects) return;

        // Masonry 초기화
        masonryRef.current = new Masonry(gridRef.current, {
            itemSelector: ".grid-item",
            percentPosition: true,
            originTop: false,
            gutter: 10,
            transitionDuration: '0.3s',
            resize: false
        });

        // 데이터가 바뀔 때마다 레이아웃 재계산
        masonryRef.current.layout();
    }, [projects]);

    useEffect(() => {
        fetchPost(setProjects);
        introMotion();
    }, [fetch]);


    return(
        <div className='guestbook motionWrap' ref={ref}>
            <div className="guestbookWrap">
                <div className='guestbookContainer'>
                    <div className="guestbookHeader">
                        <h2>GUESTBOOK</h2>
                        <p>Leave your comments.</p>
                    </div>
                    <div className="guestList">
                        <div className="listItems" ref={gridRef}>
                            {projects?.map((item, index) => (
                                <React.Fragment key={index}>
                                    {(index === 0) && 
                                        <div className="grid-sizer"></div>
                                    }
                                    {(index === 0 || index === 1 || index === 2) && 
                                        <div className="grid-item dumy" key={'dumy' + index}></div>
                                    }
                                    <div className="grid-item" key={index}>
                                        <p>{item.content}</p>
                                        <span>{item.id}, {getRelativeTime(item.date)}</span>
                                        {item.password === password && (
                                            <div className='controlBox'>
                                                <button className='editButton' onClick={() => updateMode(item.id, item.content, item.password)}><img src={editSVG} alt="edit icon" /></button>
                                                <button className='deleteButton' onClick={() => deleteHandle(item.id)}><img src={deleteSVG} alt="delete icon" /></button>
                                            </div>
                                        )}
                                    </div>
                                </React.Fragment>
                            ))}
                        </div>
                    </div>
                    <div className="guestbookFooter">
                        <textarea value={coment} placeholder="Your Comment" onChange={(e) => setComent(e.target.value)} />
                        <div className='inputBox'>
                            <input type="text" value={password} placeholder="Your Id" onChange={(e) => setPassword(e.target.value)} />
                        </div>
                        <div className='buttonBox'>
                            <button onClick={editId !== null ? () => updateHandle(editId, coment, password) : addHandle}>{editId !== null ? "Update" : "Submit"}</button>
                            {editId !== null && <button onClick={() => { setEditId(null); setComent(''); setPassword(''); }}>Cancel</button>}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
};

export default Guestbook;