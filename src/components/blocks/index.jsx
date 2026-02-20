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
            settings.backgroundType === 'gradient' ? (
                settings.gradientColor1
                    ? `linear-gradient(${settings.gradientDirection || '135deg'}, ${settings.gradientColor1} 0%, ${settings.gradientColor2 || settings.gradientColor1} 100%)`
                    : settings.backgroundGradient
            ) : undefined,
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
            {content.overlayText && (
                <div className="absolute top-6 left-1/2 -translate-x-1/2 z-20 px-6 py-2 rounded-full text-sm font-medium tracking-wider uppercase"
                    style={{ backgroundColor: 'rgba(255,255,255,0.15)', color: '#ffffff', backdropFilter: 'blur(4px)' }}>
                    {content.overlayText}
                </div>
            )}
            <div className={`relative z-10 text-${settings.textAlign || 'center'} max-w-4xl mx-auto px-4`}>
                {content.showSubtitle !== false && (
                    <p
                        className="text-lg mb-4 uppercase tracking-widest"
                        style={{
                            fontFamily: theme?.fonts?.accent || 'Dancing Script',
                            color: styles.subtitleColor || theme?.colors?.textLight
                        }}
                    >
                        {content.subtitle || data.eventName || 'Wedding'}
                    </p>
                )}
                <h1
                    className="font-bold mb-6"
                    style={{
                        fontFamily: theme?.fonts?.heading || 'Playfair Display',
                        color: styles.titleColor || theme?.colors?.text,
                        fontSize: content.titleSize ? `${content.titleSize}px` : undefined,
                    }}
                >
                    {content.title || data.hostName || 'John & Jane'}
                </h1>
                {content.description && (
                    <p
                        className="text-lg mb-6 opacity-90 max-w-2xl mx-auto"
                        style={{
                            fontFamily: theme?.fonts?.body,
                            color: styles.subtitleColor || theme?.colors?.textLight
                        }}
                    >
                        {content.description}
                    </p>
                )}
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
                    className="text-3xl md:text-4xl font-bold mb-4"
                    style={{
                        fontFamily: theme?.fonts?.heading,
                        color: theme?.colors?.text
                    }}
                >
                    {content.heading || content.title || 'Event Details'}
                </h2>
                {content.description && (
                    <p className="text-lg mb-12 opacity-80" style={{ color: theme?.colors?.textLight, fontFamily: theme?.fonts?.body }}>
                        {content.description}
                    </p>
                )}
                {!content.description && <div className="mb-12" />}

                <div className={`grid ${content.layout === 'horizontal' ? 'md:grid-cols-3' : content.layout === 'card' ? 'md:grid-cols-3' : 'grid-cols-1'} gap-8`}>
                    {content.showDate !== false && (
                        <div className="p-6 rounded-xl" style={{ backgroundColor: theme?.colors?.background }}>
                            <div className="text-4xl mb-4">📅</div>
                            <h3 className="font-semibold text-lg mb-2" style={{ color: theme?.colors?.text }}>Date</h3>
                            <p style={{ color: theme?.colors?.textLight }}>
                                {(content.date || data.eventDate) ? new Date(content.date || data.eventDate).toLocaleDateString('en-US', {
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
                                {content.time || data.eventTime || 'TBD'}
                            </p>
                        </div>
                    )}

                    {content.showVenue !== false && (
                        <div className="p-6 rounded-xl" style={{ backgroundColor: theme?.colors?.background }}>
                            <div className="text-4xl mb-4">📍</div>
                            <h3 className="font-semibold text-lg mb-2" style={{ color: theme?.colors?.text }}>Venue</h3>
                            <p style={{ color: theme?.colors?.textLight }}>
                                {content.venue || data.venue || 'TBD'}
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
                    className="text-3xl md:text-4xl font-bold mb-4"
                    style={{ fontFamily: theme?.fonts?.heading, color: theme?.colors?.text }}
                >
                    {content.title || 'Venue'}
                </h2>
                {content.description && (
                    <p className="text-lg mb-6 opacity-80" style={{ color: theme?.colors?.textLight, fontFamily: theme?.fonts?.body }}>
                        {content.description}
                    </p>
                )}
                <p className="text-xl mb-2" style={{ color: theme?.colors?.text }}>
                    {content.venueName || data.venue || 'Venue Name'}
                </p>
                <p className="text-lg mb-4" style={{ color: theme?.colors?.textLight }}>
                    {content.venueAddress || data.venueAddress || 'Venue Address'}
                </p>

                {content.directions && (
                    <div className="mb-6 p-4 rounded-xl inline-block" style={{ backgroundColor: theme?.colors?.surface }}>
                        <p className="text-sm font-medium mb-1" style={{ color: theme?.colors?.text }}>🧭 How to reach</p>
                        <p className="text-sm" style={{ color: theme?.colors?.textLight }}>{content.directions}</p>
                    </div>
                )}

                {content.parkingInfo && (
                    <p className="text-sm mb-6" style={{ color: theme?.colors?.textLight }}>
                        🅿️ {content.parkingInfo}
                    </p>
                )}

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

    if (images.length === 0) {
        return (
            <motion.section
                className="py-16 md:py-24"
                style={bgStyle}
                initial={variants.initial}
                whileInView={variants.animate}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: settings.animationDelay || 0 }}
            >
                <div className="max-w-6xl mx-auto px-4 text-center">
                    <h2
                        className="text-3xl md:text-4xl font-bold mb-6"
                        style={{ fontFamily: theme?.fonts?.heading, color: theme?.colors?.text }}
                    >
                        {content.title || 'Gallery'}
                    </h2>
                    <div className="border-2 border-dashed rounded-xl p-12" style={{ borderColor: theme?.colors?.border || '#e5e7eb' }}>
                        <p className="text-lg" style={{ color: theme?.colors?.textLight || '#9ca3af' }}>
                            📷 Add images using the editor panel
                        </p>
                    </div>
                </div>
            </motion.section>
        );
    }

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
                    className="text-3xl md:text-4xl font-bold mb-4 text-center"
                    style={{ fontFamily: theme?.fonts?.heading, color: content.titleColor || theme?.colors?.text }}
                >
                    {content.title || 'Gallery'}
                </h2>
                {content.description && (
                    <p className="text-lg mb-8 text-center opacity-80" style={{ color: theme?.colors?.textLight, fontFamily: theme?.fonts?.body }}>
                        {content.description}
                    </p>
                )}
                {!content.description && <div className="mb-8" />}

                <div
                    className="grid gap-4"
                    style={{ gridTemplateColumns: `repeat(${content.columns || 3}, minmax(0, 1fr))` }}
                >
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
                    className="text-3xl md:text-4xl font-bold mb-4"
                    style={{ fontFamily: theme?.fonts?.heading, color: isEmbedded ? (theme?.colors?.text || '#1f2937') : '#ffffff' }}
                >
                    {content.title || 'Will You Join Us?'}
                </h2>
                <p
                    className="text-lg mb-2 opacity-90"
                    style={{ color: isEmbedded ? (theme?.colors?.textLight || '#6b7280') : '#ffffff' }}
                >
                    {content.subtitle || 'Please let us know if you can make it'}
                </p>
                {content.description && (
                    <p className="text-base mb-6 opacity-75"
                        style={{ color: isEmbedded ? (theme?.colors?.textLight || '#6b7280') : '#ffffffcc' }}>
                        {content.description}
                    </p>
                )}
                {!content.description && <div className="mb-6" />}

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
                {content.thankYouMessage && (
                    <p className="mt-6 text-sm opacity-70"
                        style={{ color: isEmbedded ? (theme?.colors?.textLight || '#6b7280') : '#ffffff', fontFamily: theme?.fonts?.accent }}>
                        {content.thankYouMessage}
                    </p>
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
                        color: theme?.colors?.textLight,
                        fontStyle: content.fontStyle || 'normal',
                    }}
                >
                    {content.text || data.message || 'Your message here...'}
                </p>
                {content.secondaryText && (
                    <p
                        className="text-base mt-6 opacity-80 leading-relaxed"
                        style={{ fontFamily: theme?.fonts?.body, color: theme?.colors?.textLight }}
                    >
                        {content.secondaryText}
                    </p>
                )}
                {content.author && (
                    <p
                        className="mt-6 text-lg"
                        style={{ fontFamily: theme?.fonts?.accent, color: theme?.colors?.primary }}
                    >
                        {content.author}
                    </p>
                )}
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
                    className="text-2xl mb-4"
                    style={{ fontFamily: theme?.fonts?.accent, color: theme?.colors?.primary }}
                >
                    {content.tagline || data.hostName || 'With Love'}
                </p>
                {content.secondaryText && (
                    <p className="text-base mb-4 opacity-80" style={{ color: theme?.colors?.textLight }}>
                        {content.secondaryText}
                    </p>
                )}
                {content.websiteUrl && (
                    <a
                        href={content.websiteUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-block mb-4 text-sm underline transition-colors"
                        style={{ color: theme?.colors?.primary }}
                    >
                        {content.websiteUrl}
                    </a>
                )}
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
    const dividerColor = content.color || theme?.colors?.border || '#e5e7eb';
    const thickness = content.thickness || '1px';

    return (
        <div className="py-8" style={bgStyle}>
            <div className="max-w-4xl mx-auto px-4 flex items-center justify-center">
                {content.style === 'ornament' ? (
                    <div className="text-4xl" style={{ color: dividerColor }}>✦ ✦ ✦</div>
                ) : content.style === 'dots' ? (
                    <div className="flex gap-2">
                        {[0, 1, 2].map(i => (
                            <div key={i} className="w-2 h-2 rounded-full" style={{ backgroundColor: theme?.colors?.primary }} />
                        ))}
                    </div>
                ) : content.style === 'wave' ? (
                    <svg width="120" height="20" viewBox="0 0 120 20" fill="none">
                        <path d="M0 10 C20 0, 40 20, 60 10 S100 0, 120 10" stroke={dividerColor} strokeWidth={thickness.replace('px', '')} fill="none" />
                    </svg>
                ) : (
                    <div className="w-24" style={{ height: thickness, backgroundColor: dividerColor }} />
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
    const style = content.style || 'minimal';

    const eventDate = new Date(data.eventDate);
    const now = new Date();
    const diff = eventDate - now;

    const days = Math.max(0, Math.floor(diff / (1000 * 60 * 60 * 24)));
    const hours = Math.max(0, Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)));
    const minutes = Math.max(0, Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)));

    const itemStyle = style === 'boxed'
        ? 'p-6 rounded-xl min-w-[120px] border-2'
        : style === 'flip'
            ? 'p-4 rounded-lg min-w-[100px] shadow-lg'
            : 'p-4 rounded-xl min-w-[100px]';

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
                    className="text-2xl font-bold mb-2"
                    style={{ fontFamily: theme?.fonts?.heading, color: theme?.colors?.text }}
                >
                    {content.title || 'Counting Down'}
                </h2>
                {content.subtitle && (
                    <p className="text-base mb-6 opacity-80" style={{ color: theme?.colors?.textLight, fontFamily: theme?.fonts?.body }}>
                        {content.subtitle}
                    </p>
                )}
                {!content.subtitle && <div className="mb-6" />}
                <div className="flex justify-center gap-6">
                    {[
                        { value: days, label: content.dayLabel || 'Days' },
                        { value: hours, label: content.hourLabel || 'Hours' },
                        { value: minutes, label: content.minLabel || 'Minutes' },
                    ].map((item) => (
                        <div
                            key={item.label}
                            className={itemStyle}
                            style={{
                                backgroundColor: theme?.colors?.background,
                                borderColor: style === 'boxed' ? theme?.colors?.primary : undefined,
                            }}
                        >
                            <div className="text-4xl font-bold" style={{ color: theme?.colors?.primary }}>
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

// QR Code Block  
export const QRCodeBlock = ({ block, data, theme }) => {
    const { settings = {}, content = {} } = block;
    const variants = getAnimationVariants(settings.animation);
    const bgStyle = getBackgroundStyles(settings, theme?.colors?.background);
    const size = content.size || 200;

    // Simple QR code placeholder using a styled div
    // In production, use a QR library like 'qrcode.react'
    const qrUrl = data.shareUrl || (data.slug
        ? `${window.location.origin}/invite/${data.slug}`
        : window.location.href);

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
                    className="text-2xl font-bold mb-6"
                    style={{ fontFamily: theme?.fonts?.heading, color: theme?.colors?.text }}
                >
                    {content.title || 'Scan to View'}
                </h2>
                <div className="inline-flex flex-col items-center gap-4">
                    <div
                        className="bg-white p-4 rounded-xl shadow-md border flex items-center justify-center"
                        style={{ width: size + 32, height: size + 32 }}
                    >
                        {/* Real QR Code via API */}
                        <img
                            src={`https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encodeURIComponent(qrUrl)}`}
                            alt="QR Code"
                            width={size}
                            height={size}
                            className="rounded"
                            style={{ imageRendering: 'pixelated' }}
                        />
                    </div>
                    {content.includeLabel && (
                        <p className="text-sm" style={{ color: theme?.colors?.textLight }}>
                            Scan with your phone camera
                        </p>
                    )}
                </div>
            </div>
        </motion.section>
    );
};

// Social Share Block
export const SocialShareBlock = ({ block, data, theme }) => {
    const { settings = {}, content = {} } = block;
    const variants = getAnimationVariants(settings.animation);
    const bgStyle = getBackgroundStyles(settings, theme?.colors?.surface);

    const shareUrl = data.shareUrl || window.location.href;
    const shareText = `You're invited to ${data.eventName || 'an event'}!`;

    const shareLinks = [
        content.whatsapp !== false && {
            label: 'WhatsApp',
            color: '#25D366',
            url: `https://wa.me/?text=${encodeURIComponent(shareText + ' ' + shareUrl)}`,
            icon: '💬',
        },
        content.facebook !== false && {
            label: 'Facebook',
            color: '#1877F2',
            url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,
            icon: '📘',
        },
        content.twitter !== false && {
            label: 'Twitter',
            color: '#1DA1F2',
            url: `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`,
            icon: '🐦',
        },
    ].filter(Boolean);

    const handleCopyLink = () => {
        navigator.clipboard?.writeText(shareUrl);
    };

    return (
        <motion.section
            className="py-12"
            style={bgStyle}
            initial={variants.initial}
            whileInView={variants.animate}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: settings.animationDelay || 0 }}
        >
            <div className="max-w-4xl mx-auto px-4 text-center">
                <h2
                    className="text-2xl font-bold mb-6"
                    style={{ fontFamily: theme?.fonts?.heading, color: theme?.colors?.text }}
                >
                    {content.title || 'Share This Invitation'}
                </h2>
                <div className="flex justify-center gap-4 flex-wrap">
                    {shareLinks.map((link) => (
                        <a
                            key={link.label}
                            href={link.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 px-5 py-3 rounded-full text-white font-medium text-sm transition-transform hover:scale-105"
                            style={{ backgroundColor: link.color }}
                        >
                            <span>{link.icon}</span>
                            {link.label}
                        </a>
                    ))}
                    {content.copyLink !== false && (
                        <button
                            onClick={handleCopyLink}
                            className="inline-flex items-center gap-2 px-5 py-3 rounded-full font-medium text-sm border-2 transition-transform hover:scale-105"
                            style={{ borderColor: theme?.colors?.primary, color: theme?.colors?.primary }}
                        >
                            📋 Copy Link
                        </button>
                    )}
                </div>
            </div>
        </motion.section>
    );
};

// YouTube Embed Block
export const YouTubeBlock = ({ block, data, theme }) => {
    const { settings = {}, content = {} } = block;
    const variants = getAnimationVariants(settings.animation);
    const bgStyle = getBackgroundStyles(settings, theme?.colors?.background);

    // Extract YouTube video ID from various URL formats
    const getYouTubeId = (url) => {
        if (!url) return null;
        const patterns = [
            /(?:youtube\.com\/watch\?v=)([\w-]+)/,
            /(?:youtu\.be\/)([\w-]+)/,
            /(?:youtube\.com\/embed\/)([\w-]+)/,
            /(?:youtube\.com\/shorts\/)([\w-]+)/,
        ];
        for (const pattern of patterns) {
            const match = url.match(pattern);
            if (match) return match[1];
        }
        return null;
    };

    const videoId = getYouTubeId(content.videoUrl);

    return (
        <motion.section
            className="py-16 md:py-24"
            style={bgStyle}
            initial={variants.initial}
            whileInView={variants.animate}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: settings.animationDelay || 0 }}
        >
            <div className="max-w-4xl mx-auto px-4">
                {content.title && (
                    <h2
                        className="text-3xl md:text-4xl font-bold mb-8 text-center"
                        style={{ fontFamily: theme?.fonts?.heading, color: theme?.colors?.text }}
                    >
                        {content.title}
                    </h2>
                )}
                {videoId ? (
                    <div
                        className="relative rounded-2xl overflow-hidden shadow-lg"
                        style={{ paddingBottom: content.aspectRatio === '1:1' ? '100%' : content.aspectRatio === '4:3' ? '75%' : '56.25%', height: 0 }}
                    >
                        <iframe
                            src={`https://www.youtube.com/embed/${videoId}?rel=0${content.autoplay ? '&autoplay=1&mute=1' : ''}`}
                            title={content.title || 'Video'}
                            className="absolute inset-0 w-full h-full"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                            style={{ border: 0 }}
                        />
                    </div>
                ) : (
                    <div className="border-2 border-dashed rounded-2xl p-12 text-center" style={{ borderColor: theme?.colors?.border || '#e5e7eb' }}>
                        <p className="text-lg" style={{ color: theme?.colors?.textLight || '#9ca3af' }}>
                            🎬 Paste a YouTube URL in the editor panel
                        </p>
                    </div>
                )}
                {content.caption && (
                    <p
                        className="mt-4 text-center text-sm"
                        style={{ color: theme?.colors?.textLight, fontFamily: theme?.fonts?.body }}
                    >
                        {content.caption}
                    </p>
                )}
            </div>
        </motion.section>
    );
};

// Full Image Block — for users who have a pre-designed invitation image
export const FullImageBlock = ({ block, data, theme }) => {
    const { settings = {}, content = {} } = block;
    const variants = getAnimationVariants(settings.animation);
    const bgStyle = getBackgroundStyles(settings, theme?.colors?.background);

    return (
        <motion.section
            className="py-8 md:py-12"
            style={bgStyle}
            initial={variants.initial}
            whileInView={variants.animate}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: settings.animationDelay || 0 }}
        >
            <div className="max-w-5xl mx-auto px-4">
                {content.title && (
                    <h2
                        className="text-3xl md:text-4xl font-bold mb-6 text-center"
                        style={{ fontFamily: theme?.fonts?.heading, color: theme?.colors?.text }}
                    >
                        {content.title}
                    </h2>
                )}
                {content.imageUrl ? (
                    <div className="rounded-2xl overflow-hidden shadow-lg">
                        <img
                            src={content.imageUrl}
                            alt={content.altText || content.title || 'Invitation Image'}
                            className="w-full object-contain"
                            style={{
                                maxHeight: content.maxHeight || '800px',
                                objectFit: content.objectFit || 'contain',
                            }}
                        />
                    </div>
                ) : (
                    <div className="border-2 border-dashed rounded-2xl p-16 text-center" style={{ borderColor: theme?.colors?.border || '#e5e7eb' }}>
                        <p className="text-lg" style={{ color: theme?.colors?.textLight || '#9ca3af' }}>
                            🖼️ Paste an image URL in the editor panel
                        </p>
                    </div>
                )}
                {content.caption && (
                    <p
                        className="mt-4 text-center text-sm"
                        style={{ color: theme?.colors?.textLight, fontFamily: theme?.fonts?.body }}
                    >
                        {content.caption}
                    </p>
                )}
            </div>
        </motion.section>
    );
};

