import { Route, Routes } from "react-router-dom";

import { Main, Sub1, Sub2 } from './index';

const GridBox = () => {
    

    return(
        <div className='GridBox'>
            <h1>Grid Box Page</h1>
            <Routes>
                <Route index element={<Main />} />
                <Route path="Sub1" element={<Sub1 />} />
                <Route path="Sub2" element={<Sub2 />} />
            </Routes>
        </div>
    )
};

export default GridBox;