'use client';
import { useState } from 'react';
import CodeMirror from '@uiw/react-codemirror';  // Install @uiw/react-codemirror@4.23.0
import { sql } from '@codemirror/lang-sql';
import { oneDark } from '@codemirror/theme-one-dark';

export default function Dashboard() {
  const [nlQuery, setNlQuery] = useState('');
  const [sqlCode, setSqlCode] = useState('');
  const [results, setResults] = useState<any[]>([]);
  const [error, setError] = useState('');

  const generateSql = async () => {
    const res = await fetch('/api/generate-sql', { method: 'POST', body: JSON.stringify({ nlQuery }) });
    const data = await res.json();
    setSqlCode(data.sql || data.error);
  };

  const runSql = async () => {
    const res = await fetch('/api/run-sql', { method: 'POST', body: JSON.stringify({ sql: sqlCode }) });
    const data = await res.json();
    setResults(data.results || []);
    setError(data.error || '');
  };

  return (
    <div className="p-8">
      <h1 className="text-3xl mb-4">Dashboard: NL to SQL</h1>
      <input
        type="text"
        value={nlQuery}
        onChange={e => setNlQuery(e.target.value)}
        placeholder="Enter natural language query, e.g., 'Show employees in HR'"
        className="p-2 border w-full mb-4"
      />
      <button onClick={generateSql} className="px-4 py-2 bg-green-600 text-white mb-4">Generate SQL</button>
      <h2 className="text-xl mb-2">SQL Editor</h2>
      <CodeMirror
        value={sqlCode}
        onChange={setSqlCode}
        extensions={[sql()]}
        theme={oneDark}
        height="200px"
        className="mb-4"
      />
      <button onClick={runSql} className="px-4 py-2 bg-blue-600 text-white">Run SQL</button>
      {error && <p className="text-red-600 mt-4">{error}</p>}
      {results.length > 0 && (
        <table className="mt-4 w-full border">
          <thead><tr>{Object.keys(results[0]).map(key => <th key={key} className="border p-2">{key}</th>)}</tr></thead>
          <tbody>{results.map((row, i) => <tr key={i}>{Object.values(row).map((val, j) => <td key={j} className="border p-2">{val as string}</td>)}</tr>)}</tbody>
        </table>
      )}
    </div>
  );
}