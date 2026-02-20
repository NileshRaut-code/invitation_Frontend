import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
    ArrowLeft, ArrowRight, Check, Calendar, LayoutTemplate, PenTool,
    Loader, Sparkles, Star, Palette, Layers, Wand2, MapPin, Clock,
    User, Phone, MessageSquare, Link2
} from 'lucide-react';
import { toast } from 'react-toastify';
import { Button, Card, Input } from '../../components/ui';
import UserCustomBuilder from '../../components/invitation/UserCustomBuilder';
import api from '../../api/api';

const steps = [
    { id: 1, title: 'Choose Method', desc: 'Template or scratch', icon: LayoutTemplate },
    { id: 2, title: 'Event Details', desc: 'Date, venue & more', icon: Calendar },
    { id: 3, title: 'Design', desc: 'Customize your invitation', icon: PenTool },
];

const CreateInvitation = () => {
    const { id: editId } = useParams();
    const isEditMode = Boolean(editId);
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const [currentStep, setCurrentStep] = useState(isEditMode ? 2 : 1);
    const [creationMethod, setCreationMethod] = useState(null);
    const [templates, setTemplates] = useState([]);
    const [selectedTemplate, setSelectedTemplate] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isCreating, setIsCreating] = useState(false);
    const [error, setError] = useState(null);
    const [scratchPrice, setScratchPrice] = useState(null);
    const [isBuilderOpen, setIsBuilderOpen] = useState(false);
    const [existingDesign, setExistingDesign] = useState(null);
    const [existingInvitation, setExistingInvitation] = useState(null);

    const [formData, setFormData] = useState({
        eventName: '',
        eventDate: '',
        eventTime: '',
        venue: '',
        venueAddress: '',
        hostName: '',
        hostContact: '',
        message: '',
        rsvpDeadline: '',
        googleMapsLink: '',
    });
    const [fieldErrors, setFieldErrors] = useState({});

    useEffect(() => {
        const fetchInitialData = async () => {
            try {
                const settingsRes = await api.get('/settings');
                if (settingsRes.data && settingsRes.data.scratchDesignPrice !== undefined) {
                    setScratchPrice(settingsRes.data.scratchDesignPrice);
                }

                if (isEditMode) {
                    // Edit mode: fetch existing invitation
                    const { data: inv } = await api.get(`/invitations/${editId}`);
                    setExistingInvitation(inv);
                    setExistingDesign(inv.design || null);
                    setCreationMethod(inv.template ? 'template' : 'scratch');
                    if (inv.template) {
                        setSelectedTemplate(inv.template);
                    }
                    // Pre-fill form from existing content
                    setFormData({
                        eventName: inv.content?.eventName || '',
                        eventDate: inv.content?.eventDate ? new Date(inv.content.eventDate).toISOString().split('T')[0] : '',
                        eventTime: inv.content?.eventTime || '',
                        venue: inv.content?.venue || '',
                        venueAddress: inv.content?.venueAddress || '',
                        hostName: inv.content?.hostName || '',
                        hostContact: inv.content?.hostContact || '',
                        message: inv.content?.message || '',
                        rsvpDeadline: inv.content?.rsvpDeadline ? new Date(inv.content.rsvpDeadline).toISOString().split('T')[0] : '',
                        googleMapsLink: inv.content?.googleMapsLink || '',
                    });
                    await fetchTemplates();
                } else {
                    const templateId = searchParams.get('template');
                    if (templateId) {
                        setCreationMethod('template');
                        await fetchTemplates(templateId);
                    } else {
                        await fetchTemplates();
                    }
                }
            } catch (err) {
                console.error('Failed to load initial data:', err);
                if (isEditMode) setError('Failed to load invitation for editing');
            }
        };
        fetchInitialData();
    }, [searchParams, editId]);

    const fetchTemplates = async (preselectedId) => {
        try {
            setError(null);
            const { data } = await api.get('/public/templates');
            setTemplates(data || []);
            if (preselectedId && data) {
                const template = data.find((t) => t._id === preselectedId);
                if (template) {
                    setSelectedTemplate(template);
                    setCreationMethod('template');
                    setCurrentStep(2);
                }
            }
        } catch (err) {
            console.error('Failed to load templates:', err);
            toast.error('Failed to load templates');
        } finally {
            setIsLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        if (fieldErrors[name]) setFieldErrors(prev => ({ ...prev, [name]: null }));
    };

    const handleSelectTemplate = async (template) => {
        // Just select the template visually — don't auto-advance
        setSelectedTemplate(template);
        // Fetch full details in background
        try {
            const { data } = await api.get(`/public/templates/${template._id}`);
            setSelectedTemplate(data);
        } catch (error) {
            console.error('Failed to load template details:', error);
            // Keep the basic template object for now, details fetched later
        }
    };

    const handleNextStep = () => {
        if (currentStep === 1) {
            if (!creationMethod) {
                toast.error('Please select a creation method');
                return;
            }
            if (creationMethod === 'template' && !selectedTemplate) {
                toast.error('Please select a template first');
                return;
            }
            // Advance to step 2 explicitly
            setCurrentStep(2);
            return;
        }

        if (currentStep === 2) {
            const errors = {};
            if (!formData.eventName.trim()) errors.eventName = 'Event name is required';
            if (!formData.eventDate) errors.eventDate = 'Event date is required';
            if (!formData.venue.trim()) errors.venue = 'Venue name is required';
            if (formData.rsvpDeadline && formData.eventDate && new Date(formData.rsvpDeadline) > new Date(formData.eventDate)) {
                errors.rsvpDeadline = 'RSVP deadline must be before event date';
            }
            if (formData.eventDate && new Date(formData.eventDate) < new Date(new Date().toDateString())) {
                errors.eventDate = 'Event date must be in the future';
            }
            if (formData.googleMapsLink && !formData.googleMapsLink.startsWith('http')) {
                errors.googleMapsLink = 'Please enter a valid URL starting with http';
            }
            setFieldErrors(errors);
            if (Object.keys(errors).length > 0) {
                toast.error('Please fix the highlighted errors');
                return;
            }
            setIsBuilderOpen(true);
            return;
        }

        setCurrentStep((prev) => Math.min(prev + 1, 3));
    };

    const handlePrevStep = () => {
        if (currentStep === 2 && creationMethod === 'template' && !selectedTemplate) {
            setCreationMethod(null);
            setCurrentStep(1);
            return;
        }
        if (currentStep === 2) {
            setCurrentStep(1);
            return;
        }
        setCurrentStep((prev) => Math.max(prev - 1, 1));
    };

    const handleCustomDesignSave = async (design) => {
        if (isCreating) return;
        setIsCreating(true);
        try {
            const payload = {
                content: {
                    ...formData,
                    googleMapsLink: formData.googleMapsLink || (formData.venueAddress ? `https://maps.google.com/?q=${encodeURIComponent(formData.venueAddress)}` : ''),
                },
                design: design
            };

            if (isEditMode) {
                // Edit mode: PUT request
                await api.put(`/invitations/${editId}`, payload);
                setIsBuilderOpen(false);
                toast.success('Invitation updated successfully!');
                navigate(`/dashboard/invitations/${editId}`);
            } else {
                // Create mode: POST request
                if (creationMethod === 'template' && selectedTemplate) {
                    payload.template = selectedTemplate._id;
                }

                const { data } = await api.post('/invitations', payload);
                setIsBuilderOpen(false);
                toast.success('Invitation created successfully!');

                if (!data.isPaid) {
                    navigate(`/dashboard/payment/${data._id}`);
                } else {
                    navigate(`/dashboard/invitations/${data._id}`);
                }
            }
        } catch (err) {
            console.error(`Failed to ${isEditMode ? 'update' : 'create'} invitation:`, err);
            toast.error(err.response?.data?.message || `Failed to ${isEditMode ? 'update' : 'create'} invitation`);
        } finally {
            setIsCreating(false);
        }
    };

    if (isBuilderOpen) {
        let initialDesign = null;
        if (isEditMode && existingDesign) {
            initialDesign = existingDesign;
        } else if (creationMethod === 'template' && selectedTemplate?.design) {
            initialDesign = selectedTemplate.design;
        }

        return (
            <UserCustomBuilder
                initialData={{ formData, design: initialDesign }}
                planType={
                    creationMethod === 'scratch'
                        ? 'scratch'
                        : selectedTemplate?.isPremium ? 'paid' : 'free'
                }
                onSave={handleCustomDesignSave}
                onCancel={() => setIsBuilderOpen(false)}
                isSaving={isCreating}
            />
        );
    }

    if (error) {
        return (
            <div className="max-w-4xl mx-auto px-4 py-12">
                <Card className="p-8 text-center">
                    <p className="text-red-500 mb-4">{error}</p>
                    <Button onClick={() => fetchTemplates()}>Try Again</Button>
                </Card>
            </div>
        );
    }

    // --- Field error helper ---
    const FieldError = ({ name }) =>
        fieldErrors[name] ? <p className="text-red-500 text-xs mt-1 flex items-center gap-1">⚠ {fieldErrors[name]}</p> : null;

    return (
        <div className="min-h-screen" style={{ background: 'linear-gradient(135deg, #f8fafc 0%, #eef2ff 50%, #faf5ff 100%)' }}>
            <div className="max-w-5xl mx-auto px-4 py-8">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-8"
                >
                    <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">{isEditMode ? 'Edit Invitation' : 'Create Invitation'}</h1>
                    <p className="text-gray-500 mt-1">{isEditMode ? 'Update your invitation details and design' : 'Design your perfect digital invitation in 3 easy steps'}</p>
                </motion.div>

                {/* ── Premium Step Indicator ── */}
                <div className="mb-10">
                    <div className="flex items-center justify-between">
                        {steps.map((step, index) => (
                            <div key={step.id} className="flex items-center flex-1">
                                <div className="flex items-center gap-3">
                                    {/* Step circle */}
                                    <div className="relative">
                                        <motion.div
                                            animate={currentStep === step.id ? { scale: [1, 1.08, 1] } : {}}
                                            transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
                                            className={`flex items-center justify-center w-11 h-11 rounded-full font-semibold text-sm transition-all duration-300 ${currentStep > step.id
                                                ? 'bg-gradient-to-br from-green-500 to-emerald-600 text-white shadow-lg shadow-green-200'
                                                : currentStep === step.id
                                                    ? 'bg-gradient-to-br from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-200'
                                                    : 'bg-gray-100 text-gray-400 border-2 border-gray-200'
                                                }`}
                                        >
                                            {currentStep > step.id ? (
                                                <Check size={18} strokeWidth={3} />
                                            ) : (
                                                <step.icon size={18} />
                                            )}
                                        </motion.div>
                                        {currentStep === step.id && (
                                            <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-indigo-500 rounded-full border-2 border-white animate-pulse" />
                                        )}
                                    </div>
                                    {/* Step text */}
                                    <div className="hidden sm:block">
                                        <p className={`text-sm font-semibold leading-tight ${currentStep >= step.id ? 'text-gray-900' : 'text-gray-400'
                                            }`}>
                                            {step.title}
                                        </p>
                                        <p className="text-xs text-gray-400">{step.desc}</p>
                                    </div>
                                </div>
                                {/* Connector */}
                                {index < steps.length - 1 && (
                                    <div className="flex-1 mx-4 h-0.5 rounded-full bg-gray-200 overflow-hidden">
                                        <motion.div
                                            initial={{ width: '0%' }}
                                            animate={{ width: currentStep > step.id ? '100%' : '0%' }}
                                            transition={{ duration: 0.5, ease: 'easeOut' }}
                                            className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full"
                                        />
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                {/* ── Step 1: Choose Method ── */}
                {currentStep === 1 && (
                    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}>
                        {!creationMethod ? (
                            <div>
                                <h2 className="text-lg font-bold text-gray-800 mb-5">How would you like to start?</h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {/* Template Card */}
                                    <motion.div
                                        whileHover={{ y: -4 }}
                                        whileTap={{ scale: 0.98 }}
                                        onClick={() => setCreationMethod('template')}
                                        className="relative cursor-pointer bg-white rounded-2xl border-2 border-transparent p-8 shadow-sm hover:shadow-xl hover:border-indigo-400 transition-all group overflow-hidden"
                                    >
                                        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-indigo-50 to-transparent rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity" />
                                        <div className="relative">
                                            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-blue-600 flex items-center justify-center mb-5 shadow-lg shadow-indigo-200 group-hover:scale-110 transition-transform">
                                                <LayoutTemplate size={28} className="text-white" />
                                            </div>
                                            <h3 className="text-xl font-bold text-gray-900 mb-2">Use a Template</h3>
                                            <p className="text-gray-500 text-sm mb-5">Start with a professionally designed template and customize it to fit your event.</p>
                                            <ul className="space-y-2">
                                                {['Beautiful pre-designed layouts', 'Quick & easy to customize', 'Free & premium options'].map((f, i) => (
                                                    <li key={i} className="flex items-center gap-2 text-sm text-gray-600">
                                                        <Check size={14} className="text-indigo-500 flex-shrink-0" /> {f}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    </motion.div>

                                    {/* Scratch Card */}
                                    <motion.div
                                        whileHover={{ y: -4 }}
                                        whileTap={{ scale: 0.98 }}
                                        onClick={() => setCreationMethod('scratch')}
                                        className="relative cursor-pointer bg-white rounded-2xl border-2 border-transparent p-8 shadow-sm hover:shadow-xl hover:border-purple-400 transition-all group overflow-hidden"
                                    >
                                        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-purple-50 to-transparent rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity" />
                                        <div className="relative">
                                            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center mb-5 shadow-lg shadow-purple-200 group-hover:scale-110 transition-transform">
                                                <PenTool size={28} className="text-white" />
                                            </div>
                                            <h3 className="text-xl font-bold text-gray-900 mb-2">Design from Scratch</h3>
                                            <p className="text-gray-500 text-sm mb-5">Full creative control with our block editor to build something truly unique.</p>
                                            <ul className="space-y-2">
                                                {['Drag-and-drop block editor', 'Complete design freedom', `Starting at ₹${scratchPrice ?? '...'}`].map((f, i) => (
                                                    <li key={i} className="flex items-center gap-2 text-sm text-gray-600">
                                                        <Sparkles size={14} className="text-purple-500 flex-shrink-0" /> {f}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    </motion.div>
                                </div>
                            </div>
                        ) : creationMethod === 'template' ? (
                            <div>
                                <div className="flex items-center justify-between mb-6">
                                    <div>
                                        <h2 className="text-xl font-bold text-gray-900">Choose a Template</h2>
                                        <p className="text-sm text-gray-500 mt-0.5">{templates.length} templates available</p>
                                    </div>
                                    <Button variant="outline" size="sm" onClick={() => { setCreationMethod(null); setSelectedTemplate(null); }}>
                                        <ArrowLeft size={16} className="mr-1" /> Change Method
                                    </Button>
                                </div>
                                {isLoading ? (
                                    <div className="flex flex-col items-center justify-center py-16">
                                        <Loader className="animate-spin text-indigo-600 mb-3" size={36} />
                                        <p className="text-sm text-gray-400">Loading templates...</p>
                                    </div>
                                ) : templates.length === 0 ? (
                                    <Card className="p-10 text-center">
                                        <Layers size={40} className="text-gray-300 mx-auto mb-3" />
                                        <p className="text-gray-500 font-medium">No templates available yet</p>
                                        <p className="text-gray-400 text-sm mt-1">Check back soon or design from scratch.</p>
                                    </Card>
                                ) : (
                                    <div className="grid grid-cols-2 md:grid-cols-3 gap-5">
                                        {templates.map((template) => (
                                            <motion.div
                                                key={template._id}
                                                whileHover={{ y: -4 }}
                                                onClick={() => handleSelectTemplate(template)}
                                                className={`cursor-pointer rounded-2xl overflow-hidden border-2 transition-all bg-white shadow-sm hover:shadow-xl ${selectedTemplate?._id === template._id
                                                    ? 'border-indigo-500 ring-4 ring-indigo-100 shadow-lg'
                                                    : 'border-gray-100 hover:border-indigo-200'
                                                    }`}
                                            >
                                                <div className="aspect-[4/3] relative overflow-hidden group">
                                                    <img
                                                        src={template.previewImage || '/placeholder-template.jpg'}
                                                        alt={template.name}
                                                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                                                    />
                                                    {/* Hover overlay */}
                                                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all flex items-center justify-center">
                                                        <span className="text-white font-semibold text-sm bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all">
                                                            Select Template
                                                        </span>
                                                    </div>
                                                    {/* Badges */}
                                                    <div className="absolute top-2.5 right-2.5 flex gap-1.5">
                                                        {template.isPremium ? (
                                                            <span className="bg-gradient-to-r from-amber-500 to-orange-500 text-white text-xs px-2.5 py-1 rounded-full font-semibold flex items-center gap-1 shadow-sm">
                                                                <Star size={10} fill="currentColor" /> Premium
                                                            </span>
                                                        ) : (
                                                            <span className="bg-green-500 text-white text-xs px-2.5 py-1 rounded-full font-semibold shadow-sm">
                                                                Free
                                                            </span>
                                                        )}
                                                    </div>
                                                    {selectedTemplate?._id === template._id && (
                                                        <div className="absolute top-2.5 left-2.5 w-7 h-7 bg-indigo-600 rounded-full flex items-center justify-center shadow-lg">
                                                            <Check size={14} className="text-white" strokeWidth={3} />
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="p-3.5">
                                                    <h3 className="font-semibold text-gray-900 text-sm">{template.name}</h3>
                                                    <p className="text-xs text-gray-400 mt-0.5">
                                                        {template.isPremium ? <span className="text-amber-600 font-semibold">₹{template.price}</span> : <span className="text-green-600 font-semibold">Free</span>}
                                                        {template.category && <span className="ml-1.5">· {template.category?.name || template.category}</span>}
                                                    </p>
                                                </div>
                                            </motion.div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ) : (
                            /* Scratch mode — feature showcase */
                            <div className="max-w-lg mx-auto">
                                <Card className="p-8 text-center bg-gradient-to-br from-purple-50 to-indigo-50 border-0 shadow-lg">
                                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center mx-auto mb-5 shadow-lg">
                                        <Wand2 size={28} className="text-white" />
                                    </div>
                                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Design from Scratch</h2>
                                    <p className="text-gray-600 mb-1">Create a completely unique invitation with our powerful editor.</p>
                                    <p className="text-lg font-bold text-indigo-600 mb-6">
                                        {scratchPrice !== null ? `₹${scratchPrice}` : '...'}
                                        <span className="text-sm font-normal text-gray-400 ml-1">per invitation</span>
                                    </p>

                                    <div className="grid grid-cols-2 gap-3 text-left mb-6">
                                        {[
                                            { icon: Layers, text: 'Block-based editor' },
                                            { icon: Palette, text: 'Full color control' },
                                            { icon: Star, text: 'Premium features' },
                                            { icon: Sparkles, text: 'Animations & effects' },
                                        ].map(({ icon: Icon, text }, i) => (
                                            <div key={i} className="flex items-center gap-2 bg-white/60 rounded-lg p-2.5 text-sm text-gray-700">
                                                <Icon size={16} className="text-purple-500 flex-shrink-0" /> {text}
                                            </div>
                                        ))}
                                    </div>

                                    <Button variant="outline" onClick={() => setCreationMethod(null)} className="mx-auto">
                                        <ArrowLeft size={16} className="mr-1" /> Change Method
                                    </Button>
                                </Card>
                            </div>
                        )}
                    </motion.div>
                )}

                {/* ── Step 2: Event Details ── */}
                {currentStep === 2 && (
                    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}>
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-md">
                                <Calendar size={20} className="text-white" />
                            </div>
                            <div>
                                <h2 className="text-xl font-bold text-gray-900">Event Details</h2>
                                <p className="text-sm text-gray-500">Fill in the important details about your event</p>
                            </div>
                        </div>

                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                            {/* Section: Basic Info */}
                            <div className="p-6 border-b border-gray-100">
                                <div className="flex items-center gap-2 mb-4">
                                    <Sparkles size={16} className="text-indigo-500" />
                                    <h3 className="text-sm font-semibold text-gray-800 uppercase tracking-wider">Basic Info</h3>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                    <div>
                                        <Input label="Event Name *" name="eventName" value={formData.eventName} onChange={handleInputChange} placeholder="e.g., Wedding Ceremony" />
                                        <FieldError name="eventName" />
                                    </div>
                                    <div>
                                        <Input label="Host Name" name="hostName" value={formData.hostName} onChange={handleInputChange} placeholder="e.g., John & Jane" />
                                    </div>
                                </div>
                            </div>

                            {/* Section: Date & Time */}
                            <div className="p-6 border-b border-gray-100">
                                <div className="flex items-center gap-2 mb-4">
                                    <Clock size={16} className="text-indigo-500" />
                                    <h3 className="text-sm font-semibold text-gray-800 uppercase tracking-wider">Date & Time</h3>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                                    <div>
                                        <Input label="Event Date *" name="eventDate" type="date" value={formData.eventDate} onChange={handleInputChange} />
                                        <FieldError name="eventDate" />
                                    </div>
                                    <div>
                                        <Input label="Event Time" name="eventTime" type="time" value={formData.eventTime} onChange={handleInputChange} />
                                    </div>
                                    <div>
                                        <Input label="RSVP Deadline" name="rsvpDeadline" type="date" value={formData.rsvpDeadline} onChange={handleInputChange} />
                                        <FieldError name="rsvpDeadline" />
                                    </div>
                                </div>
                            </div>

                            {/* Section: Venue */}
                            <div className="p-6 border-b border-gray-100">
                                <div className="flex items-center gap-2 mb-4">
                                    <MapPin size={16} className="text-indigo-500" />
                                    <h3 className="text-sm font-semibold text-gray-800 uppercase tracking-wider">Venue</h3>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                    <div>
                                        <Input label="Venue Name *" name="venue" value={formData.venue} onChange={handleInputChange} placeholder="e.g., Grand Ballroom" />
                                        <FieldError name="venue" />
                                    </div>
                                    <div>
                                        <Input label="Venue Address" name="venueAddress" value={formData.venueAddress} onChange={handleInputChange} placeholder="Full address" />
                                    </div>
                                    <div className="md:col-span-2">
                                        <Input label="Google Maps Link" name="googleMapsLink" value={formData.googleMapsLink} onChange={handleInputChange} placeholder="https://maps.google.com/... (auto-generated from address if empty)" />
                                        <FieldError name="googleMapsLink" />
                                    </div>
                                </div>
                            </div>

                            {/* Section: Contact & Message */}
                            <div className="p-6">
                                <div className="flex items-center gap-2 mb-4">
                                    <MessageSquare size={16} className="text-indigo-500" />
                                    <h3 className="text-sm font-semibold text-gray-800 uppercase tracking-wider">Contact & Message</h3>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                    <div>
                                        <Input label="Contact Number" name="hostContact" value={formData.hostContact} onChange={handleInputChange} placeholder="+91 9876543210" />
                                    </div>
                                    <div /> {/* spacer */}
                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Personal Message</label>
                                        <textarea
                                            name="message"
                                            value={formData.message}
                                            onChange={handleInputChange}
                                            rows={3}
                                            className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all text-sm resize-none"
                                            placeholder="Add a personal message to your guests... (optional)"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}

                {/* ── Navigation Buttons ── */}
                <div className="flex justify-between mt-8 pb-8">
                    <Button
                        variant="outline"
                        onClick={
                            isEditMode
                                ? () => navigate(`/dashboard/invitations/${editId}`)
                                : currentStep === 1 && !creationMethod
                                    ? () => navigate('/dashboard')
                                    : handlePrevStep
                        }
                    >
                        <ArrowLeft size={18} className="mr-2" />
                        {isEditMode ? 'Cancel' : currentStep === 1 && !creationMethod ? 'Dashboard' : currentStep === 1 ? 'Change Method' : 'Previous Step'}
                    </Button>

                    <Button
                        onClick={handleNextStep}
                        disabled={currentStep === 1 && !creationMethod}
                        className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 shadow-md hover:shadow-lg transition-all"
                    >
                        {currentStep === 2
                            ? (isEditMode ? 'Edit Design' : 'Start Designing')
                            : creationMethod
                                ? 'Next: Event Details'
                                : 'Select a Method'}
                        <ArrowRight size={18} className="ml-2" />
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default CreateInvitation;
