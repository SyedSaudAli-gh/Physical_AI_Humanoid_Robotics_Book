# Data Model: Docusaurus UI Enhancements

## User Profile Entity

**Description**: Represents registered users with authentication and preference data

**Attributes**:
- `id` (string): Unique identifier for the user
- `email` (string): User's email address (required, unique)
- `name` (string): User's full name (required)
- `software_background` (string): User's software background (required, from registration)
- `hardware_background` (string): User's hardware background (required, from registration)
- `created_at` (datetime): Timestamp when user account was created
- `updated_at` (datetime): Timestamp when user account was last updated
- `language_preference` (string): User's preferred language code (default: 'en')

**Validation Rules**:
- Email must be a valid email format
- Name must be 2-100 characters
- Software/hardware background must be provided during registration
- Language preference must be one of supported languages ('en', 'ur')

**Relationships**:
- One-to-many with User Preferences (if implemented in future)

## Language Setting Entity

**Description**: Represents the current language selection for a user or session

**Attributes**:
- `user_id` (string, optional): Reference to User Profile (null for anonymous users)
- `language_code` (string): Two-letter language code (e.g., 'en', 'ur')
- `updated_at` (datetime): Timestamp when language preference was last updated

**Validation Rules**:
- Language code must be one of supported languages ('en', 'ur')
- For authenticated users, user_id must reference a valid User Profile

**Relationships**:
- Belongs to User Profile (optional, for anonymous sessions)

## Authentication Session Entity

**Description**: Represents the user's authenticated state (client-side)

**Attributes**:
- `user_id` (string): Reference to User Profile
- `token` (string): JWT token for session validation
- `expires_at` (datetime): Expiration timestamp for the token
- `created_at` (datetime): Timestamp when session was created

**Validation Rules**:
- Token must be a valid JWT format
- Session must not be expired when accessed
- User_id must reference a valid User Profile

**Relationships**:
- Belongs to User Profile

## State Transitions

### User Profile
1. **Unregistered** → **Registered**: User completes signup form with background questions
2. **Registered** → **Active**: User verifies account (if verification required)
3. **Active** → **Inactive**: User account deactivated (future feature)

### Authentication Session
1. **No Session** → **Authenticated**: User successfully logs in
2. **Authenticated** → **No Session**: User logs out or session expires

## Data Flow

### Authentication Flow
1. User visits site → Anonymous session created
2. User clicks Login/Signup → Authentication UI displayed
3. User registers with background info → User Profile created
4. User logs in → Authentication Session created with JWT
5. User navigates site → Session validated, user state maintained
6. User logs out → Session destroyed

### Language Selection Flow
1. User visits site → Default language (English) selected
2. User selects Urdu from language switcher → Language Setting updated
3. Content reloaded in selected language → User sees translated content
4. User navigates pages → Language preference maintained
5. User selects English → Language Setting updated, content switches back