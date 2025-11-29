export class AppError extends Error {
  constructor(
    message: string,
    public readonly code: string,
    public readonly cause?: Error,
  ) {
    super(message);
    this.name = "AppError";
  }
}

export class ConfigurationError extends AppError {
  constructor(message: string, cause?: Error) {
    super(message, "CONFIG_ERROR", cause);
  }
}

export class AudioExtractionError extends AppError {
  constructor(message: string, cause?: Error) {
    super(message, "AUDIO_ERROR", cause);
  }
}

export class TranscriptionError extends AppError {
  constructor(message: string, cause?: Error) {
    super(message, "TRANSCRIPTION_ERROR", cause);
  }
}

export class SummarizationError extends AppError {
  constructor(message: string, cause?: Error) {
    super(message, "SUMMARIZATION_ERROR", cause);
  }
}

export class ValidationError extends AppError {
  constructor(message: string, cause?: Error) {
    super(message, "VALIDATION_ERROR", cause);
  }
}

type ErrorCtor<T extends AppError> = new (message: string, cause?: Error) => T;

export function wrapError<T extends AppError>(
  error: unknown,
  Ctor: ErrorCtor<T>,
): T {
  if (error instanceof AppError) return error as T;
  const cause = error instanceof Error ? error : new Error(String(error));
  return new Ctor(cause.message, cause);
}
