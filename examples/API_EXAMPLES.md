# Complete API Call Examples

## 📋 Table of Contents
- [Basic GET Request](#basic-get-request)
- [POST Request with Body](#post-request-with-body)
- [PUT Request to Update](#put-request-to-update)
- [DELETE Request](#delete-request)
- [Request with Authentication](#request-with-authentication)
- [Error Handling](#error-handling)
- [Loading States](#loading-states)
- [Real-World Integration Example](#real-world-integration-example)

---

## Basic GET Request

Fetching data from an API endpoint:

```typescript
import { getPostsAPI } from '@/services/api';

async function fetchPosts() {
  const response = await getPostsAPI();
  
  if (response.data) {
    console.log('Success! Posts:', response.data);
    // Handle the data
  } else {
    console.error('Error:', response.error);
    // Handle the error
  }
}
```

**Usage in React Component:**
```typescript
import React, { useState, useEffect } from 'react';
import { getPostsAPI } from '@/services/api';

export default function PostsScreen() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const response = await getPostsAPI();
      if (response.data) {
        setPosts(response.data);
      }
    } catch (error) {
      console.error('Failed to fetch posts:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <ActivityIndicator />;
  
  return (
    <FlatList
      data={posts}
      keyExtractor={(item) => item.id.toString()}
      renderItem={({ item }) => <Text>{item.title}</Text>}
    />
  );
}
```

---

## POST Request with Body

Creating new data:

```typescript
import { createPostAPI } from '@/services/api';

async function createPost() {
  const newPost = {
    title: 'My New Post',
    body: 'This is the content of my post',
    userId: 1,
  };

  const response = await createPostAPI(newPost);
  
  if (response.data) {
    console.log('Post created:', response.data);
  } else {
    console.error('Failed to create:', response.error);
  }
}
```

**Usage in Component:**
```typescript
import { createPostAPI } from '@/services/api';

function NewPostForm() {
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    setSubmitting(true);
    const response = await createPostAPI({
      title,
      body,
      userId: 1,
    });
    
    if (response.data) {
      Alert.alert('Success', 'Post created successfully!');
      // Clear form or navigate
    } else {
      Alert.alert('Error', response.error || 'Failed to create post');
    }
    setSubmitting(false);
  };

  return (
    <View>
      <TextInput value={title} onChangeText={setTitle} />
      <TextInput value={body} onChangeText={setBody} />
      <Button 
        title="Submit" 
        onPress={handleSubmit} 
        disabled={submitting} 
      />
    </View>
  );
}
```

---

## PUT Request to Update

Updating existing data:

```typescript
import { updatePostAPI } from '@/services/api';

async function updatePost(postId: number, updates: any) {
  const response = await updatePostAPI(postId, {
    title: 'Updated Title',
    body: 'Updated content',
  });
  
  if (response.data) {
    console.log('Post updated:', response.data);
  }
}
```

---

## DELETE Request

Deleting data:

```typescript
import { deletePostAPI } from '@/services/api';

async function deletePost(postId: number) {
  const response = await deletePostAPI(postId);
  
  if (response.status === 200 || response.status === 204) {
    console.log('Post deleted successfully');
  }
}

// Usage with confirmation
function handleDelete(id: number) {
  Alert.alert(
    'Delete Post',
    'Are you sure?',
    [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => deletePost(id),
      },
    ]
  );
}
```

---

## Request with Authentication

Making authenticated requests:

```typescript
import { getUsersAPI } from '@/services/api';
import AsyncStorage from '@react-native-async-storage/async-storage';

async function fetchUsers() {
  // Get token from storage
  const token = await AsyncStorage.getItem('token');
  
  if (!token) {
    console.error('No authentication token found');
    return;
  }

  const response = await getUsersAPI(token);
  
  if (response.data) {
    console.log('Users:', response.data);
  }
}
```

---

## Error Handling

Comprehensive error handling:

```typescript
async function fetchDataWithErrorHandling() {
  try {
    const response = await getPostsAPI();
    
    if (response.error) {
      // API returned an error
      switch (response.status) {
        case 401:
          Alert.alert('Error', 'Unauthorized. Please login again.');
          // Redirect to login
          break;
        case 404:
          Alert.alert('Error', 'Resource not found.');
          break;
        case 500:
          Alert.alert('Error', 'Server error. Please try again later.');
          break;
        default:
          Alert.alert('Error', response.error);
      }
      return;
    }
    
    // Success!
    console.log('Data:', response.data);
    
  } catch (error) {
    // Network error or exception
    Alert.alert('Error', 'Network error. Check your connection.');
    console.error('Exception:', error);
  }
}
```

---

## Loading States

Managing loading states properly:

```typescript
import React, { useState } from 'react';
import { ActivityIndicator, View } from 'react-native';

function DataScreen() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await getPostsAPI();
      
      if (response.data) {
        setData(response.data);
      } else {
        setError(response.error || 'Unknown error');
      }
    } catch (err) {
      setError('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
        <Text>Loading...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Error: {error}</Text>
        <Button title="Retry" onPress={loadData} />
      </View>
    );
  }

  return (
    <View>
      {/* Render your data */}
    </View>
  );
}
```

---

## Real-World Integration Example

Complete example with authentication and data fetching:

```typescript
import React, { useState, useEffect, useCallback } from 'react';
import { View, FlatList, RefreshControl, Alert } from 'react-native';
import { getPostsAPI, createPostAPI } from '@/services/api';
import { useAuth } from '@/contexts/AuthContext';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface Post {
  id: number;
  title: string;
  body: string;
  userId: number;
}

export default function PostsScreen() {
  const { user } = useAuth();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Fetch posts on mount
  useEffect(() => {
    fetchPosts();
  }, []);

  // Fetch posts function
  const fetchPosts = async () => {
    try {
      const response = await getPostsAPI();
      
      if (response.data) {
        setPosts(response.data);
      } else {
        Alert.alert('Error', response.error || 'Failed to load posts');
      }
    } catch (error) {
      Alert.alert('Error', 'Network error. Please try again.');
      console.error('Error fetching posts:', error);
    } finally {
      setLoading(false);
    }
  };

  // Pull to refresh
  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchPosts();
    setRefreshing(false);
  }, []);

  // Create new post
  const handleCreatePost = async (title: string, body: string) => {
    try {
      const response = await createPostAPI({
        title,
        body,
        userId: user?.id || 1,
      });
      
      if (response.data) {
        Alert.alert('Success', 'Post created successfully!');
        setPosts([response.data, ...posts]); // Add to beginning
      } else {
        Alert.alert('Error', response.error || 'Failed to create post');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to create post');
      console.error('Error creating post:', error);
    }
  };

  return (
    <FlatList
      data={posts}
      keyExtractor={(item) => item.id.toString()}
      renderItem={({ item }) => (
        <View style={{ padding: 16, borderBottomWidth: 1 }}>
          <Text style={{ fontSize: 18, fontWeight: 'bold' }}>
            {item.title}
          </Text>
          <Text style={{ marginTop: 8 }}>{item.body}</Text>
        </View>
      )}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    />
  );
}
```

---

## Custom API Function Example

Creating your own API function:

```typescript
// In api.ts
export async function getUserProfileAPI(
  userId: number,
  token: string
): Promise<ApiResponse<UserProfile>> {
  return apiCall<UserProfile>(`/users/${userId}/profile`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

// Usage
const response = await getUserProfileAPI(123, 'your-token');
if (response.data) {
  console.log('Profile:', response.data);
}
```

---

## Advanced: Interceptors

Add request/response interceptors:

```typescript
// Wrapper function with interceptors
async function apiCallWithInterceptors<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  try {
    // Pre-request: Add auth token automatically
    const token = await AsyncStorage.getItem('token');
    
    const requestHeaders = {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    };

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers: requestHeaders,
    });

    // Response interceptor
    if (response.status === 401) {
      // Token expired, clear storage and redirect to login
      await AsyncStorage.removeItem('token');
      await AsyncStorage.removeItem('user');
      // Navigate to login
      return {
        status: 401,
        error: 'Session expired. Please login again.',
      };
    }

    const data = await response.json();

    if (!response.ok) {
      return {
        status: response.status,
        error: data.message || 'An error occurred',
      };
    }

    return {
      status: response.status,
      data,
    };
  } catch (error) {
    console.error('API Error:', error);
    return {
      status: 0,
      error: 'Network error or server unavailable',
    };
  }
}
```

---

## Summary

- ✅ Always handle loading states
- ✅ Always handle errors gracefully
- ✅ Check `response.data` before using it
- ✅ Use TypeScript for type safety
- ✅ Add authentication headers when needed
- ✅ Store tokens securely in AsyncStorage
- ✅ Implement pull-to-refresh for data lists
- ✅ Show user-friendly error messages
- ✅ Log errors for debugging

Check `my-app/app/(tabs)/api-demo.tsx` to see all these examples in action!


