import { useState, useCallback, useRef } from 'react';
import {
    ArrowLeft, Save, Eye, Plus, Trash2, Copy, ChevronUp, ChevronDown,
    Image, Type, Calendar, MapPin, Users, MessageSquare,
    Layout, Divide, Timer, Palette, Settings2, Check, Undo2, Redo2,
    Smartphone, Monitor, Lock, QrCode, Share2, Layers,
    GripVertical, AlertCircle, Video, X
} from 'lucide-react';
import { toast } from 'react-toastify';
import { Button } from '../../components/ui';
import { BlocksRenderer } from '../../components/blocks/BlockRenderer';

// ─── Feature Access Config (Freemium Gating) ───
const FEATURE_ACCESS = {
    // Block types
    blockTypes: {
        free: ['hero', 'eventDetails', 'venue', 'rsvp', 'message', 'countdown', 'divider', 'footer'],
        paid: ['hero', 'eventDetails', 'venue', 'gallery', 'rsvp', 'message', 'countdown', 'divider', 'footer', 'qrcode', 'socialShare', 'youtube'],
        scratch: ['hero', 'eventDetails', 'venue', 'gallery', 'rsvp', 'message', 'countdown', 'divider', 'footer', 'qrcode', 'socialShare', 'youtube'],
    },
    // Settings features
    features: {
        free: ['solidBackground', 'textAlign', 'height', 'contentEdit', 'preview', 'undoRedo'],
        paid: ['solidBackground', 'gradientBackground', 'imageBackground', 'overlay', 'animation', 'padding', 'textAlign', 'height', 'contentEdit', 'preview', 'undoRedo', 'reorder', 'duplicate', 'fonts', 'allColors'],
        scratch: ['solidBackground', 'gradientBackground', 'imageBackground', 'overlay', 'animation', 'padding', 'textAlign', 'height', 'contentEdit', 'preview', 'undoRedo', 'reorder', 'duplicate', 'fonts', 'allColors'],
    },
    // Theme colors available
    themeColors: {
        free: ['primary', 'accent'],
        paid: ['primary', 'secondary', 'accent', 'background', 'surface', 'text', 'textLight', 'border'],
        scratch: ['primary', 'secondary', 'accent', 'background', 'surface', 'text', 'textLight', 'border'],
    },
};

const hasFeature = (planType, feature) => {
    return (FEATURE_ACCESS.features[planType] || FEATURE_ACCESS.features.free).includes(feature);
};

const isBlockAllowed = (planType, blockType) => {
    return (FEATURE_ACCESS.blockTypes[planType] || FEATURE_ACCESS.blockTypes.free).includes(blockType);
};

const getAllowedColors = (planType) => {
    return FEATURE_ACCESS.themeColors[planType] || FEATURE_ACCESS.themeColors.free;
};

// ─── Generate unique ID ───
const generateId = () => crypto.randomUUID().slice(0, 8);

// ─── Block type definitions with icons ───
const BLOCK_TYPES = [
    { type: 'hero', label: 'Hero', icon: Image, description: 'Main header with background' },
    { type: 'eventDetails', label: 'Event Details', icon: Calendar, description: 'Date, time & venue cards' },
    { type: 'venue', label: 'Venue', icon: MapPin, description: 'Location with map option' },
    { type: 'gallery', label: 'Gallery', icon: Layout, description: 'Photo gallery grid' },
    { type: 'rsvp', label: 'RSVP', icon: Users, description: 'Response button section' },
    { type: 'message', label: 'Message', icon: MessageSquare, description: 'Custom text block' },
    { type: 'countdown', label: 'Countdown', icon: Timer, description: 'Event countdown timer' },
    { type: 'divider', label: 'Divider', icon: Divide, description: 'Section separator' },
    { type: 'footer', label: 'Footer', icon: Type, description: 'Contact & credits' },
    { type: 'qrcode', label: 'QR Code', icon: QrCode, description: 'Scannable QR code' },
    { type: 'socialShare', label: 'Social Share', icon: Share2, description: 'Share buttons' },
    { type: 'youtube', label: 'YouTube Video', icon: Video, description: 'Embed YouTube video' },
];

// ─── Default block settings ───
const getDefaultBlock = (type) => ({
    id: generateId(),
    type,
    order: 0,
    settings: {
        height: type === 'hero' ? '100vh' : 'auto',
        padding: '4rem',
        backgroundType: 'solid',
        backgroundColor: type === 'hero' ? '#1f2937' : '#ffffff',
        backgroundGradient: '',
        gradientColor1: '#667eea',
        gradientColor2: '#764ba2',
        gradientDirection: '135deg',
        overlayEnabled: type === 'hero',
        overlayColor: '#000000',
        overlayOpacity: 0.3,
        textAlign: 'center',
        animation: 'fade-up',
        animationDelay: 0,
    },
    content: getDefaultContent(type),
});

const getDefaultContent = (type) => {
    switch (type) {
        case 'hero':
            return { title: '{{hostName}}', subtitle: '{{eventName}}', showDate: true, showButton: true, buttonText: 'RSVP Now' };
        case 'eventDetails':
            return { title: 'Event Details', showDate: true, showTime: true, showVenue: true, layout: 'horizontal' };
        case 'venue':
            return { title: 'Venue', showMap: true, mapHeight: '400px' };
        case 'gallery':
            return { title: 'Gallery', images: [], layout: 'grid', columns: 3, gap: '8px' };
        case 'rsvp':
            return { title: 'Will You Join Us?', subtitle: 'Please let us know', buttonText: 'RSVP Now', buttonStyle: 'solid' };
        case 'message':
            return { title: '', text: '{{message}}', useAccentFont: false };
        case 'countdown':
            return { title: 'Counting Down', style: 'minimal' };
        case 'divider':
            return { style: 'line', thickness: '1px', color: '' };
        case 'footer':
            return { showContact: true, tagline: '{{hostName}}', copyright: 'Made with ❤️ using Invite Me' };
        case 'qrcode':
            return { title: 'Scan to View', size: 200, includeLabel: true };
        case 'socialShare':
            return { title: 'Share This Invitation', whatsapp: true, facebook: true, twitter: true, copyLink: true };
        case 'youtube':
            return { videoUrl: '', title: '', caption: '', aspectRatio: '16:9', autoplay: false };
        default:
            return {};
    }
};

