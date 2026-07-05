'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';

// ── Star Icon ──────────────────────────────────────────────────────────────────
function StarIcon({ filled, size = 20 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill={filled ? '#f59e0b' : 'none'}
      stroke={filled ? '#f59e0b' : '#d1d5db'}
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  );
}

// ── Interactive Star Input ─────────────────────────────────────────────────────
function StarInput({ value, onChange }) {
  const [hovered, setHovered] = useState(0);
  const labels = ['', 'Poor', 'Fair', 'Good', 'Very Good', 'Excellent!'];
  const active = hovered || value;

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((s) => (
          <button
            key={s}
            type="button"
            onMouseEnter={() => setHovered(s)}
            onMouseLeave={() => setHovered(0)}
            onClick={() => onChange(s)}
            aria-label={`${s} star`}
            className="p-1 focus:outline-none transition-transform duration-150"
            style={{ transform: (hovered === s || (active >= s && hovered === 0)) ? 'scale(1.2)' : 'scale(1)' }}
          >
            <StarIcon filled={s <= active} size={32} />
          </button>
        ))}
        {active > 0 && (
          <span className="ml-2 text-sm font-semibold text-primary">{labels[active]}</span>
        )}
      </div>
    </div>
  );
}

// ── Display Stars ──────────────────────────────────────────────────────────────
function Stars({ rating, size = 16 }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((s) => (
        <StarIcon key={s} filled={s <= rating} size={size} />
      ))}
    </div>
  );
}

// ── Rating Bar ─────────────────────────────────────────────────────────────────
function RatingBar({ label, count, total }) {
  const pct = total > 0 ? (count / total) * 100 : 0;
  return (
    <div className="flex items-center gap-3">
      <span className="text-xs font-semibold text-gray-500 w-4 text-right flex-shrink-0">{label}</span>
      <StarIcon filled size={12} />
      <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
        <div
          className="h-full rounded-full bg-gradient-to-r from-amber-400 to-orange-500 transition-all duration-700"
          style={{ width: `${pct}%` }}
        />
      </div>
      <span className="text-xs text-gray-400 w-5 flex-shrink-0">{count}</span>
    </div>
  );
}

// ── Avatar colour map ──────────────────────────────────────────────────────────
const AVATAR_BG = [
  'bg-violet-500', 'bg-sky-500', 'bg-emerald-500',
  'bg-rose-500',   'bg-amber-500', 'bg-pink-500',
];

// ── Review Card ────────────────────────────────────────────────────────────────
function ReviewCard({ review, onImageClick }) {
  const initials = review.name
    .split(' ')
    .map((w) => w[0] || '')
    .join('')
    .slice(0, 2)
    .toUpperCase();

  const bgClass =
    AVATAR_BG[
      review.name.split('').reduce((a, c) => a + c.charCodeAt(0), 0) % AVATAR_BG.length
    ];

  const date = new Date(review.createdAt).toLocaleDateString('en-US', {
    year: 'numeric', month: 'short', day: 'numeric',
  });

  return (
    <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-200 flex flex-col gap-4">
      <div className="flex items-start gap-3">
        {/* Avatar */}
        <div className={`${bgClass} w-11 h-11 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0 shadow-sm`}>
          {initials}
        </div>

        {/* Name + badge */}
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-secondary text-sm truncate">{review.name}</p>
          {review.eventType && (
            <span className="inline-block mt-1 text-xs font-semibold px-2.5 py-0.5 rounded-full bg-orange-50 text-primary border border-orange-200">
              {review.eventType}
            </span>
          )}
        </div>

        {/* Stars + date */}
        <div className="flex flex-col items-end gap-1 flex-shrink-0">
          <Stars rating={review.rating} size={14} />
          <span className="text-xs text-gray-400">{date}</span>
        </div>
      </div>

      <div className="border-t border-gray-50" />

      <p className="text-gray-600 text-sm leading-relaxed whitespace-pre-line break-words">
        &ldquo;{review.review}&rdquo;
      </p>

      {review.imageUrl && (
        <div className="mt-2 relative rounded-xl overflow-hidden cursor-zoom-in border border-gray-100 h-44 bg-gray-50 group/img">
          <img
            src={review.imageUrl}
            alt={`${review.name}'s review attachment`}
            className="w-full h-full object-cover transition-transform duration-300 group-hover/img:scale-105"
            onClick={() => onImageClick(review.imageUrl)}
          />
        </div>
      )}
    </div>
  );
}

