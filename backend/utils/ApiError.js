class ApiError extends Error {
    constructor(
        statusCode,
        message,
        error = [],
        stack =""
    ){
        super(message)
        this.statusCode = statusCode
        this.error = error
        this.message = message
        if(stack){
            this.stack = stack
        }else {
            Error.captureStackTrace(this,this.constructor)
        }
    }
}

export {ApiError}