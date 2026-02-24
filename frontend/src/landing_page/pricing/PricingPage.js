import React from 'react';

import Hero from './Hero';
import Brokerage from './Brokerage';
import OpenAccount from '../OpenAccount';

function PrincingPage() {
    return ( 
        <>
            <Hero />
            <OpenAccount />
            <Brokerage />
        </>
     );
}

export default PrincingPage;