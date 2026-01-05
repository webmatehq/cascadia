import express, { type Express, type Response } from "express";
import { ZodError } from "zod";
import { contactFormSchema, insertContactMessageSchema } from "@shared/schema";
import {
  createBeer,
  createEvent,
  createWine,
  deleteBeer,
  deleteEvent,
  deleteWine,
  getContent,
  resetAll,
  resetBeers,
  resetEvents,
  resetWines,
  updateBeer,
  updateEvent,
  updateWine,
} from "./content-store";
import { fromZodError } from "zod-validation-error";
import { beerInputSchema, eventInputSchema, wineInputSchema } from "@shared/content";

const handleError = (error: unknown, res: Response) => {
  if (error instanceof ZodError) {
    const validationError = fromZodError(error);
    return res.status(400).json({
      success: false,
      message: validationError.message,
    });
  }

  console.error(error);
  return res.status(500).json({
    success: false,
    message: "Unexpected server error",
  });
};

export function registerRoutes(app: Express) {
  app.post(
    "/api/admin/menu-upload",
    express.raw({ type: "application/pdf", limit: "15mb" }),
    async (req, res) => {
      try {
        const supabaseUrl = process.env.SUPABASE_URL;
        const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
        if (!supabaseUrl || !supabaseServiceKey) {
          return res.status(500).json({
            success: false,
            message: "Faltan credenciales de Supabase en el servidor.",
          });
        }

        if (!Buffer.isBuffer(req.body) || req.body.length === 0) {
          return res.status(400).json({
            success: false,
            message: "El PDF está vacío o no se recibió correctamente.",
          });
        }

        const uploadResponse = await fetch(
          `${supabaseUrl}/storage/v1/object/Cascadia/Menu/cascadia-menu.pdf`,
          {
            method: "POST",
            headers: {
              apikey: supabaseServiceKey,
              Authorization: `Bearer ${supabaseServiceKey}`,
              "Content-Type": "application/pdf",
              "x-upsert": "true",
            },
            body: req.body,
          }
        );

        if (!uploadResponse.ok) {
          const errorText = await uploadResponse.text().catch(() => "");
          return res.status(uploadResponse.status).json({
            success: false,
            message: errorText || "No se pudo subir el PDF.",
          });
        }

        return res.status(200).json({ success: true });
      } catch (error) {
        handleError(error, res);
      }
    }
  );

  app.get("/api/content", async (_req, res) => {
    try {
      const content = await getContent();
      res.json(content);
    } catch (error) {
      handleError(error, res);
    }
  });

  app.post("/api/admin/beers", async (req, res) => {
    try {
      const payload = beerInputSchema.parse(req.body);
      const beer = await createBeer(payload);
      res.status(201).json(beer);
    } catch (error) {
      handleError(error, res);
    }
  });

  app.put("/api/admin/beers/:id", async (req, res) => {
    try {
      const payload = beerInputSchema.parse(req.body);
      const beer = await updateBeer(req.params.id, payload);
      res.json(beer);
    } catch (error) {
      handleError(error, res);
    }
  });

  app.delete("/api/admin/beers/:id", async (req, res) => {
    try {
      await deleteBeer(req.params.id);
      res.status(204).end();
    } catch (error) {
      handleError(error, res);
    }
  });

  app.post("/api/admin/beers/reset", async (_req, res) => {
    try {
      const beers = await resetBeers();
      res.json(beers);
    } catch (error) {
      handleError(error, res);
    }
  });

  app.post("/api/admin/wines", async (req, res) => {
    try {
      const payload = wineInputSchema.parse(req.body);
      const wine = await createWine(payload);
      res.status(201).json(wine);
    } catch (error) {
      handleError(error, res);
    }
  });

  app.put("/api/admin/wines/:id", async (req, res) => {
    try {
      const payload = wineInputSchema.parse(req.body);
      const wine = await updateWine(req.params.id, payload);
      res.json(wine);
    } catch (error) {
      handleError(error, res);
    }
  });

  app.delete("/api/admin/wines/:id", async (req, res) => {
    try {
      await deleteWine(req.params.id);
      res.status(204).end();
    } catch (error) {
      handleError(error, res);
    }
  });

  app.post("/api/admin/wines/reset", async (_req, res) => {
    try {
      const wines = await resetWines();
      res.json(wines);
    } catch (error) {
      handleError(error, res);
    }
  });

  app.post("/api/admin/events", async (req, res) => {
    try {
      const payload = eventInputSchema.parse(req.body);
      const event = await createEvent(payload);
      res.status(201).json(event);
    } catch (error) {
      handleError(error, res);
    }
  });

  app.put("/api/admin/events/:id", async (req, res) => {
    try {
      const payload = eventInputSchema.parse(req.body);
      const event = await updateEvent(req.params.id, payload);
      res.json(event);
    } catch (error) {
      handleError(error, res);
    }
  });

  app.delete("/api/admin/events/:id", async (req, res) => {
    try {
      await deleteEvent(req.params.id);
      res.status(204).end();
    } catch (error) {
      handleError(error, res);
    }
  });

  app.post("/api/admin/events/reset", async (_req, res) => {
    try {
      const events = await resetEvents();
      res.json(events);
    } catch (error) {
      handleError(error, res);
    }
  });

  app.post("/api/admin/reset", async (_req, res) => {
    try {
      const content = await resetAll();
      res.json(content);
    } catch (error) {
      handleError(error, res);
    }
  });

  app.post("/api/contact", async (req, res) => {
    try {
      const formData = contactFormSchema.parse(req.body);
      const contactMessage = insertContactMessageSchema.parse({
        name: formData.name,
        email: formData.email,
        subject: formData.subject,
        message: formData.message,
      });
      console.log("Received contact message:", contactMessage);
      return res.status(200).json({
        success: true,
        message: "Message received successfully",
      });
    } catch (error) {
      handleError(error, res);
    }
  });
}
