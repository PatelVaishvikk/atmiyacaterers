// src/app/reviews/page.js
import ReviewSection from '@/components/ReviewSection';

export const metadata = {
  title: 'Customer Reviews | Atmiya Caterers',
  description:
    "Read genuine reviews from our happy customers. See what families across Windsor and Detroit say about Atmiya Caterers' food and service.",
};

export default function ReviewsPage() {
  return (
    <main>
      <ReviewSection />
    </main>
  );
}
