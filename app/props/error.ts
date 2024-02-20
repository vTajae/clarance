export class Error {
    message!: string;
    stack!: string;
}

export class ErrorInformation {
    componentStack!: string;
}

export class ErrorState {
    hasError: boolean;
    message: string;
    stack: string;

    constructor(hasError: boolean, message: string, stack: string) {
        this.hasError = hasError;
        this.message = message;
        this.stack = stack;
    }
}
