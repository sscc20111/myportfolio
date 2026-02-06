import { maxValue } from "./calculate";

const testInput: { x: number, y: number }[] = [
        { x: 468, y: 146 },
        { x: 302, y: 28 },
        { x: 69, y: 80 },
        { x: 93, y: 311 },
        { x: 129, y: 485 },
        { x: 302, y: 524 },
        { x: 478, y: 492 },
        { x: 626, y: 311 }
]
const maxInput = () => {
    // x와 y 값을 한 배열에 모음
    const allCoords = testInput.flatMap(coord => [coord.x, coord.y]);

    // 가장 큰 값 구하기
    const maxInput = Math.max(...allCoords);

    return maxInput
};

const canvasJs = (selecter: string): void => {
    const container: Element | null = document.querySelector(selecter);
    if (!container) return;
    
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    container.appendChild(canvas);

    //set size
    canvas.width = container.clientWidth;
    canvas.height = container.clientHeight;
    //setting
    const MaxValue = maxValue(testInput);
    
    const draw = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        ctx.beginPath();
        Array.from(testInput).forEach((point) => {
            ctx.arc(point.x/1.5, point.y/1.5, 5, 0, Math.PI * 2);
            ctx.closePath();
        });

        ctx.fillStyle = '#000';
        ctx.fill();
    
    };

    const update = () => {
        const ratioChange = ((canvas.width/2) / MaxValue);//canvas size에 맞게 svg포인트 변환
        
        console.log(ratioChange);
    
        return { ratioChange };
    };
update();
    setInterval(draw, 15);
};

export default canvasJs;