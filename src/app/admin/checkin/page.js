// src/app/admin/checkin/page.js
'use client';

import { useEffect, useMemo, useRef, useState } from 'react';

function norm(b) {
  if (!b || typeof b !== 'object') {
    return {
      id: '',
      name: 'Guest',
      email: '',
      phone: '',
      tokenNumber: '',
      numberOfPeople: 1,
      status: 'booked',
      bookingDate: null,
      createdAt: null,
      updatedAt: null,
      checkedInAt: null,
      dishes: [],
    };
  }
  return {
    id: String(b._id ?? b.id ?? ''),
    name: b.name || 'Guest',
    email: b.email || '',
    phone: b.phone || '',
    tokenNumber: b.tokenNumber || '',
    numberOfPeople: Number(b.numberOfPeople ?? 1),
    status: b.status || 'booked',
    bookingDate: b.bookingDate ? new Date(b.bookingDate) : null,
    createdAt: b.createdAt ? new Date(b.createdAt) : null,
    updatedAt: b.updatedAt ? new Date(b.updatedAt) : null,
    checkedInAt: b.checkedInAt ? new Date(b.checkedInAt) : null,
    dishes: Array.isArray(b.dishes) ? b.dishes : [],
  };
}

async function safeJSON(res) {
  const txt = await res.text();
  if (!txt) return { __empty: true };
  try { return JSON.parse(txt); } catch { return { __parseError: true, __raw: txt }; }
}
async function getJSON(url) {
  const res = await fetch(url, { cache: 'no-store' });
  const data = await safeJSON(res);
  return { ok: res.ok, status: res.status, data };
}
async function postJSON(url, body) {
  const res = await fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, cache: 'no-store', body: JSON.stringify(body) });
  const data = await safeJSON(res);
  return { ok: res.ok, status: res.status, data };
}

function normalizeToken(input) {
  const raw = String(input || '').toUpperCase();
  if (/^[A-Z]\d{3}$/.test(raw)) return raw;
  if (/^\d{3}$/.test(raw)) return `G${raw}`;
  const letter = raw.match(/[A-Z]/)?.[0] || 'G';
  const digits = (raw.match(/\d/g) || []).join('').slice(0, 3).padStart(3, '0');
  return `${letter}${digits}`;
}

