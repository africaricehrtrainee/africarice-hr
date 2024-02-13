// Import necessary modules and dependencies
import mysql, { Pool } from "mysql2/promise";
import dotenv from "dotenv";
import { triggers } from "../routes/util/sql";

// Load environment variables from a .env file
dotenv.config();

// Define a class named DbService
export class DbService {
    private pool: Pool;

    // Constructor for the DbService class
    constructor() {
        // Create a MySQL connection pool using configuration from environment variables
        this.pool = mysql.createPool({
            host: process.env.DB_HOST, // Database host
            port: parseInt(process.env.DB_PORT || "3306"), // Database port (default is 3306)
            user: process.env.DB_USER, // Database user
            password: process.env.DB_PASSWORD, // Database user's password
            database: process.env.DB_DATABASE, // Name of the database to connect to
            waitForConnections: true, // Whether to wait for available connections
            connectionLimit: 10, // Maximum number of connections in the pool
            queueLimit: 0, // Maximum number of queued connection requests
        });

        // Initialize the database by running SQL scripts
        this.init();
    }

    // Method for executing database queries
    async query(sql: string, params?: any[]): Promise<any> {
        // Execute the SQL query using the connection pool and optional parameters
        const [rows] = await this.pool.execute(sql, params);
        return rows; // Return the query result
    }

    // Method to initialize the database by running SQL scripts
    async init(): Promise<void> {
        // this.pool.execute(triggers);
    }

    // Method to gracefully close the database connection pool
    async close(): Promise<void> {
        await this.pool.end();
    }
}
