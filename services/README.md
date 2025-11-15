# API Service Examples

This directory contains examples of how to call APIs in your React Native app.

## File: `api.ts`

This file demonstrates various patterns for making HTTP requests using the native `fetch()` API.

## Available API Functions

### 1. **GET - Fetch All Posts**
```typescript
const response = await getPostsAPI();
if (response.data) {
  console.log('Posts:', response.data);
} else {
  console.error('Error:', response.error);
}
```

### 2. **GET - Fetch Single Post**
```typescript
const response = await getPostAPI(1);
console.log('Post:', response.data);
```

### 3. **POST - Create New Post**
```typescript
const response = await createPostAPI({
  title: 'My Post',
  body: 'Post content',
  userId: 1,
});
console.log('Created:', response.data);
```

### 4. **PUT - Update Post**
```typescript
const response = await updatePostAPI(1, {
  title: 'Updated Title',
  body: 'Updated content',
});
console.log('Updated:', response.data);
```

### 5. **DELETE - Delete Post**
```typescript
const response = await deletePostAPI(1);
console.log('Deleted:', response.status);
```

### 6. **GET with Authentication**
```typescript
const response = await getUsersAPI('your-auth-token');
console.log('Users:', response.data);
```

## Integration Example

### Using in AuthContext
```typescript
import { loginAPI } from '@/services/api';

const login = async (username: string, password: string) => {
  const response = await loginAPI({ username, password });
  
  if (response.data) {
    // Save token and user data
    await AsyncStorage.setItem('token', response.data.token);
    setUser(response.data.user);
    return true;
  }
  
  return false;
};
```

### Using in a Component
```typescript
import { getPostsAPI } from '@/services/api';

function MyComponent() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    setLoading(true);
    const response = await getPostsAPI();
    if (response.data) {
      setPosts(response.data);
    }
    setLoading(false);
  };

  return (
    <View>
      {loading ? <ActivityIndicator /> : (
        posts.map(post => (
          <Text key={post.id}>{post.title}</Text>
        ))
      )}
    </View>
  );
}
```

## Configuration

### Change API Base URL
Edit `API_BASE_URL` in `api.ts`:
```typescript
const API_BASE_URL = 'https://your-api.com/api/v1';
```

### Add Authentication to All Requests
Modify the `apiCall` function:
```typescript
async function apiCall<T>(endpoint: string, options: RequestInit = {}) {
  const token = await AsyncStorage.getItem('token');
  
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
    ...options,
  });
  
  // ... rest of the code
}
```

## Error Handling

Always check for errors:
```typescript
const response = await getPostsAPI();

if (response.error) {
  Alert.alert('Error', response.error);
  return;
}

// Use response.data safely
console.log(response.data);
```

## Best Practices

1. **Always handle loading states** - Show loading indicators while API calls are in progress
2. **Handle errors gracefully** - Display user-friendly error messages
3. **Validate responses** - Check if `response.data` exists before using it
4. **Use TypeScript** - Define interfaces for your API responses
5. **Cache when appropriate** - Use AsyncStorage or a caching library for offline support
6. **Add timeout** - Consider adding timeout to API calls
7. **Retry logic** - Implement retry for failed requests when appropriate

## Testing

You can test the API calls in the app by:
1. Opening the "API Demo" tab
2. Tapping the different buttons to see each API method in action
3. Check the console for network requests and responses


