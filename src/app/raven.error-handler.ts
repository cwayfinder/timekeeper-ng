import * as Raven from 'raven-js';
import { ErrorHandler } from '@angular/core';

Raven
  .config('https://6a367814627e42b0a84795143f2b7482@sentry.io/217665')
  .install();

export class RavenErrorHandler implements ErrorHandler {
  handleError(err: any): void {
    Raven.captureException(err);
  }
}
