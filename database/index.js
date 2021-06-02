const mongoose = require("mongoose");
const models = require("./models");
require("dotenv").config();

class MongoDB {
    constructor() {
        this.config = {
            url: process.env.DB_URL,
            database: process.env.DB_NAME,
            mongooseCfg: {
                useNewUrlParser: true,
                useCreateIndex: true,
                useUnifiedTopology: true,
                useFindAndModify: false,
            },
        };
        this.models = models;
        this.connectionString = `${this.config.url}/${this.config.database}?authSource=admin`;

        console.log(`Starting...`);
        this.init();
    }

    async init() {
        console.log("Initializing:");
        try {
            this.mongoose = await mongoose.connect(
                this.connectionString,
                this.config.mongooseCfg
            );
        } catch (e) {
            return this.logger.error(e);
        }

        console.log(`Connected: ${this.connectionString}`);
        console.log("Initialized");
    }

    async disconnect() {
        await this.mongoose.connection.close();
    }
}

module.exports = {
    MongoDB
};