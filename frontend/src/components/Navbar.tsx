import { Link, useNavigate } from 'react-router-dom';

export function Navbar() {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role');

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    navigate('/login');
  };

  if (!token) {
    return (
      <nav style={{ background: '#1a1a2e', padding: '12px 24px', color: '#fff' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', justifyContent: 'space-between' }}>
          <Link to="/login" style={{ color: '#fff', textDecoration: 'none', fontWeight: 'bold' }}>
            Ticket Service
          </Link>
          <div>
            <Link to="/login" style={{ color: '#fff' }}>Вход</Link>
          </div>
        </div>
      </nav>
    );
  }

  return (
    <nav style={{ background: '#1a1a2e', padding: '12px 24px', color: '#fff' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Link to="/" style={{ color: '#fff', textDecoration: 'none', fontWeight: 'bold' }}>
          Ticket Service
        </Link>
        <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
          <Link to="/tickets/new" style={{ color: '#fff', textDecoration: 'none' }}>
            Новая заявка
          </Link>
          {(role === 'MANAGER' || role === 'ADMIN') && (
            <Link to="/engineers" style={{ color: '#fff', textDecoration: 'none' }}>
              Инженеры
            </Link>
          )}
          {role === 'ADMIN' && (
            <>
              <Link to="/register" style={{ color: '#fff', textDecoration: 'none' }}>
                Регистрация
              </Link>
              <Link to="/users" style={{ color: '#fff', textDecoration: 'none' }}>
                Пользователи
              </Link>
            </>
          )}
          <span style={{ fontSize: 14, opacity: 0.7 }}>{role}</span>
          <button
            onClick={handleLogout}
            style={{
              background: 'transparent',
              border: '1px solid #fff',
              color: '#fff',
              padding: '4px 12px',
              borderRadius: 4,
              cursor: 'pointer',
            }}
          >
            Выйти
          </button>
        </div>
      </div>
    </nav>
  );
}
