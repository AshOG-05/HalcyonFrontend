"use client"

import { useState, useEffect } from "react"
import { isTeamLoggedIn, teamLogout } from "../../services/authService"
import { corsProtectedFetch, ORIGINAL_API_URL } from "../../utils/corsHelper"
import { EVENT_CATEGORIES } from "../../config"
import "./styles.css"

function TeamDashboard() {
  const [activeTab, setActiveTab] = useState("events")
  const [events, setEvents] = useState([])
  const [registrations, setRegistrations] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  // Search and filter states for registrations
  const [searchTerm, setSearchTerm] = useState("")
  const [filterCategory, setFilterCategory] = useState("")
  const [filterEvent, setFilterEvent] = useState("")
  const [filteredRegistrations, setFilteredRegistrations] = useState([])

  // USN Check functionality
  // Remove these lines:
  // const [usnInput, setUsnInput] = useState("")
  // const [usnCheckResult, setUsnCheckResult] = useState(null)
  // const [usnLoading, setUsnLoading] = useState(false)

  // Team size options state - THIS WAS MISSING
  const [teamSizeOptions, setTeamSizeOptions] = useState([1])

  // Modal states for registration details
  const [showRegistrationModal, setShowRegistrationModal] = useState(false)
  const [selectedRegistration, setSelectedRegistration] = useState(null)

  // Spot Registration functionality
  const [spotRegistrationForm, setSpotRegistrationForm] = useState({
    eventId: "",
    teamName: "",
    teamSize: 1,
    commonCollegeName: "",
    paymentMode: "", // Added missing paymentMode
    transactionId: "", // Added transaction ID for ERP payments
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

  // Filter registrations based on search term and filters
  useEffect(() => {
    let filtered = [...registrations]

    // Apply search filter (team name or team leader name)
    if (searchTerm.trim()) {
      filtered = filtered.filter((reg) => {
        const teamLeaderName = reg.isSpotRegistration
          ? reg.displayTeamLeader?.name || ""
          : reg.teamLeader?.name || ""
        const teamName = reg.teamName || ""

        return teamLeaderName.toLowerCase().includes(searchTerm.toLowerCase()) ||
               teamName.toLowerCase().includes(searchTerm.toLowerCase())
      })
    }

    // Apply category filter
    if (filterCategory) {
      filtered = filtered.filter((reg) => reg.event?.category === filterCategory)
    }

    // Apply event filter
    if (filterEvent) {
      filtered = filtered.filter((reg) => reg.event?._id === filterEvent)
    }

    setFilteredRegistrations(filtered)
  }, [registrations, searchTerm, filterCategory, filterEvent])

  // Close modal when switching tabs
  useEffect(() => {
    if (showRegistrationModal) {
      setShowRegistrationModal(false)
      setSelectedRegistration(null)
    }
  }, [activeTab])

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

  // Handle viewing registration details
  const handleViewRegistration = (registration) => {
    setSelectedRegistration(registration)
    setShowRegistrationModal(true)
  }

  const handleCloseRegistrationModal = () => {
    setShowRegistrationModal(false)
    setSelectedRegistration(null)
  }

  // Handle search and filter changes
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value)
  }

  const handleCategoryFilterChange = (e) => {
    setFilterCategory(e.target.value)
    // Reset event filter when category changes
    setFilterEvent("")
  }

  const handleEventFilterChange = (e) => {
    setFilterEvent(e.target.value)
  }

  const clearFilters = () => {
    setSearchTerm("")
    setFilterCategory("")
    setFilterEvent("")
  }

  // Get unique events for the selected category
  const getEventsForCategory = () => {
    if (!filterCategory) return events
    return events.filter(event => event.category === filterCategory)
  }

  // Helper function to determine if payment is required based on USN and event category
  const isPaymentRequired = (usn, eventCategory) => {
    if (!usn) return true // If no USN, assume payment required

    const isSITStudent = usn.toLowerCase().startsWith("1si")

    if (isSITStudent) {
      // SIT students only pay for gaming events
      return eventCategory === "gaming"
    } else {
      // Non-SIT students pay for all events
      return true
    }
  }

  // Helper function to check if any participant requires payment
  const isAnyPaymentRequired = () => {
    if (!selectedEvent || !spotRegistrationForm.participants.length) return false

    return spotRegistrationForm.participants.some(participant =>
      isPaymentRequired(participant.usn, selectedEvent.category)
    )
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
        transactionId: "",
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

    // If team size is > 1, suggest a default team name if none exists
    const updatedForm = {
      ...spotRegistrationForm,
      teamSize: newTeamSize,
      participants: newParticipants,
    }

    if (newTeamSize > 1 && !spotRegistrationForm.teamName) {
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

      // Validate team name for team events
      if (spotRegistrationForm.teamSize > 1 && !spotRegistrationForm.teamName.trim()) {
        throw new Error("Team name is required for team events")
      }

      // Validate payment mode if any participant requires payment
      if (selectedEvent && isAnyPaymentRequired() && !spotRegistrationForm.paymentMode) {
        throw new Error("Please select a payment mode as some participants require payment")
      }

      // Validate transaction ID if ERP payment is selected
      if (selectedEvent && isAnyPaymentRequired() && spotRegistrationForm.paymentMode === "erp" && !spotRegistrationForm.transactionId.trim()) {
        throw new Error("Please enter the transaction reference number for ERP payment")
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
          // Include the actual participant's information for spot registrations
          name: teamLeader.name,
          email: teamLeader.email,
          mobile: teamLeader.mobile,
        },
        teamName: spotRegistrationForm.teamSize > 1 ? spotRegistrationForm.teamName.trim() : null,
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

      // Handle payment based on participant requirements
      if (selectedEvent && isAnyPaymentRequired()) {
        registrationData.paymentStatus = "completed"
        // Include team member name in payment references for better tracking
        registrationData.paymentId = `SPOT_PAYMENT_${teamMemberName}_${Date.now()}`
        registrationData.orderId = `SPOT_ORDER_${teamMemberName}_${Date.now()}`

        // Include transaction ID if ERP payment is selected
        if (spotRegistrationForm.paymentMode === "erp" && spotRegistrationForm.transactionId) {
          registrationData.transactionId = spotRegistrationForm.transactionId.trim()
        }

        // Create detailed payment notes
        const paymentDetails = spotRegistrationForm.participants.map((participant, index) => {
          const requiresPayment = isPaymentRequired(participant.usn, selectedEvent.category)
          return `${participant.name || `Participant ${index + 1}`} (${participant.usn}): ${requiresPayment ? 'Payment Required' : 'No Payment Required'}`
        }).join('; ')

        let paymentNote = `Payment collected via ${spotRegistrationForm.paymentMode.toUpperCase()} by ${teamMemberName}.`
        if (spotRegistrationForm.paymentMode === "erp" && spotRegistrationForm.transactionId) {
          paymentNote += ` Transaction ID: ${spotRegistrationForm.transactionId}.`
        }
        paymentNote += ` Details: ${paymentDetails}`

        registrationData.notes = paymentNote
      } else {
        // No payment required for any participant
        registrationData.paymentStatus = "not_required"
        registrationData.notes = `No payment required for any participant. Registered by ${teamMemberName}`
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
        transactionId: "",
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

            {/* Desktop Table Layout */}
            <table className="dashboard-table">
              <thead>
                <tr>
                  <th>Event Name</th>
                  <th>Date</th>
                  <th>Venue</th>
                  <th>Amount</th>
                  <th>Registration</th>
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
                        <span className={`status-badge ${event.registrationOpen ? 'open' : 'closed'}`}>
                          {event.registrationOpen ? 'Open' : 'Closed'}
                        </span>
                      </td>
                      <td>
                        <button
                          className="action-btn register-btn"
                          onClick={async () => {
                            console.log("Register button clicked for event:", event.name);
                            console.log("Event registration status:", event.registrationOpen);
                            console.log("Full event data:", event);

                            try {
                              // Set the category first
                              setSelectedCategory(event.category || "")

                              // Set the selected event immediately
                              setSelectedEvent(event)

                              // Update filtered events to include this event
                              const filtered = events.filter((e) => e.category === (event.category || ""))
                              setFilteredEvents(filtered)

                              console.log("Fetching event details from:", `${ORIGINAL_API_URL}/event/${event._id}`);

                              // Fetch detailed event data
                              const response = await fetch(`${ORIGINAL_API_URL}/event/${event._id}`)
                              if (!response.ok) {
                                throw new Error("Failed to fetch event details")
                              }
                              const eventData = await response.json()

                              console.log("Fetched event data:", eventData);

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

                              console.log("Switching to spot registration tab");
                              // Switch to spot registration tab
                              setActiveTab("spot-registration")
                            } catch (err) {
                              console.error("Error setting up spot registration:", err)
                              setError("Failed to load event details for registration: " + err.message)
                            }
                          }}
                          disabled={!event.registrationOpen}
                          title={!event.registrationOpen ? "Registration is closed for this event" : "Click to register participants for this event"}
                        >
                          <i className={`fas ${event.registrationOpen ? 'fa-user-plus' : 'fa-lock'}`}></i>
                          {event.registrationOpen ? 'Register Participant' : 'Registration Closed'}
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="no-data">
                      No events found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>

            {/* Mobile Card Layout */}
            <div className="mobile-cards-container">
              {events.length > 0 ? (
                events.map((event) => (
                  <div key={event._id} className="registration-card">
                    <div className="registration-header">
                      <h4>{event.name}</h4>
                      <span className={`status-badge ${event.registrationOpen ? 'open' : 'closed'}`}>
                        {event.registrationOpen ? 'Open' : 'Closed'}
                      </span>
                    </div>
                    <div className="registration-details">
                      <div className="detail-row">
                        <span>📅 Date:</span>
                        <span>{new Date(event.date).toLocaleDateString()}</span>
                      </div>
                      <div className="detail-row">
                        <span>📍 Venue:</span>
                        <span>{event.venue}</span>
                      </div>
                      <div className="detail-row">
                        <span>💰 Amount:</span>
                        <span>₹{event.fees}</span>
                      </div>
                    </div>
                    <div className="registration-actions">
                      <button
                        className="action-btn register-btn"
                        onClick={async () => {
                          console.log("Register button clicked for event:", event.name);
                          console.log("Event registration status:", event.registrationOpen);
                          console.log("Full event data:", event);

                          try {
                            // Set the category first
                            setSelectedCategory(event.category || "")

                            // Set the selected event immediately
                            setSelectedEvent(event)

                            // Update filtered events to include this event
                            const filtered = events.filter((e) => e.category === (event.category || ""))
                            setFilteredEvents(filtered)

                            console.log("Fetching event details from:", `${ORIGINAL_API_URL}/event/${event._id}`);

                            // Fetch detailed event data
                            const response = await fetch(`${ORIGINAL_API_URL}/event/${event._id}`)
                            if (!response.ok) {
                              throw new Error("Failed to fetch event details")
                            }
                            const eventData = await response.json()

                            console.log("Fetched event data:", eventData);

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
                              transactionId: "",
                              participants: newParticipants,
                            })

                            console.log("Switching to spot registration tab");
                            // Switch to spot registration tab
                            setActiveTab("spot-registration")
                          } catch (err) {
                            console.error("Error setting up spot registration:", err)
                            setError("Failed to load event details for registration: " + err.message)
                          }
                        }}
                        disabled={!event.registrationOpen}
                        title={!event.registrationOpen ? "Registration is closed for this event" : "Click to register participants for this event"}
                      >
                        <i className={`fas ${event.registrationOpen ? 'fa-user-plus' : 'fa-lock'}`}></i>
                        {event.registrationOpen ? 'Register Participant' : 'Registration Closed'}
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="registration-card">
                  <div className="registration-details">
                    <div style={{ textAlign: 'center', color: '#888' }}>
                      No events available
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )

      case "registrations":
        return (
          <div className="dashboard-table-container">
            <h3>📋 Team Registrations</h3>

            {/* Search and Filter Controls */}
            <div className="search-filter-container">
              <div className="search-bar">
                <div className="search-input-wrapper">
                  <i className="fas fa-search search-icon"></i>
                  <input
                    type="text"
                    placeholder="Search by team name or team leader name..."
                    value={searchTerm}
                    onChange={handleSearchChange}
                    className="search-input"
                  />
                  {searchTerm && (
                    <button
                      className="clear-search-btn"
                      onClick={() => setSearchTerm("")}
                      title="Clear search"
                    >
                      <i className="fas fa-times"></i>
                    </button>
                  )}
                </div>
              </div>

              <div className="filter-controls">
                <div className="filter-group">
                  <label htmlFor="categoryFilter">Category:</label>
                  <select
                    id="categoryFilter"
                    value={filterCategory}
                    onChange={handleCategoryFilterChange}
                    className="filter-select"
                  >
                    <option value="">All Categories</option>
                    {EVENT_CATEGORIES.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="filter-group">
                  <label htmlFor="eventFilter">Event:</label>
                  <select
                    id="eventFilter"
                    value={filterEvent}
                    onChange={handleEventFilterChange}
                    className="filter-select"
                    disabled={!filterCategory}
                  >
                    <option value="">All Events</option>
                    {getEventsForCategory().map((event) => (
                      <option key={event._id} value={event._id}>
                        {event.name}
                      </option>
                    ))}
                  </select>
                </div>

                {(searchTerm || filterCategory || filterEvent) && (
                  <button
                    className="clear-filters-btn"
                    onClick={clearFilters}
                    title="Clear all filters"
                  >
                    <i className="fas fa-times-circle"></i>
                    Clear Filters
                  </button>
                )}
              </div>
            </div>

            <div className="registrations-summary">
              <p>
                Showing <strong>{filteredRegistrations.length}</strong> of <strong>{registrations.length}</strong> registrations
                {(searchTerm || filterCategory || filterEvent) && (
                  <span className="filter-indicator"> (filtered)</span>
                )}
              </p>
            </div>

            {/* Desktop Table Layout */}
            <table className="dashboard-table">
              <thead>
                <tr>
                  <th>Team Leader</th>
                  <th>Team Name</th>
                  <th>Event</th>
                  <th>Payment Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredRegistrations.length > 0 ? (
                  filteredRegistrations.map((reg) => (
                    <tr key={reg._id}>
                      <td>
                        {reg.isSpotRegistration
                          ? reg.displayTeamLeader?.name || "Unknown"
                          : reg.teamLeader?.name || "Unknown"}
                      </td>
                      <td>{reg.teamName || "N/A"}</td>
                      <td>{reg.event?.name || "Unknown Event"}</td>
                      <td>
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
                      </td>
                      <td>
                        <button
                          className="action-btn view-btn"
                          onClick={() => handleViewRegistration(reg)}
                          title="View Details"
                        >
                          <i className="fas fa-eye"></i> View
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="no-data">
                      <i className="fas fa-exclamation-circle"></i>
                      {registrations.length === 0
                        ? "No registrations found"
                        : (searchTerm || filterCategory || filterEvent)
                          ? "No registrations match your search criteria"
                          : "No registrations found"
                      }
                      {(searchTerm || filterCategory || filterEvent) && (
                        <div className="no-data-suggestion">
                          <button onClick={clearFilters} className="clear-filters-link">
                            Clear filters to see all registrations
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>

            {/* Mobile Cards Layout for Registrations */}
            <div className="mobile-cards-container">
              {filteredRegistrations.length > 0 ? (
                filteredRegistrations.map((reg) => (
                  <div key={reg._id} className="mobile-card registration-card">
                    <div className="mobile-card-header">
                      <div>
                        <h4 className="mobile-card-title">
                          {reg.isSpotRegistration
                            ? reg.displayTeamLeader?.name || "Unknown"
                            : reg.teamLeader?.name || "Unknown"}
                        </h4>
                        <p className="mobile-card-subtitle">{reg.teamName || "N/A"}</p>
                      </div>
                      <div className="mobile-card-actions">
                        <button
                          className="action-btn-mini view-btn"
                          onClick={() => handleViewRegistration(reg)}
                          title="View Details"
                        >
                          <i className="fas fa-eye"></i>
                        </button>
                      </div>
                    </div>
                    <div className="mobile-card-body">
                      <div className="mobile-card-row">
                        <span className="mobile-card-label">Event:</span>
                        <span className="mobile-card-value">{reg.event?.name || "Unknown Event"}</span>
                      </div>
                      <div className="mobile-card-row">
                        <span className="mobile-card-label">Payment Status:</span>
                        <span className={`mobile-card-value status-badge ${reg.paymentStatus}`}>
                          {reg.paymentStatus === "completed"
                            ? "Paid"
                            : reg.paymentStatus === "not_required"
                              ? "No Payment Required"
                              : reg.paymentStatus === "pending"
                                ? "Payment Pending"
                                : reg.paymentStatus === "failed"
                                  ? "Payment Failed"
                                  : reg.paymentStatus === "pay_on_event_day"
                                    ? "Pay on Event Day"
                                    : "Payment Required"}
                        </span>
                      </div>
                      {reg.event?.date && (
                        <div className="mobile-card-row">
                          <span className="mobile-card-label">Event Date:</span>
                          <span className="mobile-card-value">
                            {new Date(reg.event.date).toLocaleDateString()}
                          </span>
                        </div>
                      )}
                      {reg.event?.venue && (
                        <div className="mobile-card-row">
                          <span className="mobile-card-label">Venue:</span>
                          <span className="mobile-card-value">{reg.event.venue}</span>
                        </div>
                      )}
                      <div className="mobile-card-row">
                        <span className="mobile-card-label">Registration Date:</span>
                        <span className="mobile-card-value">
                          {new Date(reg.registeredAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="no-data-mobile">
                  <i className="fas fa-exclamation-circle"></i>
                  <p>
                    {registrations.length === 0
                      ? "No registrations found"
                      : (searchTerm || filterCategory || filterEvent)
                        ? "No registrations match your search criteria"
                        : "No registrations found"
                    }
                  </p>
                  {(searchTerm || filterCategory || filterEvent) && (
                    <button onClick={clearFilters} className="clear-filters-link">
                      Clear filters to see all registrations
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        )

      case "spot-registration":
        return (
          <div className="dashboard-form-container">
            <h3>Spot Registration</h3>



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

              {/* Team Name - Show for all team events (teams > 1) */}
              {spotRegistrationForm.teamSize > 1 && (
                <div className="form-group">
                  <label htmlFor="teamName">Team Name *</label>
                  <input
                    type="text"
                    id="teamName"
                    name="teamName"
                    value={spotRegistrationForm.teamName}
                    onChange={handleCommonFieldChange}
                    required
                    placeholder="Enter team name"
                  />
                  <p className="field-note">Choose a unique name for your team</p>
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

              {/* Payment Mode - Show if any participant requires payment */}
              {selectedEvent && isAnyPaymentRequired() && (
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
                    <option value="erp">ERP</option>
                  </select>

                  {/* Transaction ID field - Show only when ERP is selected */}
                  {spotRegistrationForm.paymentMode === "erp" && (
                    <div className="form-group transaction-id-group">
                      <label htmlFor="transactionId">Transaction Reference Number *</label>
                      <input
                        type="text"
                        id="transactionId"
                        name="transactionId"
                        value={spotRegistrationForm.transactionId}
                        onChange={handleCommonFieldChange}
                        required
                        placeholder="Enter transaction reference number"
                        className="transaction-id-input"
                      />
                      <p className="form-hint">Enter the transaction reference number from ERP payment</p>
                    </div>
                  )}

                  <div className="payment-info">
                    <p className="form-hint">Please select how the payment was collected</p>
                    <div className="payment-breakdown">
                      <h5>Payment Requirements:</h5>
                      {spotRegistrationForm.participants.map((participant, index) => (
                        <div key={index} className="participant-payment-info">
                          <span className="participant-name">
                            {participant.name || `Participant ${index + 1}`}
                            {index === 0 && " (Leader)"}:
                          </span>
                          <span className={`payment-status ${
                            isPaymentRequired(participant.usn, selectedEvent.category)
                              ? "payment-required"
                              : "no-payment"
                          }`}>
                            {isPaymentRequired(participant.usn, selectedEvent.category)
                              ? "Payment Required"
                              : "No Payment Required"}
                          </span>
                          {participant.usn && (
                            <span className="usn-info">({participant.usn})</span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

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

      {/* Registration Detail Modal */}
      {showRegistrationModal === true && selectedRegistration !== null && (
        <div className="modal-overlay" onClick={handleCloseRegistrationModal}>
          <div className="modal-content registration-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Registration Details</h3>
              <button className="modal-close-btn" onClick={handleCloseRegistrationModal}>
                <i className="fas fa-times"></i>
              </button>
            </div>

            <div className="modal-body">
              <div className="registration-info-grid">
                {/* Event Information */}
                <div className="info-section">
                  <h4><i className="fas fa-calendar-alt"></i> Event Information</h4>
                  <div className="info-row">
                    <span className="label">Event Name:</span>
                    <span className="value">{selectedRegistration.event?.name || 'Unknown'}</span>
                  </div>
                  <div className="info-row">
                    <span className="label">Event Date:</span>
                    <span className="value">{selectedRegistration.event?.date ? new Date(selectedRegistration.event.date).toLocaleDateString() : 'TBA'}</span>
                  </div>
                  <div className="info-row">
                    <span className="label">Venue:</span>
                    <span className="value">{selectedRegistration.event?.venue || 'TBA'}</span>
                  </div>
                  <div className="info-row">
                    <span className="label">Event Fee:</span>
                    <span className="value">₹{selectedRegistration.event?.fees || 0}</span>
                  </div>
                </div>

                {/* Team Information */}
                <div className="info-section">
                  <h4><i className="fas fa-users"></i> Team Information</h4>
                  <div className="info-row">
                    <span className="label">Team Name:</span>
                    <span className="value">{selectedRegistration.teamName || 'N/A'}</span>
                  </div>
                  <div className="info-row">
                    <span className="label">Team Size:</span>
                    <span className="value">{selectedRegistration.teamSize || 1} participant{selectedRegistration.teamSize > 1 ? 's' : ''}</span>
                  </div>
                  <div className="info-row">
                    <span className="label">College:</span>
                    <span className="value">{selectedRegistration.teamLeaderDetails?.collegeName || 'Unknown'}</span>
                  </div>
                  <div className="info-row">
                    <span className="label">Registration Date:</span>
                    <span className="value">{new Date(selectedRegistration.registeredAt).toLocaleDateString()}</span>
                  </div>
                  <div className="info-row">
                    <span className="label">Registered By:</span>
                    <span className="value">{selectedRegistration.isSpotRegistration ? 'Team Member' : 'Self Registration'}</span>
                  </div>
                </div>

                {/* Payment Information */}
                <div className="info-section">
                  <h4><i className="fas fa-credit-card"></i> Payment Information</h4>
                  <div className="info-row">
                    <span className="label">Payment Status:</span>
                    <span className={`value status-badge ${selectedRegistration.paymentStatus}`}>
                      {selectedRegistration.paymentStatus === "completed"
                        ? "Paid"
                        : selectedRegistration.paymentStatus === "not_required"
                          ? "No Payment Required"
                          : selectedRegistration.paymentStatus === "pending"
                            ? "Payment Pending"
                            : selectedRegistration.paymentStatus === "failed"
                              ? "Payment Failed"
                              : selectedRegistration.paymentStatus === "pay_on_event_day"
                                ? "Pay on Event Day"
                                : "Payment Required"}
                    </span>
                  </div>
                  {selectedRegistration.transactionId && (
                    <div className="info-row">
                      <span className="label">Transaction ID:</span>
                      <span className="value">{selectedRegistration.transactionId}</span>
                    </div>
                  )}
                  {selectedRegistration.notes && (
                    <div className="info-row">
                      <span className="label">Notes:</span>
                      <span className="value">{selectedRegistration.notes}</span>
                    </div>
                  )}
                </div>

                {/* Participants Information */}
                <div className="info-section participants-section">
                  <h4><i className="fas fa-user-friends"></i> Participants</h4>

                  {/* Team Leader */}
                  <div className="participant-card">
                    <h5>Team Leader</h5>
                    <div className="participant-details">
                      <div className="info-row">
                        <span className="label">Name:</span>
                        <span className="value">
                          {selectedRegistration.isSpotRegistration
                            ? selectedRegistration.displayTeamLeader?.name || "Unknown"
                            : selectedRegistration.teamLeader?.name || "Unknown"}
                        </span>
                      </div>
                      <div className="info-row">
                        <span className="label">USN:</span>
                        <span className="value">{selectedRegistration.teamLeaderDetails?.usn || "Unknown USN"}</span>
                      </div>
                      <div className="info-row">
                        <span className="label">Payment Required:</span>
                        <span className={`value ${
                          selectedRegistration.teamLeaderDetails?.usn?.toLowerCase().startsWith("1si")
                            ? "no-payment"
                            : "payment-required"
                        }`}>
                          {selectedRegistration.teamLeaderDetails?.usn?.toLowerCase().startsWith("1si") ? "No" : "Yes"}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Team Members */}
                  {selectedRegistration.teamMembers && selectedRegistration.teamMembers.length > 0 && (
                    selectedRegistration.teamMembers.map((member, index) => (
                      <div key={index} className="participant-card">
                        <h5>Participant {index + 2}</h5>
                        <div className="participant-details">
                          <div className="info-row">
                            <span className="label">Name:</span>
                            <span className="value">{member.name || "Unknown"}</span>
                          </div>
                          <div className="info-row">
                            <span className="label">Email:</span>
                            <span className="value">{member.email || "Unknown"}</span>
                          </div>
                          <div className="info-row">
                            <span className="label">Mobile:</span>
                            <span className="value">{member.mobile || "Unknown"}</span>
                          </div>
                          <div className="info-row">
                            <span className="label">USN:</span>
                            <span className="value">{member.usn || "Unknown USN"}</span>
                          </div>
                          <div className="info-row">
                            <span className="label">Payment Required:</span>
                            <span className={`value ${
                              member.usn?.toLowerCase().startsWith("1si") ? "no-payment" : "payment-required"
                            }`}>
                              {member.usn?.toLowerCase().startsWith("1si") ? "No" : "Yes"}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default TeamDashboard
