import CoolAuctionPage from '@/components/WebsiteComponents/HomePageComponents/CoolAuctionPage'
import React from 'react'

const page = () => {
    return (
        <div>
            <CoolAuctionPage
                heading="Hot Deals"
                noDataText="Sorry, no listing available right now!"
            />
        </div>
    )
}

export default page