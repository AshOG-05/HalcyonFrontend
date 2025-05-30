"use client"

import { useState, useEffect } from "react"
import { isTeamLoggedIn, teamLogout } from "../../services/authService"
import { corsProtectedFetch, ORIGINAL_API_URL } from "../../utils/corsHelper"
import "./styles.css"

// Event categories for spot registration
const EVENT_CATEGORIES = [
  { id: "technical", label: "Technical Events" },
  { id: "cultural", label: "Cultural Events" },
  { id: "sports", label: "Sports Events" },
  { id: "gaming", label: "Gaming Events" },
  { id: "literary", label: "Literary Events" },
  { id: "art", label: "Art & Craft Events" },
  { id: "dance", label: "Dance Events" },
  { id: "music", label: "Music Events" },
  { id: "drama", label: "Drama Events" },
  { id: "photography", label: "Photography Events" },
  { id: "other", label: "Other Events" },
]

function TeamDashboard() {
  const [activeTab, setActiveTab] = useState("events")
  const [events, setEvents] = useState([])
  const [registrations, setRegistrations] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  // USN Check functionality
  // Remove these lines:
  // const [usnInput, setUsnInput] = useState("")
  // const [usnCheckResult, setUsnCheckResult] = useState(null)
  // const [usnLoading, setUsnLoading] = useState(false)

  // Team size options state - THIS WAS MISSING
  const [teamSizeOptions, setTeamSizeOptions] = useState([1])

  // Spot Registration functionality
  const [spotRegistrationForm, setSpotRegistrationForm] = useState({
    eventId: "",
    teamName: "",
    teamSize: 1,
    commonCollegeName: "",
    paymentMode: "", // Added missing paymentMode
    participants: [
      {
        name: "",
        email: "",
        mobile: "",
        usn: "",
      },
    ],
  })
  const [selectedEvent, setSelectedEvent] = useState(null)
  const [selectedCategory, setSelectedCategory] = useState("")
  const [filteredEvents, setFilteredEvents] = useState([])

  useEffect(() => {
    // Check if team member is logged in
    if (!isTeamLoggedIn()) {
      window.location.href = "/RegisterLogin"
      return
    }

    // Fetch initial data
    const initializeData = async () => {
      try {
        await fetchEvents()
        await fetchRegistrations()
      } catch (err) {
        console.error("Error initializing team dashboard:", err)
        setError("Failed to load dashboard data. Please refresh the page.")
        setLoading(false)
      }
    }

    initializeData()
  }, [])

  // Filter events when category changes
  useEffect(() => {
    if (selectedCategory) {
      const filtered = events.filter((event) => event.category === selectedCategory)
      setFilteredEvents(filtered)
    } else {
      setFilteredEvents([])
    }

    // Don't reset the form if we have a pre-selected event that matches the category
    if (selectedEvent && selectedEvent.category === selectedCategory) {
      return
    }

    // Only reset if no event is selected or category doesn't match
    if (!selectedEvent || (selectedEvent && selectedEvent.category !== selectedCategory)) {
      setSpotRegistrationForm((prev) => ({
        ...prev,
        eventId: "",
      }))
      if (!selectedEvent) {
        setSelectedEvent(null)
      }
    }
  }, [selectedCategory, events])

  const fetchEvents = async () => {
    try {
      const response = await corsProtectedFetch("event")
      if (!response.ok) {
        throw new Error(`Failed to fetch events: ${response.status} ${response.statusText}`)
      }
      const data = await response.json()
      setEvents(data)
    } catch (err) {
      console.error("Error fetching events:", err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const fetchRegistrations = async () => {
    try {
      const token = localStorage.getItem("teamCookie")
      const response = await corsProtectedFetch("registration/me", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (!response.ok) {
        throw new Error("Failed to fetch registrations")
      }

      const data = await response.json()
      setRegistrations(data)
    } catch (err) {
      setError(err.message)
    }
  }

  // USN Check function
  // const checkUSNPaymentStatus = async () => {
  //   if (!usnInput.trim()) {
  //     alert("Please enter a USN")
  //     return
  //   }

  //   setUsnLoading(true)
  //   setUsnCheckResult(null)

  //   try {
  //     // Check if USN starts with '1si' (SIT college)
  //     const isSITStudent = usnInput.toLowerCase().startsWith("1si")

  //     setUsnCheckResult({
  //       usn: usnInput,
  //       paymentRequired: !isSITStudent,
  //       college: isSITStudent ? "Siddaganga Institute of Technology" : "Other College",
  //       message: isSITStudent
  //         ? "No payment required - SIT student"
  //         : "Payment required on event day - External student",
  //     })
  //   } catch (err) {
  //     setError(err.message)
  //   } finally {
  //     setUsnLoading(false)
  //   }
  // }

  const handleLogout = () => {
    teamLogout()
  }

  // Handle category selection
  const handleCategoryChange = (e) => {
    const category = e.target.value
    setSelectedCategory(category)
  }

  // Handle event selection and fetch event details
  const handleEventChange = async (e) => {
    const eventId = e.target.value

    // Reset form if no event is selected
    if (!eventId) {
      setSpotRegistrationForm({
        eventId: "",
        teamName: "",
        teamSize: 1,
        commonCollegeName: "",
        paymentMode: "",
        participants: [
          {
            name: "",
            email: "",
            mobile: "",
            usn: "",
          },
        ],
      })
      setSelectedEvent(null)
      setTeamSizeOptions([1])
      return
    }

    setSpotRegistrationForm({
      ...spotRegistrationForm,
      eventId,
    })

    try {
      // FIXED: Use ORIGINAL_API_URL instead of undefined API_URL
      const response = await fetch(`${ORIGINAL_API_URL}/event/${eventId}`)

      if (!response.ok) {
        throw new Error("Failed to fetch event details")
      }

      const eventData = await response.json()
      setSelectedEvent(eventData)

      // Set team size options based on event configuration
      let newTeamSize

      // For team events (3+ participants), always use min and max team sizes
      if (eventData.teamSize >= 3) {
        // Get min and max team sizes, ensuring they're properly parsed as integers
        // Use explicit checks to handle zero values correctly
        const minSize =
          eventData.minTeamSize !== undefined && eventData.minTeamSize !== null
            ? Number.parseInt(eventData.minTeamSize)
            : Number.parseInt(eventData.teamSize) || 3

        const maxSize =
          eventData.maxTeamSize !== undefined && eventData.maxTeamSize !== null
            ? Number.parseInt(eventData.maxTeamSize)
            : Number.parseInt(eventData.teamSize) || 3

        console.log("Team event detected with min size:", minSize, "and max size:", maxSize)
        console.log("Raw values from backend:", {
          minTeamSize: eventData.minTeamSize,
          maxTeamSize: eventData.maxTeamSize,
          teamSize: eventData.teamSize,
        })

        // Generate options from min to max (not from 1)
        // Make sure maxSize is greater than or equal to minSize
        if (maxSize < minSize) {
          console.error("Error: maxSize is less than minSize", { minSize, maxSize })
          // Default to just the minSize if there's an issue
          setTeamSizeOptions([minSize])
        } else {
          // Create an array of options from minSize to maxSize
          const options = []
          for (let i = minSize; i <= maxSize; i++) {
            options.push(i)
          }
          console.log("Generated team size options:", options)
          setTeamSizeOptions(options)
        }

        // Set default team size to minimum
        newTeamSize = minSize

        // Initialize participants array based on team size
        const newParticipants = Array.from({ length: newTeamSize }, (_, i) => {
          return {
            name: "",
            email: "",
            mobile: "",
            usn: "",
          }
        })

        setSpotRegistrationForm((prev) => ({
          ...prev,
          teamSize: newTeamSize,
          participants: newParticipants,
        }))
      } else {
        // If fixed team size, only provide the specified team size
        setTeamSizeOptions([eventData.teamSize || 1])

        // Update form with the required team size
        newTeamSize = eventData.teamSize || 1

        // Initialize participants array based on team size
        const newParticipants = Array.from({ length: newTeamSize }, (_, i) => {
          return {
            name: "",
            email: "",
            mobile: "",
            usn: "",
          }
        })

        setSpotRegistrationForm((prev) => ({
          ...prev,
          teamSize: newTeamSize,
          participants: newParticipants,
        }))
      }
    } catch (err) {
      setError(err.message)
    }
  }

  // Handle team size change
  const handleTeamSizeChange = (e) => {
    const newTeamSize = Number.parseInt(e.target.value)
    console.log("Team size changed to:", newTeamSize)

    // Validate the size is within the available options
    if (!teamSizeOptions.includes(newTeamSize)) {
      console.error("Selected team size is not in available options:", newTeamSize, teamSizeOptions)
      // Use the first available option as fallback
      const fallbackSize = teamSizeOptions.length > 0 ? teamSizeOptions[0] : 1
      console.log("Using fallback size:", fallbackSize)

      setSpotRegistrationForm((prev) => ({
        ...prev,
        teamSize: fallbackSize,
      }))
      return
    }

    // Initialize participants array based on new team size
    const newParticipants = Array.from({ length: newTeamSize }, (_, i) => {
      // Keep existing participant data if available
      return (
        spotRegistrationForm.participants[i] || {
          name: "",
          email: "",
          mobile: "",
          usn: "",
        }
      )
    })

    console.log("Updated participants array for team size", newTeamSize, ":", newParticipants)

    // If team size is > 2, suggest a default team name if none exists
    const updatedForm = {
      ...spotRegistrationForm,
      teamSize: newTeamSize,
      participants: newParticipants,
    }

    if (newTeamSize > 2 && !spotRegistrationForm.teamName) {
      // Get team member info from localStorage for default team name
      const teamMemberData = JSON.parse(localStorage.getItem("userData")) || {}
      const teamMemberName = teamMemberData.name || "Team"
      updatedForm.teamName = "Team " + teamMemberName.split(" ")[0]
    }

    setSpotRegistrationForm(updatedForm)
  }

  // Handle changes to common fields
  const handleCommonFieldChange = (e) => {
    const { name, value } = e.target
    setSpotRegistrationForm((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  // Handle changes to participant fields
  const handleParticipantChange = (index, field, value) => {
    const updatedParticipants = [...spotRegistrationForm.participants]
    updatedParticipants[index] = {
      ...updatedParticipants[index],
      [field]: value,
    }

    setSpotRegistrationForm((prev) => ({
      ...prev,
      participants: updatedParticipants,
    }))
  }

  const handleSpotRegistrationSubmit = async (e) => {
    e.preventDefault()
    try {
      // Validate form data
      if (!spotRegistrationForm.eventId) {
        throw new Error("Please select an event")
      }

      if (!spotRegistrationForm.commonCollegeName) {
        throw new Error("Please enter the college name")
      }

      // Validate team name for teams with more than 2 members
      if (spotRegistrationForm.teamSize > 2 && !spotRegistrationForm.teamName) {
        throw new Error("Team name is required for teams with more than 2 members")
      }

      // Validate payment mode for paid events
      if (
        selectedEvent &&
        (selectedEvent.registrationFee > 0 || (selectedEvent.fees && Number.parseInt(selectedEvent.fees) > 0)) &&
        !spotRegistrationForm.paymentMode
      ) {
        throw new Error("Please select a payment mode for this paid event")
      }

      // Validate all participants have required fields
      const missingFields = []
      spotRegistrationForm.participants.forEach((participant, index) => {
        if (!participant.name) missingFields.push(`Participant ${index + 1} name`)
        if (!participant.email) missingFields.push(`Participant ${index + 1} email`)
        if (!participant.mobile) missingFields.push(`Participant ${index + 1} mobile`)
        if (!participant.usn) missingFields.push(`Participant ${index + 1} USN`)
      })

      if (missingFields.length > 0) {
        throw new Error(`Please fill in all required fields: ${missingFields.join(", ")}`)
      }

      // Extract team leader (first participant) and team members (rest of participants)
      const teamLeader = spotRegistrationForm.participants[0]
      const teamMembers = spotRegistrationForm.participants.slice(1)

      // Prepare registration data according to backend requirements
      const registrationData = {
        teamLeaderDetails: {
          collegeName: spotRegistrationForm.commonCollegeName,
          usn: teamLeader.usn,
        },
        teamName: spotRegistrationForm.teamSize > 2 ? spotRegistrationForm.teamName : null,
        teamSize: spotRegistrationForm.teamSize,
        teamMembers: teamMembers.map((member) => ({
          name: member.name,
          email: member.email,
          mobile: member.mobile,
          usn: member.usn,
          collegeName: spotRegistrationForm.commonCollegeName,
        })),
      }

      // Get team member info from localStorage
      const teamMemberData = JSON.parse(localStorage.getItem("userData")) || {}
      const teamMemberName = teamMemberData.name || "Unknown"

      // If the event has a fee, handle payment (for spot registration, payment is collected manually)
      if (
        selectedEvent &&
        (selectedEvent.registrationFee > 0 || (selectedEvent.fees && Number.parseInt(selectedEvent.fees) > 0))
      ) {
        registrationData.paymentStatus = "completed"
        // Include team member name in payment references for better tracking
        registrationData.paymentId = `SPOT_PAYMENT_${teamMemberName}_${Date.now()}`
        registrationData.orderId = `SPOT_ORDER_${teamMemberName}_${Date.now()}`
        // Include payment mode in notes field
        registrationData.notes = `Payment collected via ${spotRegistrationForm.paymentMode.toUpperCase()} by ${teamMemberName}`
      }

      // Send registration request using the dedicated spot registration endpoint
      const token = localStorage.getItem("teamCookie")

      // Log the data being sent for debugging
      console.log("Sending spot registration data:", registrationData)

      const response = await corsProtectedFetch(`registration/spot/${spotRegistrationForm.eventId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(registrationData),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to register participant")
      }

      // Reset form and refresh registrations
      setSpotRegistrationForm({
        eventId: "",
        teamName: "",
        teamSize: 1,
        commonCollegeName: "",
        paymentMode: "",
        participants: [
          {
            name: "",
            email: "",
            mobile: "",
            usn: "",
          },
        ],
      })
      setSelectedEvent(null)
      fetchRegistrations()

      alert("Registration completed successfully!")
    } catch (err) {
      setError(err.message)
      alert("Error: " + err.message)
    }
  }

  const renderContent = () => {
    if (loading) {
      return <div className="loading">Loading...</div>
    }

    if (error) {
      return <div className="error">{error}</div>
    }

    switch (activeTab) {
      case "events":
        return (
          <div className="dashboard-table-container">
            <h3>📅 Available Events</h3>
            <table className="dashboard-table">
              <thead>
                <tr>
                  <th>Event Name</th>
                  <th>Date</th>
                  <th>Venue</th>
                  <th>Amount</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {events.length > 0 ? (
                  events.map((event) => (
                    <tr key={event._id}>
                      <td>{event.name}</td>
                      <td>{new Date(event.date).toLocaleDateString()}</td>
                      <td>{event.venue}</td>
                      <td>₹{event.fees}</td>
                      <td>
                        <button
                          className="action-btn register-btn"
                          onClick={async () => {
                            try {
                              // Set the category first
                              setSelectedCategory(event.category || "")

                              // Set the selected event immediately
                              setSelectedEvent(event)

                              // Update filtered events to include this event
                              const filtered = events.filter((e) => e.category === (event.category || ""))
                              setFilteredEvents(filtered)

                              // Fetch detailed event data
                              const response = await fetch(`${ORIGINAL_API_URL}/event/${event._id}`)
                              if (!response.ok) {
                                throw new Error("Failed to fetch event details")
                              }
                              const eventData = await response.json()

                              // Set team size options based on event configuration
                              let newTeamSize = 1
                              let teamSizeOptions = [1]

                              if (eventData.teamSize >= 3) {
                                const minSize =
                                  eventData.minTeamSize !== undefined && eventData.minTeamSize !== null
                                    ? Number.parseInt(eventData.minTeamSize)
                                    : Number.parseInt(eventData.teamSize) || 3

                                const maxSize =
                                  eventData.maxTeamSize !== undefined && eventData.maxTeamSize !== null
                                    ? Number.parseInt(eventData.maxTeamSize)
                                    : Number.parseInt(eventData.teamSize) || 3

                                if (maxSize >= minSize) {
                                  teamSizeOptions = []
                                  for (let i = minSize; i <= maxSize; i++) {
                                    teamSizeOptions.push(i)
                                  }
                                } else {
                                  teamSizeOptions = [minSize]
                                }
                                newTeamSize = minSize
                              } else {
                                teamSizeOptions = [eventData.teamSize || 1]
                                newTeamSize = eventData.teamSize || 1
                              }

                              setTeamSizeOptions(teamSizeOptions)

                              // Initialize participants array
                              const newParticipants = Array.from({ length: newTeamSize }, () => ({
                                name: "",
                                email: "",
                                mobile: "",
                                usn: "",
                              }))

                              // Update form with all the data
                              setSpotRegistrationForm({
                                eventId: event._id,
                                teamName: newTeamSize > 2 ? "" : "",
                                teamSize: newTeamSize,
                                commonCollegeName: "",
                                paymentMode: "",
                                participants: newParticipants,
                              })

                              // Switch to spot registration tab
                              setActiveTab("spot-registration")
                            } catch (err) {
                              console.error("Error setting up spot registration:", err)
                              setError("Failed to load event details for registration")
                            }
                          }}
                          disabled={!event.registrationOpen}
                        >
                          <i className="fas fa-user-plus"></i> Register Participant
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="no-data">
                      No events found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )

      case "registrations":
        return (
          <div className="dashboard-table-container">
            <h3>📋 Team Registrations</h3>
            <div className="registrations-summary">
              <p>
                Total Registrations: <strong>{registrations.length}</strong>
              </p>
            </div>

            {registrations.length > 0 ? (
              registrations.map((reg) => (
                <div key={reg._id} className="registration-card">
                  <div className="registration-header">
                    <h4>{reg.event?.name || "Unknown Event"}</h4>
                    <span className={`status-badge ${reg.paymentStatus}`}>
                      {reg.paymentStatus === "completed"
                        ? "Paid"
                        : reg.paymentStatus === "not_required"
                          ? "No Req"
                          : reg.paymentStatus === "pending"
                            ? "Payment Pending"
                            : reg.paymentStatus === "failed"
                              ? "Payment Failed"
                              : reg.paymentStatus === "pay_on_event_day"
                                ? "Pay on Event Day"
                                : "Payment Required"}
                    </span>
                  </div>

                  <div className="registration-details">
                    <div className="detail-row">
                      <strong>Team Leader:</strong> {reg.teamLeaderDetails?.usn || "Unknown"} -{" "}
                      {reg.isSpotRegistration
                        ? reg.displayTeamLeader?.name || "Unknown"
                        : reg.teamLeader?.name || "Unknown"}
                    </div>
                    <div className="detail-row">
                      <strong>Team Size:</strong> {reg.teamSize || 1} participant{reg.teamSize > 1 ? "s" : ""}
                    </div>
                    <div className="detail-row">
                      <strong>College:</strong> {reg.teamLeaderDetails?.collegeName || "Unknown"}
                    </div>
                    <div className="detail-row">
                      <strong>Registration Date:</strong> {new Date(reg.registeredAt).toLocaleDateString()}
                    </div>
                    <div className="detail-row">
                      <strong>Registered By:</strong> {reg.isSpotRegistration ? "Team Member" : "Self Registration"}
                    </div>
                  </div>

                  {/* Show payment status for each participant */}
                  <div className="participants-payment-status">
                    <h5>Payment Status by Participant:</h5>
                    <div className="participant-payment-list">
                      {/* Team Leader */}
                      <div className="participant-payment-item">
                        <span className="participant-name">
                          {reg.isSpotRegistration
                            ? reg.displayTeamLeader?.name || "Unknown"
                            : reg.teamLeader?.name || "Unknown"}{" "}
                          (Leader)
                        </span>
                        <span className="participant-usn">{reg.teamLeaderDetails?.usn || "Unknown USN"}</span>
                        <span
                          className={`participant-payment-status ${
                            reg.teamLeaderDetails?.usn?.toLowerCase().startsWith("1si")
                              ? "no-payment"
                              : "payment-required"
                          }`}
                        >
                          {reg.teamLeaderDetails?.usn?.toLowerCase().startsWith("1si") ? "No Req" : "Payment Req"}
                        </span>
                      </div>

                      {/* Team Members */}
                      {reg.teamMembers &&
                        reg.teamMembers.map((member, index) => (
                          <div key={index} className="participant-payment-item">
                            <span className="participant-name">{member.name || "Unknown"}</span>
                            <span className="participant-usn">{member.usn || "Unknown USN"}</span>
                            <span
                              className={`participant-payment-status ${
                                member.usn?.toLowerCase().startsWith("1si") ? "no-payment" : "payment-required"
                              }`}
                            >
                              {member.usn?.toLowerCase().startsWith("1si") ? "No Req" : "Payment Req"}
                            </span>
                          </div>
                        ))}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="no-data">No registrations found</div>
            )}
          </div>
        )

      case "spot-registration":
        return (
          <div className="dashboard-form-container">
            <h3>Spot Registration</h3>

            {selectedEvent &&
              (selectedEvent.registrationFee > 0 ||
                (selectedEvent.fees && Number.parseInt(selectedEvent.fees) > 0)) && (
                <div className="event-fee-notice">
                  <i className="fas fa-info-circle"></i>
                  <p>
                    This event has a registration fee of{" "}
                    {selectedEvent.registrationFee ? `₹${selectedEvent.registrationFee}` : `₹${selectedEvent.fees}`}.
                    For spot registrations, please collect the payment separately and mark as paid in the system.
                  </p>
                </div>
              )}

            <form onSubmit={handleSpotRegistrationSubmit} className="dashboard-form">
              {/* Category Selection */}
              <div className="form-group">
                <label htmlFor="category">Select Category</label>
                <select id="category" name="category" value={selectedCategory} onChange={handleCategoryChange} required>
                  <option value="">-- Select Category --</option>
                  {EVENT_CATEGORIES.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Event Selection - Only show if category is selected */}
              {selectedCategory && (
                <div className="form-group">
                  <label htmlFor="eventId">Select Event</label>
                  <select
                    id="eventId"
                    name="eventId"
                    value={spotRegistrationForm.eventId}
                    onChange={handleEventChange}
                    required
                  >
                    <option value="">-- Select Event --</option>
                    {filteredEvents.length > 0 ? (
                      filteredEvents.map((event) => (
                        <option key={event._id} value={event._id}>
                          {event.name} (Day {event.day || 1})
                        </option>
                      ))
                    ) : (
                      <option value="" disabled>
                        No events found in this category
                      </option>
                    )}
                  </select>
                </div>
              )}

              {/* Team Size Selection - Only show if event is selected */}
              {selectedEvent && (
                <div className="form-group">
                  <label htmlFor="teamSize">Team Size</label>
                  <select
                    id="teamSize"
                    name="teamSize"
                    value={spotRegistrationForm.teamSize}
                    onChange={handleTeamSizeChange}
                    required
                    disabled={teamSizeOptions.length === 1} // Disable if only one option
                    className="team-size-select"
                    style={{ fontWeight: "bold", fontSize: "1rem" }}
                  >
                    {teamSizeOptions.map((size) => (
                      <option key={size} value={size}>
                        {size} {size === 1 ? "Participant" : "Participants"}
                      </option>
                    ))}
                  </select>
                  {teamSizeOptions.length === 1 && (
                    <div className="form-hint">This event requires exactly {teamSizeOptions[0]} participant(s).</div>
                  )}
                  {teamSizeOptions.length > 1 && (
                    <div className="form-hint">
                      This event allows {Math.min(...teamSizeOptions)} to {Math.max(...teamSizeOptions)} participants.
                    </div>
                  )}
                </div>
              )}

              {/* Team Name - Only show for teams with more than 2 members */}
              {spotRegistrationForm.teamSize > 2 && (
                <div className="form-group">
                  <label htmlFor="teamName">Team Name</label>
                  <input
                    type="text"
                    id="teamName"
                    name="teamName"
                    value={spotRegistrationForm.teamName}
                    onChange={handleCommonFieldChange}
                    required
                    placeholder="Enter team name"
                  />
                </div>
              )}

              {/* Common College Name */}
              <div className="form-group">
                <label htmlFor="commonCollegeName">College Name</label>
                <input
                  type="text"
                  id="commonCollegeName"
                  name="commonCollegeName"
                  value={spotRegistrationForm.commonCollegeName}
                  onChange={handleCommonFieldChange}
                  required
                  placeholder="Enter college name (same for all participants)"
                />
              </div>

              {/* Payment Mode - Only show if event has a fee */}
              {selectedEvent &&
                (selectedEvent.registrationFee > 0 ||
                  (selectedEvent.fees && Number.parseInt(selectedEvent.fees) > 0)) && (
                  <div className="form-group">
                    <label htmlFor="paymentMode">Mode of Payment *</label>
                    <select
                      id="paymentMode"
                      name="paymentMode"
                      value={spotRegistrationForm.paymentMode}
                      onChange={handleCommonFieldChange}
                      required
                    >
                      <option value="">-- Select Payment Mode --</option>
                      <option value="cash">Cash</option>
                      <option value="upi">UPI</option>
                      <option value="card">Card</option>
                    </select>
                    <p className="form-hint">Please select how the payment was collected</p>
                  </div>
                )}

              {/* Participant Details */}
              <div className="participants-section">
                <h4>Participant Details</h4>

                {spotRegistrationForm.participants.map((participant, index) => (
                  <div key={index} className="participant-card">
                    <h5>{index === 0 ? "Team Leader" : `Participant ${index + 1}`}</h5>

                    <div className="participant-form">
                      <div className="form-group">
                        <label htmlFor={`participant-${index}-name`}>Full Name</label>
                        <input
                          type="text"
                          id={`participant-${index}-name`}
                          value={participant.name}
                          onChange={(e) => handleParticipantChange(index, "name", e.target.value)}
                          required
                          placeholder="Enter full name"
                        />
                      </div>

                      <div className="form-group">
                        <label htmlFor={`participant-${index}-email`}>Email</label>
                        <input
                          type="email"
                          id={`participant-${index}-email`}
                          value={participant.email}
                          onChange={(e) => handleParticipantChange(index, "email", e.target.value)}
                          required
                          placeholder="Enter email address"
                        />
                      </div>

                      <div className="form-group">
                        <label htmlFor={`participant-${index}-mobile`}>Mobile Number</label>
                        <input
                          type="tel"
                          id={`participant-${index}-mobile`}
                          value={participant.mobile}
                          onChange={(e) => handleParticipantChange(index, "mobile", e.target.value)}
                          required
                          placeholder="Enter 10-digit mobile number"
                          pattern="[0-9]{10}"
                        />
                      </div>

                      <div className="form-group">
                        <label htmlFor={`participant-${index}-usn`}>USN</label>
                        <input
                          type="text"
                          id={`participant-${index}-usn`}
                          value={participant.usn}
                          onChange={(e) => handleParticipantChange(index, "usn", e.target.value)}
                          required
                          placeholder="Enter USN"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <button type="submit" className="submit-btn">
                <i className="fas fa-user-plus"></i> Complete Registration
              </button>
            </form>
          </div>
        )

      default:
        return <div>Select a tab to view content</div>
    }
  }

  // Show loading state
  if (loading) {
    return (
      <div className="dashboard-container team-dashboard">
        <div className="dashboard-header">
          <h2>Team Dashboard</h2>
          <button className="logout-btn" onClick={handleLogout}>
            Logout
          </button>
        </div>
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading dashboard...</p>
        </div>
      </div>
    )
  }

  // Show error state
  if (error && !events.length) {
    return (
      <div className="dashboard-container team-dashboard">
        <div className="dashboard-header">
          <h2>Team Dashboard</h2>
          <button className="logout-btn" onClick={handleLogout}>
            Logout
          </button>
        </div>
        <div className="error-container">
          <div className="error-message">
            <i className="fas fa-exclamation-triangle"></i>
            <h3>Error Loading Dashboard</h3>
            <p>{error}</p>
            <button
              className="retry-btn"
              onClick={() => {
                setError("")
                setLoading(true)
                fetchEvents()
                fetchRegistrations()
              }}
            >
              <i className="fas fa-redo"></i> Retry
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="dashboard-container team-dashboard">
      <div className="dashboard-header">
        <h2>Team Dashboard</h2>
        <button className="logout-btn" onClick={handleLogout}>
          Logout
        </button>
      </div>

      {error && (
        <div className="error-banner">
          <i className="fas fa-exclamation-triangle"></i>
          {error}
          <button onClick={() => setError("")} className="close-error">
            ×
          </button>
        </div>
      )}

      <div className="dashboard-content">
        <div className="dashboard-sidebar">
          <button
            className={`sidebar-btn ${activeTab === "events" ? "active" : ""}`}
            onClick={() => setActiveTab("events")}
          >
            <i className="fas fa-calendar-alt"></i> Events
          </button>
          <button
            className={`sidebar-btn ${activeTab === "registrations" ? "active" : ""}`}
            onClick={() => setActiveTab("registrations")}
          >
            <i className="fas fa-clipboard-list"></i> Registrations
          </button>
          <button
            className={`sidebar-btn ${activeTab === "spot-registration" ? "active" : ""}`}
            onClick={() => setActiveTab("spot-registration")}
          >
            <i className="fas fa-user-plus"></i> Spot Registration
          </button>
        </div>

        <div className="dashboard-main">{renderContent()}</div>
      </div>
    </div>
  )
}

export default TeamDashboard
