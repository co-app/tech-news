"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = void 0;
const logger_1 = require("../common/utils/logger");
const handler = async (e) => {
    logger_1.Logger.info();
    console.log(JSON.stringify(e, null, 2));
    return {
        statusCode: 200,
        body: JSON.stringify({ message: 'hello world' }),
    };
};
exports.handler = handler;
