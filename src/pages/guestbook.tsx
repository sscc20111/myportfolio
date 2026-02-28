import { useEffect, useRef, useState } from 'react';
import { gsap } from "gsap";

import '../styles/guestbook.css'
import GuestbookInput from './guestbookInput';

const Guestbook = ({gridProps, ref}: {gridProps: (timeline: gsap.core.Timeline) => void, ref: React.Ref<HTMLDivElement>}) => {
    const [GuestbookText,setGuestbookText] = useState(GuestbookInput);
    const [input,setInput] = useState('');
    const [name,setName] = useState('');
    const inputHandle = () => {
        setGuestbookText([...GuestbookText, {
            index: GuestbookText.length,
            name: name,
            comment: input,
            date: new Date().toLocaleDateString()
        }]);
        setInput('');
        setName('');
    }
    
    
    return(
        <div className='guestbook motionWrap' ref={ref}>
            <div className="guestbookWrap">
                <div className='guestbookContainer'>
                    <div className="guestbookHeader">
                        <h2>GUESTBOOK</h2>
                        <p>Leave your comments.</p>
                    </div>
                    <ul className="guestbookBody">
                        {GuestbookText.map((item) => (
                            <li key={item.index}>
                                <p>{item.comment}</p>
                                <p>
                                    -{item.name} 
                                    <span>
                                        , {item.date}
                                    </span>
                                </p>
                            </li>
                        ))}
                    </ul>
                    <div className="guestbookFooter">
                        <textarea value={input} placeholder="Your Comment" onChange={(e) => setInput(e.target.value)} />
                        <button onClick={inputHandle}>Submit</button>
                        <input type="text" value={name} placeholder="Your Name" onChange={(e) => setName(e.target.value)} />
                    </div>
                </div>
            </div>
        </div>
    )
};

export default Guestbook;