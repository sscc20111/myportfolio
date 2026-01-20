import { useEffect } from "react";

import '../styles/main.css'
import Grid1 from '../assets/images/Grid1.png'
import Grid2 from '../assets/images/Grid2.png'
import Grid3 from '../assets/images/Grid3.png'
const images = [Grid1, Grid2, Grid3];


const Main = ({test}: {test: boolean}) => {
    const gridBotion = async() => {
        const gridWrap = document.querySelectorAll<HTMLElement>('.gridWrap');
        const gridBox = document.querySelectorAll<HTMLElement>('.gridBox');
        const coverItem = document.querySelectorAll<HTMLElement>('.cover');
        const imgCoverItem = document.querySelectorAll<HTMLElement>('.imgBox .cover');

        const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
        const randomDirection = async ( items: NodeListOf<HTMLElement> ) => { // 방향 랜덤
            Array.from(items).forEach(async (item) => {
                await delay(Math.random() * 500); //0~500ms 랜덤 딜레이
                Math.random() < 0.5 ? item.classList.add('left') : item.classList.add('right'); //50% 확률로 left or right 클래스 추가
            });
        }
        const activateItems = async ( items: NodeListOf<HTMLElement> ) => {// 아이템들에 딜레이 주면서 콜백 실행
            Array.from(items).map(async (item) => {
                await delay(Math.random() * 400); //0~500ms 랜덤 딜레이
                item.classList.add('active'); // active 클래스 추가
            });
        };

        await delay(100);
        activateItems(gridWrap);//그리드 gap 모션

        await delay(300);
        activateItems(gridBox);//items 넓이 모션

        await delay(500);
        activateItems(coverItem);//text cover 모션
        randomDirection(imgCoverItem);//img cover 모션
    };

    useEffect(() => {
        gridBotion();
    }, []);

    useEffect(()=>{
        console.log('Main test');
    },[test]);

    return(
        <div className='mainpage'>
            <div className="gridWrap">
                {[...Array(3)].map((_, index)=>(
                    <div key={index} className="gridBox">
                        <div className="textBox">
                            <span className="cover"></span>
                            <div className="textWrap">
                                <h2>Grid Box {index + 1}</h2>
                            </div>
                        </div>
                        <div className="imgBox">
                            <span className="cover"></span>
                            <figure>
                                <img src={images[index]} />
                            </figure>
                        </div>
                    </div>
                ))};
                {/* {[...Array(3)].map((_, index) => (
                    <div key={index} className={twMerge(clsx("gridBox", 그리드2, 그리드모션.gap, 그리드모션.columns[index], 트렌지션))}>
                        {[...Array(2)].map((_, index) => (
                            <div key={index} className={twMerge(clsx("gridItem", 그리드item, 그리드모션.padding, 트렌지션))}>
                                <div className={twMerge(clsx("textBox", 텍스트박스스타일))}>item{index+1}</div>
                                <div className={twMerge(clsx("imgBox", 이미지박스스타일, 트렌지션))}>
                                    <span className={twMerge(clsx("cover", "absolute", 트렌지션))}></span>
                                    <figure />
                                </div>
                            </div>
                        ))}
                    </div>
                ))} */}
            </div>
        </div>
    )
};

export default Main;