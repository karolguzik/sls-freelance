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
      },
      required: ["jobId", "stepId"],
    },
  },
  required: ["body"],
};

export default schema;
