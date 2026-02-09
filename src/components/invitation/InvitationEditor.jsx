import { useState, useEffect } from 'react';
import { BlocksRenderer } from '../blocks/BlockRenderer';
import { Button, Modal } from '../ui';
import { Palette, Type, Layout, Check, Undo } from 'lucide-react';

const InvitationEditor = ({
    template,
    formData,
    onUpdateTheme,
    isPremium
}) => {
    // Local state for theme customization
    const [theme, setTheme] = useState(template.design?.theme || {});
    const [activeTab, setActiveTab] = useState('preview'); // preview, customize
    const [customizations, setCustomizations] = useState({});

    // customizableFields example: ["theme.colors.primary", "theme.fonts.heading"]
    const customizableFields = template.customizableFields || [];
    const hasCustomization = customizableFields.length > 0;

    useEffect(() => {
        if (template.design?.theme) {
            setTheme(template.design.theme);
        }
    }, [template]);

    const handleThemeChange = (path, value) => {
        const keys = path.split('.');
        setTheme(prev => {
            const newTheme = JSON.parse(JSON.stringify(prev));
            let current = newTheme;
            for (let i = 0; i < keys.length - 1; i++) {
                // Handle "theme.colors.primary" -> keys: ["theme", "colors", "primary"]
                // We start from index 1 because "theme" is the root object state
                // Actually, if path is "theme.colors.primary", keys are ["theme", "colors", "primary"]
                // But our state is just the theme object, so we want "colors" and "primary".
                // Let's assume customizableFields are like "colors.primary" relative to theme object
                // OR "theme.colors.primary". Let's standardize on relative to theme for simplicity in storage, 
                // but the admin builder might save them as full paths.
                // Let's look at Template model: customizableFields is [String].

                // If path starts with "theme.", strip it.
                const key = keys[i];
                if (key === 'theme' && i === 0) continue;

                if (!current[key]) current[key] = {};
                current = current[key];
            }
            current[keys[keys.length - 1]] = value;
            return newTheme;
        });

        setCustomizations(prev => ({
            ...prev,
            [path]: value
        }));

        // Notify parent
        onUpdateTheme?.(path, value);
    };

    const getValue = (path, obj) => {
        const keys = path.split('.');
        let current = obj;
        for (const key of keys) {
            if (key === 'theme') continue;
            if (current === undefined || current === null) return undefined;
            current = current[key];
        }
        return current;
    };

    const renderCustomizationControl = (field) => {
        // field example: "theme.colors.primary"
        const value = getValue(field, theme);
        const label = field.split('.').pop().replace(/([A-Z])/g, ' $1');

        // Determine input type
        if (field.includes('color')) {
            return (
                <div key={field} className="flex items-center justify-between mb-3">
                    <label className="text-sm font-medium capitalize text-gray-700">{label}</label>
                    <div className="flex items-center gap-2">
                        <input
                            type="color"
                            value={value || '#000000'}
                            onChange={(e) => handleThemeChange(field, e.target.value)}
                            className="w-8 h-8 rounded cursor-pointer border shadow-sm"
                        />
                        <span className="text-xs text-gray-500 uppercase">{value}</span>
                    </div>
                </div>
            );
        }

        if (field.includes('font')) {
            return (
                <div key={field} className="mb-4">
                    <label className="text-sm font-medium capitalize text-gray-700 block mb-1">{label}</label>
                    <select
                        value={value || 'Inter'}
                        onChange={(e) => handleThemeChange(field, e.target.value)}
                        className="w-full px-3 py-2 border rounded-lg text-sm bg-white"
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
            );
        }

        return null;
    };

    return (
        <div className="flex flex-col lg:flex-row gap-6 h-[600px]">
            {/* Design Controls (if customizable) */}
            {hasCustomization && isPremium && (
                <div className="w-full lg:w-80 flex flex-col bg-white border rounded-xl overflow-hidden shadow-sm">
                    <div className="p-4 border-b bg-gray-50">
                        <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                            <Palette size={18} className="text-indigo-600" />
                            Customize Design
                        </h3>
                    </div>
                    <div className="p-4 overflow-y-auto flex-1">
                        <p className="text-sm text-gray-500 mb-4">
                            Personalize your invitation's look and feel.
                        </p>

                        <div className="space-y-1">
                            {customizableFields.map(field => renderCustomizationControl(field))}
                        </div>

                        <div className="mt-6 pt-4 border-t">
                            <Button
                                variant="outline"
                                size="sm"
                                className="w-full"
                                onClick={() => {
                                    setTheme(template.design?.theme || {});
                                    setCustomizations({});
                                    onUpdateTheme?.('reset', template.design?.theme);
                                }}
                            >
                                <Undo size={14} className="mr-2" />
                                Reset to Default
                            </Button>
                        </div>
                    </div>
                </div>
            )}

            {/* Live Preview */}
            <div className="flex-1 bg-gray-100 rounded-xl overflow-hidden border shadow-inner flex flex-col relative">
                <div className="absolute top-4 right-4 z-10 bg-black/50 text-white px-3 py-1 rounded-full text-xs font-medium backdrop-blur-sm">
                    Live Preview
                </div>

                <div className="flex-1 overflow-y-auto custom-scrollbar">
                    <div
                        className="min-h-full bg-white shadow-xl mx-auto"
                        style={{ maxWidth: template.design?.globalSettings?.maxWidth || '800px' }}
                    >
                        <BlocksRenderer
                            blocks={template.design?.blocks || []}
                            data={formData}
                            theme={theme}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default InvitationEditor;
