import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
    ArrowLeft, Save, Eye, Plus, Trash2, GripVertical,
    Image, Type, Calendar, MapPin, Users, MessageSquare,
    Layout, Divide, Timer, Palette, Settings2
} from 'lucide-react';
import { toast } from 'react-toastify';
import { Button, Card, Input, Modal } from '../../components/ui';
import { BlocksRenderer } from '../../components/blocks/BlockRenderer';
import api from '../../api/api';

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
    styles: {},
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
            return { style: 'line' }; // line, dots, ornament
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

const AdminTemplateBuilder = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const isEditing = Boolean(id);

    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [categories, setCategories] = useState([]);
    const [showPreview, setShowPreview] = useState(false);
    const [selectedBlock, setSelectedBlock] = useState(null);
    const [activePanel, setActivePanel] = useState('blocks'); // blocks, theme, settings

    // Template state
    const [template, setTemplate] = useState({
        name: '',
        description: '',
        category: '',
        previewImage: '',
        isPremium: false,
        price: 0,
        isActive: true,
        design: {
            blocks: [getDefaultBlock('hero')],
            theme: DEFAULT_THEME,
            globalSettings: {
                maxWidth: '800px',
                fontScale: 1,
                animationsEnabled: true,
            },
        },
        customizableFields: [],
        defaultContent: {
            eventName: 'Beautiful Celebration',
            hostName: 'John & Jane',
            eventDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
            eventTime: '6:00 PM',
            venue: 'Grand Ballroom',
            venueAddress: '123 Celebration Street, City',
            message: 'We would be honored to have you celebrate with us!',
        },
    });

    useEffect(() => {
        fetchCategories();
        if (isEditing) {
            fetchTemplate();
        }
    }, [id]);

    const fetchCategories = async () => {
        try {
            const { data } = await api.get('/admin/categories');
            setCategories(data);
        } catch {
            console.error('Failed to fetch categories');
        }
    };

    const fetchTemplate = async () => {
        setLoading(true);
        try {
            const { data } = await api.get(`/admin/templates/${id}`);
            setTemplate(data);
        } catch {
            toast.error('Failed to load template');
            navigate('/admin/templates');
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        if (!template.name || !template.category) {
            toast.error('Please fill in template name and category');
            return;
        }

        setSaving(true);
        try {
            if (isEditing) {
                await api.put(`/admin/templates/${id}`, template);
                toast.success('Template updated successfully');
            } else {
                await api.post('/admin/templates', template);
                toast.success('Template created successfully');
                navigate('/admin/templates');
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to save template');
        } finally {
            setSaving(false);
        }
    };

    const addBlock = (type) => {
        const newBlock = getDefaultBlock(type);
        newBlock.order = template.design.blocks.length;

        setTemplate(prev => ({
            ...prev,
            design: {
                ...prev.design,
                blocks: [...prev.design.blocks, newBlock],
            },
        }));

        setSelectedBlock(newBlock);
    };

    const removeBlock = (blockId) => {
        setTemplate(prev => ({
            ...prev,
            design: {
                ...prev.design,
                blocks: prev.design.blocks.filter(b => b.id !== blockId),
            },
        }));

        if (selectedBlock?.id === blockId) {
            setSelectedBlock(null);
        }
    };

    const updateBlock = (blockId, updates) => {
        setTemplate(prev => ({
            ...prev,
            design: {
                ...prev.design,
                blocks: prev.design.blocks.map(b =>
                    b.id === blockId ? { ...b, ...updates } : b
                ),
            },
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
        setTemplate(prev => {
            const newTheme = { ...prev.design.theme };
            let current = newTheme;
            for (let i = 0; i < keys.length - 1; i++) {
                current[keys[i]] = { ...current[keys[i]] };
                current = current[keys[i]];
            }
            current[keys[keys.length - 1]] = value;
            return {
                ...prev,
                design: { ...prev.design, theme: newTheme },
            };
        });
    };

    const moveBlock = (blockId, direction) => {
        const blocks = [...template.design.blocks];
        const index = blocks.findIndex(b => b.id === blockId);
        const newIndex = direction === 'up' ? index - 1 : index + 1;

        if (newIndex < 0 || newIndex >= blocks.length) return;

        [blocks[index], blocks[newIndex]] = [blocks[newIndex], blocks[index]];
        blocks.forEach((b, i) => b.order = i);

        setTemplate(prev => ({
            ...prev,
            design: { ...prev.design, blocks },
        }));
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600" />
            </div>
        );
    }

    return (
        <div className="h-screen flex flex-col bg-gray-100">
            {/* Top Bar */}
            <div className="bg-white border-b px-4 py-3 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => navigate('/admin/templates')}
                        className="p-2 hover:bg-gray-100 rounded-lg"
                    >
                        <ArrowLeft size={20} />
                    </button>
                    <input
                        type="text"
                        value={template.name}
                        onChange={(e) => setTemplate({ ...template, name: e.target.value })}
                        placeholder="Template Name"
                        className="text-xl font-semibold border-none focus:outline-none focus:ring-0 bg-transparent"
                    />
                </div>

                <div className="flex items-center gap-3">
                    <Button
                        variant="outline"
                        onClick={() => setShowPreview(true)}
                    >
                        <Eye size={18} className="mr-2" />
                        Preview
                    </Button>
                    <Button
                        onClick={handleSave}
                        isLoading={saving}
                    >
                        <Save size={18} className="mr-2" />
                        Save Template
                    </Button>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 flex overflow-hidden">
                {/* Left Panel - Block Palette */}
                <div className="w-72 bg-white border-r overflow-y-auto">
                    {/* Panel Tabs */}
                    <div className="flex border-b">
                        {[
                            { id: 'blocks', label: 'Blocks', icon: Layout },
                            { id: 'theme', label: 'Theme', icon: Palette },
                            { id: 'settings', label: 'Settings', icon: Settings2 },
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
                                <p className="text-xs text-gray-500 uppercase font-medium mb-3">Add Blocks</p>
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
                                    {Object.entries(template.design.theme.colors || {}).map(([key, value]) => (
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
                                    {Object.entries(template.design.theme.fonts || {}).map(([key, value]) => (
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

                        {activePanel === 'settings' && (
                            <div className="space-y-4">
                                <div>
                                    <label className="text-sm font-medium block mb-1">Category</label>
                                    <select
                                        value={template.category}
                                        onChange={(e) => setTemplate({ ...template, category: e.target.value })}
                                        className="w-full px-3 py-2 border rounded-lg text-sm"
                                    >
                                        <option value="">Select Category</option>
                                        {categories.map(cat => (
                                            <option key={cat._id} value={cat._id}>{cat.name}</option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="text-sm font-medium block mb-1">Description</label>
                                    <textarea
                                        value={template.description}
                                        onChange={(e) => setTemplate({ ...template, description: e.target.value })}
                                        className="w-full px-3 py-2 border rounded-lg text-sm"
                                        rows={3}
                                    />
                                </div>

                                <div className="flex items-center justify-between">
                                    <span className="text-sm">Premium Template</span>
                                    <input
                                        type="checkbox"
                                        checked={template.isPremium}
                                        onChange={(e) => setTemplate({ ...template, isPremium: e.target.checked })}
                                        className="w-4 h-4"
                                    />
                                </div>

                                {template.isPremium && (
                                    <div>
                                        <label className="text-sm font-medium block mb-1">Price (INR)</label>
                                        <input
                                            type="number"
                                            value={template.price}
                                            onChange={(e) => setTemplate({ ...template, price: parseInt(e.target.value) || 0 })}
                                            className="w-full px-3 py-2 border rounded-lg text-sm"
                                        />
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>

                {/* Center - Canvas */}
                <div className="flex-1 overflow-y-auto bg-gray-200 p-8">
                    <div
                        className="mx-auto bg-white shadow-2xl rounded-lg overflow-hidden"
                        style={{ maxWidth: template.design.globalSettings?.maxWidth || '800px' }}
                    >
                        {template.design.blocks.length === 0 ? (
                            <div className="py-32 text-center text-gray-400">
                                <Layout size={48} className="mx-auto mb-4 opacity-50" />
                                <p>Add blocks from the left panel to start building</p>
                            </div>
                        ) : (
                            <BlocksRenderer
                                blocks={template.design.blocks}
                                data={template.defaultContent}
                                theme={template.design.theme}
                                isEditing={true}
                                selectedBlockId={selectedBlock?.id}
                                onBlockClick={(block) => setSelectedBlock(block)}
                            />
                        )}
                    </div>
                </div>

                {/* Right Panel - Block Editor */}
                {selectedBlock && (
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

                            {/* Overlay Settings */}
                            {selectedBlock.settings?.backgroundType === 'image' && (
                                <div>
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-sm">Overlay</span>
                                        <input
                                            type="checkbox"
                                            checked={selectedBlock.settings?.overlayEnabled || false}
                                            onChange={(e) => updateBlockSettings('overlayEnabled', e.target.checked)}
                                            className="w-4 h-4"
                                        />
                                    </div>

                                    {selectedBlock.settings?.overlayEnabled && (
                                        <div className="flex items-center gap-2">
                                            <label className="text-sm">Opacity</label>
                                            <input
                                                type="range"
                                                min="0"
                                                max="1"
                                                step="0.1"
                                                value={selectedBlock.settings?.overlayOpacity || 0.3}
                                                onChange={(e) => updateBlockSettings('overlayOpacity', parseFloat(e.target.value))}
                                                className="flex-1"
                                            />
                                        </div>
                                    )}
                                </div>
                            )}

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

                            {/* Animation Settings */}
                            <div>
                                <p className="text-xs text-gray-500 uppercase font-medium mb-3">Animation</p>

                                <select
                                    value={selectedBlock.settings?.animation || 'fade-up'}
                                    onChange={(e) => updateBlockSettings('animation', e.target.value)}
                                    className="w-full px-3 py-2 border rounded-lg text-sm"
                                >
                                    <option value="none">None</option>
                                    <option value="fade-up">Fade Up</option>
                                    <option value="fade-in">Fade In</option>
                                    <option value="slide-left">Slide Left</option>
                                    <option value="slide-right">Slide Right</option>
                                    <option value="zoom">Zoom</option>
                                </select>
                            </div>

                            {/* Content Settings - varies by block type */}
                            <div>
                                <p className="text-xs text-gray-500 uppercase font-medium mb-3">Content</p>

                                {selectedBlock.type === 'hero' && (
                                    <div className="space-y-3">
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm">Show Date</span>
                                            <input
                                                type="checkbox"
                                                checked={selectedBlock.content?.showDate !== false}
                                                onChange={(e) => updateBlockContent('showDate', e.target.checked)}
                                                className="w-4 h-4"
                                            />
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm">Show Button</span>
                                            <input
                                                type="checkbox"
                                                checked={selectedBlock.content?.showButton || false}
                                                onChange={(e) => updateBlockContent('showButton', e.target.checked)}
                                                className="w-4 h-4"
                                            />
                                        </div>
                                        {selectedBlock.content?.showButton && (
                                            <div>
                                                <label className="text-sm block mb-1">Button Text</label>
                                                <input
                                                    type="text"
                                                    value={selectedBlock.content?.buttonText || 'RSVP Now'}
                                                    onChange={(e) => updateBlockContent('buttonText', e.target.value)}
                                                    className="w-full px-3 py-2 border rounded-lg text-sm"
                                                />
                                            </div>
                                        )}
                                    </div>
                                )}

                                {selectedBlock.type === 'eventDetails' && (
                                    <div className="space-y-3">
                                        <div>
                                            <label className="text-sm block mb-1">Title</label>
                                            <input
                                                type="text"
                                                value={selectedBlock.content?.title || 'Event Details'}
                                                onChange={(e) => updateBlockContent('title', e.target.value)}
                                                className="w-full px-3 py-2 border rounded-lg text-sm"
                                            />
                                        </div>
                                        <div>
                                            <label className="text-sm block mb-1">Layout</label>
                                            <select
                                                value={selectedBlock.content?.layout || 'horizontal'}
                                                onChange={(e) => updateBlockContent('layout', e.target.value)}
                                                className="w-full px-3 py-2 border rounded-lg text-sm"
                                            >
                                                <option value="horizontal">Horizontal</option>
                                                <option value="vertical">Vertical</option>
                                            </select>
                                        </div>
                                        {['showDate', 'showTime', 'showVenue'].map(key => (
                                            <div key={key} className="flex items-center justify-between">
                                                <span className="text-sm capitalize">{key.replace('show', 'Show ')}</span>
                                                <input
                                                    type="checkbox"
                                                    checked={selectedBlock.content?.[key] !== false}
                                                    onChange={(e) => updateBlockContent(key, e.target.checked)}
                                                    className="w-4 h-4"
                                                />
                                            </div>
                                        ))}
                                    </div>
                                )}

                                {selectedBlock.type === 'rsvp' && (
                                    <div className="space-y-3">
                                        <div>
                                            <label className="text-sm block mb-1">Title</label>
                                            <input
                                                type="text"
                                                value={selectedBlock.content?.title || 'Will You Join Us?'}
                                                onChange={(e) => updateBlockContent('title', e.target.value)}
                                                className="w-full px-3 py-2 border rounded-lg text-sm"
                                            />
                                        </div>
                                        <div>
                                            <label className="text-sm block mb-1">Button Text</label>
                                            <input
                                                type="text"
                                                value={selectedBlock.content?.buttonText || 'RSVP Now'}
                                                onChange={(e) => updateBlockContent('buttonText', e.target.value)}
                                                className="w-full px-3 py-2 border rounded-lg text-sm"
                                            />
                                        </div>
                                    </div>
                                )}

                                {selectedBlock.type === 'message' && (
                                    <div className="space-y-3">
                                        <div>
                                            <label className="text-sm block mb-1">Title (optional)</label>
                                            <input
                                                type="text"
                                                value={selectedBlock.content?.title || ''}
                                                onChange={(e) => updateBlockContent('title', e.target.value)}
                                                className="w-full px-3 py-2 border rounded-lg text-sm"
                                            />
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm">Use Accent Font</span>
                                            <input
                                                type="checkbox"
                                                checked={selectedBlock.content?.useAccentFont || false}
                                                onChange={(e) => updateBlockContent('useAccentFont', e.target.checked)}
                                                className="w-4 h-4"
                                            />
                                        </div>
                                    </div>
                                )}

                                {selectedBlock.type === 'divider' && (
                                    <div>
                                        <label className="text-sm block mb-1">Style</label>
                                        <select
                                            value={selectedBlock.content?.style || 'line'}
                                            onChange={(e) => updateBlockContent('style', e.target.value)}
                                            className="w-full px-3 py-2 border rounded-lg text-sm"
                                        >
                                            <option value="line">Line</option>
                                            <option value="dots">Dots</option>
                                            <option value="ornament">Ornament</option>
                                        </select>
                                    </div>
                                )}
                            </div>

                            {/* Move Block */}
                            <div className="flex gap-2">
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

            {/* Preview Modal */}
            <Modal
                isOpen={showPreview}
                onClose={() => setShowPreview(false)}
                title="Template Preview"
                size="full"
            >
                <div className="bg-gray-100 -m-6 p-6 min-h-[80vh]">
                    <div
                        className="mx-auto bg-white shadow-2xl rounded-lg overflow-hidden"
                        style={{ maxWidth: template.design.globalSettings?.maxWidth || '800px' }}
                    >
                        <BlocksRenderer
                            blocks={template.design.blocks}
                            data={template.defaultContent}
                            theme={template.design.theme}
                        />
                    </div>
                </div>
            </Modal>
        </div>
    );
};

export default AdminTemplateBuilder;
