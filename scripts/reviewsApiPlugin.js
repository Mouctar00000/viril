import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export function reviewsApiPlugin() {
  const rootDir = path.resolve(__dirname, '..');
  const dataDir = path.resolve(rootDir, 'src/data');
  const reviewsFile = path.resolve(dataDir, 'reviews.json');

  const ensureDb = () => {
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }
    if (!fs.existsSync(reviewsFile)) {
      fs.writeFileSync(reviewsFile, JSON.stringify([], null, 2), 'utf-8');
    }
  };

  const getReviews = () => {
    ensureDb();
    try {
      const content = fs.readFileSync(reviewsFile, 'utf-8');
      const list = JSON.parse(content);
      return Array.isArray(list) ? list : [];
    } catch {
      return [];
    }
  };

  const saveReviews = (list) => {
    ensureDb();
    fs.writeFileSync(reviewsFile, JSON.stringify(list, null, 2), 'utf-8');
  };

  return {
    name: 'viril-reviews-api',
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        const url = req.url?.split('?')[0];

        // 0. POST /api/save-frame (Utility for frame processing)
        if (url === '/api/save-frame' && req.method === 'POST') {
          let body = '';
          req.on('data', (chunk) => { body += chunk; });
          req.on('end', () => {
            try {
              const { filename, data } = JSON.parse(body || '{}');
              const base64Data = data.replace(/^data:image\/\w+;base64,/, '');
              const targetPath = path.resolve(rootDir, 'public/images', filename);
              fs.writeFileSync(targetPath, Buffer.from(base64Data, 'base64'));
              res.setHeader('Content-Type', 'application/json');
              res.statusCode = 200;
              res.end(JSON.stringify({ success: true, path: targetPath }));
            } catch (err) {
              res.statusCode = 500;
              res.end(JSON.stringify({ success: false, error: err.message }));
            }
          });
          return;
        }

        // 1. GET /api/reviews
        if (url === '/api/reviews' && req.method === 'GET') {
          try {
            const list = getReviews();
            // Return only approved reviews for public
            const approved = list.filter((r) => r.status === 'approved');
            res.setHeader('Content-Type', 'application/json');
            res.statusCode = 200;
            res.end(JSON.stringify({ success: true, reviews: approved }));
          } catch (err) {
            res.statusCode = 500;
            res.end(JSON.stringify({ success: false, error: 'Database read error' }));
          }
          return;
        }

        // 2. POST /api/reviews
        if (url === '/api/reviews' && req.method === 'POST') {
          let body = '';
          req.on('data', (chunk) => {
            body += chunk;
          });
          req.on('end', () => {
            try {
              const data = JSON.parse(body || '{}');

              // Anti-spam honeypot
              if (data.website || data.honeypot) {
                res.setHeader('Content-Type', 'application/json');
                res.statusCode = 400;
                res.end(JSON.stringify({ success: false, error: 'Requête non autorisée.' }));
                return;
              }

              // Sanitization & Validation
              const rawName = String(data.name || '').replace(/<[^>]*>?/gm, '').trim();
              const rawComment = String(data.comment || '').replace(/<[^>]*>?/gm, '').trim();
              const rating = Math.round(Number(data.rating));

              if (!rawName || rawName.length < 2 || rawName.length > 70) {
                res.setHeader('Content-Type', 'application/json');
                res.statusCode = 400;
                res.end(JSON.stringify({
                  success: false,
                  error: 'Le nom complet doit comporter entre 2 et 70 caractères.'
                }));
                return;
              }

              if (!rating || rating < 1 || rating > 5) {
                res.setHeader('Content-Type', 'application/json');
                res.statusCode = 400;
                res.end(JSON.stringify({
                  success: false,
                  error: 'Veuillez sélectionner une note de 1 à 5 étoiles.'
                }));
                return;
              }

              if (!rawComment || rawComment.length < 10 || rawComment.length > 1500) {
                res.setHeader('Content-Type', 'application/json');
                res.statusCode = 400;
                res.end(JSON.stringify({
                  success: false,
                  error: "L'avis doit contenir entre 10 et 1500 caractères."
                }));
                return;
              }

              // Check for suspicious spam links
              const linkCount = (rawComment.match(/https?:\/\//gi) || []).length;
              if (linkCount > 1) {
                res.setHeader('Content-Type', 'application/json');
                res.statusCode = 400;
                res.end(JSON.stringify({
                  success: false,
                  error: 'Les liens publicitaires externes ne sont pas autorisés.'
                }));
                return;
              }

              const list = getReviews();
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

              // Persist into JSON database
              list.unshift(newReview);
              saveReviews(list);

              res.setHeader('Content-Type', 'application/json');
              res.statusCode = 201;
              res.end(JSON.stringify({
                success: true,
                message: 'Merci ! Votre avis a été enregistré avec succès et publié sur le site.',
                review: newReview
              }));
            } catch (e) {
              res.setHeader('Content-Type', 'application/json');
              res.statusCode = 500;
              res.end(JSON.stringify({ success: false, error: 'Erreur interne du serveur.' }));
            }
          });
          return;
        }

        next();
      });
    },
    configurePreviewServer(server) {
      // Also enable in preview mode
      this.configureServer(server);
    }
  };
}
