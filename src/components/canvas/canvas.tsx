import { useEffect, useRef } from 'react'
import { gsap } from 'gsap';

import { lerp, lerpAngle, CatchPoint, maxInputValue } from './calculate';
import InputSVG from './input';

const Canvas = ({ images }: { images: string }) => {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);

    const ctxRef = useRef<CanvasRenderingContext2D | null>(null);
    const currentPattern = useRef<CanvasPattern | null>(null);
    const nextPattern = useRef<CanvasPattern | null>(null);
    
    const currentAlpha = useRef(1);
    const nextAlpha = useRef(0);

    const fadeOutTween = useRef<GSAPTween | null>(null);
    const fadeInTween = useRef<GSAPTween | null>(null);


        useEffect(()=>{
            const img = new Image();
            img.src = images;

            img.onload = () => {
                nextPattern.current = ctxRef.current!.createPattern(img, "repeat");

                // 기존 트윈이 있으면 종료
                fadeOutTween.current?.kill();
                fadeInTween.current?.kill();

                // 동시에 페이드아웃 + 페이드인
                fadeOutTween.current = gsap.fromTo(currentAlpha, { current: 1 }, {
                    current: 0,
                    duration: 1,
                    overwrite: "auto",
                    onComplete: () => {
                        // 새 패턴을 현재 패턴으로 승격
                        currentPattern.current = nextPattern.current;
                        currentAlpha.current = 1;
                    }
                });
                fadeInTween.current = gsap.fromTo(nextAlpha, { current: 0 }, {
                    current: 1,
                    duration: 1,
                    overwrite: "auto",
                });

            };
        },[images]);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const container = canvas.parentElement as HTMLElement | null;
        if (!container) return;

        const dpr = () => window.devicePixelRatio || 1;

        //==========================
        // Input 데이터 준비
        //==========================
        const inputPoint = InputSVG.point; //input point 좌표 로드
        const inputCP1 = InputSVG.cp1; //input control point 좌표 로드

        const maxInput = maxInputValue(inputPoint); //input 좌표중 가장 큰값(cp1은 화면에 그려지지 않으므로 maxValue 계산에서 제외)
        const inputCenter = maxInput / 2; //input 중심점
        const totalPoints = inputPoint.length; //input 총 점 개수

        const inputData = Array.from({ length: totalPoints }, (_, i) => //input 데이터 가공
            CatchPoint(inputPoint[i], inputCP1[i], inputCenter)
        );

        //canvas context 저장
        ctxRef.current = ctx; //ctx를 ref에 저장

        //==========================
        // 애니메이션 상태값
        //==========================
        let cycle = 0;
        // [수정] cycleSpeed의 의미를 "프레임당 증가량" -> "ms당 증가량"으로 변경
        // 기존 체감 속도(60Hz 기준 프레임당 0.001)와 맞추기 위해 (1000/60)으로 나눠서 보정
        // 60Hz 기준: 0.001 * 60 = 0.06/초 와 동일한 속도가 나오도록 계산됨
        let cycleSpeed = 0.001 / (1000 / 200); //임시 (ms 기준으로 변경됨, 필요시 값 재조정)
        let waveSpeed = 1.5; //임시
        let waveLength = 1; //임시

        //==========================
        // Wave 랜덤값 생성
        //==========================
        const waveAmplitude = Array.from({ length: totalPoints }, () => //1 ~ 1.5 사이의 랜덤 값 부여
            Math.random() * waveLength
        );

        const waveSpeedScale = Array.from({ length: totalPoints }, () => //0.5 ~ 1 사이의 랜덤 값 부여
            Math.random() * waveSpeed
        );

        //==========================
        // 크기/중심점 관련 값
        //==========================
        let centerX = container.clientWidth / 2;
        let centerY = container.clientHeight / 2;

        const minDimension = Math.min(container.clientWidth, container.clientHeight); //가로,세로 중 작은 값
        let scale = (minDimension / maxInput) * 0.8; //input scale 값 (가로/세로 중 작은 값 기준으로 왜곡을 줄임), 20% 여유
        let canvasRatio = Math.sqrt(Math.pow(minDimension, 2) + Math.pow(minDimension, 2)); //캔버스 대각선 길이



        //==========================
        // 좌표 계산 함수
        //==========================
        const update = (index: number) => {
            const baseIndex = Math.floor(cycle);
            const t = cycle - baseIndex;
            const prev = (baseIndex + index) % totalPoints; //lerp 현재 index
            const next = (baseIndex + index + 1) % totalPoints; //lerp 다음 index

            //wave 계산
            const wave폭 = (canvasRatio / 50) * waveAmplitude[index]; //각 point별 wave 폭
            const waveSpeed = 2 * waveSpeedScale[index]; //임시
            const wave = wave폭 * Math.sin(cycle * waveSpeed * (2 * Math.PI)); //변동 폭 조절 (sin 그래프에서 2π는 한 사이클)

            //input 데이터 로드
            const baseRadian = inputData[index].PR;
            const prevData = inputData[prev];
            const nextData = inputData[next];

            //이전, 다음 점의 CP1R 계산 (θ값 보간을 위해 필요)
            const prevR = baseRadian - (prevData.PR - prevData.CP1R);
            const nextR = baseRadian - (nextData.PR - nextData.CP1R);

            //θ, L 보간 (x,y 좌표는 θ값이 변하지 않음)
            const CP1R = lerpAngle(prevR, nextR, t);//θ 보간 (cp1, cp2는 θ값이 변함)
            const CP1L = lerp(prevData.CP1L, nextData.CP1L, t) + wave;//L 보간
            const PL = lerp(prevData.PL, nextData.PL, t) + wave;//L 보간

            //보간된 값으로 x, y, cp1x, cp1y, cp2x, cp2y 계산
            const x = Math.cos(baseRadian) * (PL * scale) + centerX;
            const y = Math.sin(baseRadian) * (PL * scale) + centerY;
            const cp1x = Math.cos(CP1R) * (CP1L * scale) + centerX;
            const cp1y = Math.sin(CP1R) * (CP1L * scale) + centerY;
            const cp2x = 2 * x - cp1x;
            const cp2y = 2 * y - cp1y;

            return { x, y, cp1x, cp1y, cp2x, cp2y };
        };

        //==========================
        // 그리기 함수
        //==========================
        // [수정] deltaTime(ms) 인자 추가 — 프레임 호출 횟수가 아닌 실제 경과 시간을 기반으로 cycle을 진행시키기 위함
        const draw = (deltaTime: number) => {
            const points = Array.from({ length: totalPoints }, (_, i) => update(i));
            const first = points[0];
            const last = points[totalPoints - 1];

            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.beginPath();

            // 베지어 곡선 그리기
            ctx.moveTo(first.x, first.y);
            for (let i = 0; i < totalPoints - 1; i += 1) {
                const current = points[i];
                const nextPoint = points[i + 1];
                ctx.bezierCurveTo(current.cp1x, current.cp1y, nextPoint.cp2x, nextPoint.cp2y, nextPoint.x, nextPoint.y);
            }
            ctx.bezierCurveTo(last.cp1x, last.cp1y, first.cp2x, first.cp2y, first.x, first.y);
            ctx.closePath();

            // 그림자: 도형 전체 외곽에 적용
            ctx.save();
            ctx.shadowColor = 'rgba(0, 0, 0, 0.32)';
            ctx.shadowBlur = 20;
            ctx.shadowOffsetX = 10;
            ctx.shadowOffsetY = 10;
            ctx.fillStyle = 'rgba(0, 0, 0, 1)';
            ctx.fill();
            ctx.restore();

            // 패턴 채우기
            ctx.save();
            ctx.clip();

            if (currentPattern.current) {
                ctx.globalAlpha = currentAlpha.current;
                ctx.fillStyle = currentPattern.current;
                ctx.fillRect(0, 0, canvas.width, canvas.height);
            }

            if (nextPattern.current) {
                ctx.globalAlpha = nextAlpha.current;
                ctx.fillStyle = nextPattern.current;
                ctx.fillRect(0, 0, canvas.width, canvas.height);
            }
            ctx.restore();

            // 사이클 업데이트
            // [수정] 프레임당 고정값(cycleSpeed) 증가 -> 경과 시간(deltaTime, ms) 기반 증가로 변경
            // 이렇게 하면 60Hz든 120Hz든 1초에 진행되는 총량이 동일해짐 (기기 독립적인 속도)
            cycle = (cycle + cycleSpeed * deltaTime) % totalPoints;
        };

        //==========================
        // 리사이즈 핸들러
        //==========================
        const resizeCanvas = () => {
            const pixelRatio = dpr();
            canvas.width = Math.floor(container.clientWidth * pixelRatio);
            canvas.height = Math.floor(container.clientHeight * pixelRatio);
            canvas.style.width = `${container.clientWidth}px`;
            canvas.style.height = `${container.clientHeight}px`;
            ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
        };

        const resize = () => {
            resizeCanvas();
            centerX = container.clientWidth / 2;
            centerY = container.clientHeight / 2;
            scale = (Math.min(container.clientWidth, container.clientHeight) / maxInput) * 0.8;
            canvasRatio = Math.sqrt(Math.pow(container.clientWidth, 2) + Math.pow(container.clientHeight, 2));
        };

        window.addEventListener('resize', resize);
        resize();

        //==========================
        // 애니메이션 루프
        //==========================
        let rafId = 0;
        // [추가] 이전 프레임의 타임스탬프를 저장해서 deltaTime 계산에 사용
        let lastTime: number | null = null;

        // [수정] rAF가 전달하는 timestamp(ms) 인자를 받도록 변경
        const animate = (time: number) => {
            // [추가] 최초 실행 시 lastTime이 없으면 현재 시각으로 초기화 (첫 프레임 deltaTime 튐 방지)
            if (lastTime === null) {
                lastTime = time;
            }

            // [추가] 이전 프레임과의 시간 차이(ms) 계산
            let deltaTime = time - lastTime;
            lastTime = time;

            // [추가] 탭이 백그라운드에 있다가 돌아오는 등 deltaTime이 비정상적으로 커지는 경우 방지 (튐 현상 방지)
            const MAX_DELTA = 100; // 100ms 이상 차이나면 100ms로 클램프
            if (deltaTime > MAX_DELTA) {
                deltaTime = MAX_DELTA;
            }

            draw(deltaTime); // [수정] draw 호출 시 deltaTime 전달
            rafId = window.requestAnimationFrame(animate);
        };
        rafId = window.requestAnimationFrame(animate); // [수정] 최초 호출도 rAF를 통해 timestamp를 받도록 변경 (animate() 직접 호출 X)

        return () => {
            window.removeEventListener('resize', resize);
            window.cancelAnimationFrame(rafId);
        };
    }, []);

    return (
        <>
            <canvas ref={canvasRef} />
        </>
    );
};

export default Canvas;
