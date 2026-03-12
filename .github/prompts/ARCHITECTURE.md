# PhotoShare PWA Architecture

A scalable, modular architecture for a photo-sharing social media Progressive Web App built with Vue 3, Vite, TypeScript, Pinia, and TailwindCSS.

## Project Structure

```
src/
├── api/                    # API service layer
│   ├── index.ts           # Base API client
│   ├── photos.ts          # Photo API endpoints
│   ├── comments.ts        # Comment API endpoints
│   ├── users.ts           # User API endpoints
│   └── likes.ts           # Like API endpoints
├── components/            # Reusable UI components
│   ├── Navigation.vue      # Main navigation header
│   ├── PhotoCard.vue       # Photo display card
│   ├── PhotoUploadModal.vue # Upload dialog
│   ├── CommentSection.vue  # Comments interface
│   ├── LikeButton.vue      # Like button
│   └── UserProfileHeader.vue # Profile header
├── composables/           # Reusable business logic
│   ├── usePhotoFeed.ts    # Feed management
│   ├── usePhotoUpload.ts  # Upload logic
│   ├── useLike.ts         # Like functionality
│   ├── useComments.ts     # Comment management
│   ├── useExplore.ts      # Search & discovery
│   └── useUserProfile.ts  # Profile management
├── pages/                 # Route components
│   ├── HomeView.vue       # Home feed page
│   ├── ExplorePage.vue    # Explore/search page
│   └── ProfilePage.vue    # User profile page
├── stores/                # Pinia state management
│   ├── photo.ts           # Photo store (feed, likes)
│   ├── comment.ts         # Comment store
│   ├── user.ts            # User & profile store
│   └── explore.ts         # Search & explore store
├── router/
│   └── index.ts           # Vue Router configuration
├── assets/
│   └── main.css           # TailwindCSS styles
├── App.vue               # Root component
└── main.ts               # Application entry point

db.json                   # JSON Server database
```

## Architecture Patterns

### 1. **State Management (Pinia)**

**Photo Store** (`src/stores/photo.ts`)
- Manages feed photos and user photos
- Handles like/unlike state
- Tracks upload and error states

**Comment Store** (`src/stores/comment.ts`)
- Nested comments by photoId
- Manages comment lifecycle
- Tracks posting/loading states

**User Store** (`src/stores/user.ts`)
- Current user authentication
- User profiles cache
- Follow/following relationships

**Explore Store** (`src/stores/explore.ts`)
- Trending photos
- Search results with pagination
- Search filters and sorting

### 2. **API Services Layer**

Base API client (`src/api/index.ts`) provides:
- Standard HTTP methods (GET, POST, PATCH, DELETE)
- Centralized error handling
- JSON serialization

Specialized API services:
- `photoApi` - Photo CRUD and queries
- `commentApi` - Comment management
- `userApi` - User profiles and follow system
- `likeApi` - Like/unlike functionality

### 3. **Composables (Business Logic)**

Each composable encapsulates a feature:

**usePhotoFeed**
```typescript
- loadPhotos()
- loadMorePhotos()
- refreshPhotos()
```

**usePhotoUpload**
```typescript
- uploadPhoto(title, description, imageUrl, userId, username, avatar)
```

**useLike**
```typescript
- toggleLike(photoId, userId)
```

**useComments**
```typescript
- loadComments(photoId)
- addComment(text, userId, username, avatar)
- deleteComment(commentId)
```

**useExplore**
```typescript
- loadTrending()
- search(query, sortBy, page)
- loadMoreSearch()
```

**useUserProfile**
```typescript
- loadProfile(userId)
- toggleFollow()
```

### 4. **Components (UI Layer)**

**Navigation** - Sticky header with routing
**PhotoCard** - Display photo with metadata
**PhotoUploadModal** - Modal form for uploads
**CommentSection** - Comment list and form
**LikeButton** - Interactive like button
**UserProfileHeader** - User profile info and stats

### 5. **Pages (Routes)**

- **HomeView** - Feed with infinite scroll
- **ExplorePage** - Search and trending discovery
- **ProfilePage** - User profile with photo gallery

## Data Models

### Photo
```typescript
{
  id: number
  title: string
  description: string
  imageUrl: string
  userId: number
  username: string
  userAvatar: string
  likes: number
  liked: boolean
  comments: number
  createdAt: ISO string
  updatedAt: ISO string
}
```

### Comment
```typescript
{
  id: number
  photoId: number
  userId: number
  username: string
  userAvatar: string
  text: string
  likes: number
  createdAt: ISO string
  updatedAt: ISO string
}
```

### UserProfile
```typescript
{
  id: number
  username: string
  email: string
  avatar: string
  bio: string
  followersCount: number
  followingCount: number
  photosCount: number
  followed: boolean
  createdAt: ISO string
}
```

## Key Features

### 1. Photo Feed
- Infinite scroll pagination
- Like/unlike with count
- Comments section (expandable)
- User information and metadata

### 2. Upload System
- Modal interface
- Image URL preview
- Title and description
- Real-time feedback

### 3. Like System
- Toggle like with animation
- Real-time count updates
- Visual feedback

### 4. Comments
- Nested by photo
- Load on demand
- Add/delete functionality
- User avatars and names

### 5. Explore & Search
- Trending photos
- Search with filters
- Sort by: recent, popular, trending
- Infinite scroll results

### 6. User Profiles
- Profile header with stats
- User's photo gallery
- Follow/unfollow
- User information and bio

## Database Schema (JSON Server)

### Collections
- `users` - User profiles and accounts
- `photos` - Photo metadata
- `comments` - Photo comments
- `likes` - Photo likes

Run both services:
```bash
npm run dev:all
```

This starts:
- Vite dev server (port 5173)
- JSON Server (port 3001)

## Best Practices

### 1. Composition API with `<script setup>`
```vue
<script setup lang="ts">
// TypeScript is default
const count = ref(0)
</script>
```

### 2. Composable Usage
```typescript
const { photos, loading, loadPhotos } = usePhotoFeed()
```

### 3. Error Handling
- Stores track error state
- Composables handle API errors
- Try-catch in async functions

### 4. Loading States
- `loading` computed properties
- Disabled buttons during requests
- Spinner feedback

### 5. Responsive Design
- TailwindCSS responsive classes
- Mobile-first approach
- Sticky headers and footers

## Type Safety

Full TypeScript support with interfaces:
- `Photo`, `PhotoUploadPayload`
- `Comment`, `CommentCreatePayload`
- `UserProfile`, `CurrentUser`
- `Like`, `SearchFilters`

## Performance Optimizations

1. **Lazy Image Loading** - Image preview in modal
2. **Route Code Splitting** - Dynamic imports for pages
3. **Pagination** - Load more button for feeds
4. **Store Caching** - Comments cached by photoId
5. **Memoization** - Computed properties in stores

## Scalability Features

1. **Modular API Services** - Easy to add new endpoints
2. **Composable Reusability** - Share logic across components
3. **Store Organization** - Separate concerns by feature
4. **Component Reusability** - PhotoCard, UserProfileHeader
5. **Type Safety** - Prevent runtime errors

## Future Enhancements

- Authentication system
- Real-time updates with WebSocket
- Image optimization and CDN
- Advanced search filters
- Notifications system
- Direct messaging
- Hashtags and trending
- Share functionality

## Running the Project

```bash
# Install dependencies
npm install

# Development (both services)
npm run dev:all

# Dev server only
npm run dev

# API server only
npm run dev:api

# Build
npm build

# Type checking
npm run type-check

# Linting
npm run lint

# Format code
npm run format
```
