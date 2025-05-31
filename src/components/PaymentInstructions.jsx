import React, { useState } from 'react';
import './PaymentInstructions.css';

function PaymentInstructions({ eventName, eventFee, onClose, onProceedToERP }) {
  const [transactionId, setTransactionId] = useState('');
  const [transactionIdValid, setTransactionIdValid] = useState(null);

  // Handle transaction ID change with validation
  const handleTransactionIdChange = (value) => {
    const upperValue = value.toUpperCase();
    setTransactionId(upperValue);

    if (upperValue.length === 0) {
      setTransactionIdValid(null);
    } else if (upperValue.length === 14) {
      const transactionIdRegex = /^[A-Za-z]{4}\d{10}$/;
      setTransactionIdValid(transactionIdRegex.test(upperValue));
    } else {
      setTransactionIdValid(false);
    }
  };

  const handleProceedToERP = () => {
    // Open ERP portal in a new tab
    window.open('http://erp.sit.ac.in/', '_blank');
  };

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
          <div className="instruction-section">
            <h3><i className="fas fa-list-ol"></i> Payment Process</h3>
            <div className="steps-container">
              <div className="step">
                <div className="step-number">1</div>
                <div className="step-content">
                  <h4>Access ERP Portal</h4>
                  <p>Click the "Proceed to ERP Portal" button below to access the official payment gateway.</p>
                  <p><strong>Portal URL:</strong> http://erp.sit.ac.in/</p>
                </div>
              </div>

              <div className="step">
                <div className="step-number">2</div>
                <div className="step-content">
                  <h4>Complete Payment</h4>
                  <p>From the user drop down select external and in external and then enter your details and in the fee head select HALCYON and form the fee type select the event name you want to participate and pay <strong>₹{eventFee}</strong>.</p>
                  <p>Ensure you have your payment details ready (card/UPI/net banking).</p>
                </div>
              </div>

              <div className="step">
                <div className="step-number">3</div>
                <div className="step-content">
                  <h4>Get Transaction ID</h4>
                  <p>After successful payment, you will receive a <strong>Transaction ID</strong>.</p>
                  <p>This ID should be in the format: <strong>4 letters + 10 digits</strong> (e.g., JCIT1234567890)</p>
                </div>
              </div>

              <div className="step">
                <div className="step-number">4</div>
                <div className="step-content">
                  <h4>Enter Transaction ID</h4>
                  <p>Return to this page and enter your Transaction ID in the field below to complete your registration.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="transaction-form">
            <div className="form-group">
              <label htmlFor="transaction-id">Transaction ID (Enter after payment completion)</label>
              <input
                type="text"
                id="transaction-id"
                value={transactionId}
                onChange={(e) => handleTransactionIdChange(e.target.value)}
                placeholder="Ex: JCIT1234567890"
                maxLength="14"
                className={transactionIdValid === true ? 'valid-input' : transactionIdValid === false ? 'invalid-input' : ''}
              />
              {transactionIdValid === true && (
                <p className="validation-message success">
                  <i className="fas fa-check-circle"></i> Valid transaction ID format
                </p>
              )}
              {transactionIdValid === false && (
                <p className="validation-message error">
                  <i className="fas fa-exclamation-circle"></i> Invalid format. Must be 4 letters + 10 digits (14 characters total)
                </p>
              )}
              <p style={{ color: '#ddd', fontSize: '0.9rem', marginTop: '8px' }}>
                Enter the transaction ID you received after completing payment on ERP portal
              </p>
            </div>
          </div>

          <div className="important-notes">
            <h3><i className="fas fa-exclamation-triangle"></i> Important Notes</h3>
            <ul>
              <li><strong>Complete payment on the ERP portal before proceeding with registration.</strong></li>
              <li><strong>Keep your transaction ID safe</strong> - you'll need it to complete registration.</li>
              <li><strong>Payment is mandatory</strong> for paid events. Registration will not be confirmed without valid payment.</li>
              <li><strong>Contact event coordinators</strong> if you face any payment issues.</li>
            </ul>
          </div>

          <div className="contact-info">
            <h3><i className="fas fa-phone"></i> Need Help?</h3>
            <p>If you face any issues with the payment process, contact:</p>
            <p><strong>Event Coordinators:</strong> Available in the event details</p>
            <p><strong>Technical Support:</strong> For ERP portal issues, contact the college IT department</p>
          </div>
        </div>

        <div className="payment-actions">
          <button className="erp-button" onClick={handleProceedToERP}>
            <i className="fas fa-external-link-alt"></i>
            Proceed to ERP Portal
          </button>
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
