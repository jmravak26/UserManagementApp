import { useAppSelector } from '../hooks/useAppSelector';
import { useAppDispatch } from '../hooks/useAppDispatch';
import { clearHistory } from '../store/messageSlice';
import './MessageHistoryModal.css';

interface MessageHistoryModalProps {
  onClose: () => void;
}

export default function MessageHistoryModal({ onClose }: MessageHistoryModalProps) {
  const messages = useAppSelector(state => state.messages.history);
  const dispatch = useAppDispatch();

  const handleClearHistory = () => {
    if (confirm('Clear all message history?')) {
      dispatch(clearHistory());
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content message-history-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Message History</h2>
          {messages.length > 0 && (
            <button className="clear-btn" onClick={handleClearHistory}>Clear All</button>
          )}
        </div>

        {messages.length === 0 ? (
          <p className="no-messages">No messages sent yet</p>
        ) : (
          <div className="message-list">
            {messages.map(msg => (
              <div key={msg.id} className="message-item">
                <div className="message-header">
                  <strong>{msg.subject}</strong>
                  <span className="message-date">{new Date(msg.sentAt).toLocaleString()}</span>
                </div>
                <div className="message-recipients">
                  To: {msg.recipientEmails.join(', ')}
                </div>
                <div className="message-body">{msg.body}</div>
                {msg.template && <div className="message-template">Template: {msg.template}</div>}
              </div>
            ))}
          </div>
        )}

        <div className="modal-actions">
          <button onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  );
}
