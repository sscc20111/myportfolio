const randomWave = (totalPoints: number) => {
    return Array(totalPoints).fill(0).map(() => Math.floor(Math.random()*3 + 1));
};

const lerp = (start: number, end: number, t: number) =>  start + (end - start) * t; //θ값 부드러운 변환
const lerpAngle = (start: number, end: number, t: number) => { //θ값이 음수 양수 전환될때 부자연스러운 움직임 해결
    let diff = end - start;
    if (diff >= Math.PI) diff -= 2 * Math.PI;
    if (diff < -Math.PI) diff += 2 * Math.PI;
    return start + diff * t;
}

//input 좌표를 L, θ 으로 변환
const CatchPoint = ( Point: {x: number, y: number}, CP1: {x: number, y: number}, Center: number ) => {
    //길이 - 중심점과 점사이의 거리
    const PL = (Math.sqrt(Math.pow(((Point.x - Center)), 2) + Math.pow(((Point.y - Center)), 2)));
    const CP1L = (Math.sqrt(Math.pow(((CP1.x - Center)), 2) + Math.pow(((CP1.y - Center)), 2)));
    //각도 - 각 점의 θ값
    const PR = Math.atan2(Point.y - Center, Point.x - Center);
    const CP1R = Math.atan2(CP1.y - Center, CP1.x - Center);
    return {PL, PR, CP1L, CP1R}
}

//scale 계산을 위한 maxInputValue 함수
const maxInputValue = (input: any[]) => {
    // x와 y 값을 한 배열에 모음
    const allCoords = input.flatMap(coord => [coord.x, coord.y]);

    // 가장 큰 값 구하기
    const maxInputValue = Math.max(...allCoords);
    return maxInputValue
};

export { randomWave, lerp, lerpAngle, CatchPoint, maxInputValue };