import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, ArrowRight, Check, Calendar, LayoutTemplate, PenTool, Loader } from 'lucide-react';
import { toast } from 'react-toastify';
import { Button, Card, Input } from '../../components/ui';
import UserCustomBuilder from '../../components/invitation/UserCustomBuilder';
import api from '../../api/api';

const steps = [
    { id: 1, title: 'Choose Method', icon: LayoutTemplate },
    { id: 2, title: 'Event Details', icon: Calendar },
    { id: 3, title: 'Design', icon: PenTool },
];

const CreateInvitation = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const [currentStep, setCurrentStep] = useState(1);
    const [creationMethod, setCreationMethod] = useState(null); // 'template' or 'scratch'
    const [templates, setTemplates] = useState([]);
    const [selectedTemplate, setSelectedTemplate] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isCreating, setIsCreating] = useState(false);
    const [error, setError] = useState(null);
    const [scratchPrice, setScratchPrice] = useState(null);

    // For builder mode (both scratch and template)
    const [isBuilderOpen, setIsBuilderOpen] = useState(false);

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
    });

    useEffect(() => {
        const fetchInitialData = async () => {
            try {
                // Fetch settings for price
                const settingsRes = await api.get('/settings');
                if (settingsRes.data && settingsRes.data.scratchDesignPrice !== undefined) {
                    setScratchPrice(settingsRes.data.scratchDesignPrice);
                }

                const templateId = searchParams.get('template');
                if (templateId) {
                    setCreationMethod('template');
                    await fetchTemplates(templateId);
                } else {
                    await fetchTemplates();
                }
            } catch (err) {
                console.error('Failed to load initial data:', err);
            }
        };

        fetchInitialData();
    }, [searchParams]);

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
            // Don't show error to user immediately if just templates fail, 
            // as they might want to do scratch. Use toast instead.
            toast.error('Failed to load templates');
        } finally {
            setIsLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSelectTemplate = async (template) => {
        try {
            const { data } = await api.get(`/public/templates/${template._id}`);
            setSelectedTemplate(data);
            // Auto advance
            setCurrentStep(2);
        } catch (error) {
            console.error('Failed to load template details:', error);
            toast.error('Failed to load template details');
            setSelectedTemplate(template);
        }
    };

    const handleNextStep = () => {
        if (currentStep === 1) {
            if (!creationMethod) {
                toast.error('Please select a creation method');
                return;
            }
            if (creationMethod === 'template' && !selectedTemplate) {
                toast.error('Please select a template');
                return;
            }
        }

        if (currentStep === 2) {
            if (!formData.eventName || !formData.eventDate || !formData.venue) {
                toast.error('Please fill in required fields (Event Name, Date, Venue)');
                return;
            }

            // Unified Flow: Open builder for both Template and Scratch
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
        setIsBuilderOpen(false);
        setIsCreating(true);
        try {
            const payload = {
                content: {
                    ...formData,
                    googleMapsLink: formData.venueAddress ? `https://maps.google.com/?q=${encodeURIComponent(formData.venueAddress)}` : '',
                },
                design: design
            };

            // If template mode, include template ID for premium status tracking
            if (creationMethod === 'template' && selectedTemplate) {
                payload.template = selectedTemplate._id;
            }

            const { data } = await api.post('/invitations', payload);
            toast.success('Invitation created successfully!');

            if (!data.isPaid) {
                navigate(`/dashboard/payment/${data._id}`);
            } else {
                navigate(`/dashboard/invitations/${data._id}`);
            }

        } catch (err) {
            console.error('Failed to create invitation:', err);
            toast.error(err.response?.data?.message || 'Failed to create invitation');
        } finally {
            setIsCreating(false);
        }
    };

    if (isBuilderOpen) {
        // Prepare initial design data
        let initialDesign = null;
        if (creationMethod === 'template' && selectedTemplate?.design) {
            initialDesign = selectedTemplate.design;
        }

        return (
            <UserCustomBuilder
                initialData={{
                    formData,
                    design: initialDesign
                }}
                onSave={handleCustomDesignSave}
                onCancel={() => setIsBuilderOpen(false)}
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

    return (
        <div className="py-8">
            <div className="max-w-4xl mx-auto px-4">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">Create Invitation</h1>
                    <p className="text-gray-600 mt-1">Follow the steps to create your digital invitation</p>
                </div>

                {/* Progress Steps */}
                <div className="mb-8 bg-white rounded-2xl p-6 shadow-lg">
                    <div className="flex items-center justify-between">
                        {steps.map((step, index) => (
                            <div key={step.id} className="flex items-center flex-1">
                                <div className="flex items-center">
                                    <div
                                        className={`flex items-center justify-center w-10 h-10 rounded-full transition-colors ${currentStep >= step.id
                                            ? 'bg-indigo-600 text-white'
                                            : 'bg-gray-200 text-gray-500'
                                            }`}
                                    >
                                        {currentStep > step.id ? (
                                            <Check size={20} />
                                        ) : (
                                            <step.icon size={20} />
                                        )}
                                    </div>
                                    <span
                                        className={`ml-3 font-medium hidden sm:block ${currentStep >= step.id ? 'text-indigo-600' : 'text-gray-500'
                                            }`}
                                    >
                                        {step.title}
                                    </span>
                                </div>
                                {index < steps.length - 1 && (
                                    <div
                                        className={`flex-1 h-1 mx-4 rounded ${currentStep > step.id ? 'bg-indigo-600' : 'bg-gray-200'
                                            }`}
                                    />
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Step 1: Choose Method */}
                {currentStep === 1 && (
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                    >
                        {!creationMethod ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <Card
                                    className="p-8 text-center cursor-pointer hover:border-indigo-500 transition-all hover:shadow-xl group"
                                    onClick={() => setCreationMethod('template')}
                                >
                                    <div className="w-16 h-16 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                                        <LayoutTemplate size={32} />
                                    </div>
                                    <h3 className="text-xl font-bold text-gray-900 mb-2">Use a Template</h3>
                                    <p className="text-gray-500">Choose from our beautiful collection of pre-designed templates.</p>
                                </Card>

                                <Card
                                    className="p-8 text-center cursor-pointer hover:border-indigo-500 transition-all hover:shadow-xl group"
                                    onClick={() => setCreationMethod('scratch')}
                                >
                                    <div className="w-16 h-16 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                                        <PenTool size={32} />
                                    </div>
                                    <h3 className="text-xl font-bold text-gray-900 mb-2">Design from Scratch</h3>
                                    <p className="text-gray-500">Build your own unique invitation using our drag-and-drop editor.</p>
                                </Card>
                            </div>
                        ) : creationMethod === 'template' ? (
                            <div>
                                <div className="flex items-center justify-between mb-6">
                                    <h2 className="text-xl font-bold text-gray-900">Choose a Template</h2>
                                    <Button variant="ghost" onClick={() => setCreationMethod(null)}>Change Method</Button>
                                </div>
                                {isLoading ? (
                                    <div className="flex items-center justify-center py-12">
                                        <Loader className="animate-spin text-indigo-600" size={40} />
                                    </div>
                                ) : templates.length === 0 ? (
                                    <Card className="p-8 text-center">
                                        <p className="text-gray-500">No templates available. Please contact admin.</p>
                                    </Card>
                                ) : (
                                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                        {templates.map((template) => (
                                            <motion.div
                                                key={template._id}
                                                whileHover={{ scale: 1.02 }}
                                                onClick={() => handleSelectTemplate(template)}
                                                className={`cursor-pointer rounded-xl overflow-hidden border-2 transition-all bg-white shadow-md ${selectedTemplate?._id === template._id
                                                    ? 'border-indigo-600 ring-4 ring-indigo-100'
                                                    : 'border-transparent hover:border-gray-300'
                                                    }`}
                                            >
                                                <div className="aspect-[4/3] relative">
                                                    <img
                                                        src={template.previewImage || '/placeholder-template.jpg'}
                                                        alt={template.name}
                                                        className="w-full h-full object-cover"
                                                    />
                                                    {template.isPremium && (
                                                        <div className="absolute top-2 right-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white text-xs px-2 py-1 rounded-full font-medium">
                                                            Premium
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="p-3">
                                                    <h3 className="font-medium text-gray-900">{template.name}</h3>
                                                    <p className="text-sm text-gray-500">
                                                        {template.isPremium ? `₹${template.price}` : 'Free'}
                                                    </p>
                                                </div>
                                            </motion.div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="text-center py-12">
                                <h2 className="text-xl font-bold text-gray-900 mb-4">Design from Scratch</h2>
                                <p className="text-gray-600 mb-6">
                                    Create a unique invitation completely from scratch.
                                    <br />
                                    <span className="font-semibold text-indigo-600">
                                        Price: {scratchPrice !== null ? `₹${scratchPrice}` : 'Loading...'}
                                    </span>
                                </p>
                                <p className="text-gray-500 text-sm mb-8">
                                    Click 'Start Designing' to enter event details and begin.
                                </p>
                                <Button variant="outline" onClick={() => setCreationMethod(null)}>Change Method</Button>
                            </div>
                        )}
                    </motion.div>
                )}

                {/* Step 2: Event Details */}
                {currentStep === 2 && (
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                    >
                        <h2 className="text-xl font-bold text-gray-900 mb-6">Event Details</h2>
                        <Card className="p-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <Input
                                    label="Event Name *"
                                    name="eventName"
                                    value={formData.eventName}
                                    onChange={handleInputChange}
                                    placeholder="e.g., Wedding Ceremony"
                                />
                                <Input
                                    label="Host Name"
                                    name="hostName"
                                    value={formData.hostName}
                                    onChange={handleInputChange}
                                    placeholder="e.g., John & Jane"
                                />
                                <Input
                                    label="Event Date *"
                                    name="eventDate"
                                    type="date"
                                    value={formData.eventDate}
                                    onChange={handleInputChange}
                                />
                                <Input
                                    label="Event Time"
                                    name="eventTime"
                                    type="time"
                                    value={formData.eventTime}
                                    onChange={handleInputChange}
                                />
                                <Input
                                    label="Venue Name *"
                                    name="venue"
                                    value={formData.venue}
                                    onChange={handleInputChange}
                                    placeholder="e.g., Grand Ballroom"
                                />
                                <Input
                                    label="Venue Address"
                                    name="venueAddress"
                                    value={formData.venueAddress}
                                    onChange={handleInputChange}
                                    placeholder="Full address"
                                />
                                <Input
                                    label="Contact Number"
                                    name="hostContact"
                                    value={formData.hostContact}
                                    onChange={handleInputChange}
                                    placeholder="+91 9876543210"
                                />
                                <Input
                                    label="RSVP Deadline"
                                    name="rsvpDeadline"
                                    type="date"
                                    value={formData.rsvpDeadline}
                                    onChange={handleInputChange}
                                />
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Personal Message
                                    </label>
                                    <textarea
                                        name="message"
                                        value={formData.message}
                                        onChange={handleInputChange}
                                        rows={4}
                                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                                        placeholder="Add a personal message to your guests..."
                                    />
                                </div>
                            </div>
                        </Card>
                    </motion.div>
                )}

                {/* Navigation Buttons */}
                <div className="flex justify-between mt-8">
                    <Button
                        variant="outline"
                        onClick={handlePrevStep}
                        disabled={currentStep === 1 && !creationMethod}
                    >
                        <ArrowLeft size={18} className="mr-2" />
                        {currentStep === 1 ? 'Back to Templates' : 'Previous'}
                    </Button>

                    <Button onClick={handleNextStep}>
                        {currentStep === 1 && creationMethod === 'scratch'
                            ? 'Next: Event Details'
                            : currentStep === 1
                                ? 'Next Step'
                                : 'Start Designing'}
                        <ArrowRight size={18} className="ml-2" />
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default CreateInvitation;
