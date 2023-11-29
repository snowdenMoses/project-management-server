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
Object.defineProperty(exports, "__esModule", { value: true });
exports.project = void 0;
const server_1 = require("../server");
const clientsLoader_1 = require("../helperMethods/clientsLoader");
exports.project = {
    client(parent, args, ctx, info) {
        // return prisma.client.findUnique({where:{id: parent.client_id}})
        return clientsLoader_1.cacheUser.load(parent.client_id);
    },
    categories(parent, args, ctx, info) {
        return __awaiter(this, void 0, void 0, function* () {
            const parent_id = parent.id;
            const category_project = yield server_1.prisma.$queryRaw`
            SELECT categories.name, categories.id
            FROM categories_projects
            JOIN categories ON  categories.id  = categories_projects.category_id
            JOIN projects ON  projects.id = categories_projects.project_id
            WHERE projects.id = ${parent_id}
            ;
             `;
            return category_project;
        });
    }
};
