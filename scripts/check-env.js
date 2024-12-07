import { existsSync, copyFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const rootDir = join(__dirname, '..');

const envFile = join(rootDir, '.env');
const envExampleFile = join(rootDir, '.env.example');

if (!existsSync(envFile) && existsSync(envExampleFile)) {
    console.log('Creating .env file from .env.example...');
    copyFileSync(envExampleFile, envFile);
    console.log('.env file created successfully!');
}
