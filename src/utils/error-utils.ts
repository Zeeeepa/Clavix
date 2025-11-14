/**
 * Error handling utilities with proper type guards
 */

/**
 * Type guard to check if value is an Error instance
 */
export function isError(error: unknown): error is Error {
  return error instanceof Error;
}

/**
 * Safely extract error message from unknown error
 * @param error - Unknown error value
 * @returns Error message string
 */
export function getErrorMessage(error: unknown): string {
  if (isError(error)) {
    return error.message;
  }

  if (typeof error === 'string') {
    return error;
  }

  if (error && typeof error === 'object' && 'message' in error) {
    const message = (error as { message: unknown }).message;
    if (typeof message === 'string') {
      return message;
    }
  }

  return 'An unknown error occurred';
}

/**
 * Safely extract error stack trace from unknown error
 * @param error - Unknown error value
 * @returns Stack trace string or undefined
 */
export function getErrorStack(error: unknown): string | undefined {
  if (isError(error)) {
    return error.stack;
  }
  return undefined;
}

/**
 * Convert unknown error to Error instance
 * Useful when you need to throw or rethrow with proper type
 */
export function toError(error: unknown): Error {
  if (isError(error)) {
    return error;
  }

  if (typeof error === 'string') {
    return new Error(error);
  }

  if (error && typeof error === 'object' && 'message' in error) {
    const message = (error as { message: unknown }).message;
    if (typeof message === 'string') {
      return new Error(message);
    }
  }

  return new Error('An unknown error occurred');
}

/**
 * Interface for NodeJS errors with code property
 */
interface NodeJSError extends Error {
  code: string;
}

/**
 * Type guard to check if error is a NodeJS error with code property
 */
export function isNodeError(error: unknown): error is NodeJSError {
  return (
    isError(error) &&
    'code' in error &&
    typeof (error as { code: unknown }).code === 'string'
  );
}
