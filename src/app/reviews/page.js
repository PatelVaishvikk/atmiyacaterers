// src/app/reviews/page.js
import ReviewSection from '@/components/ReviewSection';
import { getDb } from '@/lib/mongodb';

export const metadata = {
  title: 'Customer Reviews | Atmiya Caterers',
  description:
    "Read genuine reviews from our happy customers. See what families across Windsor and Detroit say about Atmiya Caterers' food and service.",
};

// Force dynamic rendering so server checks live DB on page loads
export const dynamic = 'force-dynamic';

async function getInitialReviewsData() {
  try {
    const db = await getDb();
    
    // Fetch initial 9 reviews in parallel with stats
    const [reviews, stats, totalCount] = await Promise.all([
      db.collection('reviews')
        .find({ approved: true })
        .sort({ createdAt: -1 })
        .limit(9)
        .toArray(),
      db.collection('reviews').aggregate([
        { $match: { approved: true } },
        {
          $group: {
            _id: null,
            avgRating: { $avg: '$rating' },
            total: { $sum: 1 },
            five:  { $sum: { $cond: [{ $eq: ['$rating', 5] }, 1, 0] } },
            four:  { $sum: { $cond: [{ $eq: ['$rating', 4] }, 1, 0] } },
            three: { $sum: { $cond: [{ $eq: ['$rating', 3] }, 1, 0] } },
            two:   { $sum: { $cond: [{ $eq: ['$rating', 2] }, 1, 0] } },
            one:   { $sum: { $cond: [{ $eq: ['$rating', 1] }, 1, 0] } },
          },
        },
      ]).toArray(),
      db.collection('reviews').countDocuments({ approved: true })
    ]);

    // Format MongoDB objects for client consumption (avoid serialisation issues)
    const formattedReviews = reviews.map(r => ({
      ...r,
      _id: r._id.toString(),
      createdAt: r.createdAt.toISOString()
    }));

    const statsObj = stats[0] || { avgRating: 0, total: 0, five: 0, four: 0, three: 0, two: 0, one: 0 };

    return {
      reviews: formattedReviews,
      stats: statsObj,
      hasMore: formattedReviews.length < totalCount
    };
  } catch (e) {
    console.error("Failed to load reviews on server side:", e);
    return { reviews: [], stats: null, hasMore: false };
  }
}

export default async function ReviewsPage() {
  const initialData = await getInitialReviewsData();

  return (
    <main>
      <ReviewSection 
        initialReviews={initialData.reviews} 
        initialStats={initialData.stats} 
        initialHasMore={initialData.hasMore}
      />
    </main>
  );
}
