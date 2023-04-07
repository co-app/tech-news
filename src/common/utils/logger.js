"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Logger = void 0;
class Logger {
    static info(msg) {
        console.log(JSON.stringify(msg, null, 2));
    }
    static warn() { }
    static debug() { }
    static error() { }
}
exports.Logger = Logger;
