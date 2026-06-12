import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api/client';

const statusColors: Record<string, string> = {
  NEW: '#2196F3',
  IN_PROGRESS: '#FF9800',
  RESOLVED: '#4CAF50',
  CLOSED: '#9E9E9E',
};

const priorityColors: Record<string, string> = {
  low: '#4CAF50',
  medium: '#FF9800',
  high: '#F44336',
  critical: '#9C27B0',
};

export function TicketListPage() {
  const [tickets, setTickets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [statusFilter, setStatusFilter] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('');

  const role = localStorage.getItem('role');

  useEffect(() => {
    loadTickets();
  }, []);

  const applyFilters = () => {
    loadTickets();
  };

  const loadTickets = async () => {
    setLoading(true);
    try {
      const params: Record<string, string> = {};
      if (statusFilter) params.status = statusFilter;
      if (priorityFilter) params.priority = priorityFilter;
      const res = await api.getTickets(params);
      setTickets(res.tickets);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <h1 style={{ margin: 0 }}>Заявки</h1>
        <Link
          to="/tickets/new"
          style={{ background: '#1a1a2e', color: '#fff', padding: '8px 16px', borderRadius: 4, textDecoration: 'none' }}
        >
          + Новая заявка
        </Link>
      </div>

      <div style={{ marginBottom: 16, display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          style={{ padding: '8px 12px', borderRadius: 4, border: '1px solid #ddd' }}
        >
          <option value="">Все статусы</option>
          <option value="NEW">Новая</option>
          <option value="IN_PROGRESS">В работе</option>
          <option value="RESOLVED">Решена</option>
          <option value="CLOSED">Закрыта</option>
        </select>

        <select
          value={priorityFilter}
          onChange={(e) => setPriorityFilter(e.target.value)}
          style={{ padding: '8px 12px', borderRadius: 4, border: '1px solid #ddd' }}
        >
          <option value="">Все приоритеты</option>
          <option value="low">Низкий</option>
          <option value="medium">Средний</option>
          <option value="high">Высокий</option>
          <option value="critical">Критичный</option>
        </select>

        <button
          onClick={applyFilters}
          style={{ background: '#1a1a2e', color: '#fff', border: 'none', padding: '8px 16px', borderRadius: 4, cursor: 'pointer' }}
        >
          Применить
        </button>
      </div>

      {loading && <div>Загрузка...</div>}

      {!loading && tickets.length === 0 && <div>Заявок не найдено</div>}

      {tickets.map((ticket) => (
        <Link
          key={ticket.id}
          to={`/tickets/${ticket.id}`}
          style={{ textDecoration: 'none', color: 'inherit' }}
        >
          <div
            style={{
              background: '#fff',
              borderRadius: 8,
              padding: '16px 20px',
              marginBottom: 8,
              boxShadow: '0 1px 4px rgba(0,0,0,0.08)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <div>
              <div style={{ fontWeight: 600, marginBottom: 4 }}>{ticket.title}</div>
              <div style={{ fontSize: 14, color: '#666' }}>
                {ticket.client.name} &middot; {new Date(ticket.createdAt).toLocaleDateString()}
                {ticket.engineer && ` &middot; Назначен: ${ticket.engineer.name}`}
              </div>
            </div>
            <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
              <span
                style={{
                  background: priorityColors[ticket.priority] || '#999',
                  color: '#fff',
                  padding: '2px 8px',
                  borderRadius: 12,
                  fontSize: 12,
                }}
              >
                {ticket.priority === 'low' ? 'Низкий' : ticket.priority === 'medium' ? 'Средний' : ticket.priority === 'high' ? 'Высокий' : ticket.priority === 'critical' ? 'Критичный' : ticket.priority}
              </span>
              <span
                style={{
                  background: statusColors[ticket.status] || '#999',
                  color: '#fff',
                  padding: '4px 12px',
                  borderRadius: 12,
                  fontSize: 12,
                }}
              >
                {ticket.status === 'NEW' ? 'Новая' : ticket.status === 'IN_PROGRESS' ? 'В работе' : ticket.status === 'RESOLVED' ? 'Решена' : ticket.status === 'CLOSED' ? 'Закрыта' : ticket.status.replace('_', ' ')}
              </span>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}
