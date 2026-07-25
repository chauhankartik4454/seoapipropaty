type LogLevel = 'info' | 'warn' | 'error' | 'debug';

class Logger {
  private formatMessage(level: LogLevel, message: string, context?: Record<string, any>) {
    const logData = {
      timestamp: new Date().toISOString(),
      level,
      message,
      ...(context && { context }),
    };

    if (process.env.NODE_ENV === 'development') {
      const colorMap: Record<LogLevel, string> = {
        info: '\x1b[32m',  // Green
        warn: '\x1b[33m',  // Yellow
        error: '\x1b[31m', // Red
        debug: '\x1b[36m', // Cyan
      };
      const resetColor = '\x1b[0m';
      const color = colorMap[level] || resetColor;

      console.log(
        `[${logData.timestamp}] ${color}${level.toUpperCase()}${resetColor}: ${message} ${
          context ? JSON.stringify(context, null, 2) : ''
        }`
      );
    } else {
      console.log(JSON.stringify(logData));
    }
  }

  info(message: string, context?: Record<string, any>) {
    this.formatMessage('info', message, context);
  }

  warn(message: string, context?: Record<string, any>) {
    this.formatMessage('warn', message, context);
  }

  error(message: string, error?: Error | unknown, context?: Record<string, any>) {
    const errorDetails = error instanceof Error ? {
      name: error.name,
      message: error.message,
      stack: error.stack,
    } : error;

    this.formatMessage('error', message, {
      ...context,
      error: errorDetails,
    });
  }

  debug(message: string, context?: Record<string, any>) {
    if (process.env.NODE_ENV !== 'production') {
      this.formatMessage('debug', message, context);
    }
  }
}

export const logger = new Logger();
export default logger;
