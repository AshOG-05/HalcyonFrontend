import React from 'react';
import './PaymentInstructions.css';

function PaymentInstructions({ eventName, eventFee, onClose }) {
  return (
    <div className="payment-instructions-overlay">
      <div className="payment-instructions-modal">
        <button className="close-modal" onClick={onClose}>
          <i className="fas fa-times"></i>
        </button>

        <div className="payment-header">
          <i className="fas fa-credit-card payment-icon"></i>
          <h2>Payment Instructions</h2>
          <p className="event-details">Event: <strong>{eventName}</strong></p>
          <p className="fee-details">Registration Fee: <strong>₹{eventFee}</strong></p>
        </div>

        <div className="instructions-content">
          <div className="important-notes">
            <h3><i className="fas fa-exclamation-triangle"></i> Important Notes</h3>
            <ul>
              <li><strong>You can't pay online. You should pay offline on the event day at the venue.</strong></li>
            </ul>
          </div>

          <div className="contact-info">
            <h3><i className="fas fa-phone"></i> Need Help?</h3>
            <p>If you face any issues with the payment process, contact:</p>
            <p><strong>Event Coordinators:</strong> Available in the event details</p>
          </div>
        </div>

        <div className="payment-actions">
          <button className="back-button" onClick={onClose}>
            <i className="fas fa-arrow-left"></i>
            Back to Registration
          </button>
        </div>
      </div>
    </div>
  );
}

export default PaymentInstructions;
