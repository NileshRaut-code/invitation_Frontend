import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Loader } from 'lucide-react';
import { BlocksRenderer } from '../components/blocks/BlockRenderer';
import RSVPModal from '../components/invitation/RSVPModal';
import api from '../api/api';

const PublicInvitation = () => {
    const { slug } = useParams();
    const [invitation, setInvitation] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isRSVPModalOpen, setIsRSVPModalOpen] = useState(false);

    useEffect(() => {
        const fetchInvitation = async () => {
            try {
                const { data } = await api.get(`/invitations/public/${slug}`);
                setInvitation(data);
            } catch (err) {
                console.error('Failed to load invitation:', err);
                setError('This invitation is not available or has expired.');
            } finally {
                setIsLoading(false);
            }
        };

        fetchInvitation();
    }, [slug]);

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <Loader className="animate-spin text-indigo-600" size={48} />
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
                <div className="bg-white rounded-2xl shadow-xl p-8 text-center max-w-md">
                    <p className="text-gray-600">{error}</p>
                </div>
            </div>
        );
    }

    const design = invitation.design || invitation.template?.design;

    if (!design) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
                <div className="bg-white rounded-2xl shadow-xl p-8 text-center max-w-md">
                    <p className="text-gray-600">Invitation design not found.</p>
                </div>
            </div>
        );
    }

    const baseTheme = design.theme || {};
    const theme = {
        ...baseTheme,
        ...invitation.customData?.themeOverrides,
        colors: {
            ...baseTheme.colors,
            ...invitation.customData?.themeOverrides?.colors,
        },
        fonts: {
            ...baseTheme.fonts,
            ...invitation.customData?.themeOverrides?.fonts,
        }
    };

    return (
        <div
            className="min-h-screen relative"
            style={{
                backgroundColor: theme.colors?.background || '#ffffff',
                fontFamily: theme.fonts?.body || 'sans-serif'
            }}
        >
            <BlocksRenderer
                blocks={design.blocks || []}
                data={{ ...invitation.content, slug: invitation.slug }}
                theme={theme}
                onRSVP={() => setIsRSVPModalOpen(true)}
                invitationId={invitation._id}
            />

            <RSVPModal
                isOpen={isRSVPModalOpen}
                onClose={() => setIsRSVPModalOpen(false)}
                invitationId={invitation._id}
            />

            {/* Watermark for unpaid/free invitations */}
            {!invitation.isPaid && (
                <div className="fixed bottom-0 left-0 right-0 z-50">
                    <Link
                        to="/"
                        className="block w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-center py-2.5 px-4 text-sm font-medium hover:from-indigo-700 hover:to-purple-700 transition-all"
                    >
                        Made with ❤️ by Invite Me — Create your own free invitation
                    </Link>
                </div>
            )}
        </div>
    );
};

export default PublicInvitation;
