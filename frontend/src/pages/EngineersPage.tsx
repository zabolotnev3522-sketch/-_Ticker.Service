import { useEffect, useState } from 'react';
import { api } from '../api/client';

export function EngineersPage() {
  const [engineers, setEngineers] = useState<any[]>([]);

  useEffect(() => {
    api.getEngineers().then(setEngineers).catch(console.error);
  }, []);

  return (
    <div style={{ maxWidth: 600, margin: '0 auto' }}>
      <h1>Инженеры</h1>
      <div style={{ background: '#fff', borderRadius: 8, boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid #eee', textAlign: 'left' }}>
              <th style={{ padding: '12px 16px' }}>ID</th>
              <th style={{ padding: '12px 16px' }}>Имя</th>
              <th style={{ padding: '12px 16px' }}>Email</th>
            </tr>
          </thead>
          <tbody>
            {engineers.map((e: any) => (
              <tr key={e.id} style={{ borderBottom: '1px solid #eee' }}>
                <td style={{ padding: '10px 16px' }}>{e.id}</td>
                <td style={{ padding: '10px 16px' }}>{e.name}</td>
                <td style={{ padding: '10px 16px' }}>{e.email}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