// ─── Default theme ───
const DEFAULT_THEME = {
    colors: {
        primary: '#6366f1',
        secondary: '#8b5cf6',
        accent: '#f59e0b',
        background: '#ffffff',
        surface: '#f9fafb',
        text: '#1f2937',
        textLight: '#6b7280',
        border: '#e5e7eb',
    },
    fonts: {
        heading: 'Playfair Display',
        body: 'Inter',
        accent: 'Dancing Script',
    },
    borderRadius: '0.75rem',
};

// ─── Placeholder Resolver ───
const resolvePlaceholders = (obj, data) => {
    if (!obj || !data) return obj;
    const newObj = JSON.parse(JSON.stringify(obj));
    const replaceInString = (str) => {
        if (typeof str !== 'string') return str;
        return str.replace(/\{\{(\w+)\}\}/g, (match, key) => data[key] || match);
    };
    const traverse = (current) => {
        for (const key in current) {
            if (typeof current[key] === 'string') {
                current[key] = replaceInString(current[key]);
            } else if (typeof current[key] === 'object' && current[key] !== null) {
                traverse(current[key]);
            }
        }
    };
    traverse(newObj);
    return newObj;
};

// ─── Lock Overlay Component ───
const LockedOverlay = ({ label = 'Upgrade to unlock' }) => (
    <div
        className="absolute inset-0 bg-white/70 backdrop-blur-[1px] z-10 flex items-center justify-center rounded-lg cursor-pointer"
        onClick={(e) => {
            e.stopPropagation();
            window.location.href = '/dashboard/create';
        }}
        title="Click to choose a premium template or start from scratch"
    >
        <div className="flex items-center gap-1.5 bg-gray-800 text-white text-xs font-medium px-3 py-1.5 rounded-full shadow-lg hover:bg-indigo-600 transition-colors">
            <Lock size={12} />
            {label}
        </div>
    </div>
);

// ─── Animations list ───
const ANIMATION_OPTIONS = [
    { value: 'none', label: 'None' },
    { value: 'fade-up', label: 'Fade Up' },
    { value: 'fade-in', label: 'Fade In' },
    { value: 'slide-left', label: 'Slide Left' },
    { value: 'slide-right', label: 'Slide Right' },
    { value: 'zoom', label: 'Zoom In' },
];

const FONT_OPTIONS = [
    'Playfair Display', 'Inter', 'Dancing Script', 'Poppins',
    'Roboto', 'Lora', 'Montserrat', 'Great Vibes', 'Raleway', 'Oswald',
];

const DIVIDER_STYLES = [
    { value: 'line', label: 'Line' },
    { value: 'dots', label: 'Dots' },
    { value: 'ornament', label: 'Ornament' },
    { value: 'wave', label: 'Wave' },
];

const COUNTDOWN_STYLES = [
    { value: 'minimal', label: 'Minimal' },
    { value: 'boxed', label: 'Boxed' },
    { value: 'flip', label: 'Flip' },
];

// ─── Max History for undo/redo ───
const MAX_HISTORY = 30;

