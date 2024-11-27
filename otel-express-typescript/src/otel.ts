import {
    LoggerProvider,
    SimpleLogRecordProcessor,
} from '@opentelemetry/sdk-logs';
import { OTLPLogExporter } from '@opentelemetry/exporter-logs-otlp-grpc';
import { Resource } from '@opentelemetry/resources';
import { logs } from '@opentelemetry/api-logs';
import { LogRecord } from './types';

class TypedLogger {
    private logger: ReturnType<LoggerProvider['getLogger']>;

    constructor(logger: ReturnType<LoggerProvider['getLogger']>) {
        this.logger = logger;
    }

    emit(record: LogRecord): void {
        this.logger.emit(record);
    }
}

// Initialize the LoggerProvider
const loggerProvider = new LoggerProvider({
    resource: new Resource({
        'service.name': process.env.OTEL_SERVICE_NAME || 'express-app',
        'service.version': '1.0.0',
    }),
});

// Add the OTLP exporter
loggerProvider.addLogRecordProcessor(
    new SimpleLogRecordProcessor(
        new OTLPLogExporter({
            url: process.env.OTEL_EXPORTER_OTLP_ENDPOINT,
        })
    )
);

// Set the LoggerProvider to be the global provider
logs.setGlobalLoggerProvider(loggerProvider);

// Create a typed logger instance
const logger = new TypedLogger(loggerProvider.getLogger('express-app-logger'));

export { logger };
