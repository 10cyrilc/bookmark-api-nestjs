const { execSync } = require('child_process');
const dotenv = require('dotenv');
const ENV = process.env.NODE_ENV || 'dev';

dotenv.config({ path: `./environments/.env.${ENV}` });

const command = process.argv.slice(2).join(' ');
execSync(`npx prisma ${command}`, { stdio: 'inherit' });
