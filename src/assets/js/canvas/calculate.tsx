interface Coordinate {
    x: number;
    y: number;
}

interface CatchPointResult {
    Length: number;
    Radian: number;
}

//좌표값 변환
const CatchPoint = (
    x: number,
    y: number,
    Vibration: number,
    MaxValue: number,
    ratioChange: number
): CatchPointResult => { //좌표값을 길이, θ로 변환
    const Center = MaxValue/2;
    const Length = (Math.sqrt(Math.pow(((x-Center)*ratioChange),2)+Math.pow(((y-Center)*ratioChange),2))) - Vibration;//중심점과 각 점사이의 거리
    const Radian = Math.atan2(y - Center, x - Center);
    return {Length,Radian}
}

const maxValue = (point: Coordinate[]): number => {
    //가장 먼 값 구하기
    const allPoint = point.flatMap(coord => [coord.x, coord.y]); //모든값 배열에 담기
    const Maxpoint = Math.max(...allPoint);

    //가장 긴 빗변 구하기
    const Center = Maxpoint/2; //(maxpoint,maxpoint) => 중심점
    const allLength = point.flatMap(point => [Math.sqrt(Math.pow(point.x-Center,2)+Math.pow(point.y-Center,2))]);// 모든 직선거리 배열에 담기
    const maxValue = Math.max(...allLength);
    return maxValue

};

export { maxValue, CatchPoint };