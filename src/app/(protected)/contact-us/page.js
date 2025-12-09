// "use client"
// import ContactForm from '@/components/WebsiteComponents/ContactusComponents/ContactForm';
// import HelpOptions from '@/components/WebsiteComponents/ContactusComponents/HelpOptions';
// import Sidebar from '@/components/WebsiteComponents/ReuseableComponenets/Sidebar';
// import React, { useState } from 'react'

// const page = () => {
//   return (
//     <>
//     <div className="flex p-10  text-black">
//     <Sidebar/>
//       {/* Main Content */}
//       <main className="flex-1 p-5 ">
//     <ContactForm/>
//         <HelpOptions/>

//       </main>
      
//     </div>
//     </>

//   )
// }

// export default page
"use client"
import ContactForm from '@/components/WebsiteComponents/ContactusComponents/ContactForm';
import Sidebar from '@/components/WebsiteComponents/ReuseableComponenets/Sidebar';
import React from 'react'

const page = () => {
  return (
    <>
      <div className="flex items-start md:p-10 text-black">
        {/* Sidebar with auto height */}
        <Sidebar />

        {/* Main Content */}
        <main className="flex-1 md:p-5 p-3">
          <ContactForm />
          {/* <HelpOptions /> */}
          {/* <ContactUs/> */}
        </main>
      </div>
    </>
  )
}

export default page