export default function CheckInPage() {
  const [mounted, setMounted] = useState(false);
  const [token, setToken] = useState('');
  const [isChecking, setIsChecking] = useState(false);
  const [isBulkChecking, setIsBulkChecking] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');

  const [todayAwaiting, setTodayAwaiting] = useState([]);
  const [recent, setRecent] = useState([]);
  const [allBookings, setAllBookings] = useState([]);
  const [allTotal, setAllTotal] = useState(0);
  const [allQuery, setAllQuery] = useState('');
  const [isLoadingAll, setIsLoadingAll] = useState(false);

  const [selectedTokensAll, setSelectedTokensAll] = useState(() => new Set());
  const [selectedTokensToday, setSelectedTokensToday] = useState(() => new Set());
  const [selectAllAll, setSelectAllAll] = useState(false);

  const tokenRef = useRef(null);

  useEffect(() => { setMounted(true); }, []);
  useEffect(() => {
    if (!mounted) return;
    loadToday();
    loadRecent();
    loadAll();
    tokenRef.current?.focus();
  }, [mounted]);

  async function loadToday() {
    const resp = await getJSON('/api/bookings?status=booked&day=today&limit=500');
    if (resp.ok && resp.data?.success && Array.isArray(resp.data.items)) {
      setTodayAwaiting(resp.data.items.filter(Boolean).map(norm));
      setSelectedTokensToday(new Set());
    }
  }
  async function loadRecent() {
    const resp = await getJSON('/api/bookings/checkin');
    if (resp.ok && resp.data?.success && Array.isArray(resp.data.items)) {
      setRecent(resp.data.items.filter(Boolean).map(norm));
    }
  }
  async function loadAll(q = '') {
    setIsLoadingAll(true);
    const resp = await getJSON(`/api/bookings?limit=500${q ? `&q=${encodeURIComponent(q)}` : ''}`);
    setIsLoadingAll(false);
    if (resp.ok && resp.data?.success && Array.isArray(resp.data.items)) {
      const arr = resp.data.items.filter(Boolean).map(norm);
      setAllBookings(arr);
      setAllTotal(arr.length);
      setSelectedTokensAll(new Set());
      setSelectAllAll(false);
    } else {
      setAllBookings([]);
      setAllTotal(0);
      setSelectedTokensAll(new Set());
      setSelectAllAll(false);
    }
  }

  async function handleCheckInSingle(inputToken) {
    setError('');
    setNotice('');
    const normalized = normalizeToken(inputToken);
    setIsChecking(true);
    const resp = await postJSON('/api/bookings/checkin', { tokenNumber: normalized, checkedInBy: 'Admin' });
    setIsChecking(false);

    if (!resp.ok || !resp.data?.success) {
      setError(resp.data?.error || `Check-in failed (${resp.status})`);
      return null;
    }

    const b = norm(resp.data.booking);
    if (resp.data.alreadyCheckedIn) {
      setNotice(`Already checked in: ${b.name} (${b.tokenNumber})`);
    } else {
      setNotice(`Checked in: ${b.name} (${b.tokenNumber})`);
      setTodayAwaiting(prev => prev.filter(x => x.tokenNumber !== b.tokenNumber));
    }
    setRecent(prev => [b, ...prev.filter(x => x.tokenNumber !== b.tokenNumber)].slice(0, 100));
    setAllBookings(prev => prev.map(x => x.tokenNumber === b.tokenNumber ? { ...x, ...b } : x));
    return b;
  }

  async function handleCheckInSubmit(e) {
    e?.preventDefault?.();
    const input = token.trim().toUpperCase();
    if (!input) { setError('Enter token'); return; }
    const b = await handleCheckInSingle(input);
    if (b) {
      setToken('');
      tokenRef.current?.focus();
    }
  }

  async function handleBulkCheckIn(tokens) {
    const unique = [...new Set(tokens.map(normalizeToken))].filter(Boolean);
    if (unique.length === 0) return;

    setError('');
    setNotice('');
    setIsBulkChecking(true);
    const resp = await postJSON('/api/bookings/checkin/bulk', { tokens: unique, checkedInBy: 'Admin' });
    setIsBulkChecking(false);

    if (!resp.ok || !resp.data?.success) {
      setError(resp.data?.error || `Bulk check-in failed (${resp.status})`);
      return;
    }

    const items = Array.isArray(resp.data.items) ? resp.data.items.map(norm) : [];
    const updatedSet = new Set(resp.data.updated || []);
    const alreadySet = new Set(resp.data.already || []);
    const doneSet = new Set([...updatedSet, ...alreadySet]);

    setRecent(prev => {
      const others = prev.filter(x => !doneSet.has(x.tokenNumber));
      return [...items, ...others].slice(0, 100);
    });

    setAllBookings(prev =>
      prev.map(x => {
        const found = items.find(i => i.tokenNumber === x.tokenNumber);
        return found ? { ...x, ...found } : x;
      })
    );

    setTodayAwaiting(prev => prev.filter(x => !doneSet.has(x.tokenNumber)));

    setSelectedTokensAll(new Set());
    setSelectedTokensToday(new Set());
    setSelectAllAll(false);

    setNotice(`Bulk check-in: updated=${updatedSet.size}, already=${alreadySet.size}, notFound=${resp.data.notFound?.length || 0}`);
  }

  const awaitingCount = todayAwaiting.length;
  const servedCount = useMemo(() => recent.reduce((s, r) => s + (r.numberOfPeople || 1), 0), [recent]);

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-900 via-blue-900 to-purple-900 p-4">
      <div className="max-w-7xl mx-auto space-y-8">

        <header className="text-center">
          <h1 className="text-4xl font-bold text-white mb-2">🎫 Check-In System</h1>
          <p className="text-lg text-blue-100">Tokens are like <b>A123</b>. Search, filter, select many, and check-in fast.</p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left: single check-in */}
          <div className="bg-white rounded-2xl shadow-2xl p-6 lg:col-span-1">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Check-In Guest</h2>
            <form onSubmit={handleCheckInSubmit} className="space-y-4">
              <div>
                <label htmlFor="tokenInput" className="block text-sm font-medium text-gray-700 mb-2">Token (A123)</label>
                <input
                  id="tokenInput"
                  ref={tokenRef}
                  type="text"
                  inputMode="text"
                  autoComplete="off"
                  placeholder="A123"
                  value={token}
                  onChange={(e) =>
                    setToken(
                      e.target.value
                        .toUpperCase()
                        .replace(/[^A-Z0-9]/g, '')
                        .replace(/^([A-Z]?)(\d{0,3}).*$/, (_, a, d) => `${a}${d}`)
                    )
                  }
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-lg"
                />
              </div>

              {error && <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-red-800 text-sm">{error}</div>}
              {notice && <div className="bg-green-50 border border-green-200 rounded-lg p-3 text-green-800 text-sm">{notice}</div>}

              <button
                type="submit"
                disabled={isChecking || !token.trim()}
                className="w-full bg-gradient-to-r from-green-600 to-blue-600 text-white py-3 rounded-lg font-semibold text-lg hover:from-green-700 hover:to-blue-700 transition disabled:opacity-50"
              >
                {isChecking ? 'Checking…' : 'Check In'}
              </button>
            </form>
          </div>

          {/* Right top: awaiting today */}
          <div className="bg-white rounded-2xl shadow-2xl p-6 lg:col-span-2">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold text-gray-900">Awaiting Today</h2>
              <div className="flex items-center gap-3">
                <div className="text-gray-600">Total: <b>{awaitingCount}</b></div>
                <button
                  onClick={() => handleBulkCheckIn([...selectedTokensToday])}
                  disabled={isBulkChecking || selectedTokensToday.size === 0}
                  className="px-3 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
                >
                  {isBulkChecking ? 'Bulk Checking…' : `Check In Selected (${selectedTokensToday.size})`}
                </button>
              </div>
            </div>

            {todayAwaiting.length === 0 ? (
              <div className="text-center py-10 text-gray-500">No bookings awaiting today.</div>
            ) : (
              <div className="grid md:grid-cols-2 gap-3 max-h-[420px] overflow-y-auto pr-1">
                {todayAwaiting.map((b) => {
                  const checked = selectedTokensToday.has(b.tokenNumber);
                  return (
                    <div key={`${b.id}-${b.tokenNumber}`} className="border rounded-lg p-3 flex items-start justify-between gap-3">
                      <div className="flex items-start gap-3 min-w-0">
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={(e) => {
                            setSelectedTokensToday(prev => {
                              const s = new Set(prev);
                              if (e.target.checked) s.add(b.tokenNumber); else s.delete(b.tokenNumber);
                              return s;
                            });
                          }}
                        />
                        <div className="min-w-0">
                          <div className="font-semibold text-gray-900 truncate">{b.name}</div>
                          <div className="text-sm text-gray-600">
                            <span className="font-mono">{b.tokenNumber}</span> · {b.numberOfPeople} ppl
                          </div>

                          {/* Mini dish summary */}
                          {Array.isArray(b.dishes) && b.dishes.length > 0 && (
                            <div className="mt-1 text-xs text-gray-700">
                              {b.dishes.map((d, i) => (
                                <span key={i}>
                                  {d.name} × {d.qty}{i < b.dishes.length - 1 ? ', ' : ''}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                      <button
                        onClick={async () => { await handleCheckInSingle(b.tokenNumber); }}
                        className="h-8 px-3 bg-green-600 text-white rounded hover:bg-green-700"
                      >
                        Check In
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Bottom: recent + all bookings */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="bg-white rounded-2xl shadow-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold text-gray-900">Recent Check-Ins</h2>
              <div className="text-gray-600">
                Served: <b>{servedCount}</b>
              </div>
            </div>
            {recent.length === 0 ? (
              <div className="text-center py-8 text-gray-500">No recent check-ins.</div>
            ) : (
              <div className="space-y-3 max-h-[420px] overflow-y-auto pr-1">
                {recent.map((r) => (
                  <div key={`${r.id}-${r.tokenNumber}`} className="bg-green-50 border border-green-200 rounded-lg p-3">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <div className="font-semibold text-green-900 truncate">{r.name}</div>
                        <div className="text-sm text-green-700 truncate">
                          <span className="font-mono">{r.tokenNumber}</span> · {r.numberOfPeople} ppl
                        </div>

                        {/* Show dishes under each checked-in card */}
                        {Array.isArray(r.dishes) && r.dishes.length > 0 && (
                          <ul className="mt-1 text-xs text-green-900 list-disc ml-5">
                            {r.dishes.map((d, i) => (
                              <li key={i}>{d.name} × {d.qty}</li>
                            ))}
                          </ul>
                        )}
                      </div>
                      <div className="text-xs text-green-700 whitespace-nowrap">
                        {r.checkedInAt ? r.checkedInAt.toLocaleTimeString() : ''}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="bg-white rounded-2xl shadow-2xl p-6 lg:col-span-2">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-4">
              <h2 className="text-2xl font-bold text-gray-900">All Bookings</h2>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  placeholder="Search name, email, phone, token…"
                  value={allQuery}
                  onChange={(e) => setAllQuery(e.target.value)}
                  className="w-full md:w-80 px-3 py-2 border rounded-lg"
                />
                <button
                  onClick={() => loadAll(allQuery)}
                  className="px-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  {isLoadingAll ? 'Searching…' : 'Search'}
                </button>
                <button
                  onClick={() => handleBulkCheckIn([...selectedTokensAll])}
                  disabled={isBulkChecking || selectedTokensAll.size === 0}
                  className="px-3 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
                >
                  {isBulkChecking ? 'Bulk Checking…' : `Check In Selected (${selectedTokensAll.size})`}
                </button>
              </div>
            </div>

            {allBookings.length === 0 ? (
              <div className="text-center py-8 text-gray-500">No bookings.</div>
            ) : (
              <div className="overflow-x-auto max-h-[420px] overflow-y-auto">
                <table className="min-w-full text-sm">
                  <thead>
                    <tr className="text-left text-gray-600 border-b">
                      <th className="py-2 pr-4">
                        <input
                          type="checkbox"
                          checked={selectAllAll}
                          onChange={(e) => {
                            const checked = e.target.checked;
                            setSelectAllAll(checked);
                            setSelectedTokensAll(prev => {
                              if (checked) {
                                const s = new Set(prev);
                                for (const b of allBookings) {
                                  if (b.status !== 'checked-in') s.add(b.tokenNumber);
                                }
                                return s;
                              } else {
                                return new Set();
                              }
                            });
                          }}
                          title="Select all not-checked-in rows"
                        />
                      </th>
                      <th className="py-2 pr-4">Token</th>
                      <th className="py-2 pr-4">Name</th>
                      <th className="py-2 pr-4">People</th>
                      <th className="py-2 pr-4">Date</th>
                      <th className="py-2 pr-4">Status</th>
                      <th className="py-2 pr-4"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {allBookings.map((b) => {
                      const checked = selectedTokensAll.has(b.tokenNumber);
                      const disabled = b.status === 'checked-in';
                      return (
                        <tr key={`${b.id}-${b.tokenNumber}`} className="border-b hover:bg-gray-50">
                          <td className="py-2 pr-4">
                            <input
                              type="checkbox"
                              disabled={disabled}
                              checked={checked && !disabled}
                              onChange={(e) => {
                                setSelectedTokensAll(prev => {
                                  const s = new Set(prev);
                                  if (e.target.checked) s.add(b.tokenNumber); else s.delete(b.tokenNumber);
                                  return s;
                                });
                              }}
                            />
                          </td>
                          <td className="py-2 pr-4 font-mono">{b.tokenNumber}</td>
                          <td className="py-2 pr-4">{b.name}</td>
                          <td className="py-2 pr-4">{b.numberOfPeople}</td>
                          <td className="py-2 pr-4">{b.bookingDate ? b.bookingDate.toLocaleDateString() : ''}</td>
                          <td className="py-2 pr-4">
                            <span className={`px-2 py-1 rounded text-xs ${b.status === 'checked-in' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                              {b.status}
                            </span>
                          </td>
                          <td className="py-2 pr-4">
                            {b.status !== 'checked-in' && (
                              <button
                                onClick={async () => { await handleCheckInSingle(b.tokenNumber); }}
                                className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700"
                              >
                                Check In
                              </button>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
