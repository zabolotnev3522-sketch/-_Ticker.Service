import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../api/client';

const statusColors: Record<string, string> = {
  NEW: '#2196F3',
  IN_PROGRESS: '#FF9800',
  RESOLVED: '#4CAF50',
  CLOSED: '#9E9E9E',
};

export function TicketDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [ticket, setTicket] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [comment, setComment] = useState('');
  const [engineers, setEngineers] = useState<any[]>([]);
  const [selectedEngineer, setSelectedEngineer] = useState<number | ''>('');
  const role = localStorage.getItem('role');

  useEffect(() => {
    loadTicket();
    if (role === 'MANAGER' || role === 'ADMIN') loadEngineers();
  }, [id]);

  const loadTicket = async () => {
    setLoading(true);
    try {
      const data = await api.getTicket(Number(id));
      setTicket(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const loadEngineers = async () => {
    try {
      const data = await api.getEngineers();
      setEngineers(data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleClaim = async () => {
    try {
      const updated = await api.claimTicket(Number(id));
      setTicket(updated);
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleStatusChange = async (status: string) => {
    try {
      const updated = await api.updateTicket(Number(id), { status });
      setTicket(updated);
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handlePriorityChange = async (priority: string) => {
    try {
      const updated = await api.updateTicket(Number(id), { priority });
      setTicket(updated);
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleReassign = async () => {
    if (!selectedEngineer) return;
    try {
      const updated = await api.assignEngineerWith(Number(id), Number(selectedEngineer));
      setTicket(updated);
      setSelectedEngineer('');
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleAddComment = async () => {
    if (!comment.trim()) return;
    try {
      await api.addComment(Number(id), comment);
      setComment('');
      loadTicket();
    } catch (err: any) {
      alert(err.message);
    }
  };

  if (loading) return <div>Загрузка...</div>;
  if (!ticket) return <div>Заявка не найдена</div>;

  const isManager = role === 'MANAGER' || role === 'ADMIN';
  const isEngineer = role === 'ENGINEER' || role === 'ADMIN';

  const statusLabels: Record<string, string> = {
    NEW: 'Новая',
    IN_PROGRESS: 'В работе',
    RESOLVED: 'Решена',
    CLOSED: 'Закрыта',
  };

  const priorityLabels: Record<string, string> = {
    low: 'Низкий',
    medium: 'Средний',
    high: 'Высокий',
    critical: 'Критичный',
  };

  return (
    <div style={{ maxWidth: 800, margin: '0 auto' }}>
      <button
        onClick={() => navigate('/')}
        style={{ background: 'none', border: 'none', color: '#1a1a2e', cursor: 'pointer', padding: 0, marginBottom: 16, fontSize: 14 }}
      >
        &larr; Назад к заявкам
      </button>

      <div style={{ background: '#fff', borderRadius: 8, padding: 24, boxShadow: '0 2px 8px rgba(0,0,0,0.1)', marginBottom: 16 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
          <h1 style={{ margin: 0 }}>{ticket.title}</h1>
          <span style={{ background: statusColors[ticket.status] || '#999', color: '#fff', padding: '4px 16px', borderRadius: 12, fontSize: 14 }}>
            {statusLabels[ticket.status] || ticket.status.replace('_', ' ')}
          </span>
        </div>

        <p style={{ color: '#444', lineHeight: 1.6 }}>{ticket.description}</p>

        <div style={{ display: 'flex', gap: 24, fontSize: 14, color: '#666', marginTop: 16 }}>
          <div><strong>Клиент:</strong> {ticket.client.name}</div>
          {ticket.engineer && <div><strong>Инженер:</strong> {ticket.engineer.name}</div>}
          <div>
            <strong>Приоритет:</strong>{' '}
            {isManager ? (
              <select value={ticket.priority} onChange={(e) => handlePriorityChange(e.target.value)} style={{ padding: '2px 8px' }}>
                <option value="low">Низкий</option>
                <option value="medium">Средний</option>
                <option value="high">Высокий</option>
                <option value="critical">Критичный</option>
              </select>
            ) : (
              priorityLabels[ticket.priority] || ticket.priority
            )}
          </div>
          <div><strong>Создана:</strong> {new Date(ticket.createdAt).toLocaleString()}</div>
        </div>

        <div style={{ marginTop: 20, display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {role === 'ENGINEER' && ticket.status === 'NEW' && !ticket.engineer && (
            <button onClick={handleClaim} style={{ background: '#4CAF50', color: '#fff', border: 'none', padding: '8px 16px', borderRadius: 4, cursor: 'pointer' }}>
              Взять в работу
            </button>
          )}
          {isManager && ticket.status === 'NEW' && (
            <button onClick={() => api.assignEngineer(Number(id)).then(setTicket).catch((e: any) => alert(e.message))} style={{ background: '#4CAF50', color: '#fff', border: 'none', padding: '8px 16px', borderRadius: 4, cursor: 'pointer' }}>
              Назначить автоматически
            </button>
          )}
          {isManager && (
            <div style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
              <select value={selectedEngineer} onChange={(e) => setSelectedEngineer(e.target.value ? Number(e.target.value) : '')} style={{ padding: '6px 8px', borderRadius: 4, border: '1px solid #ddd' }}>
                <option value="">Переназначить...</option>
                {engineers.map((e: any) => (
                  <option key={e.id} value={e.id}>{e.name}</option>
                ))}
              </select>
              <button onClick={handleReassign} disabled={!selectedEngineer} style={{ background: '#FF9800', color: '#fff', border: 'none', padding: '8px 16px', borderRadius: 4, cursor: selectedEngineer ? 'pointer' : 'not-allowed', opacity: selectedEngineer ? 1 : 0.5 }}>
                Назначить
              </button>
            </div>
          )}
          {isEngineer && ticket.status === 'IN_PROGRESS' && (
            <button onClick={() => handleStatusChange('RESOLVED')} style={{ background: '#FF9800', color: '#fff', border: 'none', padding: '8px 16px', borderRadius: 4, cursor: 'pointer' }}>
              Отметить решённой
            </button>
          )}
          {(role === 'ENGINEER' || isManager) && ticket.status === 'RESOLVED' && (
            <button onClick={() => handleStatusChange('CLOSED')} style={{ background: '#2196F3', color: '#fff', border: 'none', padding: '8px 16px', borderRadius: 4, cursor: 'pointer' }}>
              Закрыть
            </button>
          )}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        <div style={{ background: '#fff', borderRadius: 8, padding: 20, boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
          <h3 style={{ marginTop: 0 }}>Комментарии</h3>
          {ticket.comments.length === 0 && <p style={{ color: '#999', fontSize: 14 }}>Нет комментариев</p>}
          {ticket.comments.map((c: any) => (
            <div key={c.id} style={{ marginBottom: 12, paddingBottom: 12, borderBottom: '1px solid #eee' }}>
              <div style={{ fontSize: 13, color: '#666', marginBottom: 4 }}>
                <strong>{c.user.name}</strong> ({c.user.role}) &middot; {new Date(c.createdAt).toLocaleString()}
              </div>
              <div style={{ fontSize: 14 }}>{c.text}</div>
            </div>
          ))}
          <div style={{ marginTop: 12 }}>
            <textarea value={comment} onChange={(e) => setComment(e.target.value)} placeholder="Добавить комментарий..." rows={3}
              style={{ width: '100%', padding: '8px 12px', border: '1px solid #ddd', borderRadius: 4, boxSizing: 'border-box', resize: 'vertical' }} />
            <button onClick={handleAddComment} style={{ marginTop: 8, background: '#1a1a2e', color: '#fff', border: 'none', padding: '8px 16px', borderRadius: 4, cursor: 'pointer' }}>Отправить</button>
          </div>
        </div>

        <div style={{ background: '#fff', borderRadius: 8, padding: 20, boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
          <h3 style={{ marginTop: 0 }}>История статусов</h3>
          {ticket.statusHistory.map((h: any) => (
            <div key={h.id} style={{ marginBottom: 8, fontSize: 14 }}>
              <div>
                <span style={{ display: 'inline-block', background: statusColors[h.newStatus] || '#999', color: '#fff', padding: '2px 8px', borderRadius: 8, fontSize: 12, marginRight: 8 }}>
                  {statusLabels[h.newStatus] || h.newStatus.replace('_', ' ')}
                </span>
                {h.oldStatus && <span style={{ color: '#999' }}>(был {statusLabels[h.oldStatus] || h.oldStatus.replace('_', ' ')}) </span>}
                <span style={{ color: '#666' }}>от {h.user.name} &middot; {new Date(h.createdAt).toLocaleString()}</span>
              </div>
              {h.note && <div style={{ color: '#888', fontSize: 12, marginTop: 2 }}>{h.note}</div>}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
