import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
    const baseUrl = 'https://banolite.com';
    const staticRoutes = [
        '',
        '/discover',
        '/about',
        '/pricing',
        '/contact',
        '/coaching',
        '/events',
        '/privacy',
        '/terms',
    ];

    return staticRoutes.map((route) => ({
        url: `${baseUrl}${route}`,
        lastModified: new Date(),
        changeFrequency: 'weekly' as const,
        priority: route === '' ? 1.0 : 0.8,
    }));
}
