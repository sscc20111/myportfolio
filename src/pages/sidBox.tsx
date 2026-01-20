import { Route, Routes } from "react-router-dom";

import { Sub3, Sub4 } from './index';

const SidBox = () => {
    

    return(
        <div className='SidBox'>
            <h1>Sid Box Page</h1>
            <Routes>
                <Route path="Sub3" element={<Sub3 />} />
                <Route path="Sub4" element={<Sub4 />} />
            </Routes>
        </div>
    )
};

export default SidBox;