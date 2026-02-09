import { Helmet } from 'react-helmet-async';

const SEO = ({
    title = 'Invite Me - Create Beautiful Digital Invitations',
    description = 'Create stunning digital invitations for weddings, birthdays, parties, and more. Beautiful templates, easy customization, and seamless RSVP tracking.',
    image = '/og-image.jpg',
    url = '',
    type = 'website',
    keywords = 'digital invitations, online invitations, wedding invitations, birthday invitations, RSVP, event planning',
}) => {
    const siteUrl = import.meta.env.VITE_SITE_URL || 'https://inviteme.app';
    const fullUrl = url ? `${siteUrl}${url}` : siteUrl;
    const fullImage = image.startsWith('http') ? image : `${siteUrl}${image}`;

    return (
        <Helmet>
            {/* Basic Meta Tags */}
            <title>{title}</title>
            <meta name="description" content={description} />
            <meta name="keywords" content={keywords} />
            <link rel="canonical" href={fullUrl} />

            {/* Open Graph / Facebook */}
            <meta property="og:type" content={type} />
            <meta property="og:url" content={fullUrl} />
            <meta property="og:title" content={title} />
            <meta property="og:description" content={description} />
            <meta property="og:image" content={fullImage} />

            {/* Twitter */}
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:url" content={fullUrl} />
            <meta name="twitter:title" content={title} />
            <meta name="twitter:description" content={description} />
            <meta name="twitter:image" content={fullImage} />

            {/* Mobile */}
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            <meta name="theme-color" content="#6366f1" />
        </Helmet>
    );
};

export default SEO;
