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
                    console.log("Data pushed successfully for:", jobPosting.source);
                    return [3 /*break*/, 3];
                case 2:
                    error_1 = _a.sent();
                    console.error("Error pushing data to API for:", jobPosting.source, error_1);
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    });
}
function scrapeJobPostingsFromJobomas(query, location) {
    return __awaiter(this, void 0, void 0, function () {
        var browser, page, url, jobPostings, _i, jobPostings_1, jobPosting;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, puppeteer_1.default.launch()];
                case 1:
                    browser = _a.sent();
                    return [4 /*yield*/, browser.newPage()];
                case 2:
                    page = _a.sent();
                    url = "https://us.jobomas.com/Jobs-of-".concat(encodeURIComponent(query), "-in-").concat(encodeURIComponent(location));
                    return [4 /*yield*/, page.goto(url)];
                case 3:
                    _a.sent();
                    return [4 /*yield*/, scrapeJobPostings(page)];
                case 4:
                    jobPostings = _a.sent();
                    _i = 0, jobPostings_1 = jobPostings;
                    _a.label = 5;
                case 5:
                    if (!(_i < jobPostings_1.length)) return [3 /*break*/, 8];
                    jobPosting = jobPostings_1[_i];
                    jobPosting.source = 'Jobomas'; // Setting the source field
                    return [4 /*yield*/, pushDataToAPI(jobPosting)];
                case 6:
                    _a.sent();
                    _a.label = 7;
                case 7:
                    _i++;
                    return [3 /*break*/, 5];
                case 8: return [4 /*yield*/, browser.close()];
                case 9:
                    _a.sent();
                    return [2 /*return*/, jobPostings];
            }
        });
    });
}
function scrapeJobPostings(page) {
    return __awaiter(this, void 0, void 0, function () {
        var jobPostings, newJobPostings, _i, newJobPostings_1, jobPosting, nextPageButton;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    jobPostings = [];
                    _a.label = 1;
                case 1:
                    if (!true) return [3 /*break*/, 11];
                    return [4 /*yield*/, page.evaluate(function () {
                            var postings = [];
                            var jobCards = document.querySelectorAll(".item-vacante");
                            jobCards.forEach(function (card) {
                                var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l;
                                var title = ((_b = (_a = card.querySelector("h3.titulo-vacante")) === null || _a === void 0 ? void 0 : _a.textContent) === null || _b === void 0 ? void 0 : _b.trim()) || "";
                                var company = ((_d = (_c = card.querySelector("ul.resumen-vacante span:nth-child(4)")) === null || _c === void 0 ? void 0 : _c.textContent) === null || _d === void 0 ? void 0 : _d.trim()) || "";
                                var location = ((_f = (_e = card.querySelector("ul.resumen-vacante span:nth-child(6)")) === null || _e === void 0 ? void 0 : _e.textContent) === null || _f === void 0 ? void 0 : _f.trim()) || "";
                                var posting_date = ((_h = (_g = card.querySelector("ul.resumen-vacante span:nth-child(8)")) === null || _g === void 0 ? void 0 : _g.textContent) === null || _h === void 0 ? void 0 : _h.trim()) || "";
                                var description = ((_k = (_j = card.querySelector("p.extracto-vacante")) === null || _j === void 0 ? void 0 : _j.textContent) === null || _k === void 0 ? void 0 : _k.trim()) || "";
                                var job_url = ((_l = card.querySelector("a")) === null || _l === void 0 ? void 0 : _l.href) || "";
                                postings.push({
                                    title: title,
                                    company: company,
                                    location: location,
                                    posting_date: posting_date,
                                    description: description,
                                    job_url: job_url,
                                    source: 'Jobomas', // Placeholder for the source field, will be set later
                                });
                            });
                            return postings;
                        })];
                case 2:
                    newJobPostings = _a.sent();
                    _i = 0, newJobPostings_1 = newJobPostings;
                    _a.label = 3;
                case 3:
                    if (!(_i < newJobPostings_1.length)) return [3 /*break*/, 6];
                    jobPosting = newJobPostings_1[_i];
                    return [4 /*yield*/, pushDataToAPI(jobPosting)];
                case 4:
                    _a.sent();
                    jobPostings.push(jobPosting); // Storing the job posting in the array after sending it to the API
                    _a.label = 5;
                case 5:
                    _i++;
                    return [3 /*break*/, 3];
                case 6: return [4 /*yield*/, page.$(".pagination li.active + li a")];
                case 7:
                    nextPageButton = _a.sent();
                    if (!nextPageButton) return [3 /*break*/, 9];
                    return [4 /*yield*/, Promise.all([page.waitForNavigation(), nextPageButton.click()])];
                case 8:
                    _a.sent();
                    return [3 /*break*/, 10];
                case 9: return [3 /*break*/, 11];
                case 10: return [3 /*break*/, 1];
                case 11: return [2 /*return*/, jobPostings];
            }
        });
    });
}
exports.default = scrapeJobPostingsFromJobomas;