// =====================================
// MAIN COMPONENT
// =====================================
const UserCustomBuilder = ({ initialData, onSave, onCancel, planType = 'scratch' }) => {
    const [selectedBlock, setSelectedBlock] = useState(null);
    const [activePanel, setActivePanel] = useState('blocks'); // blocks, layers, theme
    const [previewMode, setPreviewMode] = useState(false);
    const [previewDevice, setPreviewDevice] = useState('desktop'); // desktop, mobile
    const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

    // Undo / Redo
    const historyRef = useRef([]);
    const historyIndexRef = useRef(-1);

    // Initialize design
    const [design, setDesign] = useState(() => {
        const baseDesign = initialData?.design || {
            blocks: [getDefaultBlock('hero')],
            theme: DEFAULT_THEME,
            globalSettings: { maxWidth: '800px', fontScale: 1, animationsEnabled: true },
        };
        const resolved = initialData?.formData ? resolvePlaceholders(baseDesign, initialData.formData) : baseDesign;
        // Push initial state to history
        historyRef.current = [JSON.parse(JSON.stringify(resolved))];
        historyIndexRef.current = 0;
        return resolved;
    });

    const pushHistory = useCallback((newDesign) => {
        const history = historyRef.current;
        const index = historyIndexRef.current;
        // Trim future states
        historyRef.current = history.slice(0, index + 1);
        historyRef.current.push(JSON.parse(JSON.stringify(newDesign)));
        if (historyRef.current.length > MAX_HISTORY) {
            historyRef.current.shift();
        } else {
            historyIndexRef.current += 1;
        }
    }, []);

    const updateDesign = useCallback((updater) => {
        setDesign(prev => {
            const next = typeof updater === 'function' ? updater(prev) : updater;
            pushHistory(next);
            setHasUnsavedChanges(true);
            return next;
        });
    }, [pushHistory]);

    const undo = useCallback(() => {
        if (historyIndexRef.current > 0) {
            historyIndexRef.current -= 1;
            const prev = JSON.parse(JSON.stringify(historyRef.current[historyIndexRef.current]));
            setDesign(prev);
            setHasUnsavedChanges(true);
        }
    }, []);

    const redo = useCallback(() => {
        if (historyIndexRef.current < historyRef.current.length - 1) {
            historyIndexRef.current += 1;
            const next = JSON.parse(JSON.stringify(historyRef.current[historyIndexRef.current]));
            setDesign(next);
            setHasUnsavedChanges(true);
        }
    }, []);

    const canUndo = historyIndexRef.current > 0;
    const canRedo = historyIndexRef.current < historyRef.current.length - 1;

    // ─── Handlers ───
    const handleSave = () => {
        if (design.blocks.length === 0) {
            toast.error('Please add at least one block');
            return;
        }
        setHasUnsavedChanges(false);
        onSave(design);
    };

    const addBlock = (type) => {
        if (!isBlockAllowed(planType, type)) {
            toast.info('This block is available in paid plans');
            return;
        }
        let newBlock = getDefaultBlock(type);
        newBlock.order = design.blocks.length;
        if (initialData?.formData) {
            newBlock = resolvePlaceholders(newBlock, initialData.formData);
        }
        updateDesign(prev => ({
            ...prev,
            blocks: [...prev.blocks, newBlock],
        }));
        setSelectedBlock(newBlock);
    };

    const duplicateBlock = (blockId) => {
        if (!hasFeature(planType, 'duplicate')) {
            toast.info('Duplicate is available in paid plans');
            return;
        }
        const block = design.blocks.find(b => b.id === blockId);
        if (!block) return;
        const newBlock = { ...JSON.parse(JSON.stringify(block)), id: generateId(), order: design.blocks.length };
        updateDesign(prev => ({
            ...prev,
            blocks: [...prev.blocks, newBlock],
        }));
        setSelectedBlock(newBlock);
    };

    const removeBlock = (blockId) => {
        updateDesign(prev => ({
            ...prev,
            blocks: prev.blocks.filter(b => b.id !== blockId),
        }));
        if (selectedBlock?.id === blockId) setSelectedBlock(null);
    };

    const updateBlock = (blockId, updates) => {
        updateDesign(prev => ({
            ...prev,
            blocks: prev.blocks.map(b =>
                b.id === blockId ? { ...b, ...updates } : b
            ),
        }));
    };

    const updateBlockSettings = (key, value) => {
        if (!selectedBlock) return;
        const updated = { ...selectedBlock, settings: { ...selectedBlock.settings, [key]: value } };
        updateBlock(selectedBlock.id, { settings: updated.settings });
        setSelectedBlock(updated);
    };

    const updateBlockContent = (key, value) => {
        if (!selectedBlock) return;
        const updated = { ...selectedBlock, content: { ...selectedBlock.content, [key]: value } };
        updateBlock(selectedBlock.id, { content: updated.content });
        setSelectedBlock(updated);
    };

    const updateTheme = (path, value) => {
        const keys = path.split('.');
        updateDesign(prev => {
            const newTheme = JSON.parse(JSON.stringify(prev.theme));
            let current = newTheme;
            for (let i = 0; i < keys.length - 1; i++) {
                if (!current[keys[i]]) current[keys[i]] = {};
                current = current[keys[i]];
            }
            current[keys[keys.length - 1]] = value;
            return { ...prev, theme: newTheme };
        });
    };

    const moveBlock = (blockId, direction) => {
        if (!hasFeature(planType, 'reorder')) {
            toast.info('Block reordering is available in paid plans');
            return;
        }
        updateDesign(prev => {
            const blocks = [...prev.blocks];
            const index = blocks.findIndex(b => b.id === blockId);
            const newIndex = direction === 'up' ? index - 1 : index + 1;
            if (newIndex < 0 || newIndex >= blocks.length) return prev;
            [blocks[index], blocks[newIndex]] = [blocks[newIndex], blocks[index]];
            blocks.forEach((b, i) => b.order = i);
            return { ...prev, blocks };
        });
    };

    // ─── Preview width ───
    const canvasMaxWidth = previewDevice === 'mobile' ? '390px' : (design.globalSettings?.maxWidth || '800px');

    // ─── Render Block-Specific Content Controls ───
    const renderBlockSpecificControls = () => {
        if (!selectedBlock) return null;
        const t = selectedBlock.type;

        return (
            <div>
                <p className="text-xs text-gray-500 uppercase font-medium mb-3">Block Options</p>
                <div className="space-y-3">
                    {/* Hero-specific */}
                    {t === 'hero' && (
                        <>
                            <div>
                                <label className="text-sm block mb-1">Title</label>
                                <input type="text" value={selectedBlock.content?.title || ''} onChange={(e) => updateBlockContent('title', e.target.value)} className="w-full px-3 py-2 border rounded-lg text-sm" />
                            </div>
                            <div>
                                <label className="text-sm block mb-1">Subtitle</label>
                                <input type="text" value={selectedBlock.content?.subtitle || ''} onChange={(e) => updateBlockContent('subtitle', e.target.value)} className="w-full px-3 py-2 border rounded-lg text-sm" />
                            </div>
                            <div className="flex items-center gap-2">
                                <input type="checkbox" checked={selectedBlock.content?.showDate ?? true} onChange={(e) => updateBlockContent('showDate', e.target.checked)} className="w-4 h-4 text-indigo-600 rounded" />
                                <label className="text-sm">Show Date</label>
                            </div>
                            <div className="flex items-center gap-2">
                                <input type="checkbox" checked={selectedBlock.content?.showButton ?? true} onChange={(e) => updateBlockContent('showButton', e.target.checked)} className="w-4 h-4 text-indigo-600 rounded" />
                                <label className="text-sm">Show Button</label>
                            </div>
                            {selectedBlock.content?.showButton && (
                                <div>
                                    <label className="text-sm block mb-1">Button Text</label>
                                    <input type="text" value={selectedBlock.content?.buttonText || ''} onChange={(e) => updateBlockContent('buttonText', e.target.value)} className="w-full px-3 py-2 border rounded-lg text-sm" />
                                </div>
                            )}
                        </>
                    )}

                    {/* Event Details */}
                    {t === 'eventDetails' && (
                        <>
                            <div>
                                <label className="text-sm block mb-1">Layout</label>
                                <select value={selectedBlock.content?.layout || 'horizontal'} onChange={(e) => updateBlockContent('layout', e.target.value)} className="w-full px-3 py-2 border rounded-lg text-sm">
                                    <option value="horizontal">Horizontal</option>
                                    <option value="vertical">Vertical</option>
                                    <option value="card">Cards</option>
                                </select>
                            </div>
                            <div className="flex items-center gap-2">
                                <input type="checkbox" checked={selectedBlock.content?.showDate ?? true} onChange={(e) => updateBlockContent('showDate', e.target.checked)} className="w-4 h-4 text-indigo-600 rounded" />
                                <label className="text-sm">Show Date</label>
                            </div>
                            <div className="flex items-center gap-2">
                                <input type="checkbox" checked={selectedBlock.content?.showTime ?? true} onChange={(e) => updateBlockContent('showTime', e.target.checked)} className="w-4 h-4 text-indigo-600 rounded" />
                                <label className="text-sm">Show Time</label>
                            </div>
                            <div className="flex items-center gap-2">
                                <input type="checkbox" checked={selectedBlock.content?.showVenue ?? true} onChange={(e) => updateBlockContent('showVenue', e.target.checked)} className="w-4 h-4 text-indigo-600 rounded" />
                                <label className="text-sm">Show Venue</label>
                            </div>
                        </>
                    )}

                    {/* Gallery */}
                    {t === 'gallery' && (
                        <>
                            <div>
                                <label className="text-sm block mb-1">Title</label>
                                <input type="text" value={selectedBlock.content?.title || ''} onChange={(e) => updateBlockContent('title', e.target.value)} className="w-full px-3 py-2 border rounded-lg text-sm" />
                            </div>
                            <div>
                                <label className="text-sm block mb-1">Layout</label>
                                <select value={selectedBlock.content?.layout || 'grid'} onChange={(e) => updateBlockContent('layout', e.target.value)} className="w-full px-3 py-2 border rounded-lg text-sm">
                                    <option value="grid">Grid</option>
                                    <option value="masonry">Masonry</option>
                                </select>
                            </div>
                            <div>
                                <label className="text-sm block mb-1">Columns</label>
                                <select value={selectedBlock.content?.columns || 3} onChange={(e) => updateBlockContent('columns', parseInt(e.target.value))} className="w-full px-3 py-2 border rounded-lg text-sm">
                                    <option value={2}>2</option>
                                    <option value={3}>3</option>
                                    <option value={4}>4</option>
                                </select>
                            </div>
                            {/* Image URL Management */}
                            <div>
                                <label className="text-sm block mb-2 font-medium">Images</label>
                                {(selectedBlock.content?.images || []).map((img, idx) => (
                                    <div key={idx} className="flex items-center gap-2 mb-2">
                                        <img src={img} alt="" className="w-10 h-10 rounded object-cover border flex-shrink-0" onError={(e) => { e.target.src = ''; e.target.alt = '⚠️'; }} />
                                        <input
                                            type="text"
                                            value={img}
                                            onChange={(e) => {
                                                const imgs = [...(selectedBlock.content?.images || [])];
                                                imgs[idx] = e.target.value;
                                                updateBlockContent('images', imgs);
                                            }}
                                            className="flex-1 px-2 py-1 border rounded text-xs"
                                            placeholder="Image URL"
                                        />
                                        <button
                                            onClick={() => {
                                                const imgs = (selectedBlock.content?.images || []).filter((_, i) => i !== idx);
                                                updateBlockContent('images', imgs);
                                            }}
                                            className="text-red-500 hover:text-red-700 flex-shrink-0"
                                        >
                                            <X size={14} />
                                        </button>
                                    </div>
                                ))}
                                <button
                                    onClick={() => {
                                        const imgs = [...(selectedBlock.content?.images || []), ''];
                                        updateBlockContent('images', imgs);
                                    }}
                                    className="flex items-center gap-1 text-sm text-indigo-600 hover:text-indigo-800 mt-1"
                                >
                                    <Plus size={14} /> Add Image URL
                                </button>
                            </div>
                        </>
                    )}

                    {/* YouTube */}
                    {t === 'youtube' && (
                        <>
                            <div>
                                <label className="text-sm block mb-1">YouTube URL</label>
                                <input type="text" value={selectedBlock.content?.videoUrl || ''} onChange={(e) => updateBlockContent('videoUrl', e.target.value)} placeholder="https://youtube.com/watch?v=..." className="w-full px-3 py-2 border rounded-lg text-sm" />
                            </div>
                            <div>
                                <label className="text-sm block mb-1">Title (optional)</label>
                                <input type="text" value={selectedBlock.content?.title || ''} onChange={(e) => updateBlockContent('title', e.target.value)} className="w-full px-3 py-2 border rounded-lg text-sm" />
                            </div>
                            <div>
                                <label className="text-sm block mb-1">Caption (optional)</label>
                                <input type="text" value={selectedBlock.content?.caption || ''} onChange={(e) => updateBlockContent('caption', e.target.value)} className="w-full px-3 py-2 border rounded-lg text-sm" />
                            </div>
                            <div>
                                <label className="text-sm block mb-1">Aspect Ratio</label>
                                <select value={selectedBlock.content?.aspectRatio || '16:9'} onChange={(e) => updateBlockContent('aspectRatio', e.target.value)} className="w-full px-3 py-2 border rounded-lg text-sm">
                                    <option value="16:9">16:9 (Widescreen)</option>
                                    <option value="4:3">4:3 (Standard)</option>
                                    <option value="1:1">1:1 (Square)</option>
                                </select>
                            </div>
                            <div className="flex items-center gap-2">
                                <input type="checkbox" checked={selectedBlock.content?.autoplay ?? false} onChange={(e) => updateBlockContent('autoplay', e.target.checked)} className="w-4 h-4 text-indigo-600 rounded" />
                                <label className="text-sm">Autoplay (muted)</label>
                            </div>
                        </>
                    )}

                    {/* RSVP */}
                    {t === 'rsvp' && (
                        <>
                            <div>
                                <label className="text-sm block mb-1">Title</label>
                                <input type="text" value={selectedBlock.content?.title || ''} onChange={(e) => updateBlockContent('title', e.target.value)} className="w-full px-3 py-2 border rounded-lg text-sm" />
                            </div>
                            <div>
                                <label className="text-sm block mb-1">Subtitle</label>
                                <input type="text" value={selectedBlock.content?.subtitle || ''} onChange={(e) => updateBlockContent('subtitle', e.target.value)} className="w-full px-3 py-2 border rounded-lg text-sm" />
                            </div>
                            <div>
                                <label className="text-sm block mb-1">Button Text</label>
                                <input type="text" value={selectedBlock.content?.buttonText || ''} onChange={(e) => updateBlockContent('buttonText', e.target.value)} className="w-full px-3 py-2 border rounded-lg text-sm" />
                            </div>
                            <div>
                                <label className="text-sm block mb-1">Button Style</label>
                                <select value={selectedBlock.content?.buttonStyle || 'solid'} onChange={(e) => updateBlockContent('buttonStyle', e.target.value)} className="w-full px-3 py-2 border rounded-lg text-sm">
                                    <option value="solid">Solid</option>
                                    <option value="outline">Outline</option>
                                    <option value="gradient">Gradient</option>
                                </select>
                            </div>
                            <div>
                                <label className="text-sm block mb-1">RSVP Form Style</label>
                                <select value={selectedBlock.settings?.rsvpStyle || 'modal'} onChange={(e) => updateBlockSettings('rsvpStyle', e.target.value)} className="w-full px-3 py-2 border rounded-lg text-sm">
                                    <option value="modal">Modal (Popup)</option>
                                    <option value="embedded">Embedded (On Page)</option>
                                </select>
                            </div>
                        </>
                    )}

                    {/* Message */}
                    {t === 'message' && (
                        <>
                            <div>
                                <label className="text-sm block mb-1">Title</label>
                                <input type="text" value={selectedBlock.content?.title || ''} onChange={(e) => updateBlockContent('title', e.target.value)} className="w-full px-3 py-2 border rounded-lg text-sm" />
                            </div>
                            <div>
                                <label className="text-sm block mb-1">Message Text</label>
                                <textarea value={selectedBlock.content?.text || ''} onChange={(e) => updateBlockContent('text', e.target.value)} rows={4} className="w-full px-3 py-2 border rounded-lg text-sm" />
                            </div>
                            <div className="flex items-center gap-2">
                                <input type="checkbox" checked={selectedBlock.content?.useAccentFont ?? false} onChange={(e) => updateBlockContent('useAccentFont', e.target.checked)} className="w-4 h-4 text-indigo-600 rounded" />
                                <label className="text-sm">Use Accent Font</label>
                            </div>
                        </>
                    )}

                    {/* Countdown */}
                    {t === 'countdown' && (
                        <>
                            <div>
                                <label className="text-sm block mb-1">Title</label>
                                <input type="text" value={selectedBlock.content?.title || ''} onChange={(e) => updateBlockContent('title', e.target.value)} className="w-full px-3 py-2 border rounded-lg text-sm" />
                            </div>
                            <div>
                                <label className="text-sm block mb-1">Style</label>
                                <select value={selectedBlock.content?.style || 'minimal'} onChange={(e) => updateBlockContent('style', e.target.value)} className="w-full px-3 py-2 border rounded-lg text-sm">
                                    {COUNTDOWN_STYLES.map(s => (
                                        <option key={s.value} value={s.value}>{s.label}</option>
                                    ))}
                                </select>
                            </div>
                        </>
                    )}

                    {/* Divider */}
                    {t === 'divider' && (
                        <>
                            <div>
                                <label className="text-sm block mb-1">Style</label>
                                <select value={selectedBlock.content?.style || 'line'} onChange={(e) => updateBlockContent('style', e.target.value)} className="w-full px-3 py-2 border rounded-lg text-sm">
                                    {DIVIDER_STYLES.map(s => (
                                        <option key={s.value} value={s.value}>{s.label}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="text-sm block mb-1">Thickness</label>
                                <select value={selectedBlock.content?.thickness || '1px'} onChange={(e) => updateBlockContent('thickness', e.target.value)} className="w-full px-3 py-2 border rounded-lg text-sm">
                                    <option value="1px">Thin</option>
                                    <option value="2px">Medium</option>
                                    <option value="3px">Thick</option>
                                </select>
                            </div>
                            <div className="flex items-center gap-2">
                                <label className="text-sm">Color</label>
                                <input type="color" value={selectedBlock.content?.color || design.theme?.colors?.border || '#e5e7eb'} onChange={(e) => updateBlockContent('color', e.target.value)} className="w-8 h-8 rounded cursor-pointer border" />
                            </div>
                        </>
                    )}

                    {/* Footer */}
                    {t === 'footer' && (
                        <>
                            <div className="flex items-center gap-2">
                                <input type="checkbox" checked={selectedBlock.content?.showContact ?? true} onChange={(e) => updateBlockContent('showContact', e.target.checked)} className="w-4 h-4 text-indigo-600 rounded" />
                                <label className="text-sm">Show Contact Info</label>
                            </div>
                            <div>
                                <label className="text-sm block mb-1">Tagline</label>
                                <input type="text" value={selectedBlock.content?.tagline || ''} onChange={(e) => updateBlockContent('tagline', e.target.value)} className="w-full px-3 py-2 border rounded-lg text-sm" />
                            </div>
                            <div>
                                <label className="text-sm block mb-1">Copyright Text</label>
                                <input type="text" value={selectedBlock.content?.copyright || ''} onChange={(e) => updateBlockContent('copyright', e.target.value)} className="w-full px-3 py-2 border rounded-lg text-sm" />
                            </div>
                        </>
                    )}

                    {/* Venue */}
                    {t === 'venue' && (
                        <>
                            <div>
                                <label className="text-sm block mb-1">Title</label>
                                <input type="text" value={selectedBlock.content?.title || ''} onChange={(e) => updateBlockContent('title', e.target.value)} className="w-full px-3 py-2 border rounded-lg text-sm" />
                            </div>
                            <div className="flex items-center gap-2">
                                <input type="checkbox" checked={selectedBlock.content?.showMap ?? true} onChange={(e) => updateBlockContent('showMap', e.target.checked)} className="w-4 h-4 text-indigo-600 rounded" />
                                <label className="text-sm">Show Map</label>
                            </div>
                        </>
                    )}

                    {/* QR Code */}
                    {t === 'qrcode' && (
                        <>
                            <div>
                                <label className="text-sm block mb-1">Title</label>
                                <input type="text" value={selectedBlock.content?.title || ''} onChange={(e) => updateBlockContent('title', e.target.value)} className="w-full px-3 py-2 border rounded-lg text-sm" />
                            </div>
                            <div>
                                <label className="text-sm block mb-1">QR Size</label>
                                <input type="range" min={100} max={300} step={10} value={selectedBlock.content?.size || 200} onChange={(e) => updateBlockContent('size', parseInt(e.target.value))} className="w-full" />
                                <span className="text-xs text-gray-500">{selectedBlock.content?.size || 200}px</span>
                            </div>
                        </>
                    )}

                    {/* Social Share */}
                    {t === 'socialShare' && (
                        <>
                            <div>
                                <label className="text-sm block mb-1">Title</label>
                                <input type="text" value={selectedBlock.content?.title || ''} onChange={(e) => updateBlockContent('title', e.target.value)} className="w-full px-3 py-2 border rounded-lg text-sm" />
                            </div>
                            {['whatsapp', 'facebook', 'twitter', 'copyLink'].map(platform => (
                                <div key={platform} className="flex items-center gap-2">
                                    <input type="checkbox" checked={selectedBlock.content?.[platform] ?? true} onChange={(e) => updateBlockContent(platform, e.target.checked)} className="w-4 h-4 text-indigo-600 rounded" />
                                    <label className="text-sm capitalize">{platform === 'copyLink' ? 'Copy Link' : platform}</label>
                                </div>
                            ))}
                        </>
                    )}
                </div>
            </div>
        );
    };

    // =====================================
    // RENDER
    // =====================================
    return (
        <div className="fixed inset-0 z-50 bg-white flex flex-col">
            {/* ─── Top Bar ─── */}
            <div className="bg-white border-b px-4 py-3 flex items-center justify-between shadow-sm">
                <div className="flex items-center gap-3">
                    <button onClick={onCancel} className="p-2 hover:bg-gray-100 rounded-lg text-gray-600">
                        <ArrowLeft size={20} />
                    </button>
                    <h2 className="text-lg font-bold text-gray-900">Design Invitation</h2>
                    {hasUnsavedChanges && (
                        <span className="flex items-center gap-1 text-xs text-amber-600 bg-amber-50 px-2 py-1 rounded-full">
                            <AlertCircle size={12} /> Unsaved
                        </span>
                    )}
                </div>

                <div className="flex items-center gap-2">
                    {/* Undo/Redo */}
                    <button onClick={undo} disabled={!canUndo} className={`p-2 rounded-lg transition-colors ${canUndo ? 'hover:bg-gray-100 text-gray-700' : 'text-gray-300 cursor-not-allowed'}`} title="Undo">
                        <Undo2 size={18} />
                    </button>
                    <button onClick={redo} disabled={!canRedo} className={`p-2 rounded-lg transition-colors ${canRedo ? 'hover:bg-gray-100 text-gray-700' : 'text-gray-300 cursor-not-allowed'}`} title="Redo">
                        <Redo2 size={18} />
                    </button>

                    <div className="w-px h-6 bg-gray-200 mx-1" />

                    {/* Device Preview */}
                    <button onClick={() => setPreviewDevice('desktop')} className={`p-2 rounded-lg transition-colors ${previewDevice === 'desktop' ? 'bg-indigo-100 text-indigo-600' : 'text-gray-500 hover:bg-gray-100'}`} title="Desktop">
                        <Monitor size={18} />
                    </button>
                    <button onClick={() => setPreviewDevice('mobile')} className={`p-2 rounded-lg transition-colors ${previewDevice === 'mobile' ? 'bg-indigo-100 text-indigo-600' : 'text-gray-500 hover:bg-gray-100'}`} title="Mobile">
                        <Smartphone size={18} />
                    </button>

                    <div className="w-px h-6 bg-gray-200 mx-1" />

                    <Button variant="outline" onClick={() => setPreviewMode(!previewMode)}>
                        {previewMode ? <Settings2 size={18} className="mr-2" /> : <Eye size={18} className="mr-2" />}
                        {previewMode ? 'Edit' : 'Preview'}
                    </Button>
                    <Button onClick={handleSave}>
                        <Check size={18} className="mr-2" />
                        Finish Design
                    </Button>
                </div>
            </div>

            {/* ─── Main Content ─── */}
            <div className="flex-1 flex overflow-hidden">
                {/* ─── Left Panel ─── */}
                {!previewMode && (
                    <div className="w-72 bg-white border-r overflow-y-auto flex flex-col">
                        {/* Tabs */}
                        <div className="flex border-b">
                            {[
                                { id: 'blocks', label: 'Blocks', icon: Plus },
                                { id: 'layers', label: 'Layers', icon: Layers },
                                { id: 'theme', label: 'Theme', icon: Palette },
                            ].map(tab => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActivePanel(tab.id)}
                                    className={`flex-1 py-3 text-xs font-medium transition-colors ${activePanel === tab.id
                                        ? 'text-indigo-600 border-b-2 border-indigo-600'
                                        : 'text-gray-500 hover:text-gray-700'
                                        }`}
                                >
                                    <tab.icon size={16} className="mx-auto mb-1" />
                                    {tab.label}
                                </button>
                            ))}
                        </div>

                        <div className="p-4 flex-1 overflow-y-auto">
                            {/* Blocks Tab — Add Components */}
                            {activePanel === 'blocks' && (
                                <div className="space-y-2">
                                    <p className="text-xs text-gray-500 uppercase font-medium mb-3">Add Components</p>
                                    {BLOCK_TYPES.map(block => {
                                        const allowed = isBlockAllowed(planType, block.type);
                                        return (
                                            <button
                                                key={block.type}
                                                onClick={() => addBlock(block.type)}
                                                className={`w-full flex items-center gap-3 p-3 rounded-lg border transition-colors text-left relative ${allowed
                                                    ? 'border-gray-200 hover:border-indigo-300 hover:bg-indigo-50'
                                                    : 'border-gray-100 bg-gray-50 opacity-60'
                                                    }`}
                                            >
                                                <block.icon size={20} className={allowed ? 'text-indigo-600' : 'text-gray-400'} />
                                                <div className="flex-1 min-w-0">
                                                    <p className="font-medium text-sm">{block.label}</p>
                                                    <p className="text-xs text-gray-500 truncate">{block.description}</p>
                                                </div>
                                                {!allowed && <Lock size={14} className="text-gray-400 shrink-0" />}
                                            </button>
                                        );
                                    })}
                                </div>
                            )}

                            {/* Layers Tab — Block List */}
                            {activePanel === 'layers' && (
                                <div className="space-y-1">
                                    <p className="text-xs text-gray-500 uppercase font-medium mb-3">Block Layers</p>
                                    {design.blocks.length === 0 ? (
                                        <p className="text-sm text-gray-400 text-center py-8">No blocks added yet</p>
                                    ) : (
                                        [...design.blocks].sort((a, b) => a.order - b.order).map((block) => (
                                            <div
                                                key={block.id}
                                                onClick={() => setSelectedBlock(block)}
                                                className={`flex items-center gap-2 p-2.5 rounded-lg cursor-pointer transition-colors group ${selectedBlock?.id === block.id
                                                    ? 'bg-indigo-50 border border-indigo-200'
                                                    : 'hover:bg-gray-50 border border-transparent'
                                                    }`}
                                            >
                                                <GripVertical size={14} className="text-gray-300 shrink-0" />
                                                <span className="text-sm font-medium flex-1 capitalize truncate">{block.type}</span>
                                                <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <button onClick={(e) => { e.stopPropagation(); moveBlock(block.id, 'up'); }} className="p-1 hover:bg-gray-200 rounded" title="Move Up">
                                                        <ChevronUp size={14} />
                                                    </button>
                                                    <button onClick={(e) => { e.stopPropagation(); moveBlock(block.id, 'down'); }} className="p-1 hover:bg-gray-200 rounded" title="Move Down">
                                                        <ChevronDown size={14} />
                                                    </button>
                                                    <button onClick={(e) => { e.stopPropagation(); duplicateBlock(block.id); }} className="p-1 hover:bg-blue-100 rounded text-blue-600" title="Duplicate">
                                                        <Copy size={14} />
                                                    </button>
                                                    <button onClick={(e) => { e.stopPropagation(); removeBlock(block.id); }} className="p-1 hover:bg-red-100 rounded text-red-500" title="Delete">
                                                        <Trash2 size={14} />
                                                    </button>
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>
                            )}

                            {/* Theme Tab */}
                            {activePanel === 'theme' && (
                                <div className="space-y-6">
                                    {/* Colors */}
                                    <div>
                                        <p className="text-xs text-gray-500 uppercase font-medium mb-3">Colors</p>
                                        {Object.entries(design.theme?.colors || {}).map(([key, value]) => {
                                            const allowed = getAllowedColors(planType).includes(key);
                                            return (
                                                <div key={key} className={`flex items-center justify-between mb-2 relative ${!allowed ? 'opacity-50' : ''}`}>
                                                    <label className="text-sm capitalize">{key.replace(/([A-Z])/g, ' $1')}</label>
                                                    <div className="flex items-center gap-2">
                                                        <input
                                                            type="color"
                                                            value={value}
                                                            onChange={(e) => updateTheme(`colors.${key}`, e.target.value)}
                                                            className="w-8 h-8 rounded cursor-pointer border"
                                                            disabled={!allowed}
                                                        />
                                                        {!allowed && <Lock size={12} className="text-gray-400" />}
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>

                                    {/* Fonts */}
                                    <div className="relative">
                                        <p className="text-xs text-gray-500 uppercase font-medium mb-3">Fonts</p>
                                        {!hasFeature(planType, 'fonts') && <LockedOverlay />}
                                        {Object.entries(design.theme?.fonts || {}).map(([key, value]) => (
                                            <div key={key} className="mb-3">
                                                <label className="text-sm capitalize block mb-1">{key}</label>
                                                <select
                                                    value={value}
                                                    onChange={(e) => updateTheme(`fonts.${key}`, e.target.value)}
                                                    className="w-full px-3 py-2 border rounded-lg text-sm"
                                                    disabled={!hasFeature(planType, 'fonts')}
                                                >
                                                    {FONT_OPTIONS.map(f => (
                                                        <option key={f} value={f}>{f}</option>
                                                    ))}
                                                </select>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* ─── Center — Canvas ─── */}
                <div className="flex-1 overflow-y-auto bg-gray-200 p-8">
                    <div
                        className="mx-auto bg-white shadow-2xl rounded-lg overflow-hidden transition-all duration-300"
                        style={{ maxWidth: canvasMaxWidth }}
                    >
                        {design.blocks.length === 0 ? (
                            <div className="py-32 text-center text-gray-400">
                                <Layout size={48} className="mx-auto mb-4 opacity-50" />
                                <p>Add blocks from the left panel to start building</p>
                            </div>
                        ) : (
                            <BlocksRenderer
                                blocks={design.blocks}
                                data={initialData?.formData || {}}
                                theme={design.theme}
                                isEditing={!previewMode}
                                selectedBlockId={selectedBlock?.id}
                                onBlockClick={(block) => !previewMode && setSelectedBlock(block)}
                            />
                        )}
                    </div>
                </div>

                {/* ─── Right Panel — Block Editor ─── */}
                {!previewMode && selectedBlock && (
                    <div className="w-80 bg-white border-l overflow-y-auto">
                        <div className="p-4 border-b flex items-center justify-between">
                            <h3 className="font-semibold capitalize">{selectedBlock.type} Block</h3>
                            <div className="flex items-center gap-1">
                                <button onClick={() => duplicateBlock(selectedBlock.id)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg" title="Duplicate">
                                    <Copy size={16} />
                                </button>
                                <button onClick={() => removeBlock(selectedBlock.id)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg" title="Delete">
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        </div>

                        <div className="p-4 space-y-6">
                            {/* Background Settings */}
                            <div>
                                <p className="text-xs text-gray-500 uppercase font-medium mb-3">Background</p>
                                <div className="space-y-3">
                                    <div>
                                        <label className="text-sm block mb-1">Type</label>
                                        <select
                                            value={selectedBlock.settings?.backgroundType || 'solid'}
                                            onChange={(e) => updateBlockSettings('backgroundType', e.target.value)}
                                            className="w-full px-3 py-2 border rounded-lg text-sm"
                                        >
                                            <option value="solid">Solid Color</option>
                                            {hasFeature(planType, 'gradientBackground') ? (
                                                <option value="gradient">Gradient</option>
                                            ) : (
                                                <option value="gradient" disabled>🔒 Gradient</option>
                                            )}
                                            {hasFeature(planType, 'imageBackground') ? (
                                                <option value="image">Image</option>
                                            ) : (
                                                <option value="image" disabled>🔒 Image</option>
                                            )}
                                        </select>
                                    </div>

                                    {selectedBlock.settings?.backgroundType === 'solid' && (
                                        <div className="flex items-center gap-2">
                                            <label className="text-sm">Color</label>
                                            <input type="color" value={selectedBlock.settings?.backgroundColor || '#ffffff'} onChange={(e) => updateBlockSettings('backgroundColor', e.target.value)} className="w-8 h-8 rounded cursor-pointer" />
                                        </div>
                                    )}

                                    {selectedBlock.settings?.backgroundType === 'gradient' && hasFeature(planType, 'gradientBackground') && (
                                        <div className="space-y-3">
                                            <div className="flex items-center gap-3">
                                                <div className="flex-1">
                                                    <label className="text-sm block mb-1">Color 1</label>
                                                    <input type="color" value={selectedBlock.settings?.gradientColor1 || '#667eea'} onChange={(e) => updateBlockSettings('gradientColor1', e.target.value)} className="w-full h-9 rounded cursor-pointer border" />
                                                </div>
                                                <div className="flex-1">
                                                    <label className="text-sm block mb-1">Color 2</label>
                                                    <input type="color" value={selectedBlock.settings?.gradientColor2 || '#764ba2'} onChange={(e) => updateBlockSettings('gradientColor2', e.target.value)} className="w-full h-9 rounded cursor-pointer border" />
                                                </div>
                                            </div>
                                            <div>
                                                <label className="text-sm block mb-1">Direction</label>
                                                <select
                                                    value={selectedBlock.settings?.gradientDirection || '135deg'}
                                                    onChange={(e) => updateBlockSettings('gradientDirection', e.target.value)}
                                                    className="w-full px-3 py-2 border rounded-lg text-sm"
                                                >
                                                    <option value="135deg">↗ Diagonal (135°)</option>
                                                    <option value="90deg">→ Left to Right (90°)</option>
                                                    <option value="180deg">↓ Top to Bottom (180°)</option>
                                                    <option value="45deg">↘ Diagonal (45°)</option>
                                                    <option value="270deg">← Right to Left (270°)</option>
                                                    <option value="0deg">↑ Bottom to Top (0°)</option>
                                                </select>
                                            </div>
                                            <div
                                                className="w-full h-10 rounded-lg border"
                                                style={{
                                                    background: `linear-gradient(${selectedBlock.settings?.gradientDirection || '135deg'}, ${selectedBlock.settings?.gradientColor1 || '#667eea'} 0%, ${selectedBlock.settings?.gradientColor2 || '#764ba2'} 100%)`
                                                }}
                                            />
                                        </div>
                                    )}

                                    {selectedBlock.settings?.backgroundType === 'image' && hasFeature(planType, 'imageBackground') && (
                                        <div>
                                            <label className="text-sm block mb-1">Image URL</label>
                                            <input type="text" value={selectedBlock.settings?.backgroundImage || ''} onChange={(e) => updateBlockSettings('backgroundImage', e.target.value)} placeholder="https://..." className="w-full px-3 py-2 border rounded-lg text-sm" />
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Overlay — gated */}
                            <div className="relative">
                                <p className="text-xs text-gray-500 uppercase font-medium mb-3">Overlay</p>
                                {!hasFeature(planType, 'overlay') && <LockedOverlay />}
                                <div className="space-y-3">
                                    <div className="flex items-center gap-2">
                                        <input type="checkbox" checked={selectedBlock.settings?.overlayEnabled ?? false} onChange={(e) => updateBlockSettings('overlayEnabled', e.target.checked)} className="w-4 h-4 text-indigo-600 rounded" />
                                        <label className="text-sm">Enable Overlay</label>
                                    </div>
                                    {selectedBlock.settings?.overlayEnabled && (
                                        <>
                                            <div className="flex items-center gap-2">
                                                <label className="text-sm">Color</label>
                                                <input type="color" value={selectedBlock.settings?.overlayColor || '#000000'} onChange={(e) => updateBlockSettings('overlayColor', e.target.value)} className="w-8 h-8 rounded cursor-pointer border" />
                                            </div>
                                            <div>
                                                <label className="text-sm block mb-1">Opacity: {Math.round((selectedBlock.settings?.overlayOpacity || 0.3) * 100)}%</label>
                                                <input type="range" min={0} max={1} step={0.05} value={selectedBlock.settings?.overlayOpacity || 0.3} onChange={(e) => updateBlockSettings('overlayOpacity', parseFloat(e.target.value))} className="w-full" />
                                            </div>
                                        </>
                                    )}
                                </div>
                            </div>

                            {/* Layout */}
                            <div>
                                <p className="text-xs text-gray-500 uppercase font-medium mb-3">Layout</p>
                                <div className="space-y-3">
                                    <div>
                                        <label className="text-sm block mb-1">Height</label>
                                        <select value={selectedBlock.settings?.height || 'auto'} onChange={(e) => updateBlockSettings('height', e.target.value)} className="w-full px-3 py-2 border rounded-lg text-sm">
                                            <option value="auto">Auto</option>
                                            <option value="50vh">Half Screen</option>
                                            <option value="100vh">Full Screen</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="text-sm block mb-1">Text Align</label>
                                        <div className="flex gap-2">
                                            {['left', 'center', 'right'].map(align => (
                                                <button key={align} onClick={() => updateBlockSettings('textAlign', align)} className={`flex-1 py-2 text-sm rounded border ${selectedBlock.settings?.textAlign === align ? 'bg-indigo-50 border-indigo-300 text-indigo-600' : 'hover:bg-gray-50'}`}>
                                                    {align.charAt(0).toUpperCase() + align.slice(1)}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Padding — gated */}
                            <div className="relative">
                                <p className="text-xs text-gray-500 uppercase font-medium mb-3">Padding</p>
                                {!hasFeature(planType, 'padding') && <LockedOverlay />}
                                <div>
                                    <select value={selectedBlock.settings?.padding || '4rem'} onChange={(e) => updateBlockSettings('padding', e.target.value)} className="w-full px-3 py-2 border rounded-lg text-sm">
                                        <option value="1rem">Small (1rem)</option>
                                        <option value="2rem">Medium (2rem)</option>
                                        <option value="4rem">Large (4rem)</option>
                                        <option value="6rem">Extra Large (6rem)</option>
                                        <option value="8rem">Huge (8rem)</option>
                                    </select>
                                </div>
                            </div>

                            {/* Animation — gated */}
                            <div className="relative">
                                <p className="text-xs text-gray-500 uppercase font-medium mb-3">Animation</p>
                                {!hasFeature(planType, 'animation') && <LockedOverlay />}
                                <div className="space-y-3">
                                    <div>
                                        <label className="text-sm block mb-1">Type</label>
                                        <select value={selectedBlock.settings?.animation || 'fade-up'} onChange={(e) => updateBlockSettings('animation', e.target.value)} className="w-full px-3 py-2 border rounded-lg text-sm">
                                            {ANIMATION_OPTIONS.map(a => (
                                                <option key={a.value} value={a.value}>{a.label}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="text-sm block mb-1">Delay: {selectedBlock.settings?.animationDelay || 0}s</label>
                                        <input type="range" min={0} max={2} step={0.1} value={selectedBlock.settings?.animationDelay || 0} onChange={(e) => updateBlockSettings('animationDelay', parseFloat(e.target.value))} className="w-full" />
                                    </div>
                                </div>
                            </div>

                            {/* Block-specific Content */}
                            {renderBlockSpecificControls()}

                            {/* Move Block */}
                            <div className="flex gap-2 pt-4 border-t">
                                <Button variant="outline" size="sm" className="flex-1" onClick={() => moveBlock(selectedBlock.id, 'up')}>
                                    <ChevronUp size={16} className="mr-1" /> Up
                                </Button>
                                <Button variant="outline" size="sm" className="flex-1" onClick={() => moveBlock(selectedBlock.id, 'down')}>
                                    <ChevronDown size={16} className="mr-1" /> Down
                                </Button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default UserCustomBuilder;
