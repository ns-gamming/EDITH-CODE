interface ConsoleError {
  type: 'error' | 'warning';
  message: string;
  stack?: string;
  timestamp: number;
  file?: string;
  line?: number;
  column?: number;
}

class ErrorDetector {
  private errors: ConsoleError[] = [];
  private errorCallback?: (error: ConsoleError) => void;
  private originalConsoleError: typeof console.error;
  private originalConsoleWarn: typeof console.warn;

  constructor() {
    this.originalConsoleError = console.error.bind(console);
    this.originalConsoleWarn = console.warn.bind(console);
    this.interceptConsole();
  }

  private interceptConsole() {
    console.error = (...args: any[]) => {
      this.originalConsoleError(...args);
      this.captureError('error', args);
    };

    console.warn = (...args: any[]) => {
      this.originalConsoleWarn(...args);
      this.captureError('warning', args);
    };
  }

  private captureError(type: 'error' | 'warning', args: any[]) {
    const message = args.map(arg => 
      typeof arg === 'object' ? JSON.stringify(arg) : String(arg)
    ).join(' ');

    const error: ConsoleError = {
      type,
      message,
      timestamp: Date.now(),
    };

    const stackMatch = message.match(/at (.+):(\d+):(\d+)/);
    if (stackMatch) {
      error.file = stackMatch[1];
      error.line = parseInt(stackMatch[2]);
      error.column = parseInt(stackMatch[3]);
    }

    this.errors.push(error);

    if (this.errorCallback) {
      this.errorCallback(error);
    }
  }

  public onError(callback: (error: ConsoleError) => void) {
    this.errorCallback = callback;
  }

  public getErrors(): ConsoleError[] {
    return [...this.errors];
  }

  public clearErrors() {
    this.errors = [];
  }

  public getLatestError(): ConsoleError | null {
    return this.errors.length > 0 ? this.errors[this.errors.length - 1] : null;
  }

  public analyzeError(error: ConsoleError): {
    category: string;
    suggestion: string;
    autoFixable: boolean;
    fix?: string;
  } {
    const msg = error.message.toLowerCase();

    if (msg.includes('is not a function')) {
      return {
        category: 'Type Error',
        suggestion: 'Check if the function exists and is properly imported',
        autoFixable: true,
        fix: 'Verify function imports and ensure the function is defined before calling it',
      };
    }

    if (msg.includes('cannot read') || msg.includes('undefined')) {
      return {
        category: 'Null Reference',
        suggestion: 'Add null/undefined checks before accessing properties',
        autoFixable: true,
        fix: 'Use optional chaining (?.) or add conditional checks',
      };
    }

    if (msg.includes('module') || msg.includes('import')) {
      return {
        category: 'Import Error',
        suggestion: 'Check if the module is installed and the import path is correct',
        autoFixable: true,
        fix: 'Verify package.json and import statements',
      };
    }

    if (msg.includes('syntax')) {
      return {
        category: 'Syntax Error',
        suggestion: 'Review the code for syntax errors',
        autoFixable: false,
      };
    }

    if (msg.includes('network') || msg.includes('fetch')) {
      return {
        category: 'Network Error',
        suggestion: 'Check network connection and API endpoints',
        autoFixable: false,
      };
    }

    return {
      category: 'Unknown Error',
      suggestion: 'Review the error message and stack trace',
      autoFixable: false,
    };
  }

  public generateFixPrompt(error: ConsoleError): string {
    const analysis = this.analyzeError(error);
    
    return `Error detected: ${error.message}

Category: ${analysis.category}
Type: ${error.type}
${error.file ? `File: ${error.file}:${error.line}:${error.column}` : ''}

Analysis: ${analysis.suggestion}
${analysis.fix ? `Fix: ${analysis.fix}` : ''}

Please analyze this error and provide a fix. If this is auto-fixable, generate the corrected code.`;
  }

  public destroy() {
    console.error = this.originalConsoleError;
    console.warn = this.originalConsoleWarn;
  }
}

export const errorDetector = new ErrorDetector();
export type { ConsoleError };
