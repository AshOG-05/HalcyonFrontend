$content = Get-Content "EventRegistrationForm.jsx" -Raw
$alreadyRegisteredComponent = @"
  // Render already registered state
  if (alreadyRegistered) {
    return (
      <div className="event-registration-overlay">
        <div className="event-registration-modal">
          <button className="close-modal" onClick={onClose}>
            <i className="fas fa-times"></i>
          </button>
          <div className="registration-closed">
            <i className="fas fa-check-circle registration-closed-icon" style={{color: '#4CAF50'}}></i>
            <h3>Already Registered</h3>
            <p>You have already registered for {eventName}.</p>
            <p>Registration is already completed. You cannot register for the same event twice.</p>
            <button className="auth-button" onClick={onClose}>Close</button>
          </div>
        </div>
      </div>
    );
  }

"@
$content = $content -replace "  }`r`n`r`n  // Render success state", "  }`r`n`r`n$alreadyRegisteredComponent  // Render success state"
$content | Set-Content "EventRegistrationForm.jsx"
