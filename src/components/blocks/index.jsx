import { motion } from 'framer-motion';
import RSVPForm from '../invitation/RSVPForm';

// Animation variants based on animation type
const getAnimationVariants = (animation) => {
    const variants = {
        'none': { initial: {}, animate: {} },
        'fade-up': {
            initial: { opacity: 0, y: 30 },
            animate: { opacity: 1, y: 0 },
        },
        'fade-in': {
            initial: { opacity: 0 },
            animate: { opacity: 1 },
        },
        'slide-left': {
            initial: { opacity: 0, x: -50 },
            animate: { opacity: 1, x: 0 },
        },
        'slide-right': {
            initial: { opacity: 0, x: 50 },
            animate: { opacity: 1, x: 0 },
        },
        'zoom': {
            initial: { opacity: 0, scale: 0.9 },
            animate: { opacity: 1, scale: 1 },
        },
    };
    return variants[animation] || variants['fade-up'];
};

// Helper for consistent background styles
const getBackgroundStyles = (settings, defaultColor) => {
    return {
        backgroundColor: settings.backgroundType === 'solid' ? (settings.backgroundColor || defaultColor) : undefined,
        backgroundImage: settings.backgroundType === 'image' ? `url(${settings.backgroundImage})` :
            settings.backgroundType === 'gradient' ? settings.backgroundGradient : undefined,
        backgroundSize: settings.backgroundSize || 'cover',
        backgroundPosition: settings.backgroundPosition || 'center',
        backgroundRepeat: 'no-repeat',
        // Fallback color if image fails to load or while loading
        ...(settings.backgroundType === 'image' && { backgroundColor: settings.backgroundColor || defaultColor }),
    };
};

// Hero Block - Main header with background
export const HeroBlock = ({ block, data, theme, isEditing }) => {
    const { settings = {}, content = {}, styles = {} } = block;

    const bgStyle = {
        ...getBackgroundStyles(settings, '#1f2937'),
        minHeight: settings.height || '100vh',
        padding: settings.padding || '4rem',
    };

    const variants = getAnimationVariants(settings.animation);

    return (
        <motion.section
            className="relative flex items-center justify-center"
            style={bgStyle}
            initial={variants.initial}
            whileInView={variants.animate}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: settings.animationDelay || 0 }}
        >
            {settings.overlayEnabled && (
                <div
                    className="absolute inset-0"
                    style={{
                        backgroundColor: settings.overlayColor,
                        opacity: settings.overlayOpacity,
                    }}
                />
            )}
            <div className={`relative z-10 text-${settings.textAlign || 'center'} max-w-4xl mx-auto px-4`}>
                {content.showSubtitle !== false && (
                    <p
                        className="text-lg mb-4"
                        style={{
                            fontFamily: theme?.fonts?.accent || 'Dancing Script',
                            color: styles.subtitleColor || theme?.colors?.textLight
                        }}
                    >
                        {data.hostName || content.subtitle || 'Welcome'}
                    </p>
                )}
                <h1
                    className="text-5xl md:text-7xl font-bold mb-6"
                    style={{
                        fontFamily: theme?.fonts?.heading || 'Playfair Display',
                        color: styles.titleColor || theme?.colors?.text
                    }}
                >
                    {data.eventName || content.title || 'Beautiful Celebration'}
                </h1>
                {content.showDate !== false && data.eventDate && (
                    <p
                        className="text-2xl"
                        style={{
                            fontFamily: theme?.fonts?.body,
                            color: styles.dateColor || theme?.colors?.primary
                        }}
                    >
                        {new Date(data.eventDate).toLocaleDateString('en-US', {
                            weekday: 'long',
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                        })}
                    </p>
                )}
                {content.showButton && (
                    <a
                        href="#rsvp"
                        className="inline-block mt-8 px-8 py-3 rounded-full font-medium transition-transform hover:scale-105"
                        style={{
                            backgroundColor: theme?.colors?.primary,
                            color: '#ffffff',
                        }}
                    >
                        {content.buttonText || 'RSVP Now'}
                    </a>
                )}
            </div>
        </motion.section>
    );
};

