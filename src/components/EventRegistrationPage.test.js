// Basic test for EventRegistrationPage component
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import EventRegistrationPage from './EventRegistrationPage';

// Mock the useParams hook
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useParams: () => ({
    eventId: 'test-event-id'
  }),
  useNavigate: () => jest.fn()
}));

// Mock the isLoggedIn function
jest.mock('../services/authService', () => ({
  isLoggedIn: () => true
}));

// Mock fetch API
global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve({
      _id: 'test-event-id',
      name: 'Test Event',
      description: 'This is a test event',
      date: '2025-05-16T10:00:00.000Z',
      venue: 'Test Venue',
      teamSize: 3,
      fees: 100,
      rules: ['Rule 1', 'Rule 2'],
      prizes: ['First Prize: ₹10,000', 'Second Prize: ₹5,000'],
      registrationOpen: true
    })
  })
);

describe('EventRegistrationPage', () => {
  test('renders loading state initially', () => {
    render(
      <BrowserRouter>
        <EventRegistrationPage />
      </BrowserRouter>
    );
    
    expect(screen.getByText(/Loading event details/i)).toBeInTheDocument();
  });
  
  test('renders event details after loading', async () => {
    render(
      <BrowserRouter>
        <EventRegistrationPage />
      </BrowserRouter>
    );
    
    // Wait for the event details to load
    const eventName = await screen.findByText('Test Event');
    expect(eventName).toBeInTheDocument();
    
    // Check if other event details are rendered
    expect(screen.getByText(/This is a test event/i)).toBeInTheDocument();
    expect(screen.getByText(/Test Venue/i)).toBeInTheDocument();
    expect(screen.getByText(/Team Size: 3/i)).toBeInTheDocument();
    expect(screen.getByText(/Registration Fee: ₹100/i)).toBeInTheDocument();
    
    // Check if rules and prizes are rendered
    expect(screen.getByText('Rule 1')).toBeInTheDocument();
    expect(screen.getByText('Rule 2')).toBeInTheDocument();
    expect(screen.getByText('First Prize: ₹10,000')).toBeInTheDocument();
    expect(screen.getByText('Second Prize: ₹5,000')).toBeInTheDocument();
    
    // Check if register button is rendered
    expect(screen.getByText('Register Now')).toBeInTheDocument();
  });
});
