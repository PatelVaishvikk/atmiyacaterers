'use client';
import { useState } from 'react';

export default function TestDB() {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const testConnection = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/admin/test');
      const data = await response.json();
      setResult(data);
    } catch (error) {
      setResult({ error: error.message });
    }
    setLoading(false);
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>Database Connection Test</h1>
      <button onClick={testConnection} disabled={loading}>
        {loading ? 'Testing...' : 'Test Connection'}
      </button>
      {result && (
        <pre style={{ background: '#f5f5f5', padding: '15px', marginTop: '20px' }}>
          {JSON.stringify(result, null, 2)}
        </pre>
      )}
    </div>
  );
}