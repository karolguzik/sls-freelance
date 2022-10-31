const schema = {
  type: "object",
  properties: {
    body: {
      type: "object",
      properties: {
        client: {
          type: "string",
        },
        description: {
          type: "string",
        },
      },
      required: ["client", "description"],
    },
  },
  required: ["body"],
};

export default schema;
