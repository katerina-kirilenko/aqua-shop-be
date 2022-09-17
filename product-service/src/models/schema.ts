const inputSchema = {
  type: "object",
  properties: {
    body: {
      type: "object",
      properties: {
        title: { type: 'string' },
        description: { type: 'string' },
        price: { type: 'number' },
        image:  { type: 'string' },
        count:  { type: 'number' },
      },
    },
  },
};

const outputSchema = {
  type: "object",
  required: ["body", "statusCode"],
  properties: {
    body: {
      type: "string",
    },
    statusCode: {
      type: "number",
    },
    headers: {
      type: "object",
    },
  },
};

export { inputSchema, outputSchema };
