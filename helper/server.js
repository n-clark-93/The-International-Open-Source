import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';
import dotenv from 'dotenv';
import minimist from 'minimist';
import fs from 'fs';

dotenv.config();

const argv = minimist(process.argv.slice(2));

// Polyfill for __dirname in ES module
const __dirname = dirname(fileURLToPath(import.meta.url));

// Verify that environment variables are loaded
console.log("Steam API Key:", process.env.STEAM_API_KEY);

function getPorts() {
    const runnerName = process.env.ACTIONS_RUNNER_NAME || 'local - 21025';
    const basePort = runnerName.split(' - ')[1] || 21025;
    const baseServerPort = 21025;
    const baseCliPort = 22025;
    const baseGrafanaPort = 3000;
    const baseRelayPort = 2003;
    const additionalPort = basePort - baseServerPort;

    const serverPort = baseServerPort + additionalPort;
    const cliPort = baseCliPort + additionalPort;
    const grafanaPort = baseGrafanaPort + additionalPort;
    const relayPort = baseRelayPort + additionalPort;
    if (!runnerName.includes('local')) console.log(`Runner name: ${runnerName}, base port: ${basePort}`);
    return { serverPort, cliPort, grafanaPort, relayPort };
}

const ports = getPorts();

const options = { stdio: 'inherit' };
const botPath = join(__dirname, '../dist');
console.log('START');

const cmdString = `npx screeps-performance-server --maxTickCount=${argv.maxTicks || 20000} --maxBots=10 --botFilePath=${botPath} --steamKey=${process.env.STEAM_API_KEY} --serverPort=${ports.serverPort} --cliPort=${ports.cliPort} --force ${argv.debug ? '--debug' : ''} --deleteLogs --tickDuration=${argv.tickDuration || 250} --logFilter='Error:'`;

try {
    execSync(cmdString, options);
} catch (error) {
    console.error('Error executing screeps-performance-server:', error);
    process.exit(1); // Exit with an error code
}

console.log('END');
