const BASE_URL = 'http://localhost:8000'; 
export const fetchData = async (endpoint, data = {}, method = 'GET') => {
  try {
    const url = `${BASE_URL}${endpoint}`;
    
    const options = {
      method,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    
        'Origin': window.location.origin,
        'X-Requested-With': 'XMLHttpRequest'
      },
      credentials: 'include',
      mode: 'cors'
    };

    if (method !== 'GET' && data) {
      options.body = JSON.stringify(data);
    }

    //had issues with CORS so leaving this in case it breaks again (for debug)
    const response = await fetch(url, options);

    if (response.status === 403) {
      const errorText = await response.text();
      try {
        const errorJson = JSON.parse(errorText);
        throw new Error(errorJson.message || `Access forbidden (403).`);
      } catch {
        throw new Error(`Access forbidden (403). Server message: ${errorText}`);
      }
    }

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `Request failed with status ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Fetch error:', error);
    throw error;
  }
};
