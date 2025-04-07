'use client'
import { SignIn } from '@clerk/nextjs'

import React from 'react'
import { cn } from '~/lib/utils';

export default function Page() {

    const [isHovering, setIsHovering] = React.useState(false);
    
    const handleMouseEnter = () => {
        setIsHovering(true);
    };
    
    const handleMouseLeave = () => {
        setIsHovering(false);
    };

    return (
        <div className='absolute inset-0 flex items-center justify-center h-screen w-screen'>
            <img className='h-full w-full object-cover object-center' src='/images/envelope.jpg'></img>
            <div className={cn('absolute w-fit h-fit', isHovering ? "animate-none" : "animate-breath-float")} 
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}>
                <SignIn />
            </div>
        </div>

    )
}