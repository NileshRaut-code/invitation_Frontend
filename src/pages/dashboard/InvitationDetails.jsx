import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
    Calendar, MapPin, Clock, Users, Eye, ExternalLink, Copy,
    ArrowLeft, Download, Loader, CheckCircle, XCircle, HelpCircle
} from 'lucide-react';
import { toast } from 'react-toastify';
import { Button, Card, CardSkeleton } from '../../components/ui';
import api from '../../api/api';

const InvitationDetails = () => {
    const { id } = useParams();
    const [invitation, setInvitation] = useState(null);
    const [rsvps, setRsvps] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchInvitation();
        fetchRSVPs();
    }, [id]);

    const fetchInvitation = async () => {
        try {
            const { data } = await api.get(`/invitations/${id}`);
            setInvitation(data);
        } catch (err) {
            console.error('Failed to load invitation:', err);
            setError('Failed to load invitation details');
        } finally {
            setIsLoading(false);
        }
    };

    const fetchRSVPs = async () => {
        try {
            const { data } = await api.get(`/rsvps/invitation/${id}`);
            setRsvps(data || []);
        } catch (err) {
            console.error('Failed to load RSVPs:', err);
        }
    };

    const copyLink = () => {
        const url = `${window.location.origin}/invite/${invitation.slug}`;
        navigator.clipboard.writeText(url);
        toast.success('Link copied!');
    };

    const exportRSVPs = () => {
        if (rsvps.length === 0) {
            toast.info('No RSVPs to export');
            return;
        }

        const headers = ['Name', 'Email', 'Phone', 'Response', 'Guests', 'Message', 'Date'];
        const csvContent = [
            headers.join(','),
            ...rsvps.map(rsvp => [
                rsvp.name || '',
                rsvp.email || '',
                rsvp.phone || '',
                rsvp.response || '',
                rsvp.numberOfGuests || 1,
                `"${(rsvp.message || '').replace(/"/g, '""')}"`,
                new Date(rsvp.createdAt).toLocaleDateString()
            ].join(','))
        ].join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `rsvps-${invitation.content?.eventName || 'invitation'}.csv`;
        a.click();
        toast.success('RSVPs exported!');
    };

    const rsvpStats = {
        attending: rsvps.filter(r => r.response === 'attending').length,
        notAttending: rsvps.filter(r => r.response === 'not_attending' || r.response === 'declined').length,
        maybe: rsvps.filter(r => r.response === 'maybe' || r.response === 'pending').length,
        totalGuests: rsvps.filter(r => r.response === 'attending').reduce((sum, r) => sum + (r.numberOfGuests || 1), 0)
    };

    if (isLoading) {
        return (
            <div>
                <div className="mb-8">
                    <Link to="/dashboard/invitations" className="text-indigo-600 hover:underline flex items-center mb-4">
                        <ArrowLeft size={18} className="mr-1" /> Back to Invitations
                    </Link>
                </div>
                <div className="space-y-4">
                    <CardSkeleton />
                    <CardSkeleton />
                </div>
            </div>
        );
    }

    if (error || !invitation) {
        return (
            <div>
                <Link to="/dashboard/invitations" className="text-indigo-600 hover:underline flex items-center mb-4">
                    <ArrowLeft size={18} className="mr-1" /> Back to Invitations
                </Link>
                <Card className="p-8 text-center">
                    <p className="text-red-500">{error || 'Invitation not found'}</p>
                </Card>
            </div>
        );
    }

    const content = invitation.content || {};

    return (
        <div>
            {/* Header */}
            <div className="mb-8">
                <Link to="/dashboard/invitations" className="text-indigo-600 hover:underline flex items-center mb-4">
                    <ArrowLeft size={18} className="mr-1" /> Back to Invitations
                </Link>
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">{content.eventName || 'Untitled Event'}</h1>
                        <p className="text-gray-600 mt-1">Manage your invitation and track RSVPs</p>
                    </div>
                    <div className="flex gap-2">
                        <Button variant="outline" onClick={copyLink}>
                            <Copy size={18} className="mr-2" />
                            Copy Link
                        </Button>
                        {invitation.isPaid && (
                            <a
                                href={`/invite/${invitation.slug}`}
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                <Button>
                                    <ExternalLink size={18} className="mr-2" />
                                    View Live
                                </Button>
                            </a>
                        )}
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Column - Event Details */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Preview Card */}
                    <Card className="overflow-hidden">
                        <img
                            src={invitation.template?.previewImage || 'https://via.placeholder.com/800x300'}
                            alt="Template Preview"
                            className="w-full h-48 object-cover"
                        />
                        <div className="p-6">
                            <h2 className="text-xl font-bold text-gray-900 mb-4">Event Details</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="flex items-center text-gray-600">
                                    <Calendar size={18} className="mr-3 text-indigo-600 flex-shrink-0" />
                                    <div>
                                        <p className="text-sm text-gray-500">Date</p>
                                        <p className="font-medium text-gray-900">
                                            {content.eventDate
                                                ? new Date(content.eventDate).toLocaleDateString('en-IN', {
                                                    weekday: 'long',
                                                    day: 'numeric',
                                                    month: 'long',
                                                    year: 'numeric'
                                                })
                                                : 'Not set'}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center text-gray-600">
                                    <Clock size={18} className="mr-3 text-indigo-600 flex-shrink-0" />
                                    <div>
                                        <p className="text-sm text-gray-500">Time</p>
                                        <p className="font-medium text-gray-900">{content.eventTime || 'Not set'}</p>
                                    </div>
                                </div>
                                <div className="flex items-center text-gray-600">
                                    <MapPin size={18} className="mr-3 text-indigo-600 flex-shrink-0" />
                                    <div>
                                        <p className="text-sm text-gray-500">Venue</p>
                                        <p className="font-medium text-gray-900">{content.venue || 'Not set'}</p>
                                        {content.venueAddress && <p className="text-sm text-gray-500">{content.venueAddress}</p>}
                                    </div>
                                </div>
                                <div className="flex items-center text-gray-600">
                                    <Users size={18} className="mr-3 text-indigo-600 flex-shrink-0" />
                                    <div>
                                        <p className="text-sm text-gray-500">Host</p>
                                        <p className="font-medium text-gray-900">{content.hostName || 'Not set'}</p>
                                    </div>
                                </div>
                            </div>
                            {content.message && (
                                <div className="mt-4 p-4 bg-gray-50 rounded-lg border-l-4 border-indigo-500">
                                    <p className="text-gray-600 italic">"{content.message}"</p>
                                </div>
                            )}
                        </div>
                    </Card>

                    {/* RSVP List */}
                    <Card className="p-6">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-bold text-gray-900">RSVP Responses</h2>
                            <Button variant="outline" size="sm" onClick={exportRSVPs}>
                                <Download size={16} className="mr-2" />
                                Export CSV
                            </Button>
                        </div>

                        {rsvps.length === 0 ? (
                            <div className="text-center py-8 text-gray-500">
                                <Users size={40} className="mx-auto mb-2 opacity-50" />
                                <p>No RSVPs yet. Share your invitation link to get responses!</p>
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead>
                                        <tr className="text-left text-gray-500 text-sm border-b">
                                            <th className="pb-3">Name</th>
                                            <th className="pb-3">Response</th>
                                            <th className="pb-3">Guests</th>
                                            <th className="pb-3">Date</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {rsvps.map((rsvp) => (
                                            <tr key={rsvp._id} className="border-b last:border-0">
                                                <td className="py-3">
                                                    <p className="font-medium text-gray-900">{rsvp.name}</p>
                                                    <p className="text-sm text-gray-500">{rsvp.email}</p>
                                                </td>
                                                <td className="py-3">
                                                    {rsvp.response === 'attending' ? (
                                                        <span className="inline-flex items-center text-green-600">
                                                            <CheckCircle size={16} className="mr-1" /> Attending
                                                        </span>
                                                    ) : rsvp.response === 'not_attending' || rsvp.response === 'declined' ? (
                                                        <span className="inline-flex items-center text-red-600">
                                                            <XCircle size={16} className="mr-1" /> Declined
                                                        </span>
                                                    ) : (
                                                        <span className="inline-flex items-center text-yellow-600">
                                                            <HelpCircle size={16} className="mr-1" /> Maybe
                                                        </span>
                                                    )}
                                                </td>
                                                <td className="py-3 text-gray-600">{rsvp.numberOfGuests || 1}</td>
                                                <td className="py-3 text-gray-500">
                                                    {new Date(rsvp.createdAt).toLocaleDateString()}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </Card>
                </div>

                {/* Right Column - Stats */}
                <div className="space-y-6">
                    {/* Status Card */}
                    <Card className="p-6">
                        <h3 className="font-semibold text-gray-900 mb-4">Status</h3>
                        <div className="space-y-3">
                            <div className="flex justify-between">
                                <span className="text-gray-500">Payment</span>
                                <span className={`font-medium ${invitation.isPaid ? 'text-green-600' : 'text-yellow-600'}`}>
                                    {invitation.isPaid ? '✓ Paid' : 'Pending'}
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-500">Status</span>
                                <span className={`font-medium ${invitation.status === 'published' ? 'text-green-600' : 'text-gray-600'}`}>
                                    {invitation.status === 'published' ? 'Published' : 'Draft'}
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-500">Views</span>
                                <span className="font-medium text-gray-900">{invitation.views || 0}</span>
                            </div>
                        </div>
                    </Card>

                    {/* RSVP Stats */}
                    <Card className="p-6">
                        <h3 className="font-semibold text-gray-900 mb-4">RSVP Summary</h3>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center">
                                    <div className="w-3 h-3 rounded-full bg-green-500 mr-2" />
                                    <span className="text-gray-600">Attending</span>
                                </div>
                                <span className="font-bold text-gray-900">{rsvpStats.attending}</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <div className="flex items-center">
                                    <div className="w-3 h-3 rounded-full bg-red-500 mr-2" />
                                    <span className="text-gray-600">Not Attending</span>
                                </div>
                                <span className="font-bold text-gray-900">{rsvpStats.notAttending}</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <div className="flex items-center">
                                    <div className="w-3 h-3 rounded-full bg-yellow-500 mr-2" />
                                    <span className="text-gray-600">Maybe</span>
                                </div>
                                <span className="font-bold text-gray-900">{rsvpStats.maybe}</span>
                            </div>
                            <hr />
                            <div className="flex items-center justify-between">
                                <span className="text-gray-900 font-medium">Total Guests</span>
                                <span className="font-bold text-xl text-indigo-600">{rsvpStats.totalGuests}</span>
                            </div>
                        </div>
                    </Card>

                    {/* Shareable Link */}
                    <Card className="p-6">
                        <h3 className="font-semibold text-gray-900 mb-4">Share Link</h3>
                        <div className="flex items-center">
                            <input
                                type="text"
                                readOnly
                                value={`${window.location.origin}/invite/${invitation.slug}`}
                                className="flex-1 px-3 py-2 bg-gray-100 rounded-l-lg text-sm text-gray-600 truncate"
                            />
                            <button
                                onClick={copyLink}
                                className="px-4 py-2 bg-indigo-600 text-white rounded-r-lg hover:bg-indigo-700 transition-colors"
                            >
                                <Copy size={18} />
                            </button>
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default InvitationDetails;
