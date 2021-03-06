"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const display_dir_1 = require("./display-dir");
const display_file_1 = require("./display-file");
const fs_1 = __importDefault(require("fs"));
const config = __importStar(require("../../../config"));
const util_1 = require("util");
const statP = util_1.promisify(fs_1.default.stat);
function notFoundInCloud(req, res) {
    const htmlData = {
        pageTitle: "Not Found",
        bodyTitle: "Not Found - 404",
        bodyMessage: `Could not find ${req.path} in your cloud.`
    };
    res.status(404);
    res.type("text/html");
    res.render("default.hb", htmlData);
}
function determineFileType(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        let requestedFile = "./" + config.cloudDirectory + req.path;
        try {
            const rfStats = yield statP(requestedFile);
            if (rfStats.isDirectory()) {
                display_dir_1.displayDir(req, res, requestedFile);
            }
            else {
                display_file_1.displayFile(req, res, requestedFile);
            }
        }
        catch (err) {
            // Requested file was not found
            if (err.code === "ENOENT") {
                notFoundInCloud(req, res);
            }
        }
    });
}
exports.determineFileType = determineFileType;
// Any request that comes the cloud feature needs to be checked for "/..", because it may 
// map outside of the config.cloudDirectory
function disallowParentDirectoryRequest(req, res, next) {
    if (req.originalUrl.includes("/..")) {
        notFoundInCloud(req, res);
    }
    else {
        next();
    }
}
exports.disallowParentDirectoryRequest = disallowParentDirectoryRequest;
//# sourceMappingURL=index.js.map