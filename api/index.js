import app from '../backend/app.js';
import connectDb from '../backend/config/db.js';

// Pre-connect database for serverless invocations
connectDb().catch((err) => console.warn('Serverless DB connect error:', err?.message));

export default app;
