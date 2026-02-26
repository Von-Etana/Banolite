import { Metadata } from 'next';
import { ProductDetail } from "../../../views/ProductDetail";
import { createServerClient } from '../../../lib/supabase/server';

interface Props {
    params: { id: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const supabase = createServerClient();

    const { data: product } = await supabase
        .from('products')
        .select('title, description, cover_url, creator, price, type, rating')
        .eq('id', params.id)
        .single();

    if (!product) {
        return {
            title: 'Product Not Found | Banolite',
            description: 'This product could not be found.',
        };
    }

    const title = `${product.title} by ${product.creator} | Banolite`;
    const description = product.description
        ? product.description.slice(0, 160)
        : `Get "${product.title}" — a premium ${product.type?.toLowerCase() || 'digital product'} by ${product.creator}. Only $${product.price}.`;

    return {
        title,
        description,
        openGraph: {
            title,
            description,
            images: product.cover_url ? [{ url: product.cover_url, width: 800, height: 600 }] : [],
            type: 'website',
            siteName: 'Banolite',
        },
        twitter: {
            card: 'summary_large_image',
            title,
            description,
            images: product.cover_url ? [product.cover_url] : [],
        },
    };
}

export default function Page() {
    return <ProductDetail />;
}
