// const { base } = require("../Src/models/user")

// const { json } = require("express");
// const { copy } = require("../routes/home");
//base-product.find()
//big-Q api/Product?search=coder&page=2&category=shortsleeves&rating[gte]=4&price[lte]=999&[gte]=199
class WhereClause {
    constructor(base, bigQ) {
        this.base = base;
        this.bigQ = bigQ;
    }

    search() {
        const searchword = this.bigQ.search ? {
            name: {
                $regex: this.bigQ.search,
                $options: 'i'
            }
        } : {};

        this.base = this.base.find({ ...searchword });
        return this;
    }

    filter() {
        const copyQ = { ...this.bigQ };

        delete copyQ["search"];
        delete copyQ["limit"];
        delete copyQ["page"];

        let stringOfcopyQ = JSON.stringify(copyQ);
        stringOfcopyQ = stringOfcopyQ.replace(/\b(gte|lte|gt|lt)\b/g, m => `$${m}`);
        const jsonOfCopyQ = JSON.parse(stringOfcopyQ);

        this.base = this.base.find(jsonOfCopyQ);
        return this;
    }

    pager(resultperPage) {
        let currentpage = 1;
        if (this.bigQ.page) {
            currentpage = this.bigQ.page;
        }
        const skipval = resultperPage * (currentpage - 1);

        this.base = this.base.skip(skipval).limit(resultperPage);
        return this;
    }
}

module.exports = WhereClause;
