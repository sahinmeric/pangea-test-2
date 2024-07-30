import React from 'react';

import BlitzLayout from './BlitzLayout';
import { Outlet } from 'react-router-dom';

const BlitzRoute = () => {
    return (
        <BlitzLayout>
            <Outlet></Outlet>
        </BlitzLayout>
    );
};

export default BlitzRoute;
