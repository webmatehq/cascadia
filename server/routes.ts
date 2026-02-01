import express, { type Express, type Response } from "express";
import { ZodError } from "zod";
import { contactFormSchema, insertContactMessageSchema, newsletterSignupSchema, newsletterSubscribers } from "@shared/schema";
import nodemailer from "nodemailer";
import pdfParse from "pdf-parse";
import {
  createBeer,
  createEvent,
  createUpcomingScheduleItem,
  createWine,
  deleteBeer,
  deleteEvent,
  deleteUpcomingScheduleItem,
  deleteWine,
  getContent,
  reorderUpcomingScheduleItems,
  resetAll,
  resetBeers,
  resetEvents,
  resetUpcomingSchedule,
  resetWines,
  updateUpcomingScheduleItem,
  updateBeer,
  updateEvent,
  upsertUpcomingScheduleWeek,
  updateWine,
} from "./content-store";
import { fromZodError } from "zod-validation-error";
import {
  beerInputSchema,
  eventInputSchema,
  upcomingScheduleItemInputSchema,
  upcomingScheduleWeekInputSchema,
  wineInputSchema,
} from "@shared/content";
import { z } from "zod";
import { db } from "./db";

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

const escapeHtml = (value: string) =>
  value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");

const formatPdfTextAsHtml = (text: string) => {
  const paragraphs = text
    .split(/\n\s*\n/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);

  if (paragraphs.length === 0) {
    return "<p style=\"font-size: 16px;\">(No text content found in the PDF.)</p>";
  }

  return paragraphs
    .map((paragraph) => {
      const withBreaks = escapeHtml(paragraph).replace(/\n/g, "<br/>");
      return `<p style="margin: 0 0 16px; font-size: 16px; line-height: 1.6; color: #111827;">${withBreaks}</p>`;
    })
    .join("");
};

