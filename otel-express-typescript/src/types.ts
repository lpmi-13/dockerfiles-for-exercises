import { SeverityNumber } from '@opentelemetry/api-logs';

export interface LogAttributes {
    [key: string]: string | number | boolean;
}

export type SeverityTextType =
    | 'TRACE'
    | 'DEBUG'
    | 'INFO'
    | 'WARN'
    | 'ERROR'
    | 'FATAL';

export interface LogRecord {
    severityNumber: SeverityNumber;
    severityText: SeverityTextType;
    body: string;
    attributes: LogAttributes;
    timestamp?: number; // Optional timestamp in milliseconds
}

export interface HttpLogAttributes extends LogAttributes {
    'http.method': string;
    'http.url': string;
    'http.status_code': number;
    'http.user_agent': string;
    'http.request_id': string;
    'http.duration_ms': number;
}

export interface ErrorLogAttributes extends HttpLogAttributes {
    'error.type': string;
    'error.stack': string;
    'error.message': string;
}

export interface CustomLogAttributes extends LogAttributes {
    'custom.attribute': string;
    'route.handler': string;
    [key: `custom.${string}`]: string | number | boolean;
}

// Helper type for creating structured logs with specific attributes
export type StructuredLog<T extends LogAttributes> = Omit<
    LogRecord,
    'attributes'
> & {
    attributes: T;
};

// Common log types
export type HttpLog = StructuredLog<HttpLogAttributes>;
export type ErrorLog = StructuredLog<ErrorLogAttributes>;
export type CustomLog = StructuredLog<CustomLogAttributes>;
