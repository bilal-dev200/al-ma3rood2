"use client";
import CoolAuctionPage from '@/components/WebsiteComponents/HomePageComponents/CoolAuctionPage'
import React from 'react'
import { useTranslation } from 'react-i18next';

const page = () => {
    const { t, i18n } = useTranslation();
    
    return (
        <div>
            <CoolAuctionPage
                heading={t("Cool Auctions")}
                noDataText="Sorry, no listing available right now!"
            />
        </div>
    )
}

export default page