const fs = require('fs');
const path = require('path');
const chalk = require('chalk');

const logDir = path.join(__dirname, '../logs');
const logFile = path.join(logDir, 'app.log');

// Ensure logs directory exists
if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir, { recursive: true });
}

function getTimestamp() {
    return new Date().toISOString();
}

function writeLog(level, message) {
    const logEntry = `[${getTimestamp()}] [${level.toUpperCase()}]: ${message}\n`;
    // Write to console
    if (level === 'error') {
        console.error(logEntry.trim());
    } else {
        console.log(logEntry.trim());
    }
    // Append to log file
    fs.appendFileSync(logFile, logEntry, { encoding: 'utf8' });
}

const logger = {
    info: (message) => writeLog('info', message),
    error: (message) => writeLog('error', message),
    warn: (message) => writeLog('warn', message),
    debug: (message) => writeLog('debug', message),
    log: (message) => writeLog('log', message),
};

module.exports = logger;
