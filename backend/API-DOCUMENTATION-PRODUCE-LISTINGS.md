# Produce Listings API Documentation

## Base URL
```
http://localhost:5000/api/produce-listings
```

## Endpoints

### 1. Get All Produce Listings
**GET** `/api/produce-listings`

Get all produce listings with optional filtering.

**Query Parameters:**
- `userId` (optional): Filter by user ID
- `status` (optional): Filter by status ('active' or 'sold')

**Example Request:**
```javascript
fetch('http://localhost:5000/api/produce-listings?userId=farmer1&status=active')
```

**Response:**
```json
{
  "success": true,
  "listings": [
    {
      "id": 1,
      "userId": "farmer1",
      "crop": "Mustard",
      "quantity": 25,
      "pricePerQuintal": 6200,
      "quality": "Premium",
      "availableFrom": "2025-01-15",
      "deliveryPreference": "Warehouse delivery",
      "targetBuyers": ["FPO", "Processor"],
      "status": "active",
      "listedDate": "2024-12-05",
      "notes": "Certified organic mustard seeds"
    }
  ]
}
```

---

### 2. Get Single Produce Listing
**GET** `/api/produce-listings/:id`

Get a specific produce listing by ID.

**Example Request:**
```javascript
fetch('http://localhost:5000/api/produce-listings/1')
```

**Response:**
```json
{
  "success": true,
  "listing": {
    "id": 1,
    "userId": "farmer1",
    "crop": "Mustard",
    ...
  }
}
```

---

### 3. Create Produce Listing
**POST** `/api/produce-listings`

Create a new produce listing.

**Request Body:**
```json
{
  "userId": "farmer1",
  "crop": "Soybean",
  "quantity": 30,
  "pricePerQuintal": 5800,
  "quality": "Grade A",
  "availableFrom": "2025-01-10",
  "deliveryPreference": "Farm pickup",
  "targetBuyers": ["FPO", "Processor"],
  "notes": "Fresh harvest"
}
```

**Example Request:**
```javascript
fetch('http://localhost:5000/api/produce-listings', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(listingData)
})
```

**Response:**
```json
{
  "success": true,
  "listing": {
    "id": 4,
    "userId": "farmer1",
    "crop": "Soybean",
    "status": "active",
    "listedDate": "2024-12-06",
    ...
  }
}
```

---

### 4. Update Produce Listing
**PUT** `/api/produce-listings/:id`

Update an existing produce listing.

**Request Body:**
```json
{
  "quantity": 35,
  "pricePerQuintal": 5900,
  "notes": "Updated price"
}
```

**Example Request:**
```javascript
fetch('http://localhost:5000/api/produce-listings/1', {
  method: 'PUT',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(updates)
})
```

**Response:**
```json
{
  "success": true,
  "listing": {
    "id": 1,
    "quantity": 35,
    "pricePerQuintal": 5900,
    ...
  }
}
```

---

### 5. Update Listing Status
**PATCH** `/api/produce-listings/:id/status`

Update the status of a listing (e.g., mark as sold).

**Request Body:**
```json
{
  "status": "sold"
}
```

**Example Request:**
```javascript
fetch('http://localhost:5000/api/produce-listings/1/status', {
  method: 'PATCH',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ status: 'sold' })
})
```

**Response:**
```json
{
  "success": true,
  "listing": {
    "id": 1,
    "status": "sold",
    ...
  }
}
```

---

### 6. Delete Produce Listing
**DELETE** `/api/produce-listings/:id`

Delete a produce listing.

**Example Request:**
```javascript
fetch('http://localhost:5000/api/produce-listings/1', {
  method: 'DELETE'
})
```

**Response:**
```json
{
  "success": true,
  "listing": {
    "id": 1,
    ...
  }
}
```

---

## Frontend API Utility

Use the `ProduceListingsAPI` utility for easy integration:

```javascript
// Get all listings
const listings = await ProduceListingsAPI.getAllListings('farmer1', 'active');

// Get single listing
const listing = await ProduceListingsAPI.getListingById(1);

// Create listing
const result = await ProduceListingsAPI.createListing({
  crop: 'Mustard',
  quantity: 25,
  pricePerQuintal: 6200,
  quality: 'Premium',
  availableFrom: '2025-01-15',
  deliveryPreference: 'Warehouse delivery',
  targetBuyers: ['FPO', 'Processor'],
  notes: 'Organic certified'
});

// Update listing
const updated = await ProduceListingsAPI.updateListing(1, {
  quantity: 30,
  pricePerQuintal: 6300
});

// Mark as sold
const sold = await ProduceListingsAPI.updateListingStatus(1, 'sold');

// Delete listing
const deleted = await ProduceListingsAPI.deleteListing(1);
```

---

## Data Storage

Data is stored in `backend/data/produceListings.json` as a JSON file.

**File Structure:**
```json
{
  "produceListings": [
    {
      "id": 1,
      "userId": "farmer1",
      "crop": "Mustard",
      ...
    }
  ]
}
```

---

## Error Handling

All endpoints return a consistent error format:

```json
{
  "success": false,
  "error": "Error message description"
}
```

**Common HTTP Status Codes:**
- `200` - Success
- `201` - Created
- `404` - Not Found
- `500` - Server Error

---

## Running the Server

1. Navigate to backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies (if not already installed):
   ```bash
   npm install
   ```

3. Start the server:
   ```bash
   node server.js
   ```

4. Server will run on `http://localhost:5000`

---

## Testing with Postman or cURL

**Create a listing:**
```bash
curl -X POST http://localhost:5000/api/produce-listings \
  -H "Content-Type: application/json" \
  -d '{
    "crop": "Soybean",
    "quantity": 30,
    "pricePerQuintal": 5800,
    "quality": "Grade A",
    "availableFrom": "2025-01-10",
    "deliveryPreference": "Farm pickup",
    "targetBuyers": ["FPO", "Processor"],
    "notes": "Fresh harvest"
  }'
```

**Get all listings:**
```bash
curl http://localhost:5000/api/produce-listings
```

**Mark as sold:**
```bash
curl -X PATCH http://localhost:5000/api/produce-listings/1/status \
  -H "Content-Type: application/json" \
  -d '{"status": "sold"}'
```
