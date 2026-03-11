import { useEffect, useRef } from "react";
import { gsap } from "gsap";

import '../styles/contact.css';


const Contact = ({gridProps, ref}: {gridProps: (timeline: gsap.core.Timeline) => void, ref: React.Ref<HTMLDivElement>}) => {
    const tl = useRef<gsap.core.Timeline | null>(null);
    const header = document.querySelector(".header");
    
    const introMotion = () => {
        const fadeitems = document.querySelectorAll(".contact .fadeIn");
        const moveItems = document.querySelectorAll(".contact .moveIn");

        tl.current = gsap.timeline({ defaults: { duration: 0.5, ease: "power2.inOut" } });

        //타이틀 IN
        fadeitems.forEach((item, index) => {
            tl.current!.fromTo(item, { opacity: 0 }, { opacity: 1, delay: 0.2 + (index * 0.2) }, "title");
        });

        //인풋 IN
        tl.current.addLabel("input", "title+=0.3");
        moveItems.forEach((item, index) => {
            tl.current!.fromTo(item, { y: 20, opacity: 0 }, { y: 0, opacity: 1, delay: 0.5 + (index * 0.2) }, "input");
        });

        //헤더 IN
        tl.current.addLabel("done", "input+=1");
        tl.current.to(header, { opacity: 1, duration: 0.5 }, "done");

        gridProps(tl.current);
    }

    useEffect(() => {
        introMotion();
    }, []);

    return(
        <div className='contact motionWrap' ref={ref}>
                <h2 className="fadeIn">Get In Touch</h2>
                <p className="fadeIn">Let's Work Together</p>
                <div className="inputBox">
                    <input className="moveIn" type="text" placeholder="Name" />
                    <input className="moveIn" type="email" placeholder="Email" />
                    <textarea className="moveIn" placeholder="Message"></textarea>
                    <button className="moveIn">Send Message</button>
                </div>
        </div>
    )
};

export default Contact;