// Event Details Block
export const EventDetailsBlock = ({ block, data, theme }) => {
    const { settings = {}, content = {}, styles = {} } = block;
    const variants = getAnimationVariants(settings.animation);
    const bgStyle = getBackgroundStyles(settings, theme?.colors?.surface);

    return (
        <motion.section
            className="py-16 md:py-24"
            style={{
                ...bgStyle,
                textAlign: settings.textAlign || 'center',
            }}
            initial={variants.initial}
            whileInView={variants.animate}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: settings.animationDelay || 0 }}
        >
            <div className="max-w-4xl mx-auto px-4">
                <h2
                    className="text-3xl md:text-4xl font-bold mb-12"
                    style={{
                        fontFamily: theme?.fonts?.heading,
                        color: theme?.colors?.text
                    }}
                >
                    {content.title || 'Event Details'}
                </h2>

                <div className={`grid ${content.layout === 'horizontal' ? 'md:grid-cols-3' : 'grid-cols-1'} gap-8`}>
                    {content.showDate !== false && (
                        <div className="p-6 rounded-xl" style={{ backgroundColor: theme?.colors?.background }}>
                            <div className="text-4xl mb-4">📅</div>
                            <h3 className="font-semibold text-lg mb-2" style={{ color: theme?.colors?.text }}>Date</h3>
                            <p style={{ color: theme?.colors?.textLight }}>
                                {data.eventDate ? new Date(data.eventDate).toLocaleDateString('en-US', {
                                    month: 'long',
                                    day: 'numeric',
                                    year: 'numeric'
                                }) : 'TBD'}
                            </p>
                        </div>
                    )}

                    {content.showTime !== false && (
                        <div className="p-6 rounded-xl" style={{ backgroundColor: theme?.colors?.background }}>
                            <div className="text-4xl mb-4">🕐</div>
                            <h3 className="font-semibold text-lg mb-2" style={{ color: theme?.colors?.text }}>Time</h3>
                            <p style={{ color: theme?.colors?.textLight }}>
                                {data.eventTime || 'TBD'}
                            </p>
                        </div>
                    )}

                    {content.showVenue !== false && (
                        <div className="p-6 rounded-xl" style={{ backgroundColor: theme?.colors?.background }}>
                            <div className="text-4xl mb-4">📍</div>
                            <h3 className="font-semibold text-lg mb-2" style={{ color: theme?.colors?.text }}>Venue</h3>
                            <p style={{ color: theme?.colors?.textLight }}>
                                {data.venue || 'TBD'}
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </motion.section>
    );
};

// Venue Block with optional map
export const VenueBlock = ({ block, data, theme }) => {
    const { settings = {}, content = {} } = block;
    const variants = getAnimationVariants(settings.animation);
    const bgStyle = getBackgroundStyles(settings, theme?.colors?.background);

    return (
        <motion.section
            className="py-16 md:py-24"
            style={bgStyle}
            initial={variants.initial}
            whileInView={variants.animate}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: settings.animationDelay || 0 }}
        >
            <div className="max-w-4xl mx-auto px-4 text-center">
                <h2
                    className="text-3xl md:text-4xl font-bold mb-6"
                    style={{ fontFamily: theme?.fonts?.heading, color: theme?.colors?.text }}
                >
                    {content.title || 'Venue'}
                </h2>
                <p className="text-xl mb-2" style={{ color: theme?.colors?.text }}>
                    {data.venue || 'Venue Name'}
                </p>
                <p className="text-lg mb-8" style={{ color: theme?.colors?.textLight }}>
                    {data.venueAddress || 'Venue Address'}
                </p>

                {content.showMap && data.googleMapsLink && (
                    <div className="rounded-xl overflow-hidden" style={{ height: content.mapHeight || '400px' }}>
                        <iframe
                            src={data.googleMapsLink}
                            width="100%"
                            height="100%"
                            style={{ border: 0 }}
                            allowFullScreen=""
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"
                        />
                    </div>
                )}

                {data.googleMapsLink && (
                    <a
                        href={data.googleMapsLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-block mt-6 px-6 py-3 rounded-lg font-medium transition-colors"
                        style={{
                            backgroundColor: theme?.colors?.primary,
                            color: '#ffffff',
                        }}
                    >
                        Get Directions
                    </a>
                )}
            </div>
        </motion.section>
    );
};

