import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { ListToolsRequestSchema, CallToolRequestSchema } from "@modelcontextprotocol/sdk/types.js";
import mysql from "mysql2/promise";

// Database configuration
const DB_CONFIG = {
  host: "localhost",
  port: 3306,
  user: "root",
  password: "123456",
  database: "CELC",
};

// Create server instance
const server = new Server(
  { name: "mariadb-server", version: "1.0.0" },
  { capabilities: { tools: {} } }
);

// Helper function to get database connection
async function getConnection() {
  return await mysql.createConnection(DB_CONFIG);
}

// Define tools
const tools = [
  {
    name: "execute_query",
    description: "Execute a SQL query on the MariaDB database",
    inputSchema: {
      type: "object",
      properties: {
        query: { type: "string", description: "The SQL query to execute" }
      },
      required: ["query"]
    }
  },
  {
    name: "list_tables",
    description: "List all tables in the database",
    inputSchema: {
      type: "object",
      properties: {},
      required: []
    }
  }
];

// Register handlers
server.setRequestHandler(ListToolsRequestSchema, () => {
  return { tools };
});

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;
  let connection;
  try {
    if (name === "execute_query") {
      const query = args?.query as string;
      connection = await getConnection();
      const [rows] = await connection.execute(query);

      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(rows, null, 2),
          },
        ],
      };
    } else if (name === "list_tables") {
      connection = await getConnection();
      const [rows] = await connection.execute("SHOW TABLES");

      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(rows, null, 2),
          },
        ],
      };
    } else {
      throw new Error("Tool not found");
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return {
      content: [
        {
          type: "text",
          text: `Error: ${message}`,
        },
      ],
    };
  } finally {
    if (connection) {
      await connection.end();
    }
  }
});

// Run the server
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("MariaDB MCP Server running on stdio");
}

main().catch((error) => {
  console.error("Fatal error in main():", error);
  process.exit(1);
});