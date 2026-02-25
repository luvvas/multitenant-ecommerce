import configPromise from "@payload-config";
import { getPayload } from 'payload';

import { Category } from "@/payload-types";
import { Footer } from "./footer";
import { Navbar } from "./navbar";
import { SearchFilters } from "./search-filters";

interface Props {
    children: React.ReactNode
}

const layout = async ({ children }: Props) => {
    const payload = await getPayload({ config: configPromise })

    const data = await payload.find({
        collection: 'categories',
        depth: 1, // Populate subcategories
        pagination: false,
        where: {
            parent: {
                exists: false
            }
        }
    });

    const formattedData = data.docs.map((doc: any) => {
        return {
            ...doc,
            subcategories: (doc.subcategories?.docs ?? []).map((doc: Category) => ({
                // Because of depth: 1
                ...(doc as Category),
                subcategories: undefined
            })) || []
        }
    })

    console.log({
        data,
        formattedData
    })

    return (
        <div className="flex flex-col min-h-screen">
            <Navbar />
            <SearchFilters data={formattedData} />
            <div className="flex-1 bg-[#f4f4f0]">
                {children}
            </div>
            <Footer />
        </div>
    )
}

export default layout