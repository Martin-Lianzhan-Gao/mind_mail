'use client'
import { SignUp } from '@clerk/nextjs'

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
        <div className='absolute h-screen w-screen inset-0 flex items-center justify-center'>
            <img className='h-full w-full object-cover' src='/images/envelope.jpg'></img>
            <div className={cn('absolute w-fit h-fit', isHovering ? "animate-none" : "animate-breath-float")} 
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
            >
                <SignUp />
            </div>
        </div>
    )
}