const parseSender = (value: string) => {
  const match = value.match(/^(.*)<([^>]+)>$/);
  if (!match) {
    return { name: "Cascadia Tap House", email: value.trim() };
  }
  return {
    name: match[1].trim().replace(/^"|"$/g, "") || "Cascadia Tap House",
    email: match[2].trim(),
  };
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

  app.put("/api/admin/upcoming-schedule/week", async (req, res) => {
    try {
      const payload = upcomingScheduleWeekInputSchema.parse(req.body);
      const scheduleWeek = await upsertUpcomingScheduleWeek(payload);
      res.json(scheduleWeek);
    } catch (error) {
      handleError(error, res);
    }
  });

  app.post("/api/admin/upcoming-schedule/items", async (req, res) => {
    try {
      const payload = upcomingScheduleItemInputSchema.parse(req.body);
      const item = await createUpcomingScheduleItem(payload);
      res.status(201).json(item);
    } catch (error) {
      handleError(error, res);
    }
  });

  app.put("/api/admin/upcoming-schedule/items/reorder", async (req, res) => {
    try {
      const payload = z
        .array(
          z.object({
            id: z.string(),
            sortOrder: z.number().int().nonnegative(),
          })
        )
        .parse(req.body);
      await reorderUpcomingScheduleItems(payload);
      res.status(200).json({ success: true });
    } catch (error) {
      handleError(error, res);
    }
  });

  app.put("/api/admin/upcoming-schedule/items/:id", async (req, res) => {
    try {
      const payload = upcomingScheduleItemInputSchema.parse(req.body);
      const item = await updateUpcomingScheduleItem(req.params.id, payload);
      res.json(item);
    } catch (error) {
      handleError(error, res);
    }
  });

  app.delete("/api/admin/upcoming-schedule/items/:id", async (req, res) => {
    try {
      await deleteUpcomingScheduleItem(req.params.id);
      res.status(204).end();
    } catch (error) {
      handleError(error, res);
    }
  });

  app.post("/api/admin/upcoming-schedule/reset", async (_req, res) => {
    try {
      const scheduleWeek = await resetUpcomingSchedule();
      res.json(scheduleWeek);
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

  app.post("/api/newsletter", async (req, res) => {
    try {
      const { email } = newsletterSignupSchema.parse(req.body);
      const normalizedEmail = email.trim().toLowerCase();
      const [inserted] = await db
        .insert(newsletterSubscribers)
        .values({ email: normalizedEmail })
        .onConflictDoNothing({ target: newsletterSubscribers.email })
        .returning();

      return res.status(200).json({
        success: true,
        status: inserted ? "subscribed" : "already",
        message: inserted ? "Thanks for joining the newsletter." : "This email is already subscribed.",
      });
    } catch (error) {
      handleError(error, res);
    }
  });

  app.get("/api/admin/newsletter", async (_req, res) => {
    try {
      const subscribers = await db.query.newsletterSubscribers.findMany({
        orderBy: (fields, { asc }) => asc(fields.createdAt),
      });
      res.json({ subscribers });
    } catch (error) {
      handleError(error, res);
    }
  });

  app.get("/api/admin/newsletter/export", async (_req, res) => {
    try {
      const subscribers = await db.query.newsletterSubscribers.findMany({
        orderBy: (fields, { asc }) => asc(fields.createdAt),
      });
      const header = "email,created_at\n";
      const rows = subscribers
        .map((subscriber) => {
          const email = `"${subscriber.email.replace(/"/g, '""')}"`;
          const createdAt = subscriber.createdAt.toISOString();
          return `${email},${createdAt}`;
        })
        .join("\n");
      res.setHeader("Content-Type", "text/csv; charset=utf-8");
      res.setHeader("Content-Disposition", "attachment; filename=\"newsletter-subscribers.csv\"");
      res.status(200).send(header + rows);
    } catch (error) {
      handleError(error, res);
    }
  });

  app.post(
    "/api/admin/newsletter/send",
    express.raw({ type: "application/pdf", limit: "20mb" }),
    async (req, res) => {
      try {
        const { subject = "Cascadia Tap House Newsletter" } = req.query;
        const {
          SMTP_HOST,
          SMTP_PORT,
          SMTP_SECURE,
          SMTP_USER,
          SMTP_PASS,
          MAIL_FROM,
          BREVO_API_KEY,
        } = process.env;

        if (!MAIL_FROM) {
          return res.status(500).json({
            success: false,
            message: "MAIL_FROM is not configured.",
          });
        }

        if (!Buffer.isBuffer(req.body) || req.body.length === 0) {
          return res.status(400).json({
            success: false,
            message: "El PDF está vacío o no se recibió correctamente.",
          });
        }

        const subscribers = await db.query.newsletterSubscribers.findMany({
          orderBy: (fields, { asc }) => asc(fields.createdAt),
        });

        if (subscribers.length === 0) {
          return res.status(400).json({
            success: false,
            message: "No hay correos suscritos para enviar.",
          });
        }

        const parsed = await pdfParse(req.body);
        const htmlBody = formatPdfTextAsHtml(parsed.text || "");
        const textBody = parsed.text?.trim() || "Newsletter update.";

        const bccList = subscribers.map((subscriber) => subscriber.email);
        const sender = parseSender(MAIL_FROM);

        const emailSubject = Array.isArray(subject) ? subject[0] : subject;
        const html = `
          <div style="font-family: 'Helvetica Neue', Arial, sans-serif; background: #f8fafc; padding: 24px;">
            <div style="max-width: 680px; margin: 0 auto; background: #ffffff; border-radius: 14px; border: 1px solid #e5e7eb; overflow: hidden;">
              <div style="background: #1e3a5f; color: #ffffff; padding: 24px;">
                <h1 style="margin: 0; font-size: 22px; letter-spacing: 0.3px;">Cascadia Tap House</h1>
                <p style="margin: 6px 0 0; font-size: 14px; opacity: 0.9;">Newsletter update</p>
              </div>
              <div style="padding: 24px;">
                ${htmlBody}
              </div>
            </div>
          </div>
        `;

        console.log(BREVO_API_KEY,"BREVO_API_KEY")

        if (BREVO_API_KEY) {
          const response = await fetch("https://api.brevo.com/v3/smtp/email", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "api-key": BREVO_API_KEY,
            },
            body: JSON.stringify({
              sender,
              to: [sender],
              bcc: bccList.map((email) => ({ email })),
              subject: emailSubject,
              htmlContent: html,
              textContent: textBody,
            }),
          });

          if (!response.ok) {
            const errorText = await response.text().catch(() => "");
            return res.status(500).json({
              success: false,
              message: errorText || "No se pudo enviar el newsletter con Brevo.",
            });
          }
        } else {
          if (!SMTP_HOST || !SMTP_PORT || !SMTP_USER || !SMTP_PASS) {
            return res.status(500).json({
              success: false,
              message: "Email service is not configured.",
            });
          }

          const transporter = nodemailer.createTransport({
            host: SMTP_HOST,
            port: Number(SMTP_PORT),
            secure: SMTP_SECURE === "true",
            auth: {
              user: SMTP_USER,
              pass: SMTP_PASS,
            },
          });

          await transporter.sendMail({
            from: MAIL_FROM,
            to: MAIL_FROM,
            bcc: bccList,
            subject: emailSubject,
            text: textBody,
            html,
          });
        }

        return res.status(200).json({
          success: true,
          message: "Newsletter sent.",
        });
      } catch (error) {
        handleError(error, res);
      }
    }
  );
}
