import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
    Calendar, MapPin, Clock, Users, Eye, ExternalLink, Copy,
    ArrowLeft, Download, CheckCircle, XCircle, HelpCircle,
    Edit3, Share2, QrCode, MessageCircle, Mail, Smartphone,
    Link2, Timer, ToggleLeft, ToggleRight, Save, X, Check
} from 'lucide-react';
import { toast } from 'react-toastify';
import { Button, Card, CardSkeleton } from '../../components/ui';
import api from '../../api/api';

const InvitationDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [invitation, setInvitation] = useState(null);
    const [rsvps, setRsvps] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    // Branded link state
    const [editingSlug, setEditingSlug] = useState(false);
    const [customSlug, setCustomSlug] = useState('');
    const [slugSaving, setSlugSaving] = useState(false);

    // Expiry state
    const [expiryDate, setExpiryDate] = useState('');
    const [autoDelete, setAutoDelete] = useState(true);
    const [expirySaving, setExpirySaving] = useState(false);

    useEffect(() => {
        fetchInvitation();
        fetchRSVPs();
    }, [id]);

    const fetchInvitation = async () => {
        try {
            const { data } = await api.get(`/invitations/${id}`);
            setInvitation(data);
            setCustomSlug(data.slug || '');
            setAutoDelete(data.autoDelete !== false);
            if (data.expiresAt) {
                setExpiryDate(new Date(data.expiresAt).toISOString().split('T')[0]);
            }
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

    const getInviteUrl = () => `${window.location.origin}/invite/${invitation.slug}`;

    const copyLink = () => {
        navigator.clipboard.writeText(getInviteUrl());
        toast.success('Link copied to clipboard!');
    };

    // ── Share Functions ──
    const shareViaWhatsApp = () => {
        const eventName = invitation.content?.eventName || 'an event';
        const text = `You're invited to ${eventName}! 🎉\nCheck it out: ${getInviteUrl()}`;
        window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
    };

    const shareViaEmail = () => {
        const eventName = invitation.content?.eventName || 'an event';
        const subject = `You're Invited to ${eventName}!`;
        const body = `Hi!\n\nYou're invited to ${eventName}.\n\nView the invitation here: ${getInviteUrl()}\n\nLooking forward to seeing you!`;
        window.open(`mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`, '_self');
    };

    const shareViaSMS = () => {
        const eventName = invitation.content?.eventName || 'an event';
        const text = `You're invited to ${eventName}! 🎉 ${getInviteUrl()}`;
        window.open(`sms:?body=${encodeURIComponent(text)}`, '_self');
    };

    // ── Branded Link ──
    const saveCustomSlug = async () => {
        const sanitized = customSlug.toLowerCase().replace(/[^a-z0-9-]/g, '');
        if (sanitized.length < 3) {
            toast.error('Custom link must be at least 3 characters');
            return;
        }
        setSlugSaving(true);
        try {
            const { data } = await api.put(`/invitations/${id}`, { slug: sanitized });
            setInvitation(data);
            setCustomSlug(data.slug);
            setEditingSlug(false);
            toast.success('Custom link updated!');
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to update link');
        } finally {
            setSlugSaving(false);
        }
    };

    // ── Expiry Settings ──
    const saveExpiry = async () => {
        setExpirySaving(true);
        try {
            const { data } = await api.put(`/invitations/${id}`, {
                expiresAt: expiryDate || null,
                autoDelete,
            });
            setInvitation(data);
            toast.success('Expiry settings saved!');
        } catch (err) {
            toast.error('Failed to update expiry settings');
        } finally {
            setExpirySaving(false);
        }
    };

    const extendExpiry = async (days) => {
        const currentExpiry = invitation.expiresAt ? new Date(invitation.expiresAt) : new Date();
        const newExpiry = new Date(currentExpiry.getTime() + days * 24 * 60 * 60 * 1000);
        setExpiryDate(newExpiry.toISOString().split('T')[0]);
        setExpirySaving(true);
        try {
            const { data } = await api.put(`/invitations/${id}`, {
                expiresAt: newExpiry.toISOString(),
                autoDelete,
            });
            setInvitation(data);
            toast.success(`Extended by ${days} days!`);
        } catch (err) {
            toast.error('Failed to extend expiry');
        } finally {
            setExpirySaving(false);
        }
    };

    const downloadQR = () => {
        const qrApiUrl = `https://api.qrserver.com/v1/create-qr-code/?size=400x400&data=${encodeURIComponent(getInviteUrl())}`;
        const a = document.createElement('a');
        a.href = qrApiUrl;
        a.download = `qr-${invitation.slug}.png`;
        a.target = '_blank';
        a.click();
        toast.success('QR code download started!');
    };

    const toggleStatus = async () => {
        try {
            const { data } = await api.put(`/invitations/${id}/status`);
            setInvitation(data);
            toast.success(`Status updated to ${data.status}`);
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to update status');
        }
    };

    const exportRSVPs = () => {
        if (rsvps.length === 0) { toast.info('No RSVPs to export'); return; }
        const headers = ['Name', 'Email', 'Phone', 'Response', 'Guests', 'Message', 'Date'];
        const csvContent = [
            headers.join(','),
            ...rsvps.map(rsvp => [
                rsvp.name || '', rsvp.email || '', rsvp.phone || '',
                rsvp.response || '', rsvp.numberOfGuests || 1,
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
                <Link to="/dashboard/invitations" className="text-indigo-600 hover:underline flex items-center mb-4">
                    <ArrowLeft size={18} className="mr-1" /> Back to Invitations
                </Link>
                <div className="space-y-4"><CardSkeleton /><CardSkeleton /></div>
            </div>
        );
    }

    if (error || !invitation) {
        return (
            <div>
                <Link to="/dashboard/invitations" className="text-indigo-600 hover:underline flex items-center mb-4">
                    <ArrowLeft size={18} className="mr-1" /> Back to Invitations
                </Link>
                <Card className="p-8 text-center"><p className="text-red-500">{error || 'Invitation not found'}</p></Card>
            </div>
        );
    }

    const content = invitation.content || {};
    const isExpired = invitation.expiresAt && new Date() > new Date(invitation.expiresAt);

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
                    <div className="flex gap-2 flex-wrap">
                        {invitation.isPaid && (
                            <Button
                                variant={invitation.status === 'published' ? 'secondary' : 'default'}
                                onClick={toggleStatus}
                                className="flex items-center"
                            >
                                {invitation.status === 'published' ? (
                                    <><ToggleRight size={18} className="mr-2 text-green-500" /> Published</>
                                ) : (
                                    <><ToggleLeft size={18} className="mr-2 text-gray-500" /> Draft</>
                                )}
                            </Button>
                        )}
                        <Button variant="outline" onClick={copyLink}>
                            <Copy size={18} className="mr-2" /> Copy Link
                        </Button>
                        <Button variant="outline" onClick={() => navigate(`/dashboard/edit/${id}`)}>
                            <Edit3 size={18} className="mr-2" /> Edit Design
                        </Button>
                        {invitation.isPaid && invitation.status === 'published' && (
                            <a href={`/invite/${invitation.slug}`} target="_blank" rel="noopener noreferrer">
                                <Button><ExternalLink size={18} className="mr-2" /> View Live</Button>
                            </a>
                        )}
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Column */}
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
                                                ? new Date(content.eventDate).toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })
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
                                <Download size={16} className="mr-2" /> Export CSV
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
                                                        <span className="inline-flex items-center text-green-600"><CheckCircle size={16} className="mr-1" /> Attending</span>
                                                    ) : rsvp.response === 'not_attending' || rsvp.response === 'declined' ? (
                                                        <span className="inline-flex items-center text-red-600"><XCircle size={16} className="mr-1" /> Declined</span>
                                                    ) : (
                                                        <span className="inline-flex items-center text-yellow-600"><HelpCircle size={16} className="mr-1" /> Maybe</span>
                                                    )}
                                                </td>
                                                <td className="py-3 text-gray-600">{rsvp.numberOfGuests || 1}</td>
                                                <td className="py-3 text-gray-500">{new Date(rsvp.createdAt).toLocaleDateString()}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </Card>
                </div>

                {/* Right Column */}
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
                                    {isExpired ? '⏰ Expired' : invitation.status === 'published' ? 'Published' : 'Draft'}
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
                                <div className="flex items-center"><div className="w-3 h-3 rounded-full bg-green-500 mr-2" /><span className="text-gray-600">Attending</span></div>
                                <span className="font-bold text-gray-900">{rsvpStats.attending}</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <div className="flex items-center"><div className="w-3 h-3 rounded-full bg-red-500 mr-2" /><span className="text-gray-600">Not Attending</span></div>
                                <span className="font-bold text-gray-900">{rsvpStats.notAttending}</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <div className="flex items-center"><div className="w-3 h-3 rounded-full bg-yellow-500 mr-2" /><span className="text-gray-600">Maybe</span></div>
                                <span className="font-bold text-gray-900">{rsvpStats.maybe}</span>
                            </div>
                            <hr />
                            <div className="flex items-center justify-between">
                                <span className="text-gray-900 font-medium">Total Guests</span>
                                <span className="font-bold text-xl text-indigo-600">{rsvpStats.totalGuests}</span>
                            </div>
                        </div>
                    </Card>

                    {/* ── Share Panel (WhatsApp / Email / SMS) ── */}
                    <Card className="p-6">
                        <h3 className="font-semibold text-gray-900 mb-4">📤 Share Invitation</h3>
                        <div className="flex items-center mb-4">
                            <input
                                type="text"
                                readOnly
                                value={getInviteUrl()}
                                className="flex-1 px-3 py-2 bg-gray-100 rounded-l-lg text-sm text-gray-600 truncate"
                            />
                            <button onClick={copyLink} className="px-4 py-2 bg-indigo-600 text-white rounded-r-lg hover:bg-indigo-700 transition-colors">
                                <Copy size={18} />
                            </button>
                        </div>
                        <div className="grid grid-cols-3 gap-2">
                            <button
                                onClick={shareViaWhatsApp}
                                className="flex flex-col items-center gap-1.5 p-3 rounded-xl text-white text-xs font-medium transition-all hover:scale-105"
                                style={{ backgroundColor: '#25D366' }}
                            >
                                <MessageCircle size={20} />
                                WhatsApp
                            </button>
                            <button
                                onClick={shareViaEmail}
                                className="flex flex-col items-center gap-1.5 p-3 rounded-xl text-white text-xs font-medium transition-all hover:scale-105"
                                style={{ backgroundColor: '#EA4335' }}
                            >
                                <Mail size={20} />
                                Email
                            </button>
                            <button
                                onClick={shareViaSMS}
                                className="flex flex-col items-center gap-1.5 p-3 rounded-xl text-white text-xs font-medium transition-all hover:scale-105"
                                style={{ backgroundColor: '#6366f1' }}
                            >
                                <Smartphone size={20} />
                                SMS
                            </button>
                        </div>
                    </Card>

                    {/* ── Branded Link / Custom Slug ── */}
                    <Card className="p-6">
                        <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                            <Link2 size={18} className="text-indigo-600" /> Custom Link
                        </h3>
                        <p className="text-xs text-gray-500 mb-3">Personalize your invitation URL</p>

                        {editingSlug ? (
                            <div>
                                <div className="flex items-center mb-2">
                                    <span className="text-xs text-gray-400 mr-1 flex-shrink-0">{window.location.origin}/invite/</span>
                                    <input
                                        type="text"
                                        value={customSlug}
                                        onChange={(e) => setCustomSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))}
                                        className="flex-1 px-2 py-1.5 border border-indigo-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                        placeholder="my-event"
                                        maxLength={50}
                                    />
                                </div>
                                <p className="text-xs text-gray-400 mb-3">Only letters, numbers, and hyphens. Min 3 characters.</p>
                                <div className="flex gap-2">
                                    <button
                                        onClick={saveCustomSlug}
                                        disabled={slugSaving}
                                        className="flex-1 flex items-center justify-center gap-1 px-3 py-2 rounded-lg text-white text-sm font-medium transition-colors disabled:opacity-50"
                                        style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}
                                    >
                                        <Check size={14} /> {slugSaving ? 'Saving...' : 'Save'}
                                    </button>
                                    <button
                                        onClick={() => { setEditingSlug(false); setCustomSlug(invitation.slug); }}
                                        className="px-3 py-2 rounded-lg bg-gray-100 text-gray-600 text-sm hover:bg-gray-200 transition-colors"
                                    >
                                        <X size={14} />
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div>
                                <div className="p-3 bg-gray-50 rounded-xl mb-3">
                                    <p className="text-xs text-gray-400">Current link:</p>
                                    <p className="text-sm font-medium text-indigo-600 truncate">{getInviteUrl()}</p>
                                </div>
                                <button
                                    onClick={() => setEditingSlug(true)}
                                    className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl border-2 border-dashed border-gray-200 text-sm text-gray-500 hover:border-indigo-400 hover:text-indigo-600 transition-all"
                                >
                                    <Edit3 size={14} /> Customize Link
                                </button>
                            </div>
                        )}
                    </Card>

                    {/* ── Expiry Settings ── */}
                    <Card className="p-6">
                        <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                            <Timer size={18} className="text-indigo-600" /> Expiry Settings
                        </h3>

                        {isExpired && (
                            <div className="px-3 py-2 rounded-lg bg-red-50 text-red-600 text-sm mb-4 flex items-center gap-2">
                                <XCircle size={14} /> This invitation has expired
                            </div>
                        )}

                        <div className="space-y-4">
                            <div>
                                <label className="text-xs font-medium text-gray-500 block mb-1">Expiry Date</label>
                                <input
                                    type="date"
                                    value={expiryDate}
                                    onChange={(e) => setExpiryDate(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                />
                            </div>

                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-700">Auto-delete</p>
                                    <p className="text-xs text-gray-400">Remove invitation after expiry</p>
                                </div>
                                <button onClick={() => setAutoDelete(!autoDelete)} className="text-indigo-600">
                                    {autoDelete
                                        ? <ToggleRight size={32} className="text-indigo-600" />
                                        : <ToggleLeft size={32} className="text-gray-400" />
                                    }
                                </button>
                            </div>

                            <div className="flex gap-2">
                                <button
                                    onClick={saveExpiry}
                                    disabled={expirySaving}
                                    className="flex-1 flex items-center justify-center gap-1 px-3 py-2 rounded-xl text-white text-sm font-medium transition-all disabled:opacity-50 hover:scale-105"
                                    style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}
                                >
                                    <Save size={14} /> {expirySaving ? 'Saving...' : 'Save'}
                                </button>
                                <button
                                    onClick={() => extendExpiry(30)}
                                    disabled={expirySaving}
                                    className="px-4 py-2 rounded-xl bg-emerald-50 text-emerald-700 text-sm font-medium hover:bg-emerald-100 transition-colors disabled:opacity-50"
                                >
                                    +30 days
                                </button>
                            </div>
                        </div>
                    </Card>

                    {/* QR Code */}
                    <Card className="p-6">
                        <h3 className="font-semibold text-gray-900 mb-4">QR Code</h3>
                        <div className="text-center">
                            <img
                                src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(getInviteUrl())}`}
                                alt="QR Code"
                                className="mx-auto rounded-lg border p-2 bg-white"
                                width={200}
                                height={200}
                            />
                            <p className="text-xs text-gray-500 mt-2">Scan to view invitation</p>
                            <Button variant="outline" size="sm" className="mt-3" onClick={downloadQR}>
                                <Download size={16} className="mr-2" /> Download QR
                            </Button>
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default InvitationDetails;
