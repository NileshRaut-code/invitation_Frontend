import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CreditCard, Check, X, Loader, ArrowLeft, Shield } from 'lucide-react';
import { toast } from 'react-toastify';
import { Button, Card } from '../../components/ui';
import api from '../../api/api';

const Payment = () => {
    const { invitationId } = useParams();
    const navigate = useNavigate();
    const [invitation, setInvitation] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [paymentStatus, setPaymentStatus] = useState(null); // null, 'processing', 'success', 'failed'
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchInvitation();
    }, [invitationId]);

    const fetchInvitation = async () => {
        try {
            const { data } = await api.get(`/invitations/${invitationId}`);
            setInvitation(data);

            // If already paid, redirect
            if (data.isPaid) {
                toast.info('This invitation is already paid');
                navigate(`/dashboard/invitations/${invitationId}`);
            }
        } catch (err) {
            console.error('Failed to load invitation:', err);
            setError('Failed to load invitation details');
        } finally {
            setIsLoading(false);
        }
    };

    const loadRazorpay = () => {
        return new Promise((resolve) => {
            const script = document.createElement('script');
            script.src = 'https://checkout.razorpay.com/v1/checkout.js';
            script.onload = resolve;
            document.body.appendChild(script);
        });
    };

    const handlePayment = async () => {
        setPaymentStatus('processing');

        try {
            await loadRazorpay();

            // Create order
            const { data: orderData } = await api.post('/payments/create-order', {
                invitationId,
            });

            const options = {
                key: orderData.key,
                amount: orderData.amount,
                currency: orderData.currency,
                name: 'InviteMe',
                description: `Payment for ${invitation.content?.eventName || 'Invitation'}`,
                order_id: orderData.orderId,
                handler: async (response) => {
                    try {
                        // Verify payment
                        await api.post('/payments/verify', {
                            razorpay_order_id: response.razorpay_order_id,
                            razorpay_payment_id: response.razorpay_payment_id,
                            razorpay_signature: response.razorpay_signature,
                        });

                        setPaymentStatus('success');
                        toast.success('Payment successful!');
                    } catch (err) {
                        console.error('Payment verification failed:', err);
                        setPaymentStatus('failed');
                        toast.error('Payment verification failed');
                    }
                },
                modal: {
                    ondismiss: () => {
                        setPaymentStatus(null);
                    },
                },
                prefill: {
                    name: invitation.content?.hostName || '',
                },
                theme: {
                    color: '#4F46E5',
                },
            };

            const razorpay = new window.Razorpay(options);
            razorpay.open();
        } catch (err) {
            console.error('Payment initiation failed:', err);
            setPaymentStatus('failed');
            toast.error(err.response?.data?.message || 'Failed to initiate payment');
        }
    };

    if (isLoading) {
        return (
            <div className="max-w-2xl mx-auto py-12">
                <div className="flex items-center justify-center py-20">
                    <Loader className="animate-spin text-indigo-600" size={48} />
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="max-w-2xl mx-auto py-12">
                <Card className="p-8 text-center">
                    <p className="text-red-500 mb-4">{error}</p>
                    <Link to="/dashboard/invitations">
                        <Button variant="outline">
                            <ArrowLeft size={18} className="mr-2" /> Back to Invitations
                        </Button>
                    </Link>
                </Card>
            </div>
        );
    }

    // Payment Success Screen
    if (paymentStatus === 'success') {
        return (
            <div className="max-w-2xl mx-auto py-12">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                >
                    <Card className="p-8 text-center">
                        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                            <Check className="text-green-600" size={40} />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">Payment Successful!</h2>
                        <p className="text-gray-600 mb-6">
                            Your invitation is now active and ready to share.
                        </p>
                        <div className="flex justify-center gap-4">
                            <Link to={`/dashboard/invitations/${invitationId}`}>
                                <Button>View Invitation</Button>
                            </Link>
                            <Button variant="outline" onClick={() => {
                                const url = `${window.location.origin}/invite/${invitation.slug}`;
                                navigator.clipboard.writeText(url);
                                toast.success('Link copied!');
                            }}>
                                Copy Share Link
                            </Button>
                        </div>
                    </Card>
                </motion.div>
            </div>
        );
    }

    // Payment Failed Screen
    if (paymentStatus === 'failed') {
        return (
            <div className="max-w-2xl mx-auto py-12">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                >
                    <Card className="p-8 text-center">
                        <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                            <X className="text-red-600" size={40} />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">Payment Failed</h2>
                        <p className="text-gray-600 mb-6">
                            Something went wrong with your payment. Please try again.
                        </p>
                        <div className="flex justify-center gap-4">
                            <Button onClick={handlePayment}>Try Again</Button>
                            <Link to="/dashboard/invitations">
                                <Button variant="outline">Back to Invitations</Button>
                            </Link>
                        </div>
                    </Card>
                </motion.div>
            </div>
        );
    }

    const content = invitation.content || {};
    const template = invitation.template || {};

    return (
        <div className="max-w-2xl mx-auto py-8">
            {/* Header */}
            <div className="mb-8">
                <Link to="/dashboard/invitations" className="text-indigo-600 hover:underline flex items-center mb-4">
                    <ArrowLeft size={18} className="mr-1" /> Back to Invitations
                </Link>
                <h1 className="text-3xl font-bold text-gray-900">Complete Payment</h1>
                <p className="text-gray-600 mt-1">Complete your payment to activate your invitation</p>
            </div>

            <div className="grid gap-6">
                {/* Order Summary */}
                <Card className="overflow-hidden">
                    <div className="flex">
                        <div className="w-32 h-24 flex-shrink-0">
                            <img
                                src={template.previewImage ||
                                    invitation.design?.blocks?.find(b => b.type === 'hero')?.settings?.backgroundImage ||
                                    'https://via.placeholder.com/200x150'}
                                alt={template.name || 'Custom Design'}
                                className="w-full h-full object-cover"
                            />
                        </div>
                        <div className="p-4 flex-1">
                            <h3 className="font-semibold text-gray-900">{content.eventName || 'Your Event'}</h3>
                            <p className="text-sm text-gray-500">{template.name ? `${template.name} Template` : 'Custom Design'}</p>
                            <span className="inline-block mt-2 text-xs font-medium text-amber-700 bg-amber-100 px-2 py-1 rounded-full">
                                Premium
                            </span>
                        </div>
                    </div>
                </Card>

                {/* Payment Details */}
                <Card className="p-6">
                    <h3 className="font-semibold text-gray-900 mb-4">Payment Details</h3>
                    <div className="space-y-3">
                        <div className="flex justify-between text-gray-600">
                            <span>{template.name ? 'Template Price' : 'Design Price'}</span>
                            <span>₹{template.price || invitation.price || 0}</span>
                        </div>
                        <div className="flex justify-between text-gray-600">
                            <span>GST (18%)</span>
                            <span>Included</span>
                        </div>
                        <hr />
                        <div className="flex justify-between text-xl font-bold">
                            <span>Total</span>
                            <span className="text-indigo-600">₹{template.price || invitation.price || 0}</span>
                        </div>
                    </div>
                </Card>

                {/* Security Note */}
                <div className="flex items-center text-sm text-gray-500 gap-2">
                    <Shield size={16} />
                    <span>Payments are securely processed by Razorpay</span>
                </div>

                {/* Pay Button */}
                <Button
                    onClick={handlePayment}
                    disabled={paymentStatus === 'processing'}
                    className="w-full py-4 text-lg"
                >
                    {paymentStatus === 'processing' ? (
                        <>
                            <Loader size={20} className="mr-2 animate-spin" />
                            Processing...
                        </>
                    ) : (
                        <>
                            <CreditCard size={20} className="mr-2" />
                            Pay ₹{template.price || invitation.price || 0}
                        </>
                    )}
                </Button>
            </div>
        </div>
    );
};

export default Payment;
