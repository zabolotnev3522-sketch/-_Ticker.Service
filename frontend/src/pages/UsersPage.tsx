import { useEffect, useState } from 'react';
import { api } from '../api/client';

export function UsersPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState({ name: '', email: '', role: '', password: '' });
  const [roleFilter, setRoleFilter] = useState('');
  const [searchFilter, setSearchFilter] = useState('');

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      const params: Record<string, string> = {};
      if (roleFilter) params.role = roleFilter;
      if (searchFilter) params.search = searchFilter;
      const data = await api.getUsers(params);
      setUsers(data);
    } catch (err) {
      console.error(err);
    }
  };

  const startEdit = (u: any) => {
    setEditingId(u.id);
    setForm({ name: u.name, email: u.email, role: u.role, password: '' });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setForm({ name: '', email: '', role: '', password: '' });
  };

  const handleSave = async () => {
    if (!editingId) return;
    try {
      const payload: Record<string, string> = { name: form.name, email: form.email, role: form.role };
      if (form.password) payload.password = form.password;
      await api.updateUser(editingId, payload);
      cancelEdit();
      loadUsers();
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleDelete = async (id: number, name: string) => {
    if (!window.confirm(`Удалить пользователя ${name}?`)) return;
    try {
      await api.deleteUser(id);
      loadUsers();
    } catch (err: any) {
      alert(err.message);
    }
  };

  return (
    <div style={{ maxWidth: 900, margin: '0 auto' }}>
      <h1>Пользователи</h1>

      <div style={{ marginBottom: 16, display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
        <input
          value={searchFilter}
          onChange={(e) => setSearchFilter(e.target.value)}
          placeholder="Поиск по имени или email..."
          style={{ padding: '8px 12px', borderRadius: 4, border: '1px solid #ddd', flex: 1, minWidth: 200 }}
        />
        <select
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
          style={{ padding: '8px 12px', borderRadius: 4, border: '1px solid #ddd' }}
        >
          <option value="">Все роли</option>
          <option value="CLIENT">CLIENT</option>
          <option value="ENGINEER">ENGINEER</option>
          <option value="MANAGER">MANAGER</option>
          <option value="ADMIN">ADMIN</option>
        </select>
        <button
          onClick={loadUsers}
          style={{ background: '#1a1a2e', color: '#fff', border: 'none', padding: '8px 16px', borderRadius: 4, cursor: 'pointer' }}
        >
          Поиск
        </button>
      </div>

      <div style={{ background: '#fff', borderRadius: 8, boxShadow: '0 2px 8px rgba(0,0,0,0.1)', overflow: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid #eee', textAlign: 'left' }}>
              <th style={{ padding: '12px 16px' }}>ID</th>
              <th style={{ padding: '12px 16px' }}>Имя</th>
              <th style={{ padding: '12px 16px' }}>Email</th>
              <th style={{ padding: '12px 16px' }}>Роль</th>
              <th style={{ padding: '12px 16px' }}>Действия</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u: any) => (
              <tr key={u.id} style={{ borderBottom: '1px solid #eee' }}>
                {editingId === u.id ? (
                  <>
                    <td style={{ padding: '10px 16px' }}>{u.id}</td>
                    <td style={{ padding: '10px 16px' }}>
                      <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} style={{ width: 120, padding: '4px 8px' }} />
                    </td>
                    <td style={{ padding: '10px 16px' }}>
                      <input value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} style={{ width: 160, padding: '4px 8px' }} />
                    </td>
                    <td style={{ padding: '10px 16px' }}>
                      <select value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} style={{ padding: '4px 8px' }}>
                        <option value="CLIENT">CLIENT</option>
                        <option value="ENGINEER">ENGINEER</option>
                        <option value="MANAGER">MANAGER</option>
                        <option value="ADMIN">ADMIN</option>
                      </select>
                    </td>
                    <td style={{ padding: '10px 16px' }}>
                      <div style={{ display: 'flex', gap: 4, alignItems: 'center', flexWrap: 'wrap' }}>
                        <input value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} placeholder="Новый пароль" type="password" style={{ width: 110, padding: '4px 8px' }} />
                        <button onClick={handleSave} style={{ background: '#4CAF50', color: '#fff', border: 'none', padding: '6px 12px', borderRadius: 4, cursor: 'pointer' }}>Сохранить</button>
                        <button onClick={cancelEdit} style={{ background: '#999', color: '#fff', border: 'none', padding: '6px 12px', borderRadius: 4, cursor: 'pointer' }}>Отмена</button>
                      </div>
                    </td>
                  </>
                ) : (
                  <>
                    <td style={{ padding: '10px 16px' }}>{u.id}</td>
                    <td style={{ padding: '10px 16px' }}>{u.name}</td>
                    <td style={{ padding: '10px 16px' }}>{u.email}</td>
                    <td style={{ padding: '10px 16px' }}>{u.role}</td>
                    <td style={{ padding: '10px 16px' }}>
                      <button onClick={() => startEdit(u)} style={{ background: '#FF9800', color: '#fff', border: 'none', padding: '6px 12px', borderRadius: 4, cursor: 'pointer', marginRight: 8 }}>Ред.</button>
                      <button onClick={() => handleDelete(u.id, u.name)} style={{ background: '#F44336', color: '#fff', border: 'none', padding: '6px 12px', borderRadius: 4, cursor: 'pointer' }}>Удал.</button>
                    </td>
                  </>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