// Gallery Block
export const GalleryBlock = ({ block, data, theme }) => {
    const { settings = {}, content = {} } = block;
    const images = content.images || data.images || [];
    const variants = getAnimationVariants(settings.animation);
    const bgStyle = getBackgroundStyles(settings, theme?.colors?.surface);

    if (images.length === 0) return null;

    return (
        <motion.section
            className="py-16 md:py-24"
            style={bgStyle}
            initial={variants.initial}
            whileInView={variants.animate}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: settings.animationDelay || 0 }}
        >
            <div className="max-w-6xl mx-auto px-4">
                <h2
                    className="text-3xl md:text-4xl font-bold mb-12 text-center"
                    style={{ fontFamily: theme?.fonts?.heading, color: theme?.colors?.text }}
                >
                    {content.title || 'Gallery'}
                </h2>

                <div className={`grid ${content.layout === 'carousel' ? 'grid-cols-1' : 'grid-cols-2 md:grid-cols-3'} gap-4`}>
                    {images.map((img, index) => (
                        <motion.div
                            key={index}
                            className="rounded-xl overflow-hidden"
                            whileHover={{ scale: 1.02 }}
                            transition={{ duration: 0.2 }}
                        >
                            <img
                                src={img}
                                alt={`Gallery ${index + 1}`}
                                className="w-full h-64 object-cover"
                            />
                        </motion.div>
                    ))}
                </div>
            </div>
        </motion.section>
    );
};

// RSVP Block
export const RSVPBlock = ({ block, data, theme, onRSVP, invitationId }) => {
    const { settings = {}, content = {} } = block;
    const variants = getAnimationVariants(settings.animation);
    const bgStyle = getBackgroundStyles(settings, theme?.colors?.primary);
    const isEmbedded = settings.rsvpStyle === 'embedded';

    return (
        <motion.section
            id="rsvp"
            className="py-16 md:py-24"
            style={bgStyle}
            initial={variants.initial}
            whileInView={variants.animate}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: settings.animationDelay || 0 }}
        >
            <div className="max-w-2xl mx-auto px-4 text-center">
                <h2
                    className="text-3xl md:text-4xl font-bold mb-6"
                    style={{ fontFamily: theme?.fonts?.heading, color: isEmbedded ? (theme?.colors?.text || '#1f2937') : '#ffffff' }}
                >
                    {content.title || 'Will You Join Us?'}
                </h2>
                <p
                    className="text-lg mb-8 opacity-90"
                    style={{ color: isEmbedded ? (theme?.colors?.textLight || '#6b7280') : '#ffffff' }}
                >
                    {content.subtitle || 'Please let us know if you can make it'}
                </p>

                {isEmbedded ? (
                    <div className="bg-white p-8 rounded-xl shadow-xl max-w-lg mx-auto">
                        <RSVPForm
                            invitationId={invitationId}
                            onSuccess={onRSVP}
                            isPreview={!invitationId}
                        />
                    </div>
                ) : (
                    <button
                        onClick={onRSVP}
                        className="px-10 py-4 text-lg font-semibold rounded-full transition-transform hover:scale-105"
                        style={{
                            backgroundColor: '#ffffff',
                            color: theme?.colors?.primary,
                        }}
                    >
                        {content.buttonText || 'RSVP Now'}
                    </button>
                )}
            </div>
        </motion.section>
    );
};

// Message Block
export const MessageBlock = ({ block, data, theme }) => {
    const { settings = {}, content = {} } = block;
    const variants = getAnimationVariants(settings.animation);
    const bgStyle = getBackgroundStyles(settings, theme?.colors?.background);

    return (
        <motion.section
            className="py-16 md:py-24"
            style={bgStyle}
            initial={variants.initial}
            whileInView={variants.animate}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: settings.animationDelay || 0 }}
        >
            <div className="max-w-3xl mx-auto px-4 text-center">
                {content.title && (
                    <h2
                        className="text-3xl font-bold mb-8"
                        style={{ fontFamily: theme?.fonts?.heading, color: theme?.colors?.text }}
                    >
                        {content.title}
                    </h2>
                )}
                <p
                    className="text-xl leading-relaxed"
                    style={{
                        fontFamily: content.useAccentFont ? theme?.fonts?.accent : theme?.fonts?.body,
                        color: theme?.colors?.textLight
                    }}
                >
                    {data.message || content.text || 'Your message here...'}
                </p>
            </div>
        </motion.section>
    );
};

