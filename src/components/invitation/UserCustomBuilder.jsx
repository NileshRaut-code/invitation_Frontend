import { useState } from 'react';

import {
    ArrowLeft, Save, Eye, Plus, Trash2,
    Image, Type, Calendar, MapPin, Users, MessageSquare,
    Layout, Divide, Timer, Palette, Settings2, Check
} from 'lucide-react';
import { toast } from 'react-toastify';
import { Button } from '../../components/ui';
import { BlocksRenderer } from '../../components/blocks/BlockRenderer';

// Generate unique ID
const generateId = () => crypto.randomUUID().slice(0, 8);

// Block type definitions with icons
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
];

// Default block settings by type
const getDefaultBlock = (type) => ({
    id: generateId(),
    type,
    order: 0,
    settings: {
        height: type === 'hero' ? '100vh' : 'auto',
        padding: '4rem',
        backgroundType: 'solid',
        backgroundColor: type === 'hero' ? '#1f2937' : '#ffffff',
        overlayEnabled: type === 'hero',
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
            return { title: '{{eventName}}', subtitle: '{{hostName}}', showDate: true, showButton: true, buttonText: 'RSVP Now' };
        case 'eventDetails':
            return { title: 'Event Details', showDate: true, showTime: true, showVenue: true, layout: 'horizontal' };
        case 'venue':
            return { title: 'Venue', showMap: true, mapHeight: '400px' };
        case 'gallery':
            return { title: 'Gallery', images: [], layout: 'grid' };
        case 'rsvp':
            return { title: 'Will You Join Us?', subtitle: 'Please let us know', buttonText: 'RSVP Now' };
        case 'message':
            return { title: '', text: '{{message}}', useAccentFont: false };
        case 'countdown':
            return { title: 'Counting Down' };
        case 'divider':
            return { style: 'line' };
        case 'footer':
            return { showContact: true, tagline: '{{hostName}}', copyright: 'Made with ❤️ using Invite Me' };
        default:
            return {};
    }
};

// Default theme
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

const resolvePlaceholders = (obj, data) => {
    if (!obj || !data) return obj;
    const newObj = JSON.parse(JSON.stringify(obj));

    // Helper to replace in string
    const replaceInString = (str) => {
        if (typeof str !== 'string') return str;
        return str.replace(/\{\{(\w+)\}\}/g, (match, key) => {
            return data[key] || match;
        });
    };

    // Recursive traversal
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

const UserCustomBuilder = ({ initialData, onSave, onCancel }) => {
    const [selectedBlock, setSelectedBlock] = useState(null);
    const [activePanel, setActivePanel] = useState('blocks'); // blocks, theme
    const [previewMode, setPreviewMode] = useState(false);

    // Initialize design with resolved placeholders
    const [design, setDesign] = useState(() => {
        const baseDesign = initialData?.design || {
            blocks: [getDefaultBlock('hero')],
            theme: DEFAULT_THEME,
            globalSettings: {
                maxWidth: '800px',
                fontScale: 1,
                animationsEnabled: true,
            },
        };

        // Resolve placeholders with form data
        if (initialData?.formData) {
            return resolvePlaceholders(baseDesign, initialData.formData);
        }
        return baseDesign;
    });

    const handleSave = () => {
        if (design.blocks.length === 0) {
            toast.error('Please add at least one block');
            return;
        }
        onSave(design);
    };

    const addBlock = (type) => {
        let newBlock = getDefaultBlock(type);
        newBlock.order = design.blocks.length;

        // Resolve placeholders for new block
        if (initialData?.formData) {
            newBlock = resolvePlaceholders(newBlock, initialData.formData);
        }

        setDesign(prev => ({
            ...prev,
            blocks: [...prev.blocks, newBlock],
        }));

        setSelectedBlock(newBlock);
    };

    const removeBlock = (blockId) => {
        setDesign(prev => ({
            ...prev,
            blocks: prev.blocks.filter(b => b.id !== blockId),
        }));

        if (selectedBlock?.id === blockId) {
            setSelectedBlock(null);
        }
    };

    const updateBlock = (blockId, updates) => {
        setDesign(prev => ({
            ...prev,
            blocks: prev.blocks.map(b =>
                b.id === blockId ? { ...b, ...updates } : b
            ),
        }));
    };

    const updateBlockSettings = (key, value) => {
        if (!selectedBlock) return;

        updateBlock(selectedBlock.id, {
            settings: { ...selectedBlock.settings, [key]: value },
        });

        setSelectedBlock(prev => ({
            ...prev,
            settings: { ...prev.settings, [key]: value },
        }));
    };

    const updateBlockContent = (key, value) => {
        if (!selectedBlock) return;

        updateBlock(selectedBlock.id, {
            content: { ...selectedBlock.content, [key]: value },
        });

        setSelectedBlock(prev => ({
            ...prev,
            content: { ...prev.content, [key]: value },
        }));
    };



    const updateTheme = (path, value) => {
        const keys = path.split('.');
        setDesign(prev => {
            const newTheme = { ...prev.theme };
            let current = newTheme;
            for (let i = 0; i < keys.length - 1; i++) {
                current[keys[i]] = { ...current[keys[i]] };
                current = current[keys[i]];
            }
            current[keys[keys.length - 1]] = value;
            return {
                ...prev,
                theme: newTheme,
            };
        });
    };

    const moveBlock = (blockId, direction) => {
        const blocks = [...design.blocks];
        const index = blocks.findIndex(b => b.id === blockId);
        const newIndex = direction === 'up' ? index - 1 : index + 1;

        if (newIndex < 0 || newIndex >= blocks.length) return;

        [blocks[index], blocks[newIndex]] = [blocks[newIndex], blocks[index]];
        blocks.forEach((b, i) => b.order = i);

        setDesign(prev => ({
            ...prev,
            blocks,
        }));
    };

    return (
        <div className="fixed inset-0 z-50 bg-white flex flex-col">
            {/* Top Bar */}
            <div className="bg-white border-b px-4 py-3 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <button
                        onClick={onCancel}
                        className="p-2 hover:bg-gray-100 rounded-lg text-gray-600"
                    >
                        <ArrowLeft size={20} />
                    </button>
                    <h2 className="text-xl font-bold text-gray-900">Design Invitation</h2>
                </div>

                <div className="flex items-center gap-3">
                    <Button
                        variant="outline"
                        onClick={() => setPreviewMode(!previewMode)}
                    >
                        {previewMode ? <Settings2 size={18} className="mr-2" /> : <Eye size={18} className="mr-2" />}
                        {previewMode ? 'Edit' : 'Preview'}
                    </Button>
                    <Button onClick={handleSave}>
                        <Check size={18} className="mr-2" />
                        Finish Design
                    </Button>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 flex overflow-hidden">
                {/* Left Panel - Hidden in Preview Mode */}
                {!previewMode && (
                    <div className="w-72 bg-white border-r overflow-y-auto">
                        <div className="flex border-b">
                            {[
                                { id: 'blocks', label: 'Blocks', icon: Layout },
                                { id: 'theme', label: 'Theme', icon: Palette },
                            ].map(tab => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActivePanel(tab.id)}
                                    className={`flex-1 py-3 text-sm font-medium transition-colors ${activePanel === tab.id
                                        ? 'text-indigo-600 border-b-2 border-indigo-600'
                                        : 'text-gray-500 hover:text-gray-700'
                                        }`}
                                >
                                    <tab.icon size={16} className="mx-auto mb-1" />
                                    {tab.label}
                                </button>
                            ))}
                        </div>

                        <div className="p-4">
                            {activePanel === 'blocks' && (
                                <div className="space-y-2">
                                    <p className="text-xs text-gray-500 uppercase font-medium mb-3">Add Components</p>
                                    {BLOCK_TYPES.map(block => (
                                        <button
                                            key={block.type}
                                            onClick={() => addBlock(block.type)}
                                            className="w-full flex items-center gap-3 p-3 rounded-lg border border-gray-200 hover:border-indigo-300 hover:bg-indigo-50 transition-colors text-left"
                                        >
                                            <block.icon size={20} className="text-indigo-600" />
                                            <div>
                                                <p className="font-medium text-sm">{block.label}</p>
                                                <p className="text-xs text-gray-500">{block.description}</p>
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            )}

                            {activePanel === 'theme' && (
                                <div className="space-y-6">
                                    <div>
                                        <p className="text-xs text-gray-500 uppercase font-medium mb-3">Colors</p>
                                        {Object.entries(design.theme.colors || {}).map(([key, value]) => (
                                            <div key={key} className="flex items-center justify-between mb-2">
                                                <label className="text-sm capitalize">{key.replace(/([A-Z])/g, ' $1')}</label>
                                                <input
                                                    type="color"
                                                    value={value}
                                                    onChange={(e) => updateTheme(`colors.${key}`, e.target.value)}
                                                    className="w-8 h-8 rounded cursor-pointer border"
                                                />
                                            </div>
                                        ))}
                                    </div>

                                    <div>
                                        <p className="text-xs text-gray-500 uppercase font-medium mb-3">Fonts</p>
                                        {Object.entries(design.theme.fonts || {}).map(([key, value]) => (
                                            <div key={key} className="mb-3">
                                                <label className="text-sm capitalize block mb-1">{key}</label>
                                                <select
                                                    value={value}
                                                    onChange={(e) => updateTheme(`fonts.${key}`, e.target.value)}
                                                    className="w-full px-3 py-2 border rounded-lg text-sm"
                                                >
                                                    <option value="Playfair Display">Playfair Display</option>
                                                    <option value="Inter">Inter</option>
                                                    <option value="Dancing Script">Dancing Script</option>
                                                    <option value="Poppins">Poppins</option>
                                                    <option value="Roboto">Roboto</option>
                                                    <option value="Lora">Lora</option>
                                                    <option value="Montserrat">Montserrat</option>
                                                </select>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* Center - Canvas */}
                <div className="flex-1 overflow-y-auto bg-gray-200 p-8">
                    <div
                        className="mx-auto bg-white shadow-2xl rounded-lg overflow-hidden transition-all duration-300"
                        style={{ maxWidth: design.globalSettings?.maxWidth || '800px' }}
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

                {/* Right Panel - Block Editor (Hidden in Preview) */}
                {!previewMode && selectedBlock && (
                    <div className="w-80 bg-white border-l overflow-y-auto">
                        <div className="p-4 border-b flex items-center justify-between">
                            <h3 className="font-semibold capitalize">{selectedBlock.type} Block</h3>
                            <button
                                onClick={() => removeBlock(selectedBlock.id)}
                                className="p-2 text-red-500 hover:bg-red-50 rounded-lg"
                            >
                                <Trash2 size={18} />
                            </button>
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
                                            <option value="gradient">Gradient</option>
                                            <option value="image">Image</option>
                                        </select>
                                    </div>

                                    {selectedBlock.settings?.backgroundType === 'solid' && (
                                        <div className="flex items-center gap-2">
                                            <label className="text-sm">Color</label>
                                            <input
                                                type="color"
                                                value={selectedBlock.settings?.backgroundColor || '#ffffff'}
                                                onChange={(e) => updateBlockSettings('backgroundColor', e.target.value)}
                                                className="w-8 h-8 rounded cursor-pointer"
                                            />
                                        </div>
                                    )}

                                    {selectedBlock.settings?.backgroundType === 'image' && (
                                        <div>
                                            <label className="text-sm block mb-1">Image URL</label>
                                            <input
                                                type="text"
                                                value={selectedBlock.settings?.backgroundImage || ''}
                                                onChange={(e) => updateBlockSettings('backgroundImage', e.target.value)}
                                                placeholder="https://..."
                                                className="w-full px-3 py-2 border rounded-lg text-sm"
                                            />
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Layout Settings */}
                            <div>
                                <p className="text-xs text-gray-500 uppercase font-medium mb-3">Layout</p>
                                <div className="space-y-3">
                                    {selectedBlock.type === 'rsvp' && (
                                        <div>
                                            <label className="text-sm block mb-1">RSVP Style</label>
                                            <select
                                                value={selectedBlock.settings?.rsvpStyle || 'modal'}
                                                onChange={(e) => updateBlockSettings('rsvpStyle', e.target.value)}
                                                className="w-full px-3 py-2 border rounded-lg text-sm"
                                            >
                                                <option value="modal">Modal (Popup)</option>
                                                <option value="embedded">Embedded (On Page)</option>
                                            </select>
                                        </div>
                                    )}
                                    <div>
                                        <label className="text-sm block mb-1">Height</label>
                                        <select
                                            value={selectedBlock.settings?.height || 'auto'}
                                            onChange={(e) => updateBlockSettings('height', e.target.value)}
                                            className="w-full px-3 py-2 border rounded-lg text-sm"
                                        >
                                            <option value="auto">Auto</option>
                                            <option value="50vh">Half Screen</option>
                                            <option value="100vh">Full Screen</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="text-sm block mb-1">Text Align</label>
                                        <div className="flex gap-2">
                                            {['left', 'center', 'right'].map(align => (
                                                <button
                                                    key={align}
                                                    onClick={() => updateBlockSettings('textAlign', align)}
                                                    className={`flex-1 py-2 text-sm rounded border ${selectedBlock.settings?.textAlign === align
                                                        ? 'bg-indigo-50 border-indigo-300 text-indigo-600'
                                                        : 'hover:bg-gray-50'
                                                        }`}
                                                >
                                                    {align.charAt(0).toUpperCase() + align.slice(1)}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Content Settings */}
                            <div>
                                <p className="text-xs text-gray-500 uppercase font-medium mb-3">Content</p>
                                <div className="space-y-3">
                                    {Object.entries(selectedBlock.content || {}).map(([key, value]) => {
                                        // Skip internal keys or specific types if needed
                                        if (key === 'layout' || key === 'style') return null;

                                        return (
                                            <div key={key}>
                                                <label className="text-sm block mb-1 capitalize">
                                                    {key.replace(/([A-Z])/g, ' $1').trim()}
                                                </label>
                                                {typeof value === 'boolean' ? (
                                                    <div className="flex items-center">
                                                        <input
                                                            type="checkbox"
                                                            checked={value}
                                                            onChange={(e) => updateBlockContent(key, e.target.checked)}
                                                            className="w-4 h-4 text-indigo-600 rounded border-gray-300 focus:ring-indigo-500"
                                                        />
                                                        <span className="ml-2 text-sm text-gray-600">
                                                            {value ? 'Shown' : 'Hidden'}
                                                        </span>
                                                    </div>
                                                ) : key === 'text' || key.includes('MESSAGE') ? (
                                                    <textarea
                                                        value={value}
                                                        onChange={(e) => updateBlockContent(key, e.target.value)}
                                                        rows={4}
                                                        className="w-full px-3 py-2 border rounded-lg text-sm"
                                                    />
                                                ) : (
                                                    <input
                                                        type="text"
                                                        value={value}
                                                        onChange={(e) => updateBlockContent(key, e.target.value)}
                                                        className="w-full px-3 py-2 border rounded-lg text-sm"
                                                    />
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Move Block */}
                            <div className="flex gap-2 pt-4 border-t">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="flex-1"
                                    onClick={() => moveBlock(selectedBlock.id, 'up')}
                                >
                                    Move Up
                                </Button>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="flex-1"
                                    onClick={() => moveBlock(selectedBlock.id, 'down')}
                                >
                                    Move Down
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
