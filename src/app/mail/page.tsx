'use client' // you must use client component if you want to use dynamic import
import dynamic from "next/dynamic";
import React from "react";

// import Mail from "./mail";

// use dynamic import to avoid hydration issue caused by ssr
// also, lazy load the mail component (that's the main usage of dynamic import)
const Mail = dynamic(() => { 
    return import("./mail")
}, {
    ssr: false
})

const MailDashboard = () => { 
    return (
        <Mail defaultLayout={ [20, 32, 48] } defaultCollapsed={ false } navCollapseSize={ 4 } />
    )
}


export default MailDashboard;