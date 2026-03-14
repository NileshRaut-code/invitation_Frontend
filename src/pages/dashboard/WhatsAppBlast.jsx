import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, Upload, Send, Plus, Trash2, ArrowLeft, CheckCircle, XCircle, Clock, ExternalLink, Loader } from 'lucide-react';
import { toast } from 'react-toastify';
import { Button, Input } from '../../components/ui';
import api from '../../api/api';

const WhatsAppBlast = () => {
    const { invitationId } = useParams();
    const [guests, setGuests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [sending, setSending] = useState(false);
    const [newGuest, setNewGuest] = useState({ name: '', phone: '' });
    const [whatsappLinks, setWhatsappLinks] = useState([]);

    useEffect(() => {
        fetchData();
    }, [invitationId]);

    const fetchData = async () => {
        try {
            const { data } = await api.get(`/whatsapp/guests/${invitationId}`);
            setGuests(data.guests || []);
        } catch (err) {
            toast.error('Failed to load guest list');
        } finally {
            setLoading(false);
        }
    };

    const addGuest = () => {
        if (!newGuest.name.trim() || !newGuest.phone.trim()) {
            toast.error('Please enter name and phone number');
            return;
        }
        if (newGuest.phone.replace(/\D/g, '').length < 10) {
            toast.error('Please enter a valid phone number');
            return;
        }
        setGuests([...guests, { ...newGuest, status: 'pending' }]);
        setNewGuest({ name: '', phone: '' });
    };

    const removeGuest = (index) => {
        setGuests(guests.filter((_, i) => i !== index));
    };

    const saveGuests = async () => {
        try {
            await api.put(`/whatsapp/guests/${invitationId}`, { guests });
            toast.success('Guest list saved!');
        } catch {
            toast.error('Failed to save guest list');
        }
    };

    const handleCSVUpload = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
            const text = event.target.result;
            const lines = text.split('\n').filter(l => l.trim());
            const parsed = lines.slice(1).map(line => {
                const [name, phone] = line.split(',').map(s => s.trim());
                return { name: name || '', phone: phone || '', status: 'pending' };
            }).filter(g => g.name && g.phone);

            setGuests([...guests, ...parsed]);
            toast.success(`${parsed.length} guests imported`);
        };
        reader.readAsText(file);
        e.target.value = '';
    };

    const sendIndividual = (guest) => {
        let phone = guest.phone.replace(/[\s\-()]/g, '');
        if (!phone.startsWith('+')) phone = '+91' + phone;
        const message = encodeURIComponent(`Hi ${guest.name}! 🎉\n\nYou're invited!\n\nView your invitation here:\n${window.location.origin}/invite/${invitationId}\n\nWe hope to see you there! 💐`);
        window.open(`https://wa.me/${phone.replace('+', '')}?text=${message}`, '_blank');
    };

    const sendBlast = async () => {
        const pendingCount = guests.filter(g => g.status === 'pending').length;
        if (pendingCount === 0) { toast.info('No pending guests to send to'); return; }

        setSending(true);
        try {
            await saveGuests();
            const { data } = await api.post(`/whatsapp/blast/${invitationId}`);
            toast.success(data.message);
            setWhatsappLinks(data.whatsappLinks || []);
            fetchData();
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to generate links');
        } finally {
            setSending(false);
        }
    };

    const statusIcon = (status) => {
        if (status === 'sent') return <CheckCircle size={16} className="text-green-500" />;
        if (status === 'failed') return <XCircle size={16} className="text-red-500" />;
        return <Clock size={16} className="text-yellow-500" />;
    };

    if (loading) return <div className="flex justify-center py-20"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600" /></div>;

    const pendingCount = guests.filter(g => g.status === 'pending').length;

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            {/* Header */}
            <div>
                <Link to={`/dashboard/invitations/${invitationId}`} className="text-indigo-600 hover:underline text-sm flex items-center gap-1 mb-2">
                    <ArrowLeft size={14} /> Back to Invitation
                </Link>
                <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                    <MessageCircle className="text-green-500" /> WhatsApp Blast
                </h1>
                <p className="text-sm text-gray-500 mt-1">Add your guests and send personalized WhatsApp invitations — completely free!</p>
            </div>

            {/* WhatsApp Links Generated */}
            <AnimatePresence>
                {whatsappLinks.length > 0 && (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="bg-green-50 border border-green-200 rounded-2xl p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-lg font-semibold text-green-900">✅ WhatsApp Links Ready — Click to Send</h2>
                            <button onClick={() => setWhatsappLinks([])} className="text-green-600 text-sm hover:underline">Dismiss</button>
                        </div>
                        <div className="space-y-2 max-h-64 overflow-y-auto">
                            {whatsappLinks.map((link, i) => (
                                <a key={i} href={link.url} target="_blank" rel="noopener noreferrer" className="flex items-center justify-between p-3 bg-white rounded-xl hover:bg-green-50 border border-green-100 transition-colors">
                                    <div>
                                        <p className="font-medium text-gray-900">{link.name}</p>
                                        <p className="text-xs text-gray-500">{link.phone}</p>
                                    </div>
                                    <div className="flex items-center gap-2 text-green-600">
                                        <span className="text-sm font-medium">Open WhatsApp</span>
                                        <ExternalLink size={16} />
                                    </div>
                                </a>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Add Guests */}
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Add Guests</h2>
                <div className="flex gap-3 mb-4 flex-wrap">
                    <Input placeholder="Guest Name" value={newGuest.name} onChange={(e) => setNewGuest({ ...newGuest, name: e.target.value })} className="flex-1 min-w-[140px]"
                        onKeyDown={(e) => e.key === 'Enter' && addGuest()} />
                    <Input placeholder="Phone (e.g. 9876543210)" value={newGuest.phone} onChange={(e) => setNewGuest({ ...newGuest, phone: e.target.value })} className="flex-1 min-w-[140px]"
                        onKeyDown={(e) => e.key === 'Enter' && addGuest()} />
                    <Button onClick={addGuest}><Plus size={18} /></Button>
                </div>
                <div className="flex gap-2">
                    <label className="cursor-pointer">
                        <input type="file" accept=".csv" onChange={handleCSVUpload} className="hidden" />
                        <span className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm text-gray-700 transition-colors">
                            <Upload size={16} /> Import CSV
                        </span>
                    </label>
                    <span className="text-xs text-gray-500 self-center">Format: name, phone (one per line, with header row)</span>
                </div>
            </motion.div>

            {/* Guest List */}
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-semibold text-gray-900">{guests.length} Guest{guests.length !== 1 ? 's' : ''}</h2>
                    <Button variant="outline" onClick={saveGuests} disabled={guests.length === 0}>Save List</Button>
                </div>

                {guests.length === 0 ? (
                    <p className="text-gray-500 text-center py-8">No guests added yet. Add them above or import a CSV file.</p>
                ) : (
                    <div className="divide-y divide-gray-100 max-h-96 overflow-y-auto">
                        {guests.map((guest, index) => (
                            <div key={index} className="flex items-center justify-between py-3 px-2 hover:bg-gray-50 rounded-lg">
                                <div className="flex items-center gap-3">
                                    {statusIcon(guest.status)}
                                    <div>
                                        <p className="font-medium text-gray-900 text-sm">{guest.name}</p>
                                        <p className="text-xs text-gray-500">{guest.phone}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className={`text-xs px-2 py-0.5 rounded-full ${guest.status === 'sent' ? 'bg-green-100 text-green-700' : guest.status === 'failed' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'}`}>
                                        {guest.status}
                                    </span>
                                    <button onClick={() => sendIndividual(guest)} className="text-green-600 hover:text-green-700" title="Send via WhatsApp">
                                        <MessageCircle size={14} />
                                    </button>
                                    {guest.status === 'pending' && (
                                        <button onClick={() => removeGuest(index)} className="text-gray-400 hover:text-red-500"><Trash2 size={16} /></button>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </motion.div>

            {/* Send Blast */}
            {pendingCount > 0 && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-2xl p-6">
                    <div className="flex items-center justify-between flex-wrap gap-3">
                        <div>
                            <p className="font-semibold text-green-900">Ready to send {pendingCount} message{pendingCount !== 1 ? 's' : ''}</p>
                            <p className="text-sm text-green-700">Click below to generate WhatsApp links for all pending guests.</p>
                        </div>
                        <Button onClick={sendBlast} disabled={sending} className="bg-green-600 hover:bg-green-700">
                            {sending ? <><Loader size={18} className="mr-2 animate-spin" /> Generating...</> : <><Send size={18} className="mr-2" /> Send Blast</>}
                        </Button>
                    </div>
                </motion.div>
            )}
        </div>
    );
};

export default WhatsAppBlast;
