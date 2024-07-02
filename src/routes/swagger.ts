import swaggerJSDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import express, { Express } from "express";
import path from "path";

const swaggerDefinition = {
  openapi: "3.0.0",
  info: {
    title: "Journaling App API",
    version: "1.0.0",
    description: "API documentation for the Journaling App",
  },
  servers: [
    {
      url: "http://localhost:5001",
      description: "Development server",
    },
  ],
};

const options = {
  swaggerDefinition,
  apis: ["./src/routes/*.ts"],
};

const swaggerSpec = swaggerJSDoc(options);

export const setupSwagger = (app: Express) => {
  app.use(
    "/api-docs",
    swaggerUi.serve,
    swaggerUi.setup(swaggerSpec, {
      customCssUrl: path.join(__dirname, "../public/custom-swagger.css"),
      customSiteTitle: "Journaling App API Docs",
    })
  );

  app.use("/public", express.static(path.join(__dirname, "../public")));
};
