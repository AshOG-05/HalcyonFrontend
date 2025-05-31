import React from 'react';
import './PaymentInstructions.css';

function PaymentInstructions({ eventName, eventFee, onClose, onProceedToERP }) {
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
          <h2>Team Payment Instructions</h2>
          <p className="event-details">Event: <strong>{eventName}</strong></p>
          <p className="fee-details">Team Registration Fee: <strong>₹{eventFee}</strong></p>

        </div>

        <div className="instructions-content">
          <div className="instruction-section">
            <h3><i className="fas fa-list-ol"></i> Payment Process</h3>
            <div className="steps-container">
              <div className="step">
                <div className="step-number">1</div>
                <div className="step-content">
                  <h4>Access ERP Portal</h4>
                  <p>Click the "Go to ERP Portal" button below to access the official payment gateway.</p>
                  <p><strong>Portal URL:</strong> http://erp.sit.ac.in/</p>
                </div>
              </div>

              <div className="step">
                <div className="step-number">2</div>
                <div className="step-content">
                  <h4>Complete Payment</h4>
                  <div className="qr-code-section">
                    <img
                      src="/assets/qrcode.jpeg"
                      alt="Payment QR Code"
                      className="payment-qr-code"
                    />
                    <p className="qr-instruction">
                      <strong>Scan this QR code for quick payment procedure</strong>
                    </p>
                  </div>
                  <p>Step 1: Select External option in the user type section</p>
                  <p>Step 2: Select External option in the user type section</p>
                  <p>Step 3: Go to Fee Head and Select HALCYON option</p>
                  <p>Step 4: Go to Fee Type and Select your choice of event </p>
                  <p>Step 5: Your FEE amount will be visible click confirm to proceed for payment</p>
                  <p>Step 6: Select your choice of Payment Method enter the details and make the payment.</p>
                </div>
              </div>

              <div className="step">
                <div className="step-number">3</div>
                <div className="step-content">
                  <h4>Get Refernce Number</h4>
                  <p>After successful payment, you will receive a <strong> Transaction Refernce Number</strong>.</p>
                  <p>This ID should be exactly <strong>14 alphanumeric characters</strong> (e.g., JCIT1234567890, ABC123DEF45678)</p>
                </div>
              </div>

              <div className="step">
                <div className="step-number">4</div>
                <div className="step-content">
                  <h4>Complete Registration</h4>
                  <p>Return to the registration form and enter your Transaction Refernce Number in the designated field to complete your registration.</p>
                  <p>The Transaction Refernce Number field will be available in the main registration form.</p>
                </div>
              </div>
            </div>
          </div>

          {/* ERP Portal Access Section */}
          <div className="erp-access-section">
            <h3><i className="fas fa-external-link-alt"></i> Access Payment Portal</h3>
            <p>Click the button below to proceed to the ERP portal for payment:</p>
            <button className="erp-button-main" onClick={handleProceedToERP}>
              <i className="fas fa-external-link-alt"></i>
              Go to ERP Portal
            </button>
            <p className="erp-note">
              <i className="fas fa-info-circle"></i>
              The ERP portal will open in a new tab. Complete your payment there and return to the registration form to enter your Transaction Refernce Number.
            </p>
          </div>

          <div className="important-notes">
            <h3><i className="fas fa-exclamation-triangle"></i> Important Notes</h3>
            <ul>
              <li><strong>One payment per team:</strong> Only the team leader needs to complete the payment on the ERP portal.</li>
              <li><strong>Keep your Transaction Refernce Number safe</strong> - you'll need it to complete team registration.</li>
              <li><strong>Team payment is mandatory</strong> for paid events. Registration will not be confirmed without valid payment.</li>
              <li><strong>All team members covered:</strong> This single payment covers registration for all team members.</li>
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
