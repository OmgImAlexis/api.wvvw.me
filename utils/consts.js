// @TODO: Replace with real i18n funciton
const __ = str => {
    return str;
};

const USER = {
    NOT_FOUND: {
        status: 404,
        message: __(`No user was found.`)
    },
    CREATED: {
        SUCCESS: {
            status: 201,
            message: __(`User created successfully.`)
        },
        FAILURE: {
            DUPLICATE: {
                status: 503,
                message: __(`Please choose another username.`)
            },
            DISABLED: {
                status: 503,
                message: __(`Signups currently disabled.`)
            }
        }
    },
    INVALID_DETAILS: {
        status: 401,
        message: __(`Either no user was found or you suppplied an incorrect user/pass.`)
    }
};

const POST = {
    NOT_FOUND: {
        status: 404,
        message: __(`No post was found.`)
    },
    CREATED: {
        SUCCESS: {
            status: 201,
            message: __(`Post created successfully.`)
        }
    },
    INVALID_DETAILS: {
        status: 422,
        message: __(`Invalid ObjectId.`)
    }
};

const TOKEN = {
    NOT_FOUND: {
        status: 404,
        message: __(`No token was found.`)
    },
    CREATED: {
        SUCCESS: {
            status: 201,
            message: __(`Token created successfully.`)
        }
    },
    INVALID_DETAILS: {
        status: 401,
        message: __(`Either no user was found or you suppplied an incorrect user/pass.`)
    }
};

export {
    USER,
    POST,
    TOKEN
};
