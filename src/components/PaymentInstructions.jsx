import React from 'react';
import './PaymentInstructions.css';

function PaymentInstructions({ eventName, eventFee, onClose, onProceedToERP }) {
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
            <h3><i className="fas fa-info-circle"></i> How to Pay Using ERP Portal</h3>
            <div className="steps-container">
              <div className="step">
                <div className="step-number">1</div>
                <div className="step-content">
                  <h4>Login to ERP Portal</h4>
                  <p>Visit the ERP portal and under the user type identity as External</p>
                </div>
              </div>

              <div className="step">
                <div className="step-number">2</div>
                <div className="step-content">
                  <h4>Enter Details</h4>
                  <p>Enter all the details that are asked</p>
                </div>
              </div>

              <div className="step">
                <div className="step-number">3</div>
                <div className="step-content">
                  <h4>Selection of Halcyon under Fee Head</h4>
                  <p>From the dropdown select Halcyon as the Fee Head</p>
                </div>
              </div>

              <div className="step">
                <div className="step-number">4</div>
                <div className="step-content">
                  <h4>Selection of Event from the fee type </h4>
                  <p>Select the event you want to participate from the dropdown</p>
                  
                </div>
              </div>

              <div className="step">
                <div className="step-number">5</div>
                <div className="step-content">
                  <h4>Pay the total payable amount </h4>
                  <p>Total payable amount will be displayed, Pay the amount using the payment mode of your choice</p>
                </div>
              </div>

              <div className="step">
                <div className="step-number">6</div>
                <div className="step-content">
                  <h4>Note Transaction ID</h4>
                  <p><strong>Important:</strong> After successful payment, note down the Transaction ID. You'll need to enter this in the registration form.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="important-notes">
            <h3><i className="fas fa-exclamation-triangle"></i> Important Notes</h3>
            <ul>
              <li>Keep your transaction ID safe - you'll need it to complete registration</li>
              <li>Payment must be completed before you can register for the event</li>
              <li>If you face any issues with payment, contact the event coordinators</li>
              <li>Ensure you're using the correct event name and amount</li>
            </ul>
          </div>

          <div className="contact-info">
            <h3><i className="fas fa-phone"></i> Need Help?</h3>
            <p>If you face any issues with the payment process, contact:</p>
            <p><strong>Event Coordinators:</strong> Available in the event details</p>
          </div>
        </div>

        <div className="payment-actions">
          <button className="erp-button" onClick={onProceedToERP}>
            <i className="fas fa-external-link-alt"></i>
            Go to ERP Portal
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
