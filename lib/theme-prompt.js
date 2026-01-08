// scripts/theme-dev.js
import { intro, select, outro, isCancel, spinner, confirm } from '@clack/prompts';
import { spawn, exec } from 'child_process';
import { createRequire } from 'module';
import { promisify } from 'util';

const execAsync = promisify(exec);
const require = createRequire(import.meta.url);
const pkg = require('../package.json');
const { dev, prod } = pkg.config;

async function run() {
  console.clear();
  intro(`🛍️  Shopify Theme Development`);

  // Select environment
  const environment = await select({
    message: 'Which environment would you like to work in?',
    options: [
      {
        value: 'dev',
        label: 'Development',
        hint: `Store: ${dev.replace('--store ', '')}`
      },
      {
        value: 'prod',
        label: 'Production',
        hint: `Store: ${prod.replace('--store ', '')}`
      },
    ],
  });

  if (isCancel(environment)) {
    outro('Operation cancelled.');
    process.exit(0);
  }

  const storeConfig = environment === 'prod' ? prod : dev;
  const storeName = storeConfig.replace('--store ', '');

  // Verify authentication
  const s = spinner();
  s.start(`Verifying access to ${storeName}...`);

  try {
    await execAsync(`shopify theme list ${storeConfig}`, { stdio: 'ignore' });
    s.stop(`✅ Access confirmed`);
  } catch (error) {
    s.stop(`❌ Access denied or session expired`);

    const shouldLogin = await confirm({
      message: `Would you like to log in to ${storeName}?`
    });

    if (isCancel(shouldLogin) || !shouldLogin) {
      outro('Cannot proceed without authentication.');
      process.exit(1);
    }

    console.log('');
    await runCommand('shopify', ['auth', 'login', ...storeConfig.split(' ')]);
    console.log('');
  }

  // Start development server
  const envLabel = environment === 'prod' ? 'Production' : 'Development';
  outro(`🚀 Starting ${envLabel} environment...`);

  await runCommand('shopify', ['theme', 'dev', '--path', 'theme', ...storeConfig.split(' ')]);
}

function runCommand(command, args) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, { stdio: 'inherit', shell: true });

    child.on('close', (code) => {
      code === 0 ? resolve() : reject(new Error(`Command failed with code ${code}`));
    });

    child.on('error', reject);
  });
}

run();