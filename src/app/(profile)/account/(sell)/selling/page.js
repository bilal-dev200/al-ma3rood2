"use client";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import ListingCard from "./ListingCard";
import { listingsApi } from "@/lib/api/listings";
import { Image_URL } from "@/config/constants";
import Breadcrumbs from "@/components/WebsiteComponents/ReuseableComponenets/Breadcrumbs";
import { useTranslation } from "react-i18next";
import WithdrawDialog from "@/components/WebsiteComponents/ReuseableComponenets/WithdrawDialog";

const filters = [
  { label: "All Time", value: "all" },
  { label: "Last 45 days", value: "45d" },
  { label: "Last 7 days", value: "7d" },
  { label: "Last 24 hours", value: "24h" },
  { label: "Last 1 hours", value: "1h" },
];

const listingsData = [
  {
    id: 1,
    title: "Macbook",
    watchers: 0,
    views: 11,
    price: 2000,
    closingDate: "2025-07-10",
    image: "/watch.jpg",
  },
  {
    id: 2,
    title: "iphone",
    watchers: 3,
    views: 28,
    price: 1500,
    closingDate: "2025-07-10",
    image:
      "data:image/webp;base64,UklGRkQPAABXRUJQVlA4IDgPAACQRgCdASqMAMwAPkkgjUUioaEnpPHLyPAJCWUAzMiiK+wscTY81vD0h7fXzRftH6xHok/wfqAf1X+zdbp6Cnlzez3+33pK3TLxP62XuLlcn4nGD6ufUC9ef5nhqwC/oP9m/z/9l5Gfsp5V3rv/yfG/mY/07/n/cz8m3+//mPRD9O/9n/Q/AV/O/7D/zfuG+cD13ftr7IX61FV1m3T+kU6G8HNtETcaj9ylc13pcnqk6F5yKPOaQDhHbFq+nOVukFK/adWtgJlNJFQAwSS5fSNI10PQ8b7eEQ7v9GDkADZ7D9e37gZLDl+UIOgle5bsJHDWLJLNF4l8skmw5/Tbcl7mBdCO6mcLfw1cnSmH0RlWJ8PsjBO6dbVUqhJBLTz6/3jagwu6S2Nd3pybxSIBg3qyfC6WsL3q0IwohAheWzTeFuj2u54MKT5fA1RhT+3Cu3va4pF3mSYL4oslGnUJRW2h+Oz5fLnm+nf0J+wBIdhHwibGW+w51a6H7nwNgQsejkUbssW9JEuTjxlvyQK0+xqOyta2E9SiYr66cId5itPNQD3Hz/aLmuGF8dMfnGW4ciAtUBAzzyeqDKeMdxh9enh5XOGfrU87tHm67JgjIUsvGJz7q/JJuJGt2Pa34jr9M0WUJOITyFcb3weQUiwlMqtHJT6bg2iD3axURl04MSVXL/Yt8EJ3i7ncAu4hay04Ic9a8MtHLRJccFYfvygsZgOdjpvUoEvCBJGhlfIY3jL42XC2/T6YQqVm/T+AwQAA/v+CA4xNleLV/FFSh9RNUGQIyGW/rDdwb3nLxkrbJ8yocwFljrmoz+gDqF5p9FAzggAVxWFxFa4FutXKL/wCkeYADPi2f7rGH/rj3kfLCcCluU5/0np2uoHo7xjvktjAO5wn38W4vlKUuo+65gnvBTHU3uEbv30Q3QbY5LgvUN/lnP3tvF/f3cYyg2er+Ags3qXpRIN74sabhJFuXr08y+NAuRJPiD+Swv/uN4yzgNPpGzPLAJ3byhz3dnBnTQXWslO4BKKMvGuQZ13kpGEdJzFshTy0DBBon/Y1R523Ab6n6UrK29GfmwV7xMcxAiuUGvlV35sP0fasYd400njzSibKCe+Fuv1Az6y5ssFm5V8lGSfqotgWXWk9su6uMotXBCSVbAFmOezwB8NIXG90HA5+XfUkkPZi0hiFnyFL3+/5iXVdmb8qDuKNTCKiKYT/1PTnJSUkp/vWjzcXqMjyUoNworkKTezord5TwEU2pSl5M6wbd9dSv2hWo6zeizMdv+aEob72pBOUg8vWvb3BlroT+pIq/tkpo+fQIxS6WXdVFx7fS3UFRFlMCUO/knE4IOotYddFc64dWAhZfMQNKKnrZlKbbGwdxwfbRUF/hMP789fVTjFb3yighE9arhUhNozepORIz6IRdxDHGzLA200bs/TI10bMvc+Moho9E4jqETPMasvZDO3pADb/BYx1ZWSKJ4sqBLJpgwBQswAEoV4xBJDED2rF5zEp3XAW5W188NY59GOLPDPnU33f/CY7qM9tG1clNUFtbNagIisQ1LBaTfrfx5slFQr7YQ7fTEbnpAU3DMK+wtmsaZLQ42ZWEokZ1ZfrrSs3Hmx6Fe9/3TUcqzGNL0gxpz7gFyPrQab34Jjm8H4AzW/89SEq8GlxRhJflc2sgNczWP2nR70YeapxJfQ/7RXP/kVklBU5CNt9dD69fJXhrRtAS285FXn4ki1dtlRTYcIyuURpkI/WeWJGJHtaf7fq34V2xQ0YpbtR0lnofEtkZo6MEqMJLXnpa/mH4Zq2zCLlGz/zij/xKBFCHp4SV1eeUqdzRuSOgA5KWpfZfKw12W0MnouM4kmQEjn2cnHjCPUNZoDLiidfq2Yvvpn/cEn1BVTR83O8J8yMkH8i1MlJCjGWfCvvBRciNlhWLM3QD2HA0YC0Lv6FLgMvV4hglr80Z21Yt8ufM+x6LpbGKInIovPBebefDu8qwOr5Oz7rK6ZMgKKmkIe0Kyq2jiDmBO2Jie6tt0lPrZ+5CCp6uCCrWiOJkzG24DFnfScxGSX9dlJ+EprGfe7DPyCeplHocLhK9YlKZnnrg6lUw/GO3x7rDxYpTvcuptBvGCB/NAj7JF1Ak/YVVN47clE8ad4Kx1ZdRoO9cqDVGaHy1tPNnyBZeOSBMMjXfkvVoVff9yRZGlOQ++mmrg09faCbME5PYCM3QKfXS1kH7smQUhOV41EjmJHlzbg05aXYZL79ECMekVC7sYvFuyozGRr51cD51I/rK8wl0SmX5cWELxzAyXW3uY3LRHsfo2rlzT/8T1Wjl4sKfco/hWA/ufzNIq21PWmW96ykenq8DBkANtoQv4lO4BMIvaQvDSkPWn/kL4D1LOhY1is1lQSjRPJXBoM1l5Y/0kgMRfM4Z+W3ofeiCdBaiPg9R+ABMWOF0ruD4jhOw/kZrZ37ooOCbx9tHJ6Nyz6COrzD1UQ/ha6aFIWiY4lKZrUoW4Aqt8yItUEI/ipyXaQ0DzASvip8/Y8ywB6c19HmfrzH4ZUwDT80gQ3vtnpzWdxq9cXzrFsXWzzSmhX6g8rmhDJLFmLSLgHZeVKSauQ1n2ISNSXdLW2lfuzkmo83OPPyQ85iQ7Gq767pK6rmtHMAH3cNkELk3tbwU8lP4i9tUpgODDPJjjZgibOn+K04xCkgBayCkXrrC8qShyliamDtS/BYlniZNrrxWT+orI6VASev44UPiUOa/CGMBmdD2hZla8TDI4QCjhBPHSFkrwZyBkwwI0mdLX4bOTNi9tzfIDg/vcvHd9ldYvohSHOfPKfUcTX4fYZ38MP1W/AXoh4TY3Xjo8Upc7FIOziarmTmtasIN7xwHSb1JPALTNKUGoPkmoGbfU4IslH671GtXugzJtzTZ/JsP4NHo80H1QUDQiVd7bTTmJ7OaqLUJt5kJAuFD6eW7IATGrEbnp2qayiwbGlQIyjBNPS/4ctGlf3wM4LDkUKCDfj9zPk49XhGnxasZcUD6JxiE0kRgDIP2YCuKzBw8qbIeg1raXrRFkEt+kXPWCQ8zdvNM9UCTRDVssJ9/saxyjyBeNOXGH9Zt/FKRg0OYxqtKejjMistmYXN0wtajE/vuf6KLnoVmpkvo2fzVofKcdAcRNCbcgIzvq9hgIklXC1BhsXd8YSbjMTIqfXZVIhqGJFGvkkhZBuevUPxpM/8zXyR8/vg3/g/4r9VM7LymFVg4k3Z/d9+hfO2PUtwBGj0OhHyiJOo6yT1RotQLLTw2bqYQjkvZypvNI9NCE4E7mAnbTCUJsb0ads2cDiumaLbVq2U5Pa6ACh9YRabXy+Do5jnbXTH0/ijsNwAO639CLWYx5ng+c0sYSiIeeVGvZi1p4I1NyDy1SpQ6vW7DmktBANgYJBIHqY80ikuB8XJ5Y7VVrDv8kbqT1R5uChsg+cCnde+hMfHQVTOmV5CeTzjp9pAaDoYwwO/+7MgbbD0a4s4MwTeGNOhh1Xs4+sP1TbWnuCRPrJPpINnGhvMbBUWyrHpMVhCnEkXWcHLhFntopEHuj0Pf1nN8DOsQcXnafVuw5Pk17dWCVM8mxgi4k99eaPy80/CspvF924anfqhVoctDOhwlifn8yLndws6y+xAm6Pu6iSH7PzN3IIaRg7lR8drxCVDHFL8yydvFt5zunSgeEbhHu6rkHlOI8NEjzMtz/NasPYB8bEgtBNe4I7FgjuSMx6KPgzFcaIVm0sls7ZVlB1qi9EDrW5ZYB9qdbBW0VlPxdnnW5GGQ8DeDwXyNJwc3tOjiIpmJ1MnluVTcXJAAR5mfKkGC7dhd7ygsrJJQPNAmpDZd/evj/DyiaGT3Plbt+Zz5NG6H6yHqkz2L7Ms4xcd/5/GalE93QPsF6Ax9e84vAnMwnNT8dTu49Kg9RkZ/hNzGRmhHd9EKbCJJyXnQRDQTwyEDjk7z0xKebkY0rug6hwRmnvzXSt3MwnrBNaQy2rHsgKB7dtIl3TJhk+GGcjYp+uv3dpzZeCaiF/883va5NKOvi0h/JKLISPp7cwcL8kOnQ37J+52gBEzViQ81rW2N/ugatGeTbBSvZRtXdO9Pmuzk2WLRQG4r0nloJnBpETav4uT86mZ26IEAjjinW5MU2keg/5/B60greomrYlQoa3p/5G9eB+6tx0ECOWgsRMf3TmA59/HMJvQtitt5nqYVnHb2RJj2I5tqgGQRainRfYmE37t4Zar94lWY0aO4oJrYoOoWgN4rImzGhFkFn7hyja8TazaHukaL6EqPBZA8uM3ME7UexrEOy8yw9skvjORuC+eCKEO1tndOgy+2cDEEJWyu9SZcbtF9Kbh5ws7uTrp1yu6iwnfdQJEYoClxgUFs9OTiDJjPiXRXb9dEczWiqet4qduYW4LBTaW8tbg/Qshc8mlVnHbUOWi7aO9dpJ23N2IQoYgEA40dgFTOB30+57nv6k2s35B7j7YkdIfFv+/XP4IXdCIxiZj+p7YsohkB1Wdr5yQl4Hmi+PoptGUiGrpzPBxYR1sXSKCupj9LOD9Cn13wca4YZ32r7e1pgqCf3UO4NwcROQhfW7AHF0JuH/l99hPsOiwyxyZyhghbNN7/UW/i828jnBfhq8jwJU0G/19Uv5RXhy5vCNpBa68JgHrFZGKjbLoWH+Ycs4JQ/LG/m3U/GbY1Vq+cRKGZkxRTFHvqm1mM7tbuPUFPQ2gGvBQYdWNBhBCMmv+qk9YnrMNbfwDLdjlAj3/b9vXcE+w2qfm/RYzmoswKBl1sBiKhVnAmR0TX5uxe5m/Dn0L0qigi9yvdFNLJXA65GRGQEsZB+/nxN5V2fBQ904NJn0U4P5PcgCaWa/DAeRXYW6uEYVDx9KW5wgng95VZ0/ung/oT5hbpsroGH7WUdbvXjfqoVxnPUYWYiBzACDqXT5CjhlI1mntB6/G6DINocmArkM3wZTq7DVOZaUlx41oaub8VYIIX6Gg+3uQaA87+q9haMyBoOEdw4Jzp12qWw2Hw4uHguOuY/cdqjhefcam19g6Xt4as8hFKacIj5182L7/YH520I8fKif2+7Pojbh4VOfXFoUBpvd7HJLcg0192sHU9wsleMG55LCO6uRSWYjV8ZwUbC0PD8+aalfxbxBRl2xvor4m6BQ0cCt+lx/zFyXpJuEk/UJVBz0ZY0ELzfeAMm6uN/1jeicYXih6G7Ig3AAAAAAAAAAAAA==", // 👈 must be in /public
  },
  {
    id: 3,
    title: "Camera",
    watchers: 1,
    views: 9,
    price: 500,
    closingDate: "2025-07-12",
    image: "/shirt.jpg",
  },
];

