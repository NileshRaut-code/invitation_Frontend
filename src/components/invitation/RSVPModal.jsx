import { Modal } from '../ui';
import RSVPForm from './RSVPForm';

const RSVPModal = ({ isOpen, onClose, invitationId, onSuccess }) => {
    return (
        <Modal isOpen={isOpen} onClose={onClose} title="RSVP">
            <RSVPForm
                invitationId={invitationId}
                onSuccess={() => {
                    onSuccess?.();
                    // Optional: keep open to show success message or close automatically
                }}
                onCancel={onClose}
            />
        </Modal>
    );
};

export default RSVPModal;
