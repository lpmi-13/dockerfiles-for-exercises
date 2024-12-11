// app.ts
import express, {
    Request,
    Response,
    NextFunction,
    ErrorRequestHandler,
} from 'express';
import { SeverityNumber } from '@opentelemetry/api-logs';
import { logger } from './otel';
import { LogAttributes } from './types';
import { Server } from 'http';

interface ErrorWithStack extends Error {
    stack?: string;
}

const app = express();
let server:Server;

// Custom request interface to handle request timing
interface TimedRequest extends Request {
    startTime?: number;
}

// Logging middleware
app.use((req: TimedRequest, res: Response, next: NextFunction) => {
    req.startTime = Date.now();

    const requestAttributes: LogAttributes = {
        'http.method': req.method,
        'http.url': req.url,
        'http.user_agent': req.get('user-agent') || 'unknown',
        'http.request_id': req.get('x-request-id') || 'unknown',
    };

    logger.emit({
        severityNumber: SeverityNumber.INFO,
        severityText: 'INFO',
        body: 'Incoming request',
        attributes: requestAttributes,
    });

    // Capture response using response event
    res.on('finish', () => {
        const duration = req.startTime ? Date.now() - req.startTime : 0;

        const responseAttributes: LogAttributes = {
            ...requestAttributes,
            'http.status_code': res.statusCode,
            'http.duration_ms': duration,
        };

        logger.emit({
            severityNumber: SeverityNumber.INFO,
            severityText: 'INFO',
            body: 'Request completed',
            attributes: responseAttributes,
        });
    });

    next();
});

// Example route with custom logging
app.get('/', (req: Request, res: Response) => {
    logger.emit({
        severityNumber: SeverityNumber.INFO,
        severityText: 'INFO',
        body: 'Processing root route',
        attributes: {
            'custom.attribute': 'some value',
            'route.handler': 'root',
        },
    });

    res.send('Hello World!');
});

// Error handling middleware with error logging
const errorHandler: ErrorRequestHandler = (
    err: ErrorWithStack,
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const errorAttributes: LogAttributes = {
        'error.type': err.name,
        'error.stack': err.stack || 'No stack trace available',
        'http.method': req.method,
        'http.url': req.url,
    };

    logger.emit({
        severityNumber: SeverityNumber.ERROR,
        severityText: 'ERROR',
        body: err.message,
        attributes: errorAttributes,
    });

    res.status(500).send('Something broke!');
};

app.use(errorHandler);

const PORT = process.env.PORT || 3000;
server = app.listen(PORT, () => {
    logger.emit({
        severityNumber: SeverityNumber.INFO,
        severityText: 'INFO',
        body: `Server is running on port ${PORT}`,
        attributes: {
            'server.port': PORT,
        },
    });
});

// Graceful shutdown on SIGTERM
process.on('SIGINT', () => {
    logger.emit({
        severityNumber: SeverityNumber.INFO,
        severityText: 'INFO',
        body: 'SIGINT received. Shutting down server.',
        attributes: {},
    });

    server.close(() => {
        logger.emit({
            severityNumber: SeverityNumber.INFO,
            severityText: 'INFO',
            body: 'Server closed successfully.',
            attributes: {},
        });
        process.exit(0);
    });

    // Force exit if shutdown takes too long
    setTimeout(() => {
        logger.emit({
            severityNumber: SeverityNumber.ERROR,
            severityText: 'ERROR',
            body: 'Server shutdown timed out. Exiting forcefully.',
            attributes: {},
        });
        process.exit(1);
    }, 3000); // 3 seconds timeout
});

export default app;
