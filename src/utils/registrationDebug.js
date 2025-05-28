import { corsProtectedFetch } from './corsHelper';
import { APP_CONFIG } from '../config';

/**
 * Debug function to test registration API
 */
export const debugRegistration = async () => {
    console.log('🔍 Starting Registration Debug...');
    
    // Check if user is logged in
    const token = localStorage.getItem(APP_CONFIG.tokenName);
    if (!token) {
        console.error('❌ No authentication token found');
        return { success: false, error: 'Not logged in' };
    }
    
    console.log('✅ Token found:', token.substring(0, 20) + '...');
    
    try {
        // Test 1: Check current user
        console.log('\n🧪 Test 1: Checking current user...');
        const userResponse = await corsProtectedFetch('auth/me', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        
        if (userResponse.ok) {
            const userData = await userResponse.json();
            console.log('✅ User data:', userData);
        } else {
            console.error('❌ Failed to get user data:', userResponse.status);
            return { success: false, error: 'Invalid token' };
        }
        
        // Test 2: Get events
        console.log('\n🧪 Test 2: Getting events...');
        const eventsResponse = await corsProtectedFetch('event', {
            method: 'GET'
        });
        
        if (eventsResponse.ok) {
            const events = await eventsResponse.json();
            console.log('✅ Found events:', events.length);
            
            if (events.length > 0) {
                const testEvent = events[0];
                console.log('📝 Test event:', testEvent.name, 'ID:', testEvent._id);
                
                // Test 3: Check registration status
                console.log('\n🧪 Test 3: Checking registration status...');
                const checkResponse = await corsProtectedFetch(`registration/check/${testEvent._id}`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                
                if (checkResponse.ok) {
                    const checkData = await checkResponse.json();
                    console.log('✅ Registration check:', checkData);
                } else {
                    console.error('❌ Registration check failed:', checkResponse.status);
                }
                
                // Test 4: Get my registrations
                console.log('\n🧪 Test 4: Getting my registrations...');
                const myRegsResponse = await corsProtectedFetch('registration/me', {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                
                if (myRegsResponse.ok) {
                    const myRegs = await myRegsResponse.json();
                    console.log('✅ My registrations:', myRegs.length);
                    myRegs.forEach((reg, index) => {
                        console.log(`${index + 1}. Event: ${reg.event?.name || 'Unknown'}`);
                        console.log(`   Team Size: ${reg.teamSize}`);
                        console.log(`   Created: ${reg.createdAt}`);
                    });
                } else {
                    console.error('❌ Failed to get my registrations:', myRegsResponse.status);
                }
            }
        } else {
            console.error('❌ Failed to get events:', eventsResponse.status);
        }
        
        return { success: true };
        
    } catch (error) {
        console.error('❌ Debug error:', error);
        return { success: false, error: error.message };
    }
};

/**
 * Test registration with sample data
 */
export const testRegistration = async (eventId) => {
    console.log('🧪 Testing registration for event:', eventId);
    
    const token = localStorage.getItem(APP_CONFIG.tokenName);
    if (!token) {
        console.error('❌ No authentication token found');
        return { success: false, error: 'Not logged in' };
    }
    
    const testData = {
        teamName: 'Debug Test Team',
        teamSize: 1,
        teamLeaderDetails: {
            collegeName: 'Test College',
            usn: 'TEST123'
        },
        teamMembers: [],
        transactionId: 'TEST1234567890'
    };
    
    try {
        console.log('📤 Sending test registration data:', testData);
        
        const response = await corsProtectedFetch(`registration/${eventId}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(testData)
        });
        
        console.log('📥 Response status:', response.status);
        
        if (response.ok) {
            const data = await response.json();
            console.log('✅ Registration successful:', data);
            return { success: true, data };
        } else {
            const errorData = await response.json();
            console.error('❌ Registration failed:', errorData);
            return { success: false, error: errorData };
        }
        
    } catch (error) {
        console.error('❌ Test registration error:', error);
        return { success: false, error: error.message };
    }
};

// Add to window for easy access in browser console
if (typeof window !== 'undefined') {
    window.debugRegistration = debugRegistration;
    window.testRegistration = testRegistration;
}
