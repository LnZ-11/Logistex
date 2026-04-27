import { defineConfig } from '@prisma/config';
import * as dotenv from 'dotenv';
dotenv.config();

const url = process.env.DATABASE_URL;
if (!url) throw new Error('DATABASE_URL is not set');

export default defineConfig({
    migrations: {
        seed: './prisma/seed.ts',
    },
    datasource: {
        url,
    },
});