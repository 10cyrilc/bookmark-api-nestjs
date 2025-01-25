const { execSync } = require('child_process');
const dotenv = require('dotenv');

const ENV = process.env.NODE_ENV || 'dev';

dotenv.config({ path: `./environments/.env.${ENV}` });

console.log(`Starting Prisma Studio for environment: ${ENV}`);

try {
  execSync(`npx prisma studio`, { stdio: 'inherit' });
} catch (error) {
  console.error('Failed to start Prisma Studio:', error.message);
  process.exit(1);
}