// Footer Block
export const FooterBlock = ({ block, data, theme }) => {
    const { settings = {}, content = {} } = block;
    const variants = getAnimationVariants(settings.animation);
    const bgStyle = getBackgroundStyles(settings, theme?.colors?.surface);

    return (
        <motion.footer
            className="py-12"
            style={bgStyle}
            initial={variants.initial}
            whileInView={variants.animate}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: settings.animationDelay || 0 }}
        >
            <div className="max-w-4xl mx-auto px-4 text-center">
                {content.showContact && data.hostContact && (
                    <p className="mb-4" style={{ color: theme?.colors?.textLight }}>
                        Contact: {data.hostContact}
                    </p>
                )}
                <p
                    className="text-2xl mb-6"
                    style={{ fontFamily: theme?.fonts?.accent, color: theme?.colors?.primary }}
                >
                    {content.tagline || data.hostName || 'With Love'}
                </p>
                <p className="text-sm" style={{ color: theme?.colors?.textLight }}>
                    {content.copyright || `Made with ❤️ using Invite Me`}
                </p>
            </div>
        </motion.footer>
    );
};

// Divider Block
export const DividerBlock = ({ block, theme }) => {
    const { settings = {}, content = {} } = block;
    const bgStyle = getBackgroundStyles(settings, 'transparent');

    return (
        <div
            className="py-8"
            style={bgStyle}
        >
            <div className="max-w-4xl mx-auto px-4 flex items-center justify-center">
                {content.style === 'ornament' ? (
                    <div className="text-4xl">✦ ✦ ✦</div>
                ) : content.style === 'dots' ? (
                    <div className="flex gap-2">
                        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: theme?.colors?.primary }} />
                        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: theme?.colors?.primary }} />
                        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: theme?.colors?.primary }} />
                    </div>
                ) : (
                    <div
                        className="w-24 h-0.5"
                        style={{ backgroundColor: theme?.colors?.border }}
                    />
                )}
            </div>
        </div>
    );
};

// Countdown Block
export const CountdownBlock = ({ block, data, theme }) => {
    const { settings = {}, content = {} } = block;
    const variants = getAnimationVariants(settings.animation);
    const bgStyle = getBackgroundStyles(settings, theme?.colors?.surface);

    // Calculate time remaining
    const eventDate = new Date(data.eventDate);
    const now = new Date();
    const diff = eventDate - now;

    const days = Math.max(0, Math.floor(diff / (1000 * 60 * 60 * 24)));
    const hours = Math.max(0, Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)));
    const minutes = Math.max(0, Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)));

    return (
        <motion.section
            className="py-16"
            style={bgStyle}
            initial={variants.initial}
            whileInView={variants.animate}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: settings.animationDelay || 0 }}
        >
            <div className="max-w-4xl mx-auto px-4 text-center">
                <h2
                    className="text-2xl font-bold mb-8"
                    style={{ fontFamily: theme?.fonts?.heading, color: theme?.colors?.text }}
                >
                    {content.title || 'Counting Down'}
                </h2>
                <div className="flex justify-center gap-6">
                    {[
                        { value: days, label: 'Days' },
                        { value: hours, label: 'Hours' },
                        { value: minutes, label: 'Minutes' },
                    ].map((item) => (
                        <div
                            key={item.label}
                            className="p-4 rounded-xl min-w-[100px]"
                            style={{ backgroundColor: theme?.colors?.background }}
                        >
                            <div
                                className="text-4xl font-bold"
                                style={{ color: theme?.colors?.primary }}
                            >
                                {item.value}
                            </div>
                            <div style={{ color: theme?.colors?.textLight }}>{item.label}</div>
                        </div>
                    ))}
                </div>
            </div>
        </motion.section>
    );
};

export default {
    HeroBlock,
    EventDetailsBlock,
    VenueBlock,
    GalleryBlock,
    RSVPBlock,
    MessageBlock,
    FooterBlock,
    DividerBlock,
    CountdownBlock,
};
