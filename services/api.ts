/**
 * API Service - Example of calling REST API endpoints
 * This file demonstrates various API call patterns using fetch()
 */

const API_BASE_URL = 'https://jsonplaceholder.typicode.com'; // Example API for demo

// API Response types
interface ApiResponse<T> {
  data?: T;
  error?: string;
  status: number;
}

interface LoginRequest {
  username: string;
  password: string;
}

interface LoginResponse {
  id: string;
  username: string;
  email: string;
  token: string;
}

interface Post {
  id: number;
  title: string;
  body: string;
  userId: number;
}

interface User {
  id: number;
  name: string;
  email: string;
  username: string;
}

/**
 * Generic API call function
 */
async function apiCall<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });

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

/**
 * Example 1: Login API call with POST method
 * Demonstrates sending JSON data in request body
 */
export async function loginAPI(credentials: LoginRequest): Promise<ApiResponse<LoginResponse>> {
  // In a real app, you would call your actual login endpoint
  // For demo, we'll simulate with a mock response
  return apiCall<LoginResponse>('/users/1', {
    method: 'GET', // Using GET for demo since this is a public API
  });
}

/**
 * Example 2: GET request to fetch a list of posts
 * Demonstrates fetching data with query parameters
 */
export async function getPostsAPI(userId?: number): Promise<ApiResponse<Post[]>> {
  const endpoint = userId ? `/posts?userId=${userId}` : '/posts';
  return apiCall<Post[]>(endpoint, {
    method: 'GET',
  });
}

/**
 * Example 3: GET request to fetch a single post by ID
 * Demonstrates fetching a specific resource
 */
export async function getPostAPI(postId: number): Promise<ApiResponse<Post>> {
  return apiCall<Post>(`/posts/${postId}`, {
    method: 'GET',
  });
}

/**
 * Example 4: POST request to create a new post
 * Demonstrates creating a resource with JSON body
 */
export async function createPostAPI(post: {
  title: string;
  body: string;
  userId: number;
}): Promise<ApiResponse<Post>> {
  return apiCall<Post>('/posts', {
    method: 'POST',
    body: JSON.stringify(post),
  });
}

/**
 * Example 5: PUT request to update an existing post
 * Demonstrates updating a resource
 */
export async function updatePostAPI(
  postId: number,
  post: Partial<Post>
): Promise<ApiResponse<Post>> {
  return apiCall<Post>(`/posts/${postId}`, {
    method: 'PUT',
    body: JSON.stringify(post),
  });
}

/**
 * Example 6: DELETE request to delete a post
 * Demonstrates deleting a resource
 */
export async function deletePostAPI(postId: number): Promise<ApiResponse<{}>> {
  return apiCall<{}>(`/posts/${postId}`, {
    method: 'DELETE',
  });
}

/**
 * Example 7: GET request with custom headers (authentication token)
 * Demonstrates adding authorization headers
 */
export async function getUsersAPI(token: string): Promise<ApiResponse<User[]>> {
  return apiCall<User[]>('/users', {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

/**
 * Example 8: File upload (multipart/form-data)
 * Demonstrates uploading files
 */
export async function uploadFileAPI(file: FormData): Promise<ApiResponse<{ url: string }>> {
  try {
    const response = await fetch(`${API_BASE_URL}/upload`, {
      method: 'POST',
      body: file,
      // Note: Don't set Content-Type header when using FormData,
      // browser will set it automatically with boundary
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        status: response.status,
        error: data.message || 'Upload failed',
      };
    }

    return {
      status: response.status,
      data,
    };
  } catch (error) {
    console.error('Upload Error:', error);
    return {
      status: 0,
      error: 'Upload failed',
    };
  }
}


