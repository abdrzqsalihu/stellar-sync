// utils/firestore-serializer.js

/**
 * Serializes Firestore data to be safely passed in SSR
 * Converts Timestamps to ISO strings and handles other Firestore types
 */
export function serializeFirestoreData(data) {
  if (data === null || data === undefined) {
    return data;
  }

  if (Array.isArray(data)) {
    return data.map(serializeFirestoreData);
  }

  if (typeof data === 'object') {
    // Handle Firestore Timestamp - check for both _seconds/_nanoseconds and constructor
    if (data._seconds !== undefined && data._nanoseconds !== undefined) {
      return new Date(data._seconds * 1000 + data._nanoseconds / 1000000).toISOString();
    }

    // Handle Firestore Timestamp class instances
    if (data.constructor && data.constructor.name === 'Timestamp') {
      return data.toDate().toISOString();
    }

    // Handle Date objects
    if (data instanceof Date) {
      return data.toISOString();
    }

    // Handle plain objects - recursively serialize all properties
    const serialized = {};
    for (const [key, value] of Object.entries(data)) {
      serialized[key] = serializeFirestoreData(value);
    }
    return serialized;
  }

  return data;
}

/**
 * Serializes user data specifically for SSR - handles ALL possible Firestore types
 */
export function serializeUserData(userData) {
  if (!userData) return null;

  // Use the robust serializer for the entire object
  return serializeFirestoreData(userData);
}

/**
 * Get storage limit based on plan
 */
export function getStorageLimit(plan) {
  switch (plan?.toLowerCase()) {
    case 'pro':
      return 4 * 1024 * 1024 * 1024; // 4GB in bytes
    case 'free':
    default:
      return 1 * 1024 * 1024 * 1024; // 1GB in bytes
  }
}