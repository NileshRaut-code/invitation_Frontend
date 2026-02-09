import { useState } from 'react';
import { Button, Input } from '../ui';
import { Loader, CheckCircle, PartyPopper } from 'lucide-react';
import { toast } from 'react-toastify';
import api from '../../api/api';

const RSVPForm = ({ invitationId, onSuccess, onCancel, showCancel = false, isPreview = false }) => {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        response: 'attending',
        numberOfGuests: 1,
        message: '',
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (isPreview) {
            toast.info('This is a preview. RSVP is not saved.');
            setIsSuccess(true);
            return;
        }

        if (!formData.name || !formData.email) {
            toast.error('Please enter your name and email');
            return;
        }

        setIsSubmitting(true);
        try {
            await api.post(`/rsvps`, {
                invitation: invitationId,
                ...formData,
            });
            setIsSuccess(true);
            toast.success('Thank you for your response!');
            onSuccess?.();
        } catch (err) {
            console.error('Failed to submit RSVP:', err);
            toast.error(err.response?.data?.message || 'Failed to submit RSVP');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isSuccess) {
        return (
            <div className="text-center py-8">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    {formData.response === 'attending' ? (
                        <PartyPopper className="text-green-600" size={40} />
                    ) : (
                        <CheckCircle className="text-green-600" size={40} />
                    )}
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Response Recorded!</h3>
                <p className="text-gray-600 mb-6">
                    {formData.response === 'attending'
                        ? "We're excited to see you! Your RSVP has been recorded."
                        : 'Your response has been recorded. Thank you for letting us know!'}
                </p>
                {showCancel && !isPreview && (
                    <Button onClick={onCancel} className="w-full">
                        Close
                    </Button>
                )}
                {isPreview && (
                    <Button onClick={() => setIsSuccess(false)} className="w-full">
                        Reset Preview
                    </Button>
                )}
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-4 text-left">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                    label="Your Name *"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required={!isPreview}
                    placeholder="Enter your name"
                />
                <Input
                    label="Email *"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    required={!isPreview}
                    placeholder="your@email.com"
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                    label="Phone"
                    name="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="+91 9876543210"
                />
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Number of Guests
                    </label>
                    <select
                        name="numberOfGuests"
                        value={formData.numberOfGuests}
                        onChange={handleChange}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    >
                        {[1, 2, 3, 4, 5].map((n) => (
                            <option key={n} value={n}>
                                {n} {n === 1 ? 'Guest' : 'Guests'}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Will you attend? *
                </label>
                <div className="grid grid-cols-3 gap-3">
                    {[
                        { value: 'attending', label: 'Yes!', color: 'green' },
                        { value: 'maybe', label: 'Maybe', color: 'yellow' },
                        { value: 'not_attending', label: 'Sorry', color: 'red' },
                    ].map((option) => (
                        <button
                            key={option.value}
                            type="button"
                            onClick={() =>
                                setFormData((prev) => ({ ...prev, response: option.value }))
                            }
                            className={`py-3 px-4 rounded-xl font-medium transition-all ${formData.response === option.value
                                ? option.value === 'attending'
                                    ? 'bg-green-500 text-white'
                                    : option.value === 'maybe'
                                        ? 'bg-yellow-500 text-white'
                                        : 'bg-red-500 text-white'
                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                }`}
                        >
                            {option.label}
                        </button>
                    ))}
                </div>
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    Message (Optional)
                </label>
                <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    rows={3}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    placeholder="Add a message for the hosts..."
                />
            </div>

            <div className="pt-4">
                <Button
                    type="submit"
                    className="w-full py-3"
                    disabled={isSubmitting}
                >
                    {isSubmitting ? (
                        <>
                            <Loader size={20} className="mr-2 animate-spin" />
                            Submitting...
                        </>
                    ) : (
                        'Submit RSVP'
                    )}
                </Button>
            </div>
        </form>
    );
};

export default RSVPForm;
