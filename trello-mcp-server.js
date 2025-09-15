#!/usr/bin/env node

/**
 * Simple Trello MCP Server for Demo
 * This creates a basic MCP server that can interact with Trello API
 */

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';

const TRELLO_API_KEY = process.env.TRELLO_API_KEY;
const TRELLO_TOKEN = process.env.TRELLO_TOKEN;
const TRELLO_BASE_URL = 'https://api.trello.com/1';

class TrelloMCPServer {
  constructor() {
    this.server = new Server(
      {
        name: 'trello-mcp-server',
        version: '0.1.0',
      },
      {
        capabilities: {
          tools: {},
        },
      }
    );

    this.setupToolHandlers();
    
    // Error handling
    this.server.onerror = (error) => console.error('[MCP Error]', error);
    process.on('SIGINT', async () => {
      await this.server.close();
      process.exit(0);
    });
  }

  setupToolHandlers() {
    this.server.setRequestHandler(ListToolsRequestSchema, async () => ({
      tools: [
        {
          name: 'trello_create_card',
          description: 'Create a new card in a Trello board',
          inputSchema: {
            type: 'object',
            properties: {
              name: {
                type: 'string',
                description: 'Name of the card',
              },
              desc: {
                type: 'string',
                description: 'Description of the card',
              },
              listId: {
                type: 'string',
                description: 'ID of the list to add the card to',
              },
            },
            required: ['name', 'listId'],
          },
        },
        {
          name: 'trello_move_card',
          description: 'Move a card to a different list',
          inputSchema: {
            type: 'object',
            properties: {
              cardId: {
                type: 'string',
                description: 'ID of the card to move',
              },
              listId: {
                type: 'string',
                description: 'ID of the target list',
              },
            },
            required: ['cardId', 'listId'],
          },
        },
        {
          name: 'trello_get_boards',
          description: 'Get all boards for the authenticated user',
          inputSchema: {
            type: 'object',
            properties: {},
          },
        },
        {
          name: 'trello_get_lists',
          description: 'Get all lists for a specific board',
          inputSchema: {
            type: 'object',
            properties: {
              boardId: {
                type: 'string',
                description: 'ID of the board',
              },
            },
            required: ['boardId'],
          },
        },
        {
          name: 'zapier_webhook',
          description: 'Trigger a Zapier webhook with custom data',
          inputSchema: {
            type: 'object',
            properties: {
              webhookUrl: {
                type: 'string',
                description: 'Zapier webhook URL',
              },
              data: {
                type: 'object',
                description: 'Data to send to the webhook',
              },
            },
            required: ['webhookUrl', 'data'],
          },
        },
      ],
    }));

    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      const { name, arguments: args } = request.params;

      try {
        switch (name) {
          case 'trello_create_card':
            return await this.createCard(args);
          case 'trello_move_card':
            return await this.moveCard(args);
          case 'trello_get_boards':
            return await this.getBoards();
          case 'trello_get_lists':
            return await this.getLists(args);
          case 'zapier_webhook':
            return await this.triggerWebhook(args);
          default:
            throw new Error(`Unknown tool: ${name}`);
        }
      } catch (error) {
        return {
          content: [
            {
              type: 'text',
              text: `Error: ${error.message}`,
            },
          ],
        };
      }
    });
  }

  async makeRequest(endpoint, method = 'GET', body = null) {
    const url = `${TRELLO_BASE_URL}${endpoint}`;
    const params = new URLSearchParams({
      key: TRELLO_API_KEY,
      token: TRELLO_TOKEN,
    });

    const response = await fetch(`${url}?${params}`, {
      method,
      headers: {
        'Content-Type': 'application/json',
      },
      body: body ? JSON.stringify(body) : null,
    });

    if (!response.ok) {
      throw new Error(`Trello API error: ${response.status} ${response.statusText}`);
    }

    return await response.json();
  }

  async createCard(args) {
    const { name, desc, listId } = args;
    
    const result = await this.makeRequest('/cards', 'POST', {
      name,
      desc: desc || '',
      idList: listId,
    });

    return {
      content: [
        {
          type: 'text',
          text: `Successfully created Trello card: "${name}" (ID: ${result.id})`,
        },
      ],
    };
  }

  async moveCard(args) {
    const { cardId, listId } = args;
    
    await this.makeRequest(`/cards/${cardId}`, 'PUT', {
      idList: listId,
    });

    return {
      content: [
        {
          type: 'text',
          text: `Successfully moved card ${cardId} to list ${listId}`,
        },
      ],
    };
  }

  async getBoards() {
    const boards = await this.makeRequest('/members/me/boards');
    
    const boardList = boards.map(board => `- ${board.name} (ID: ${board.id})`).join('\n');
    
    return {
      content: [
        {
          type: 'text',
          text: `Your Trello boards:\n${boardList}`,
        },
      ],
    };
  }

  async getLists(args) {
    const { boardId } = args;
    const lists = await this.makeRequest(`/boards/${boardId}/lists`);
    
    const listInfo = lists.map(list => `- ${list.name} (ID: ${list.id})`).join('\n');
    
    return {
      content: [
        {
          type: 'text',
          text: `Lists in board:\n${listInfo}`,
        },
      ],
    };
  }

  async triggerWebhook(args) {
    const { webhookUrl, data } = args;
    
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`Webhook failed: ${response.status} ${response.statusText}`);
    }

    return {
      content: [
        {
          type: 'text',
          text: `Successfully triggered Zapier webhook with data: ${JSON.stringify(data, null, 2)}`,
        },
      ],
    };
  }

  async run() {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    console.error('Trello MCP server running on stdio');
  }
}

const server = new TrelloMCPServer();
server.run().catch(console.error);
