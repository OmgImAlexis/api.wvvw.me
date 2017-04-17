class RestError extends Error {
    constructor(message) {
        super(message.message);
        this.name = 'RestError';
        this.status = message.status;
    }
}

export default RestError;
