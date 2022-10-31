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
        status: {
          type: "string",
          enum: ["ACCEPTED", "REJECTED"],
        },
      },
      required: ["jobId", "stepId", "status"],
    },
  },
  required: ["body"],
};

export default schema;
