import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
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

    // Determine design source (Custom or Template)
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

    // Merge theme with user customizations (overrides)
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
            className="min-h-screen"
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
        </div>
    );
};

export default PublicInvitation;
