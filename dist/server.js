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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.prisma = void 0;
const server_1 = require("@apollo/server");
const client_1 = require("@prisma/client");
const express4_1 = require("@apollo/server/express4");
const express_1 = __importDefault(require("express"));
const http_1 = __importDefault(require("http"));
const body_parser_1 = require("body-parser");
const cors_1 = __importDefault(require("cors"));
const typeDef_1 = require("./typeDef/typeDef");
const resolvers_1 = require("./resolvers");
const clientIdFromToken_1 = __importDefault(require("./authentication/clientIdFromToken"));
const shield_1 = require("./shield/shield");
const port = process.env.PORT || 4000;
exports.prisma = new client_1.PrismaClient();
const app = (0, express_1.default)();
const httpServer = http_1.default.createServer(app);
const server = new server_1.ApolloServer({
    typeDefs: typeDef_1.typeDefs,
    resolvers: resolvers_1.resolvers,
    plugins: [shield_1.permissions],
    csrfPrevention: false
});
function serverFunction() {
    return __awaiter(this, void 0, void 0, function* () {
        yield server.start();
        app.use((0, cors_1.default)(), (0, body_parser_1.json)(), (0, express4_1.expressMiddleware)(server, {
            context: ({ req }) => __awaiter(this, void 0, void 0, function* () {
                const bearerToken = String(req.headers.authorization);
                const token = bearerToken.split("Bearer ")[1];
                const currenUserId = yield (0, clientIdFromToken_1.default)(token);
                return {
                    currenUserId: currenUserId === null || currenUserId === void 0 ? void 0 : currenUserId.userId
                };
            }),
        }));
        yield new Promise((resolve) => httpServer.listen({ port }, resolve));
        console.log(`🚀 Server ready at ${process.env.HOST}`);
    });
}
serverFunction();
