"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
        while (_) try {
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var mockConfigFetcher_1 = __importDefault(require("./helpers/mockConfigFetcher"));
var helpers = __importStar(require("../helpers"));
var aurora_1 = __importDefault(require("../aurora"));
var jest_mock_1 = require("jest-mock");
function getGeneratedSchema(paths) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    (0, mockConfigFetcher_1.default)(paths);
                    return [4 /*yield*/, (0, aurora_1.default)()];
                case 1:
                    _a.sent();
                    return [2 /*return*/, jest.spyOn(helpers, 'writeSchema').mock.calls[0][1].replace(/\s+/g, ' ')];
            }
        });
    });
}
describe('aurora()', function () {
    beforeAll(function () {
        process.env.DATABASE_URL = 'file:./dev.db';
        process.env.SHADOW_DATABASE_URL = 'file:./shadow.db';
        process.env.BINARY_TARGETS = 'native';
    });
    beforeEach(function () {
        jest.clearAllMocks();
    });
    describe('Datasource Blocks', function () {
        it('should render datasource name', function () { return __awaiter(void 0, void 0, void 0, function () {
            var generatedSchema;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, getGeneratedSchema([
                            'feature-specific/datasource/datasource-url.prisma'
                        ])];
                    case 1:
                        generatedSchema = _a.sent();
                        expect(generatedSchema).toContain('datasource db');
                        return [2 /*return*/];
                }
            });
        }); });
        it('should render provider', function () { return __awaiter(void 0, void 0, void 0, function () {
            var generatedSchema;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, getGeneratedSchema([
                            'feature-specific/datasource/datasource-url.prisma'
                        ])];
                    case 1:
                        generatedSchema = _a.sent();
                        expect(generatedSchema).toContain('provider = "sqlite"');
                        return [2 /*return*/];
                }
            });
        }); });
        it('should render url', function () { return __awaiter(void 0, void 0, void 0, function () {
            var generatedSchema;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, getGeneratedSchema([
                            'feature-specific/datasource/datasource-url.prisma'
                        ])];
                    case 1:
                        generatedSchema = _a.sent();
                        expect(generatedSchema).toContain('url = "file:./dev.db"');
                        return [2 /*return*/];
                }
            });
        }); });
        it('should render shadowDatabaseUrl', function () { return __awaiter(void 0, void 0, void 0, function () {
            var generatedSchema;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, getGeneratedSchema([
                            'feature-specific/datasource/datasource-url.prisma'
                        ])];
                    case 1:
                        generatedSchema = _a.sent();
                        expect(generatedSchema).toContain('shadowDatabaseUrl = "file:./shadow.db"');
                        return [2 /*return*/];
                }
            });
        }); });
        it('should render referentialIntegrity', function () { return __awaiter(void 0, void 0, void 0, function () {
            var generatedSchema;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, getGeneratedSchema([
                            'feature-specific/datasource/datasource-url.prisma'
                        ])];
                    case 1:
                        generatedSchema = _a.sent();
                        expect(generatedSchema).toContain('referentialIntegrity = "prisma"');
                        return [2 /*return*/];
                }
            });
        }); });
        it('should env var in url', function () { return __awaiter(void 0, void 0, void 0, function () {
            var generatedSchemaWithEnv;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, getGeneratedSchema([
                            'feature-specific/datasource/datasource-env-url.prisma'
                        ])];
                    case 1:
                        generatedSchemaWithEnv = _a.sent();
                        expect(generatedSchemaWithEnv).toContain('url = env("DATABASE_URL")');
                        return [2 /*return*/];
                }
            });
        }); });
        it('should render env var in shadowDatabaseUrl', function () { return __awaiter(void 0, void 0, void 0, function () {
            var generatedSchemaWithEnv;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, getGeneratedSchema([
                            'feature-specific/datasource/datasource-env-url.prisma'
                        ])];
                    case 1:
                        generatedSchemaWithEnv = _a.sent();
                        expect(generatedSchemaWithEnv).toContain('shadowDatabaseUrl = env("SHADOW_DATABASE_URL")');
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('Generator Blocks', function () {
        it('should succeed when no generators are present', function () { return __awaiter(void 0, void 0, void 0, function () {
            var generatedSchema;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, getGeneratedSchema([
                            'feature-specific/generators/noGenerators.prisma'
                        ])];
                    case 1:
                        generatedSchema = _a.sent();
                        expect(generatedSchema).not.toContain('generator');
                        return [2 /*return*/];
                }
            });
        }); });
        it('Should succeed when there are multiple generators present', function () { return __awaiter(void 0, void 0, void 0, function () {
            var generatedSchema, count;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, getGeneratedSchema([
                            'feature-specific/generators/multipleGenerators.prisma'
                        ])];
                    case 1:
                        generatedSchema = _a.sent();
                        count = (generatedSchema.match(/generator\s+\w+\s+\{/g) || []).length;
                        expect(count).toBe(2);
                        return [2 /*return*/];
                }
            });
        }); });
        it('should render generator name', function () { return __awaiter(void 0, void 0, void 0, function () {
            var generatedSchema;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, getGeneratedSchema([
                            'feature-specific/generators/generator.prisma'
                        ])];
                    case 1:
                        generatedSchema = _a.sent();
                        expect(generatedSchema).toContain('generator client');
                        return [2 /*return*/];
                }
            });
        }); });
        it('should render generator provider', function () { return __awaiter(void 0, void 0, void 0, function () {
            var generatedSchema;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, getGeneratedSchema([
                            'feature-specific/generators/generator.prisma'
                        ])];
                    case 1:
                        generatedSchema = _a.sent();
                        expect(generatedSchema).toContain('provider = "prisma-client-js"');
                        return [2 /*return*/];
                }
            });
        }); });
        it('should render generator output', function () { return __awaiter(void 0, void 0, void 0, function () {
            var generatedSchema;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, getGeneratedSchema([
                            'feature-specific/generators/generator.prisma'
                        ])];
                    case 1:
                        generatedSchema = _a.sent();
                        expect(generatedSchema).toContain('output = "../src/generated"');
                        return [2 /*return*/];
                }
            });
        }); });
        it('should render generator previewFeatures', function () { return __awaiter(void 0, void 0, void 0, function () {
            var generatedSchema;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, getGeneratedSchema([
                            'feature-specific/generators/generator.prisma'
                        ])];
                    case 1:
                        generatedSchema = _a.sent();
                        expect(generatedSchema).toContain('previewFeatures = ["referentialIntegrity"]');
                        return [2 /*return*/];
                }
            });
        }); });
        it('should render generator engineType', function () { return __awaiter(void 0, void 0, void 0, function () {
            var generatedSchema;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, getGeneratedSchema([
                            'feature-specific/generators/generator.prisma'
                        ])];
                    case 1:
                        generatedSchema = _a.sent();
                        expect(generatedSchema).toContain('engineType = "library"');
                        return [2 /*return*/];
                }
            });
        }); });
        it('should render generator binaryTarget', function () { return __awaiter(void 0, void 0, void 0, function () {
            var generatedSchema;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, getGeneratedSchema([
                            'feature-specific/generators/generator.prisma'
                        ])];
                    case 1:
                        generatedSchema = _a.sent();
                        expect(generatedSchema).toContain('binaryTargets = ["native"]');
                        return [2 /*return*/];
                }
            });
        }); });
        it('should render generator env var in binaryTarget', function () { return __awaiter(void 0, void 0, void 0, function () {
            var generatedSchemaWithBinaryEnv;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, getGeneratedSchema([
                            'feature-specific/generators/generator-binary-env.prisma'
                        ])];
                    case 1:
                        generatedSchemaWithBinaryEnv = _a.sent();
                        expect(generatedSchemaWithBinaryEnv).toContain("binaryTargets = [env(\"BINARY_TARGETS\")]");
                        return [2 /*return*/];
                }
            });
        }); });
        it('should render custom generator options', function () { return __awaiter(void 0, void 0, void 0, function () {
            var generatedSchemaWithCustomGenOptions;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, getGeneratedSchema([
                            'feature-specific/generators/generator-custom.prisma'
                        ])];
                    case 1:
                        generatedSchemaWithCustomGenOptions = _a.sent();
                        expect(generatedSchemaWithCustomGenOptions).toContain("createCRUD = \"C-R-U-D\"");
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('Model Blocks', function () {
        describe('Models', function () {
            it('should render a model', function () { return __awaiter(void 0, void 0, void 0, function () {
                var generatedSchema;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, getGeneratedSchema(['feature-specific/models/model.prisma'])];
                        case 1:
                            generatedSchema = _a.sent();
                            expect(generatedSchema).toContain('model User');
                            return [2 /*return*/];
                    }
                });
            }); });
            describe('@@id', function () {
                it('should render an @@id([])', function () { return __awaiter(void 0, void 0, void 0, function () {
                    var generatedSchema;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, getGeneratedSchema([
                                    'feature-specific/models/model-@@id.prisma'
                                ])];
                            case 1:
                                generatedSchema = _a.sent();
                                expect(generatedSchema).toContain('@@id([id])');
                                return [2 /*return*/];
                        }
                    });
                }); });
                it('should render an @@id(fields: [])', function () { return __awaiter(void 0, void 0, void 0, function () {
                    var generatedSchema;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, getGeneratedSchema([
                                    'feature-specific/models/model-@@id-fields.prisma'
                                ])];
                            case 1:
                                generatedSchema = _a.sent();
                                expect(generatedSchema).toContain('@@id(fields: [id])');
                                return [2 /*return*/];
                        }
                    });
                }); });
                it('should render an @@id(name: "")', function () { return __awaiter(void 0, void 0, void 0, function () {
                    var generatedSchema;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, getGeneratedSchema([
                                    'feature-specific/models/model-@@id-name.prisma'
                                ])];
                            case 1:
                                generatedSchema = _a.sent();
                                expect(generatedSchema).toContain('@@id(name: "unique", [id])');
                                return [2 /*return*/];
                        }
                    });
                }); });
                it('should render an @@id(map: "")', function () { return __awaiter(void 0, void 0, void 0, function () {
                    var generatedSchema;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, getGeneratedSchema([
                                    'feature-specific/models/model-@@id-map.prisma'
                                ])];
                            case 1:
                                generatedSchema = _a.sent();
                                expect(generatedSchema).toContain('@@id(map: "unique", [id])');
                                return [2 /*return*/];
                        }
                    });
                }); });
            });
            describe('@@fulltext', function () {
                it('should render an @@fulltext([])', function () { return __awaiter(void 0, void 0, void 0, function () {
                    var generatedSchema;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, getGeneratedSchema([
                                    'feature-specific/models/model-@@fulltext.prisma'
                                ])];
                            case 1:
                                generatedSchema = _a.sent();
                                expect(generatedSchema).toContain(' @@fulltext([title(sort: Desc), content])');
                                return [2 /*return*/];
                        }
                    });
                }); });
            });
            describe('@@unique', function () {
                it('should render an @@unique([])', function () { return __awaiter(void 0, void 0, void 0, function () {
                    var generatedSchema;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, getGeneratedSchema([
                                    'feature-specific/models/model-@@unique.prisma'
                                ])];
                            case 1:
                                generatedSchema = _a.sent();
                                expect(generatedSchema).toContain('@@unique([id])');
                                return [2 /*return*/];
                        }
                    });
                }); });
                it('should render an @@unique(fields: [])', function () { return __awaiter(void 0, void 0, void 0, function () {
                    var generatedSchema;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, getGeneratedSchema([
                                    'feature-specific/models/model-@@unique-fields.prisma'
                                ])];
                            case 1:
                                generatedSchema = _a.sent();
                                expect(generatedSchema).toContain('@@unique(fields: [id])');
                                return [2 /*return*/];
                        }
                    });
                }); });
                it('should render an @@unique(name: "")', function () { return __awaiter(void 0, void 0, void 0, function () {
                    var generatedSchema;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, getGeneratedSchema([
                                    'feature-specific/models/model-@@unique-name.prisma'
                                ])];
                            case 1:
                                generatedSchema = _a.sent();
                                expect(generatedSchema).toContain('@@unique(name: "unique", [id])');
                                return [2 /*return*/];
                        }
                    });
                }); });
                it('should render an @@unique(map: "")', function () { return __awaiter(void 0, void 0, void 0, function () {
                    var generatedSchema;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, getGeneratedSchema([
                                    'feature-specific/models/model-@@unique-map.prisma'
                                ])];
                            case 1:
                                generatedSchema = _a.sent();
                                expect(generatedSchema).toContain('@@unique(map: "unique", [id])');
                                return [2 /*return*/];
                        }
                    });
                }); });
            });
            describe('@@index', function () {
                it('should render an @@index([])', function () { return __awaiter(void 0, void 0, void 0, function () {
                    var generatedSchema;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, getGeneratedSchema([
                                    'feature-specific/models/model-@@index.prisma'
                                ])];
                            case 1:
                                generatedSchema = _a.sent();
                                expect(generatedSchema).toContain('@@index([id])');
                                return [2 /*return*/];
                        }
                    });
                }); });
                it('should render an @@index(fields: [])', function () { return __awaiter(void 0, void 0, void 0, function () {
                    var generatedSchema;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, getGeneratedSchema([
                                    'feature-specific/models/model-@@index-fields.prisma'
                                ])];
                            case 1:
                                generatedSchema = _a.sent();
                                expect(generatedSchema).toContain('@@index(fields: [id])');
                                return [2 /*return*/];
                        }
                    });
                }); });
                it('should render an @@index(name: "")', function () { return __awaiter(void 0, void 0, void 0, function () {
                    var generatedSchema;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, getGeneratedSchema([
                                    'feature-specific/models/model-@@index-name.prisma'
                                ])];
                            case 1:
                                generatedSchema = _a.sent();
                                expect(generatedSchema).toContain('@@index(name: "unique", [id])');
                                return [2 /*return*/];
                        }
                    });
                }); });
                it('should render an @@index(map: "")', function () { return __awaiter(void 0, void 0, void 0, function () {
                    var generatedSchema;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, getGeneratedSchema([
                                    'feature-specific/models/model-@@index-map.prisma'
                                ])];
                            case 1:
                                generatedSchema = _a.sent();
                                expect(generatedSchema).toContain('@@index(map: "unique", [id])');
                                return [2 /*return*/];
                        }
                    });
                }); });
            });
            describe('@@map', function () {
                it('should render an @@map("")', function () { return __awaiter(void 0, void 0, void 0, function () {
                    var generatedSchema;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, getGeneratedSchema([
                                    'feature-specific/models/model-@@map.prisma'
                                ])];
                            case 1:
                                generatedSchema = _a.sent();
                                expect(generatedSchema).toContain('@@map("test")');
                                return [2 /*return*/];
                        }
                    });
                }); });
                it('should render an @@map(name: "")', function () { return __awaiter(void 0, void 0, void 0, function () {
                    var generatedSchema;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, getGeneratedSchema([
                                    'feature-specific/models/model-@@map-name.prisma'
                                ])];
                            case 1:
                                generatedSchema = _a.sent();
                                expect(generatedSchema).toContain('@@map(name: "test")');
                                return [2 /*return*/];
                        }
                    });
                }); });
            });
            describe('@@ignore', function () {
                it('should NOT render an @@ignore model', function () { return __awaiter(void 0, void 0, void 0, function () {
                    var generatedSchema;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, getGeneratedSchema([
                                    'feature-specific/models/model-@@ignore.prisma'
                                ])];
                            case 1:
                                generatedSchema = _a.sent();
                                expect(generatedSchema).not.toContain('model User');
                                return [2 /*return*/];
                        }
                    });
                }); });
            });
        });
        describe('Model Fields', function () {
            it('should merge duplicate fields', function () { return __awaiter(void 0, void 0, void 0, function () {
                var generatedSchema;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, getGeneratedSchema(['duplicates/*.prisma'])];
                        case 1:
                            generatedSchema = _a.sent();
                            expect(generatedSchema).toContain('userId BigInt @id @default(autoincrement())');
                            return [2 /*return*/];
                    }
                });
            }); });
            it('should render ?', function () { return __awaiter(void 0, void 0, void 0, function () {
                var generatedSchema;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, getGeneratedSchema([
                                'feature-specific/model-fields/model-field-?.prisma'
                            ])];
                        case 1:
                            generatedSchema = _a.sent();
                            expect(generatedSchema).toContain('date DateTime?');
                            return [2 /*return*/];
                    }
                });
            }); });
            it('should render []', function () { return __awaiter(void 0, void 0, void 0, function () {
                var generatedSchema;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, getGeneratedSchema([
                                'feature-specific/model-fields/model-field-[].prisma'
                            ])];
                        case 1:
                            generatedSchema = _a.sent();
                            expect(generatedSchema).toContain('data String[]');
                            return [2 /*return*/];
                    }
                });
            }); });
            describe('@id', function () {
                it('should render @id', function () { return __awaiter(void 0, void 0, void 0, function () {
                    var generatedSchema;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, getGeneratedSchema([
                                    'feature-specific/model-fields/model-field-@db.prisma'
                                ])];
                            case 1:
                                generatedSchema = _a.sent();
                                expect(generatedSchema).toContain('updatedAt DateTime @updatedAt @db.DateTime(6)');
                                return [2 /*return*/];
                        }
                    });
                }); });
            });
            describe('@id', function () {
                it('should render @id', function () { return __awaiter(void 0, void 0, void 0, function () {
                    var generatedSchema;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, getGeneratedSchema([
                                    'feature-specific/model-fields/model-field-@id.prisma'
                                ])];
                            case 1:
                                generatedSchema = _a.sent();
                                expect(generatedSchema).toContain('id Int @id');
                                return [2 /*return*/];
                        }
                    });
                }); });
                it('should render @id(map: "")', function () { return __awaiter(void 0, void 0, void 0, function () {
                    var generatedSchema;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, getGeneratedSchema([
                                    'feature-specific/model-fields/model-field-@id-map.prisma'
                                ])];
                            case 1:
                                generatedSchema = _a.sent();
                                expect(generatedSchema).toContain('id Int @id(map: "test")');
                                return [2 /*return*/];
                        }
                    });
                }); });
                it('should render @id(length: 1)', function () { return __awaiter(void 0, void 0, void 0, function () {
                    var generatedSchema;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, getGeneratedSchema([
                                    'feature-specific/model-fields/model-field-@id-length.prisma'
                                ])];
                            case 1:
                                generatedSchema = _a.sent();
                                expect(generatedSchema).toContain('id String @id(length: 1)');
                                return [2 /*return*/];
                        }
                    });
                }); });
                it('should render @id(sort: "Asc")', function () { return __awaiter(void 0, void 0, void 0, function () {
                    var generatedSchema;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, getGeneratedSchema([
                                    'feature-specific/model-fields/model-field-@id-sort.prisma'
                                ])];
                            case 1:
                                generatedSchema = _a.sent();
                                expect(generatedSchema).toContain('id String @id(sort: Asc)');
                                return [2 /*return*/];
                        }
                    });
                }); });
            });
            describe('@default', function () {
                it('should render @default("")', function () { return __awaiter(void 0, void 0, void 0, function () {
                    var generatedSchema;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, getGeneratedSchema([
                                    'feature-specific/model-fields/model-field-@default.prisma'
                                ])];
                            case 1:
                                generatedSchema = _a.sent();
                                expect(generatedSchema).toContain('id String @id @default("test")');
                                return [2 /*return*/];
                        }
                    });
                }); });
                it('should render @default(value: "")', function () { return __awaiter(void 0, void 0, void 0, function () {
                    var generatedSchema;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, getGeneratedSchema([
                                    'feature-specific/model-fields/model-field-@default-value.prisma'
                                ])];
                            case 1:
                                generatedSchema = _a.sent();
                                expect(generatedSchema).toContain('id Int @id @default(value: 99)');
                                return [2 /*return*/];
                        }
                    });
                }); });
                it('should render @default(map: "", "")', function () { return __awaiter(void 0, void 0, void 0, function () {
                    var generatedSchema;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, getGeneratedSchema([
                                    'feature-specific/model-fields/model-field-@default-map.prisma'
                                ])];
                            case 1:
                                generatedSchema = _a.sent();
                                expect(generatedSchema).toContain('id String @id @default(map: "mapping", "test")');
                                return [2 /*return*/];
                        }
                    });
                }); });
                it('should render @default values that have a string length under 1', function () { return __awaiter(void 0, void 0, void 0, function () {
                    var generatedSchema;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, getGeneratedSchema([
                                    'feature-specific/model-fields/model-field-@default-0.prisma'
                                ])];
                            case 1:
                                generatedSchema = _a.sent();
                                expect(generatedSchema).toContain('count Int @default(2)');
                                return [2 /*return*/];
                        }
                    });
                }); });
            });
            describe('@unique', function () {
                it('should render @unique', function () { return __awaiter(void 0, void 0, void 0, function () {
                    var generatedSchema;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, getGeneratedSchema([
                                    'feature-specific/model-fields/model-field-@unique.prisma'
                                ])];
                            case 1:
                                generatedSchema = _a.sent();
                                expect(generatedSchema).toContain('id Int @id @unique');
                                return [2 /*return*/];
                        }
                    });
                }); });
                it('should render @unique(map: "")', function () { return __awaiter(void 0, void 0, void 0, function () {
                    var generatedSchema;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, getGeneratedSchema([
                                    'feature-specific/model-fields/model-field-@unique-map.prisma'
                                ])];
                            case 1:
                                generatedSchema = _a.sent();
                                expect(generatedSchema).toContain('@unique(map: "mapping")');
                                return [2 /*return*/];
                        }
                    });
                }); });
                it('should render @unique(length: 1)', function () { return __awaiter(void 0, void 0, void 0, function () {
                    var generatedSchema;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, getGeneratedSchema([
                                    'feature-specific/model-fields/model-field-@unique-length.prisma'
                                ])];
                            case 1:
                                generatedSchema = _a.sent();
                                expect(generatedSchema).toContain('id String @unique(length: 1)');
                                return [2 /*return*/];
                        }
                    });
                }); });
                it('should render @unique(sort: Asc)', function () { return __awaiter(void 0, void 0, void 0, function () {
                    var generatedSchema;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, getGeneratedSchema([
                                    'feature-specific/model-fields/model-field-@unique-sort.prisma'
                                ])];
                            case 1:
                                generatedSchema = _a.sent();
                                expect(generatedSchema).toContain('id String @unique(sort: Asc)');
                                return [2 /*return*/];
                        }
                    });
                }); });
            });
            describe('@relation', function () {
                it('should render @relation("")', function () { return __awaiter(void 0, void 0, void 0, function () {
                    var generatedSchema;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, getGeneratedSchema([
                                    'feature-specific/model-fields/model-field-@relation.prisma'
                                ])];
                            case 1:
                                generatedSchema = _a.sent();
                                expect(generatedSchema).toContain('@relation("UserPost")');
                                return [2 /*return*/];
                        }
                    });
                }); });
                it('should render @relation(fields: [])', function () { return __awaiter(void 0, void 0, void 0, function () {
                    var generatedSchema;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, getGeneratedSchema([
                                    'feature-specific/model-fields/model-field-@relation.prisma'
                                ])];
                            case 1:
                                generatedSchema = _a.sent();
                                expect(generatedSchema).toContain('fields: [id]');
                                return [2 /*return*/];
                        }
                    });
                }); });
                it('should render @relation(references: [])', function () { return __awaiter(void 0, void 0, void 0, function () {
                    var generatedSchema;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, getGeneratedSchema([
                                    'feature-specific/model-fields/model-field-@relation.prisma'
                                ])];
                            case 1:
                                generatedSchema = _a.sent();
                                expect(generatedSchema).toContain('references: [id]');
                                return [2 /*return*/];
                        }
                    });
                }); });
                it('should render @relation(name: "", fields: [], references: [])', function () { return __awaiter(void 0, void 0, void 0, function () {
                    var generatedSchema;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, getGeneratedSchema([
                                    'feature-specific/model-fields/model-field-@relation-name.prisma'
                                ])];
                            case 1:
                                generatedSchema = _a.sent();
                                expect(generatedSchema).toContain('@relation(name: "UserPost", fields: [id], references: [id])');
                                return [2 /*return*/];
                        }
                    });
                }); });
                it('should render @relation(fields: [], references: [])', function () { return __awaiter(void 0, void 0, void 0, function () {
                    var generatedSchema;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, getGeneratedSchema([
                                    'feature-specific/model-fields/model-field-@relation-unnamed.prisma'
                                ])];
                            case 1:
                                generatedSchema = _a.sent();
                                expect(generatedSchema).toContain('@relation(fields: [id], references: [id])');
                                return [2 /*return*/];
                        }
                    });
                }); });
                it('should render @relation(onDelete: action)', function () { return __awaiter(void 0, void 0, void 0, function () {
                    var generatedSchema;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, getGeneratedSchema([
                                    'feature-specific/model-fields/model-field-@relation-ondelete.prisma'
                                ])];
                            case 1:
                                generatedSchema = _a.sent();
                                expect(generatedSchema).toContain('onDelete: Cascade');
                                expect(generatedSchema).toContain('fields: [id]');
                                expect(generatedSchema).toContain('references: [id]');
                                return [2 /*return*/];
                        }
                    });
                }); });
                it('should render @relation(onUpdate: action)', function () { return __awaiter(void 0, void 0, void 0, function () {
                    var generatedSchema;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, getGeneratedSchema([
                                    'feature-specific/model-fields/model-field-@relation-onupdate.prisma'
                                ])];
                            case 1:
                                generatedSchema = _a.sent();
                                expect(generatedSchema).toContain('onUpdate: Cascade');
                                expect(generatedSchema).toContain('fields: [id]');
                                expect(generatedSchema).toContain('references: [id]');
                                return [2 /*return*/];
                        }
                    });
                }); });
                it('should render @relation(map: "")', function () { return __awaiter(void 0, void 0, void 0, function () {
                    var generatedSchema;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, getGeneratedSchema([
                                    'feature-specific/model-fields/model-field-@relation-map.prisma'
                                ])];
                            case 1:
                                generatedSchema = _a.sent();
                                expect(generatedSchema).toContain('@relation(map: "Test", fields: [id], references: [id])');
                                return [2 /*return*/];
                        }
                    });
                }); });
            });
            describe('@map', function () {
                it('should render @map("")', function () { return __awaiter(void 0, void 0, void 0, function () {
                    var generatedSchema;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, getGeneratedSchema([
                                    'feature-specific/model-fields/model-field-@map.prisma'
                                ])];
                            case 1:
                                generatedSchema = _a.sent();
                                expect(generatedSchema).toContain('id Int @id @map("test")');
                                return [2 /*return*/];
                        }
                    });
                }); });
                it('should render @map(name: "")', function () { return __awaiter(void 0, void 0, void 0, function () {
                    var generatedSchema;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, getGeneratedSchema([
                                    'feature-specific/model-fields/model-field-@map-name.prisma'
                                ])];
                            case 1:
                                generatedSchema = _a.sent();
                                expect(generatedSchema).toContain('id Int @id @map(name: "test")');
                                return [2 /*return*/];
                        }
                    });
                }); });
            });
            describe('@updatedAt', function () {
                it('should render @updatedAt', function () { return __awaiter(void 0, void 0, void 0, function () {
                    var generatedSchema;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, getGeneratedSchema([
                                    'feature-specific/model-fields/model-field-@updatedAt.prisma'
                                ])];
                            case 1:
                                generatedSchema = _a.sent();
                                expect(generatedSchema).toContain('date DateTime @updatedAt');
                                return [2 /*return*/];
                        }
                    });
                }); });
            });
            describe('@ignore', function () {
                it('should NOT render @ignore', function () { return __awaiter(void 0, void 0, void 0, function () {
                    var generatedSchema;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, getGeneratedSchema([
                                    'feature-specific/model-fields/model-field-@ignore.prisma'
                                ])];
                            case 1:
                                generatedSchema = _a.sent();
                                expect(generatedSchema).toContain('@ignore');
                                return [2 /*return*/];
                        }
                    });
                }); });
            });
        });
    });
    describe('Enum Blocks', function () {
        it('should render an enum', function () { return __awaiter(void 0, void 0, void 0, function () {
            var generatedSchema;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, getGeneratedSchema(['feature-specific/enums/enum.prisma'])];
                    case 1:
                        generatedSchema = _a.sent();
                        expect(generatedSchema).toContain('enum Test');
                        expect(generatedSchema).toContain('TestValue');
                        return [2 /*return*/];
                }
            });
        }); });
        it('should render an enum value with only one letter', function () { return __awaiter(void 0, void 0, void 0, function () {
            var generatedSchema, fields;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, getGeneratedSchema([
                            'feature-specific/enums/enum-single-letter.prisma'
                        ])];
                    case 1:
                        generatedSchema = _a.sent();
                        expect(generatedSchema).toContain('enum Names');
                        fields = generatedSchema
                            .split('enum Names {')[1]
                            .split('}')[0]
                            .split(' ')
                            .filter(function (field) { return field.length; });
                        expect(fields.some(function (field) { return field === 'X'; })).toBeTruthy();
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('Glob Config', function () {
        it('should render global Glob Files', function () { return __awaiter(void 0, void 0, void 0, function () {
            var generatedSchema;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, getGeneratedSchema(['glob-test/**/*.prisma'])];
                    case 1:
                        generatedSchema = _a.sent();
                        expect(generatedSchema).toContain('generator client');
                        expect(generatedSchema).toContain('datasource db');
                        expect(generatedSchema).toContain('model Person');
                        expect(generatedSchema).toContain('model User');
                        expect(generatedSchema).toContain('enum Environment');
                        expect(generatedSchema).toContain('enum Test');
                        return [2 /*return*/];
                }
            });
        }); });
        it('should render individual Glob Files', function () { return __awaiter(void 0, void 0, void 0, function () {
            var generatedSchema;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, getGeneratedSchema([
                            'glob-test/providers/*.prisma',
                            'glob-test/enums/*.prisma',
                            'glob-test/models/*.prisma'
                        ])];
                    case 1:
                        generatedSchema = _a.sent();
                        expect(generatedSchema).toContain('generator client');
                        expect(generatedSchema).toContain('datasource db');
                        expect(generatedSchema).toContain('model Person');
                        expect(generatedSchema).toContain('model User');
                        expect(generatedSchema).toContain('enum Environment');
                        expect(generatedSchema).toContain('enum Test');
                        return [2 /*return*/];
                }
            });
        }); });
        it('should render mixed Glob Files', function () { return __awaiter(void 0, void 0, void 0, function () {
            var generatedSchema;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, getGeneratedSchema([
                            'glob-test/providers/datasource.prisma',
                            'glob-test/models/*.prisma',
                            'glob-test/enums/environment.prisma'
                        ])];
                    case 1:
                        generatedSchema = _a.sent();
                        expect(generatedSchema).not.toContain('generator client');
                        expect(generatedSchema).toContain('datasource db');
                        expect(generatedSchema).toContain('model Person');
                        expect(generatedSchema).toContain('model User');
                        expect(generatedSchema).toContain('enum Environment');
                        expect(generatedSchema).not.toContain('enum Test');
                        return [2 /*return*/];
                }
            });
        }); });
        it('should throw imaginary Glob Files', function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        // SHHHH! Don't display the expected error on this test in console!
                        (0, jest_mock_1.spyOn)(console, 'error');
                        return [4 /*yield*/, expect(
                            // eslint-disable-next-line no-console
                            getGeneratedSchema([
                                'glob-test/providers/*.prisma',
                                'glob-test/enums/*.prisma',
                                'glob-test/models/*.prisma',
                                'glob-test/nonexistent/*.prisma'
                            ])).rejects.toThrow()];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
    });
});