// ── Skeleton Loader Card ──────────────────────────────────────────────────────
function ReviewSkeletonCard() {
  return (
    <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm flex flex-col gap-4 animate-pulse">
      <div className="flex items-start gap-3">
        <div className="w-11 h-11 rounded-full bg-gray-200 flex-shrink-0" />
        <div className="flex-1 min-w-0 space-y-2 py-1">
          <div className="h-4 bg-gray-200 rounded w-2/3" />
          <div className="h-3 bg-gray-200 rounded w-1/3" />
        </div>
        <div className="flex flex-col items-end gap-1 flex-shrink-0 space-y-1.5">
          <div className="h-3 bg-gray-200 rounded w-16" />
          <div className="h-2.5 bg-gray-200 rounded w-10" />
        </div>
      </div>
      <div className="border-t border-gray-50 pt-4 space-y-2">
        <div className="h-3 bg-gray-200 rounded" />
        <div className="h-3 bg-gray-200 rounded w-5/6" />
      </div>
    </div>
  );
}

const INPUT =
  'w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-secondary placeholder-gray-400 outline-none focus:border-primary focus:ring-2 focus:ring-orange-100 transition font-sans';

// ── Main Section ───────────────────────────────────────────────────────────────
export default function ReviewSection({ initialReviews = [], initialStats = null, initialHasMore = false }) {
  const [reviews, setReviews]       = useState(initialReviews);
  const [stats, setStats]           = useState(initialStats);
  const [loading, setLoading]       = useState(initialReviews.length === 0);
  const [showForm, setShowForm]     = useState(false);
  const [submitted, setSubmitted]   = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError]           = useState('');

  // Image Upload states
  const [uploading, setUploading]   = useState(false);
  const [imagePreview, setImagePreview] = useState('');
  const fileInputRef = useRef(null);

  // Lightbox Modal state
  const [lightboxImage, setLightboxImage] = useState(null);

  // Pagination states
  const [page, setPage]             = useState(1);
  const [hasMore, setHasMore]       = useState(initialHasMore);
  const [loadingMore, setLoadingMore] = useState(false);

  const [form, setForm] = useState({ name: '', email: '', rating: 0, review: '', eventType: '', imageUrl: '' });
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const fetchReviews = (pageNum, isNewSubmit = false) => {
    if (pageNum === 1 && !isNewSubmit) {
      setLoading(true);
    } else if (pageNum > 1) {
      setLoadingMore(true);
    }

    fetch(`/api/reviews?page=${pageNum}&limit=9`)
      .then((r) => r.json())
      .then((d) => {
        if (d.success) {
          if (pageNum === 1) {
            setReviews(d.reviews);
          } else {
            setReviews((prev) => [...prev, ...d.reviews]);
          }
          setStats(d.stats);
          setHasMore(d.pagination.hasMore);
        }
      })
      .catch(() => {})
      .finally(() => {
        setLoading(false);
        setLoadingMore(false);
      });
  };

  useEffect(() => {
    if (initialReviews.length > 0 && page === 1 && !submitted) {
      setLoading(false);
      return;
    }
    setPage(1);
    fetchReviews(1, submitted);
  }, [submitted]);

  const loadNextPage = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchReviews(nextPage);
  };

  // Image selection and upload handler
  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('Image file is too large. Max size is 5MB.');
      return;
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('Only image files are allowed.');
      return;
    }

    setUploading(true);
    setError('');

    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (data.success && data.imageUrl) {
        setForm((f) => ({ ...f, imageUrl: data.imageUrl }));
        setImagePreview(data.imageUrl);
      } else {
        setError(data.error || 'Failed to upload image. Please try again.');
      }
    } catch {
      setError('Network error during image upload.');
    } finally {
      setUploading(false);
    }
  };

  const removeSelectedImage = () => {
    setForm((f) => ({ ...f, imageUrl: '' }));
    setImagePreview('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!form.rating)                  { setError('Please choose a star rating.'); return; }
    if (!form.name.trim())             { setError('Please enter your name.'); return; }
    if (form.review.trim().length < 10){ setError('Write at least 10 characters.'); return; }
    if (uploading)                     { setError('Please wait for the image upload to complete.'); return; }

    setSubmitting(true);
    try {
      const res  = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (data.success) {
        setSubmitted(true);
        setShowForm(false);
        setImagePreview('');
        setForm({ name: '', email: '', rating: 0, review: '', eventType: '', imageUrl: '' });
      } else {
        setError(data.error || 'Something went wrong. Please try again.');
      }
    } catch {
      setError('Network error. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section id="reviews" className="section-padding bg-white">
      <div className="container">

        {/* ── Header ─────────────────────────────────────────────────── */}
        <div className="text-center mb-12">
          <p className="text-sm uppercase tracking-[0.3em] text-secondary mb-3">Customer Reviews</p>
          <h2 className="text-4xl md:text-5xl font-serif font-bold text-primary mb-4">
            What Our Customers Say
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Real experiences from real families. We are proud of every plate we serve.
          </p>
        </div>

        {/* ── Write a Review CTA + Form (TOP) ─────────────────────────── */}
        {!showForm && (
          <div className="text-center mb-10">
            {submitted && (
              <div className="flex items-center justify-center gap-2 bg-green-50 border border-green-200 rounded-xl px-5 py-3 mb-5 max-w-xl mx-auto">
                <span className="text-green-500 text-base">✓</span>
                <p className="text-green-800 text-sm font-semibold">Your review is live — thank you! 🎉</p>
              </div>
            )}
            <button
              onClick={() => { setShowForm(true); setSubmitted(false); }}
              className="inline-flex items-center gap-2 bg-primary hover:bg-orange-700 text-white font-bold text-base px-8 py-3.5 rounded-full shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-200"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931z" />
              </svg>
              Write a Review
            </button>
          </div>
        )}

        {showForm && (
          <div className="mx-auto max-w-2xl border border-gray-100 rounded-2xl shadow-md bg-white p-6 sm:p-8 mb-10" style={{ animation: 'slideUp 0.3s ease' }}>
            <style>{`
              @keyframes slideUp {
                from { opacity: 0; transform: translateY(16px); }
                to   { opacity: 1; transform: translateY(0); }
              }
            `}</style>

            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-serif font-bold text-secondary">Share Your Experience 🙏</h3>
              <button
                onClick={() => setShowForm(false)}
                aria-label="Close"
                className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-500 text-xl flex items-center justify-center transition-colors"
              >
                ×
              </button>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              <div>
                <label className="block text-sm font-semibold text-secondary mb-2">
                  Your Rating <span className="text-red-500">*</span>
                </label>
                <StarInput value={form.rating} onChange={(v) => setForm((f) => ({ ...f, rating: v }))} />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-secondary mb-1.5">
                    Your Name <span className="text-red-500">*</span>
                  </label>
                  <input type="text" className={INPUT} placeholder="Your full name" value={form.name} onChange={set('name')} maxLength={60} />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-secondary mb-1.5">
                    Email <span className="text-xs font-normal text-gray-400">(optional)</span>
                  </label>
                  <input type="email" className={INPUT} placeholder="your@email.com" value={form.email} onChange={set('email')} />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-secondary mb-1.5">
                  Occasion <span className="text-xs font-normal text-gray-400">(optional)</span>
                </label>
                <select className={INPUT} value={form.eventType} onChange={set('eventType')}>
                  <option value="">Select occasion…</option>
                  {['Wedding','Baby Shower','Birthday','Corporate','Pooja / Religious','Tiffin Service','Other'].map((o) => (
                    <option key={o} value={o}>{o}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-secondary mb-1.5">
                  Your Review <span className="text-red-500">*</span>
                </label>
                <textarea
                  className={`${INPUT} resize-y`}
                  placeholder="Tell us about your experience — the food, service, presentation…"
                  rows={5}
                  value={form.review}
                  onChange={set('review')}
                  maxLength={800}
                />
                <p className="text-xs text-gray-400 text-right mt-1">{form.review.length}/800</p>
              </div>

              {/* Image Upload Input */}
              <div className="flex flex-col gap-2">
                <label className="block text-sm font-semibold text-secondary">
                  Add Photo <span className="text-xs font-normal text-gray-400">(optional, max 5MB)</span>
                </label>
                
                {!imagePreview ? (
                  <div 
                    onClick={() => fileInputRef.current?.click()}
                    className="border-2 border-dashed border-gray-200 hover:border-primary rounded-xl p-6 flex flex-col items-center justify-center gap-2 cursor-pointer transition bg-gray-50/50 hover:bg-orange-50/10"
                  >
                    <svg className="w-8 h-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0zM18.75 10.5h.008v.008h-.008V10.5z" />
                    </svg>
                    <span className="text-sm font-semibold text-gray-500">
                      {uploading ? 'Uploading your photo...' : 'Click to upload a photo'}
                    </span>
                    <input 
                      type="file" 
                      ref={fileInputRef}
                      onChange={handleImageChange}
                      accept="image/*"
                      className="hidden"
                      disabled={uploading}
                    />
                  </div>
                ) : (
                  <div className="relative rounded-xl overflow-hidden border border-gray-100 h-40 bg-gray-50 flex items-center justify-center">
                    <img 
                      src={imagePreview} 
                      alt="Review preview" 
                      className="w-full h-full object-cover"
                    />
                    <button 
                      type="button"
                      onClick={removeSelectedImage}
                      className="absolute top-2 right-2 bg-red-600/90 text-white rounded-full p-1.5 shadow-md hover:bg-red-700 transition"
                      aria-label="Remove image"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                )}
              </div>

              {error && (
                <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl px-4 py-3">
                  <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z" clipRule="evenodd" />
                  </svg>
                  {error}
                </div>
              )}

              <div className="flex gap-3 justify-end pt-1">
                <button type="button" onClick={() => setShowForm(false)} className="px-5 py-2.5 rounded-xl border border-gray-200 text-gray-600 text-sm font-semibold hover:bg-gray-50 transition-colors">
                  Cancel
                </button>
                <button type="submit" disabled={submitting || uploading} className="px-6 py-2.5 rounded-xl bg-primary hover:bg-orange-700 disabled:bg-gray-300 text-white text-sm font-bold shadow-md hover:shadow-lg disabled:shadow-none disabled:cursor-not-allowed transition-all duration-200">
                  {submitting ? 'Submitting…' : 'Submit Review'}
                </button>
              </div>
            </form>
          </div>
        )}

        {stats && stats.total > 0 && (
          <div className="mx-auto max-w-2xl bg-light/60 border border-gray-100 rounded-2xl shadow-sm p-6 sm:p-8 mb-10 flex flex-col sm:flex-row gap-8 items-center">
            {/* Big average */}
            <div className="text-center flex-shrink-0">
              <p className="text-6xl font-black text-secondary leading-none">{stats.avgRating.toFixed(1)}</p>
              <div className="flex justify-center mt-2">
                <Stars rating={Math.round(stats.avgRating)} size={20} />
              </div>
              <p className="text-sm text-gray-400 mt-2">
                {stats.total} review{stats.total !== 1 ? 's' : ''}
              </p>
            </div>

            {/* Breakdown bars */}
            <div className="flex-1 w-full flex flex-col gap-2.5">
              <RatingBar label="5" count={stats.five}  total={stats.total} />
              <RatingBar label="4" count={stats.four}  total={stats.total} />
              <RatingBar label="3" count={stats.three} total={stats.total} />
              <RatingBar label="2" count={stats.two}   total={stats.total} />
              <RatingBar label="1" count={stats.one}   total={stats.total} />
            </div>
          </div>
        )}

        {/* ── Review Cards ─────────────────────────────────────────────── */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-10">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <ReviewSkeletonCard key={i} />
            ))}
          </div>
        ) : reviews.length === 0 ? (
          <div className="text-center py-16 bg-light/60 border border-gray-100 rounded-2xl shadow-sm mb-10">
            <div className="text-5xl mb-4">🌟</div>
            <p className="text-gray-500 text-base font-medium">
              No reviews yet — be the first to share your experience!
            </p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-10">
              {reviews.map((r) => (
                <ReviewCard 
                  key={r._id} 
                  review={r} 
                  onImageClick={(url) => setLightboxImage(url)} 
                />
              ))}
            </div>

            {/* Pulsing loaders for Load More actions */}
            {loadingMore && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-10">
                {[1, 2, 3].map((i) => (
                  <ReviewSkeletonCard key={i} />
                ))}
              </div>
            )}

            {/* Load More Button */}
            {hasMore && !loadingMore && (
              <div className="text-center mb-10">
                <button
                  type="button"
                  onClick={loadNextPage}
                  className="inline-flex items-center gap-2 border border-gray-200 hover:border-primary hover:text-primary text-gray-600 font-semibold text-sm px-6 py-2.5 rounded-full transition-all duration-200 bg-white shadow-sm"
                >
                  Load More Reviews
                  <svg className="w-4 h-4 animate-bounce" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                  </svg>
                </button>
              </div>
            )}
          </>
        )}

      </div>

      {/* ── Lightbox Image Modal ─────────────────────────────────────── */}
      {lightboxImage && (
        <div 
          onClick={() => setLightboxImage(null)}
          className="fixed inset-0 bg-black/85 backdrop-blur-sm z-[9999] flex items-center justify-center p-4 cursor-zoom-out animate-fadeIn"
        >
          <style>{`
            @keyframes fadeIn {
              from { opacity: 0; }
              to { opacity: 1; }
            }
          `}</style>
          <div className="relative max-w-4xl max-h-[85vh] overflow-hidden rounded-xl border border-white/10 shadow-2xl">
            <img 
              src={lightboxImage} 
              alt="Review attachment zoomed" 
              className="w-full h-full max-h-[85vh] object-contain"
            />
            <button 
              onClick={() => setLightboxImage(null)}
              className="absolute top-4 right-4 bg-black/40 hover:bg-black/60 text-white rounded-full p-2 flex items-center justify-center transition border border-white/10"
              aria-label="Close lightbox"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      )}

    </section>
  );
}
