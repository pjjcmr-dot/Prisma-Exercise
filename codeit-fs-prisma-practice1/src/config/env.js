// src/config/env.js
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: join(__dirname, '../../env/.env.development') });

console.log('🔍 DATABASE_URL:', process.env.DATABASE_URL);
console.log('🔍 PORT:', process.env.PORT);

