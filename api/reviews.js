// Vercel Serverless Function: /api/reviews
import initialReviews from '../src/data/reviews.json' with { type: 'json' };

// In-memory cache for serverless invocation lifecycle
let reviewsStore = [...initialReviews];

export default async function handler(req, res) {
  res.setHeader('Content-Type', 'application/json');

  // GET /api/reviews
  if (req.method === 'GET') {
    const approved = reviewsStore.filter((r) => r.status === 'approved');
    return res.status(200).json({ success: true, reviews: approved });
  }

  // POST /api/reviews
  if (req.method === 'POST') {
    try {
      const data = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : (req.body || {});

      // Anti-spam bot check
      if (data.website || data.honeypot) {
        return res.status(400).json({ success: false, error: 'Requête non autorisée.' });
      }

      const rawName = String(data.name || '').replace(/<[^>]*>?/gm, '').trim();
      const rawComment = String(data.comment || '').replace(/<[^>]*>?/gm, '').trim();
      const rating = Math.round(Number(data.rating));

      if (!rawName || rawName.length < 2 || rawName.length > 70) {
        return res.status(400).json({
          success: false,
          error: 'Le nom complet doit comporter entre 2 et 70 caractères.'
        });
      }

      if (!rating || rating < 1 || rating > 5) {
        return res.status(400).json({
          success: false,
          error: 'Veuillez sélectionner une note de 1 à 5 étoiles.'
        });
      }

      if (!rawComment || rawComment.length < 10 || rawComment.length > 1500) {
        return res.status(400).json({
          success: false,
          error: "L'avis doit contenir entre 10 et 1500 caractères."
        });
      }

      const now = new Date();
      const formattedDate = new Intl.DateTimeFormat('fr-FR', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      }).format(now);

      const newReview = {
        id: `rev-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
        name: rawName,
        rating,
        comment: rawComment,
        date: formattedDate,
        createdAt: now.toISOString(),
        status: 'approved',
        verifiedCustomer: true
      };

      reviewsStore.unshift(newReview);

      return res.status(201).json({
        success: true,
        message: 'Merci ! Votre avis a été enregistré avec succès.',
        review: newReview
      });
    } catch {
      return res.status(500).json({ success: false, error: 'Erreur lors du traitement de votre avis.' });
    }
  }

  return res.status(405).json({ error: 'Méthode non autorisée.' });
}
