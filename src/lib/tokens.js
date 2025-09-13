// src/lib/tokens.js

function randomLetter() {
  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  return letters[Math.floor(Math.random() * letters.length)];
}

/**
 * Generate an A123-style token (1 letter + 3 digits).
 * Ensures uniqueness PER DAY (UTC) for the given bookingDate.
 */
export async function generateUniqueToken(db, bookingDate, maxAttempts = 30) {
  const start = new Date(bookingDate);
  start.setUTCHours(0, 0, 0, 0);
  const end = new Date(bookingDate);
  end.setUTCHours(23, 59, 59, 999);

  for (let i = 0; i < maxAttempts; i++) {
    const letter = randomLetter();
    const num = Math.floor(100 + Math.random() * 900); // 100–999
    const token = `${letter}${num}`;

    const exists = await db.collection('bookings').findOne(
      { bookingDate: { $gte: start, $lte: end }, tokenNumber: token },
      { projection: { _id: 1 } }
    );

    if (!exists) return token;
  }
  throw new Error('Could not generate unique short token');
}
