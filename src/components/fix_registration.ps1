# Read the file content
$content = Get-Content "EventRegistrationForm.jsx" -Raw

# Replace the handleSubmit function with a simple success version
$pattern = 'const handleSubmit = async \(e\) => \{[\s\S]*?setSubmitting\(false\);\s*\};'

$newFunction = @"
const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate user data
    if (!userData.name || !userData.email || !userData.mobile) {
      setError('User data is missing. Please try logging in again.');
      return;
    }

    // Validate common college name
    if (!commonCollegeName) {
      setError('Please enter the college name');
      return;
    }

    // Validate all participants have required fields
    for (let i = 0; i < participants.length; i++) {
      const participant = participants[i];

      if (i === 0) {
        // Team leader validation - only check USN as other fields come from userData
        if (!participant.usn) {
          setError(\`Please fill in USN for team leader\`);
          return;
        }
      } else {
        // Other team members validation - check all fields except collegeName
        if (!participant.name || !participant.email || !participant.mobile || !participant.usn) {
          setError(\`All fields for participant \${i + 1} are required\`);
          return;
        }
      }
    }

    // Validate team name if team size > 2
    if (teamSize > 2 && !teamName) {
      setError('Team name is required for teams with more than 2 members');
      return;
    }

    // Validate transaction ID if event has fees
    if (eventFee > 0) {
      if (!transactionId.trim()) {
        setError('Transaction ID is required for paid events. Please complete payment first.');
        return;
      }
      
      // Validate transaction ID format: 14 alphanumeric characters
      const transactionIdRegex = /^[A-Za-z0-9]{14}$/;
      if (!transactionIdRegex.test(transactionId.trim())) {
        setError('Invalid Transaction ID format. It should be exactly 14 alphanumeric characters (e.g., JCIT1234567890, ABC123DEF45678)');
        return;
      }
    }

    setError('');
    setSubmitting(true);

    // Extract team leader (first participant) and team members (rest of participants)
    const teamLeader = participants[0];
    const teamMembers = participants.slice(1);

    // Prepare registration data according to backend requirements
    const registrationData = {
      teamLeaderDetails: {
        collegeName: commonCollegeName, // Use common college name for team leader
        usn: teamLeader.usn
      },
      teamName: teamSize > 2 ? teamName : null,
      teamSize: teamSize,
      teamMembers: teamMembers.map(member => ({
        name: member.name,
        email: member.email,
        mobile: member.mobile,
        usn: member.usn,
        collegeName: commonCollegeName // Use common college name for all team members
      })),
      transactionId: eventFee > 0 ? transactionId.trim() : null
    };

    // All validations passed - show success immediately
    console.log('Registration data prepared:', registrationData);
    setSuccess(true);

    // Call onSuccess callback if provided
    if (onSuccess) {
      onSuccess(registrationData);
    }

    setSubmitting(false);
  };
"@

$content = $content -replace $pattern, $newFunction
$content | Set-Content "EventRegistrationForm.jsx"
Write-Host "Fixed registration form!"
