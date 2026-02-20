import {
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
} from './index';

// Map block types to components
const blockComponents = {
    hero: HeroBlock,
    eventDetails: EventDetailsBlock,
    venue: VenueBlock,
    gallery: GalleryBlock,
    rsvp: RSVPBlock,
    message: MessageBlock,
    footer: FooterBlock,
    divider: DividerBlock,
    countdown: CountdownBlock,
    qrcode: QRCodeBlock,
    socialShare: SocialShareBlock,
    youtube: YouTubeBlock,
    fullImage: FullImageBlock,
    pdf: PDFBlock,
};

/**
 * BlockRenderer - Renders a single block based on its type
 * @param {Object} block - Block configuration object
 * @param {Object} data - Invitation content data
 * @param {Object} theme - Theme settings
 * @param {Function} onRSVP - RSVP callback for RSVP blocks
 * @param {Boolean} isEditing - Whether in edit mode
 * @param {Function} onBlockClick - Callback when block is clicked (for editing)
 * @param {Boolean} isSelected - Whether this block is currently selected
 */
const BlockRenderer = ({
    block,
    data = {},
    theme = {},
    onRSVP,
    isEditing = false,
    onBlockClick,
    isSelected = false,
    invitationId,
}) => {
    const BlockComponent = blockComponents[block.type];

    if (!BlockComponent) {
        console.warn(`Unknown block type: ${block.type}`);
        return null;
    }

    if (isEditing) {
        return (
            <div
                className={`relative cursor-pointer transition-all ${isSelected
                    ? 'ring-4 ring-indigo-500 ring-offset-2'
                    : 'hover:ring-2 hover:ring-indigo-300'
                    }`}
                onClick={() => onBlockClick?.(block)}
            >
                {/* Block type label */}
                <div className="absolute top-2 left-2 z-20 px-2 py-1 bg-indigo-600 text-white text-xs font-medium rounded capitalize">
                    {block.type}
                </div>

                <BlockComponent
                    block={block}
                    data={data}
                    theme={theme}
                    onRSVP={onRSVP}
                    isEditing={isEditing}
                    invitationId={invitationId}
                />
            </div>
        );
    }

    return (
        <BlockComponent
            block={block}
            data={data}
            theme={theme}
            onRSVP={onRSVP}
            invitationId={invitationId}
        />
    );
};

/**
 * BlocksRenderer - Renders all blocks in order
 */
export const BlocksRenderer = ({
    blocks = [],
    data = {},
    theme = {},
    onRSVP,
    isEditing = false,
    selectedBlockId,
    onBlockClick,
    invitationId,
}) => {
    // Sort blocks by order
    const sortedBlocks = [...blocks].sort((a, b) => a.order - b.order);

    return (
        <div className="blocks-container">
            {sortedBlocks.map((block) => (
                <BlockRenderer
                    key={block.id}
                    block={block}
                    data={data}
                    theme={theme}
                    onRSVP={onRSVP}
                    isEditing={isEditing}
                    isSelected={selectedBlockId === block.id}
                    onBlockClick={onBlockClick}
                    invitationId={invitationId}
                />
            ))}
        </div>
    );
};

export default BlockRenderer;