export default function Page() {
  // const [filter, setFilter] = useState("all");
  const router = useRouter();
  const commonActions = (id) => [
    { label: "Promote listing", href: `/promote/${id}` },
    { label: "Edit listing", href: `/listing/viewlisting/${id}` },
    { label: "See similar", onClick: () => alert("Selling similar...") },
  ];

  const [filter, setFilter] = useState("all");
  const [allListings, setAllListings] = useState([]);
  const [filteredListings, setFilteredListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openWithdrawDialog, setOpenWithdrawDialog] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedListing, setSelectedListing] = useState(null);

  useEffect(() => {
    fetchListings();
  }, []);

  useEffect(() => {
    applyFilter();
  }, [filter, allListings]);

  const fetchListings = async () => {
    try {
      setLoading(true);
      const response = await listingsApi.getUserListings({});
      const listData = response || [];
      setAllListings(listData);
    } catch (error) {
      console.error("Failed to fetch listings:", error);
    } finally {
      setLoading(false);
    }
  };

  async function handleWithdraw(listing) {
    try {
      await listingsApi.withdrawListing(listing.slug);
      setOpenWithdrawDialog(false);
    } catch (error) {
      console.log("error", error);
    }
  }

  const applyFilter = () => {
    const now = new Date();
    let threshold;

    if (filter === "45d") {
      threshold = new Date(now.setDate(now.getDate() - 45));
    } else if (filter === "7d") {
      threshold = new Date(now.setDate(now.getDate() - 7));
    } else if (filter === "24h") {
      threshold = new Date(now.setHours(now.getHours() - 24));
    } else if (filter === "1h") {
      threshold = new Date(now.setHours(now.getHours() - 1));
    } else {
      setFilteredListings(allListings);
      return;
    }

    const filtered = allListings.filter((listing) => {
      const createdAt = new Date(listing.created_at);
      return createdAt >= threshold;
    });

    setFilteredListings(filtered);
  };

  const items = [
    { label: "Home", href: "/" },
    { label: "Account", href: "/account" },
    { label: "Selling" },
  ];
  const { t } = useTranslation();

  return (
    <div className="min-h-screen  text-gray-800">
      <Breadcrumbs
        items={items}
        styles={{
          nav: "flex justify-start text-sm font-medium bg-white border-b border-gray-200 py-2",
        }}
      />

      <h1 className="text-2xl font-bold text-green-600 uppercase mb-1 mt-5">
        {t("Selling")}{" "}
      </h1>
      <p className="text-sm mb-4 mt-3">
        {filteredListings.length} {t("listings")}
      </p>

      <div className="mb-4">
        <select
          className="border border-green-500 text-green-500 px-4 py-1 rounded-full text-sm hover:bg-green-50"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        >
          {filters.map((item) => (
            <option key={item.value} value={item.value}>
              {t(item.label)}{" "}
            </option>
          ))}
        </select>
      </div>

      {/* Listings */}
      {loading ? (
        <p className="text-sm text-gray-500">{t("Loading Listings...")}</p>
      ) : filteredListings.length === 0 ? (
        <p className="text-sm text-gray-500">{t("No listings found.")}</p>
      ) : (
        filteredListings.map((listing) => {
          const catSlug = listing.category?.slug?.includes("/")
            ? listing.category.slug.split("/").pop()
            : listing.category?.slug || "unknown";
            
          const handleSeeSimilar = async (listing) => {
            // Check listing.type first for service and job
            if (listing.type === "service") {
              router.push(`/services/${listing?.slug}`);
              return;
            }

            if (listing.type === "job") {
              router.push(`/jobs/${listing?.slug}`);
              return;
            }

            // Then check listing_type for marketplace, property, and motors
            switch (listing.listing_type) {
              case "marketplace":
                router.push(`/marketplace/${catSlug}/${listing?.slug}`);
                break;
              case "property":
              case "motors":
                router.push(`/${listing.listing_type}/${listing?.slug}`);
                break;
              default:
                console.warn(
                  "Unknown listing type:",
                  listing.listing_type,
                  listing.type
                );
                break;
            }
          };
          return (
            <ListingCard
              key={listing.id}
              listing={{
                id: listing.id,
                listing_type: listing.listing_type,
                bids: listing.bids || [],
                offers: listing.selling_offers || [],
                title: listing.title,
                price: listing.buy_now_price || "N/A",
                views: listing.view_count || 0,
                watchers: 0,
                slug: listing.slug,
                closingDate: listing.expire_at || "",
                image: listing.images?.[0]?.image_path
                  ? `${Image_URL}${listing.images[0].image_path}`
                  : "/default-image.jpg",
                link: `/marketplace/${catSlug}/${listing.slug}`,
              }}
              actions={[
                // { label: "Promote listing", href: `/promote/${listing?.id}` },
                {
                  label: t("Edit listing"),
                  href: `/listing/viewlisting?slug=${listing?.slug}`,
                },
                {
                  label: t("See similar"),
                  onClick: () => handleSeeSimilar(listing),
                },
              ]}
            />
          );
        })
      )}

      <WithdrawDialog
        isOpen={openWithdrawDialog}
        onClose={() => setOpenWithdrawDialog(false)}
        onWithdraw={() => handleWithdraw(selectedListing)}
      />
    </div>
  );
}
