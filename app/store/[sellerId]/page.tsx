import { Metadata } from 'next';
import { SellerStorefront } from "../../../views/SellerStorefront";
import { createServerClient } from '../../../lib/supabase/server';

interface Props {
    params: { sellerId: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const supabase = createServerClient();

    const { data: seller } = await supabase
        .from('profiles')
        .select('name, store_name, store_description, store_banner, avatar')
        .eq('id', params.sellerId)
        .single();

    if (!seller) {
        return {
            title: 'Store Not Found | Banolite',
            description: 'This store could not be found.',
        };
    }

    const storeName = seller.store_name || `${seller.name}'s Store`;
    const title = `${storeName} | Banolite`;
    const description = seller.store_description
        ? seller.store_description.slice(0, 160)
        : `Browse premium digital products from ${seller.name} on Banolite.`;

    const image = seller.store_banner || seller.avatar;

    return {
        title,
        description,
        openGraph: {
            title,
            description,
            images: image ? [{ url: image, width: 1200, height: 630 }] : [],
            type: 'website',
            siteName: 'Banolite',
        },
        twitter: {
            card: 'summary_large_image',
            title,
            description,
            images: image ? [image] : [],
        },
    };
}

export default function Page() {
    return <SellerStorefront />;
}
