import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { ZodError } from "zod";
import { contactFormSchema, insertContactMessageSchema } from "@shared/schema";
import { fromZodError } from "zod-validation-error";

export async function registerRoutes(app: Express): Promise<Server> {
  // Contact form submission endpoint
  app.post("/api/contact", async (req, res) => {
    try {
      // Validate input
      const formData = contactFormSchema.parse(req.body);
      
      // Transform to insert schema
      const contactMessage = insertContactMessageSchema.parse({
        name: formData.name,
        email: formData.email,
        subject: formData.subject,
        message: formData.message,
      });
      
      // In a real app with a database, we would store this
      // For now, we'll just log it
      console.log("Received contact message:", contactMessage);
      
      return res.status(200).json({
        success: true,
        message: "Message received successfully",
      });
    } catch (error) {
      if (error instanceof ZodError) {
        const validationError = fromZodError(error);
        return res.status(400).json({
          success: false,
          message: validationError.message,
        });
      }
      
      console.error("Error processing contact form:", error);
      return res.status(500).json({
        success: false,
        message: "An error occurred while processing your message",
      });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
