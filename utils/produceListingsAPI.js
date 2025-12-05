// utils/produceListingsAPI.js
// API utility for produce listings with real-time backend integration

const API_BASE_URL = 'http://localhost:5000/api/produce-listings';

// Get all produce listings (with optional filters)
async function getAllListings(userId = null, status = null) {
    try {
        const params = new URLSearchParams();
        if (userId) params.append('userId', userId);
        if (status) params.append('status', status);

        const url = params.toString() ? `${API_BASE_URL}?${params}` : API_BASE_URL;
        const response = await fetch(url);
        const data = await response.json();

        if (data.success) {
            return data.listings;
        } else {
            console.error('Failed to fetch listings:', data.error);
            return [];
        }
    } catch (error) {
        console.error('Error fetching produce listings:', error);
        return [];
    }
}

// Get a single produce listing by ID
async function getListingById(id) {
    try {
        const response = await fetch(`${API_BASE_URL}/${id}`);
        const data = await response.json();

        if (data.success) {
            return data.listing;
        } else {
            console.error('Failed to fetch listing:', data.error);
            return null;
        }
    } catch (error) {
        console.error('Error fetching produce listing:', error);
        return null;
    }
}

// Create a new produce listing
async function createListing(listingData) {
    try {
        const response = await fetch(API_BASE_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(listingData)
        });

        const data = await response.json();

        if (data.success) {
            return { success: true, listing: data.listing };
        } else {
            return { success: false, error: data.error };
        }
    } catch (error) {
        console.error('Error creating produce listing:', error);
        return { success: false, error: error.message };
    }
}

// Update a produce listing
async function updateListing(id, updates) {
    try {
        const response = await fetch(`${API_BASE_URL}/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(updates)
        });

        const data = await response.json();

        if (data.success) {
            return { success: true, listing: data.listing };
        } else {
            return { success: false, error: data.error };
        }
    } catch (error) {
        console.error('Error updating produce listing:', error);
        return { success: false, error: error.message };
    }
}

// Update listing status (mark as sold)
async function updateListingStatus(id, status = 'sold') {
    try {
        const response = await fetch(`${API_BASE_URL}/${id}/status`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ status })
        });

        const data = await response.json();

        if (data.success) {
            return { success: true, listing: data.listing };
        } else {
            return { success: false, error: data.error };
        }
    } catch (error) {
        console.error('Error updating listing status:', error);
        return { success: false, error: error.message };
    }
}

// Delete a produce listing
async function deleteListing(id) {
    try {
        const response = await fetch(`${API_BASE_URL}/${id}`, {
            method: 'DELETE'
        });

        const data = await response.json();

        if (data.success) {
            return { success: true, listing: data.listing };
        } else {
            return { success: false, error: data.error };
        }
    } catch (error) {
        console.error('Error deleting produce listing:', error);
        return { success: false, error: error.message };
    }
}

// Export API functions
if (typeof window !== 'undefined') {
    window.ProduceListingsAPI = {
        getAllListings,
        getListingById,
        createListing,
        updateListing,
        updateListingStatus,
        deleteListing
    };
}
