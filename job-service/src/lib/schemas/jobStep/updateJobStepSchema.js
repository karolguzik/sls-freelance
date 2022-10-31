const schema = {
  type: "object",
  properties: {
    body: {
      type: "object",
      properties: {
        jobId: {
          type: "string",
        },
        stepId: {
          type: "string",
        },
        title: {
          type: "string",
        },
        description: {
          type: "string",
        },
        documents: {
          type: "array",
          items: {
            type: "object",
            properties: {
              id: {
                type: "string",
              },
              title: {
                type: "string",
              },
              document: {
                type: "string",
              },
            },
          },
        },
        status: {
          type: "string",
          enum: ["ACCEPTED", "REJECTED", "IN_PROGRESS"],
          default: "IN_PROGRESS",
        },
      },
      required: ["jobId", "stepId", "title", "description"],
    },
  },
  required: ["body"],
};

export default schema;
