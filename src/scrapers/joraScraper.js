"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var puppeteer_1 = require("puppeteer");
var axios_1 = require("axios");
var API_ENDPOINT = "http://127.0.0.1:8080/add-job-postings/";
function pushDataToAPI(jobPosting) {
    return __awaiter(this, void 0, void 0, function () {
        var response, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    console.log("Sending data:", jobPosting);
                    return [4 /*yield*/, axios_1.default.post(API_ENDPOINT, [jobPosting])];
                case 1:
                    response = _a.sent();
                    console.log("Data pushed successfully:", jobPosting.source);
                    return [3 /*break*/, 3];
                case 2:
                    error_1 = _a.sent();
                    console.error("Error pushing data to API:", jobPosting.source, error_1);
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    });
}
function scrapeJobPostingsFromJora(query, location) {
    return __awaiter(this, void 0, void 0, function () {
        var browser, page, baseUrl, url, jobPostings, newJobPostings, _i, newJobPostings_1, jobPosting, nextPageButton, nextPageUrl;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, puppeteer_1.default.launch()];
                case 1:
                    browser = _a.sent();
                    return [4 /*yield*/, browser.newPage()];
                case 2:
                    page = _a.sent();
                    baseUrl = "https://us.jora.com/j?sp=homepage&trigger_source=homepage";
                    url = "".concat(baseUrl, "&q=").concat(encodeURIComponent(query), "&l=").concat(encodeURIComponent(location));
                    return [4 /*yield*/, page.goto(url)];
                case 3:
                    _a.sent();
                    jobPostings = [];
                    _a.label = 4;
                case 4:
                    if (!true) return [3 /*break*/, 14];
                    return [4 /*yield*/, page.waitForSelector('.job-card', { timeout: 60000 })];
                case 5:
                    _a.sent();
                    return [4 /*yield*/, page.$$eval('.job-card', function (cards) {
                            return cards.map(function (card) {
                                var _a, _b, _c, _d, _e, _f, _g, _h, _j;
                                var title = ((_b = (_a = card.querySelector('.job-title a')) === null || _a === void 0 ? void 0 : _a.textContent) === null || _b === void 0 ? void 0 : _b.trim()) || "";
                                var job_url = ((_c = card.querySelector('.job-title a')) === null || _c === void 0 ? void 0 : _c.href) || "";
                                var company = ((_e = (_d = card.querySelector('.job-company')) === null || _d === void 0 ? void 0 : _d.textContent) === null || _e === void 0 ? void 0 : _e.trim()) || "";
                                var location = ((_g = (_f = card.querySelector('.job-location')) === null || _f === void 0 ? void 0 : _f.textContent) === null || _g === void 0 ? void 0 : _g.trim()) || "";
                                var description = ((_j = (_h = card.querySelector('.job-abstract')) === null || _h === void 0 ? void 0 : _h.textContent) === null || _j === void 0 ? void 0 : _j.trim()) || "";
                                return {
                                    title: title,
                                    company: company,
                                    location: location,
                                    description: description,
                                    job_url: job_url,
                                    source: 'Jora'
                                };
                            });
                        })];
                case 6:
                    newJobPostings = _a.sent();
                    _i = 0, newJobPostings_1 = newJobPostings;
                    _a.label = 7;
                case 7:
                    if (!(_i < newJobPostings_1.length)) return [3 /*break*/, 10];
                    jobPosting = newJobPostings_1[_i];
                    return [4 /*yield*/, pushDataToAPI(jobPosting)];
                case 8:
                    _a.sent();
                    jobPostings.push(jobPosting); // Storing the job posting in the array after sending it to the API
                    _a.label = 9;
                case 9:
                    _i++;
                    return [3 /*break*/, 7];
                case 10: return [4 /*yield*/, page.$('.next-page-button')];
                case 11:
                    nextPageButton = _a.sent();
                    if (!nextPageButton) {
                        return [3 /*break*/, 14];
                    }
                    return [4 /*yield*/, page.evaluate(function (button) { return button.href; }, nextPageButton)];
                case 12:
                    nextPageUrl = _a.sent();
                    return [4 /*yield*/, page.goto(nextPageUrl)];
                case 13:
                    _a.sent();
                    return [3 /*break*/, 4];
                case 14: return [4 /*yield*/, browser.close()];
                case 15:
                    _a.sent();
                    return [2 /*return*/, jobPostings];
            }
        });
    });
}
exports.default = scrapeJobPostingsFromJora;
