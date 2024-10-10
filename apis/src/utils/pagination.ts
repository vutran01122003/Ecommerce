import { Document, Query } from "mongoose";
import { PaginationQueryString } from "../shared/types";

const { LIMIT = 5, PAGE = 1 } = process.env;

class Pagination<T extends Document> {
    queryDB!: Query<T[], T>;
    queryString!: PaginationQueryString;

    constructor(queryDB: Query<T[], T>, queryString?: PaginationQueryString) {
        this.queryDB = queryDB;
        if (queryString) this.queryString = queryString;
    }

    async query(): Promise<Query<T[], T>> {
        return this.queryDB;
    }

    async paginate(): Promise<Query<T[], T>> {
        const limit: number = +this.queryString.limit || +LIMIT;
        const page: number = +this.queryString.page || +PAGE;
        const skip = (page - 1) * limit;

        return this.queryDB.limit(limit).skip(skip);
    }
}

export default Pagination;