// PDF Block — embed a PDF document
export const PDFBlock = ({ block, data, theme }) => {
    const { settings = {}, content = {} } = block;
    const variants = getAnimationVariants(settings.animation);
    const bgStyle = getBackgroundStyles(settings, theme?.colors?.background);

    return (
        <motion.section
            className="py-12 md:py-16"
            style={bgStyle}
            initial={variants.initial}
            whileInView={variants.animate}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: settings.animationDelay || 0 }}
        >
            <div className="max-w-4xl mx-auto px-4">
                {content.title && (
                    <h2
                        className="text-3xl md:text-4xl font-bold mb-6 text-center"
                        style={{ fontFamily: theme?.fonts?.heading, color: theme?.colors?.text }}
                    >
                        {content.title}
                    </h2>
                )}
                {content.pdfUrl ? (
                    <div className="rounded-2xl overflow-hidden shadow-lg border" style={{ borderColor: theme?.colors?.border || '#e5e7eb' }}>
                        <iframe
                            src={content.pdfUrl}
                            title={content.title || 'PDF Document'}
                            width="100%"
                            style={{ height: content.height || '600px', border: 0 }}
                            loading="lazy"
                        />
                    </div>
                ) : (
                    <div className="border-2 border-dashed rounded-2xl p-16 text-center" style={{ borderColor: theme?.colors?.border || '#e5e7eb' }}>
                        <p className="text-lg" style={{ color: theme?.colors?.textLight || '#9ca3af' }}>
                            📄 Paste a PDF URL in the editor panel
                        </p>
                    </div>
                )}
                {content.caption && (
                    <p
                        className="mt-4 text-center text-sm"
                        style={{ color: theme?.colors?.textLight, fontFamily: theme?.fonts?.body }}
                    >
                        {content.caption}
                    </p>
                )}
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
    QRCodeBlock,
    SocialShareBlock,
    YouTubeBlock,
    FullImageBlock,
    PDFBlock,
};
