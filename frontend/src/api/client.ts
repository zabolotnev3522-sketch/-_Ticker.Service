const API_BASE = '/api';

function getToken(): string | null {
  return localStorage.getItem('token');
}

async function request(path: string, options: RequestInit = {}) {
  const token = getToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const res = await fetch(`${API_BASE}${path}`, { ...options, headers });

  if (res.status === 401) {
    localStorage.removeItem('token');
    window.location.href = '/login';
    throw new Error('Unauthorized');
  }

  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Request failed');
  return data;
}

export const api = {
  login: (email: string, password: string) =>
    request('/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) }),

  register: (email: string, password: string, name: string, role?: string) =>
    request('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ email, password, name, role }),
    }),

  getTickets: (params?: Record<string, string>) => {
    const qs = params ? '?' + new URLSearchParams(params) : '';
    return request(`/tickets${qs}`);
  },

  getTicket: (id: number) => request(`/tickets/${id}`),

  createTicket: (title: string, description: string, priority?: string) =>
    request('/tickets', {
      method: 'POST',
      body: JSON.stringify({ title, description, priority }),
    }),

  updateTicket: (id: number, data: Record<string, string>) =>
    request(`/tickets/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),

  assignEngineer: (id: number) =>
    request(`/tickets/${id}/assign`, { method: 'POST' }),

  getUsers: (params?: Record<string, string>) => {
    const qs = params ? '?' + new URLSearchParams(params) : '';
    return request(`/users${qs}`);
  },
  getUser: (id: number) => request(`/users/${id}`),
  updateUser: (id: number, data: Record<string, string>) =>
    request(`/users/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),
  deleteUser: (id: number) =>
    request(`/users/${id}`, { method: 'DELETE' }),
  getEngineers: () => request('/users/engineers'),
  claimTicket: (id: number) => request(`/tickets/${id}/claim`, { method: 'POST' }),
  assignEngineerWith: (id: number, engineerId: number) =>
    request(`/tickets/${id}/assign`, { method: 'POST', body: JSON.stringify({ engineerId }) }),

  addComment: (ticketId: number, text: string) =>
    request(`/tickets/${ticketId}/comments`, {
      method: 'POST',
      body: JSON.stringify({ text }),
    }),
};
