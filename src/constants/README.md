# Configuration Constants

This file centralizes all application configuration values to eliminate code duplication and improve maintainability.

## What was refactored:

### Before:
- `allowedDomains` was duplicated in 3+ files
- Hardcoded email domains scattered throughout the codebase
- Inconsistent naming conventions
- Manual email validation logic repeated

### After:
- Single source of truth in `config.js`
- Centralized utility functions
- Consistent naming and behavior
- Easy to maintain and extend

## Usage Examples:

### Email Validation
```javascript
import { authUtils } from '../constants/config';

// Check if email is allowed
const isValid = authUtils.isEmailAllowed('student@lamduan.mfu.ac.th'); // true

// Get user type
const userType = authUtils.getUserType('staff@mfu.ac.th'); // 'staff'
```

### Constants
```javascript
import { ALLOWED_DOMAINS, USER_TYPES, MESSAGES } from '../constants/config';

// Use allowed domains
console.log(ALLOWED_DOMAINS); // ["@lamduan.mfu.ac.th", "@mfu.ac.th"]

// Use user types
if (userType === USER_TYPES.STUDENT) {
  // Handle student logic
}

// Use standardized messages
alert(MESSAGES.ACCESS_DENIED);
```

## Files Refactored:

1. ✅ **App.js** - Main authentication logic
2. ✅ **ProtectedRoute.js** - Route protection
3. ✅ **Login.jsx** - Login component
4. ✅ **baseAPI.js** - API utilities
5. ✅ **Navbar.jsx** - Navigation logic
6. ✅ **UnifiedDashboard.jsx** - Dashboard messages

## Benefits:

- **Maintainability**: Change domains in one place
- **Consistency**: Same validation logic everywhere
- **Scalability**: Easy to add new domains or user types
- **Type Safety**: Better IntelliSense and error detection
- **Testing**: Easier to mock and test
