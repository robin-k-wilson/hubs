"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TsTest = void 0;
var react_1 = __importDefault(require("react"));
function TsTest(_a) {
    var toyName = _a.toyName;
    return react_1.default.createElement("div", null, toyName);
}
exports.TsTest = TsTest;
