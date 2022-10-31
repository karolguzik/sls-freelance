const schema = {
  type: "object",
  properties: {
    body: {
      type: "object",
      properties: {
        client: {
          type: "string",
        },
        title: {
          type: "string",
        },
        description: {
          type: "string",
        },
        steps: {
          type: "array",
          default: [],
        },
      },
      required: ["client", "title", "description"],
    },
  },
  required: ["body"],
};

export default schema;
