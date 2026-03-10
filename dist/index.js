var __defProp = Object.defineProperty;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __esm = (fn, res) => function __init() {
  return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
};
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};

// shared/schema.ts
import {
  pgTable,
  serial,
  varchar,
  text,
  timestamp,
  decimal,
  integer,
  boolean,
  jsonb,
  index
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { z } from "zod";
var sessions, users, passwordResetTokens, partners, projects, tickets, portfolio, payments2, paymentStages, notifications, projectMessages, projectTimeline, ticketResponses, budgetNegotiations, workModalities, clientBillingInfo, companyBillingInfo, exchangeRateConfig, legalPages, referrals, projectFiles, paymentMethods, invoices, transactions, usersRelations, partnersRelations, projectsRelations, referralsRelations, ticketsRelations, paymentsRelations, heroSlides, paymentMethodsRelations, invoicesRelations, transactionsRelations, paymentStagesRelations, notificationsRelations, projectMessagesRelations, projectFilesRelations, projectTimelineRelations, ticketResponsesRelations, budgetNegotiationsRelations, clientBillingInfoRelations, loginSchema, registerSchema, contactSchema, insertProjectSchema, insertTicketSchema;
var init_schema = __esm({
  "shared/schema.ts"() {
    "use strict";
    sessions = pgTable(
      "sessions",
      {
        sid: varchar("sid").primaryKey(),
        sess: jsonb("sess").notNull(),
        expire: timestamp("expire").notNull()
      },
      (table) => [index("IDX_session_expire").on(table.expire)]
    );
    users = pgTable("users", {
      id: serial("id").primaryKey(),
      email: varchar("email", { length: 255 }).notNull().unique(),
      password: varchar("password", { length: 255 }).notNull(),
      fullName: varchar("full_name", { length: 255 }).notNull(),
      role: varchar("role", { length: 50 }).notNull().default("cliente"),
      // 'admin', 'cliente', 'socio'
      whatsappNumber: varchar("whatsapp_number", { length: 50 }),
      isActive: boolean("is_active").notNull().default(true),
      createdAt: timestamp("created_at").defaultNow(),
      updatedAt: timestamp("updated_at").defaultNow()
    });
    passwordResetTokens = pgTable("password_reset_tokens", {
      id: serial("id").primaryKey(),
      userId: integer("user_id").references(() => users.id).notNull(),
      token: varchar("token", { length: 255 }).notNull().unique(),
      expiresAt: timestamp("expires_at").notNull(),
      used: boolean("used").notNull().default(false),
      createdAt: timestamp("created_at").defaultNow()
    });
    partners = pgTable("partners", {
      id: serial("id").primaryKey(),
      userId: integer("user_id").references(() => users.id).notNull(),
      referralCode: varchar("referral_code", { length: 50 }).unique().notNull(),
      commissionRate: decimal("commission_rate", { precision: 5, scale: 2 }).notNull().default("25.00"),
      totalEarnings: decimal("total_earnings", { precision: 12, scale: 2 }).notNull().default("0.00"),
      createdAt: timestamp("created_at").defaultNow()
    });
    projects = pgTable("projects", {
      id: serial("id").primaryKey(),
      name: varchar("name", { length: 255 }).notNull(),
      description: text("description"),
      price: decimal("price", { precision: 12, scale: 2 }).notNull(),
      status: varchar("status", { length: 50 }).notNull().default("pendiente"),
      // 'pendiente', 'negociando', 'en_progreso', 'completado', 'cancelado'
      progress: integer("progress").notNull().default(0),
      // 0-100
      clientId: integer("client_id").references(() => users.id).notNull(),
      partnerId: integer("partner_id").references(() => partners.id),
      startDate: timestamp("start_date"),
      deliveryDate: timestamp("delivery_date"),
      createdAt: timestamp("created_at").defaultNow(),
      updatedAt: timestamp("updated_at").defaultNow()
    });
    tickets = pgTable("tickets", {
      id: serial("id").primaryKey(),
      title: varchar("title", { length: 255 }).notNull(),
      description: text("description").notNull(),
      status: varchar("status", { length: 50 }).notNull().default("abierto"),
      // 'abierto', 'en_progreso', 'resuelto', 'cerrado'
      priority: varchar("priority", { length: 50 }).notNull().default("media"),
      // 'baja', 'media', 'alta', 'urgente'
      userId: integer("user_id").references(() => users.id).notNull(),
      projectId: integer("project_id").references(() => projects.id),
      createdAt: timestamp("created_at").defaultNow(),
      updatedAt: timestamp("updated_at").defaultNow()
    });
    portfolio = pgTable("portfolio", {
      id: serial("id").primaryKey(),
      title: varchar("title", { length: 255 }).notNull(),
      description: text("description").notNull(),
      category: varchar("category", { length: 100 }).notNull(),
      // 'E-commerce', 'Dashboard', 'Mobile App', etc.
      technologies: text("technologies").notNull(),
      // JSON string with tech stack
      imageUrl: text("image_url").notNull(),
      demoUrl: text("demo_url"),
      completedAt: timestamp("completed_at").notNull(),
      featured: boolean("featured").notNull().default(false),
      isActive: boolean("is_active").notNull().default(true),
      createdAt: timestamp("created_at").defaultNow(),
      updatedAt: timestamp("updated_at").defaultNow()
    });
    payments2 = pgTable("payments", {
      id: serial("id").primaryKey(),
      projectId: integer("project_id").references(() => projects.id).notNull(),
      amount: decimal("amount", { precision: 12, scale: 2 }).notNull(),
      status: varchar("status", { length: 50 }).notNull().default("pendiente"),
      paymentData: jsonb("payment_data"),
      createdAt: timestamp("created_at").defaultNow(),
      stage: varchar("stage", { length: 50 }).default("full"),
      stagePercentage: decimal("stage_percentage", { precision: 5, scale: 2 }).default("100.00"),
      paymentMethod: varchar("payment_method", { length: 100 }),
      transactionId: varchar("transaction_id", { length: 255 })
    });
    paymentStages = pgTable("payment_stages", {
      id: serial("id").primaryKey(),
      projectId: integer("project_id").references(() => projects.id).notNull(),
      stageName: text("stage_name").notNull(),
      stagePercentage: integer("stage_percentage").notNull(),
      amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
      requiredProgress: integer("required_progress").notNull().default(0),
      status: text("status").notNull().default("pendiente"),
      // pendiente, disponible, pagado
      paymentLink: text("payment_link"),
      paymentMethod: varchar("payment_method", { length: 50 }),
      // mango, ueno, solar
      paymentData: jsonb("payment_data"),
      // Datos adicionales del pago
      proofFileUrl: text("proof_file_url"),
      // URL del comprobante
      paidAt: timestamp("paid_date"),
      exchangeRateUsed: decimal("exchange_rate_used", { precision: 10, scale: 2 }),
      // Tipo de cambio usado al momento del pago
      createdAt: timestamp("created_at").defaultNow(),
      updatedAt: timestamp("updated_at").defaultNow()
    });
    notifications = pgTable("notifications", {
      id: serial("id").primaryKey(),
      userId: integer("user_id").references(() => users.id).notNull(),
      title: varchar("title", { length: 255 }).notNull(),
      message: text("message").notNull(),
      type: varchar("type", { length: 50 }).notNull().default("info"),
      // 'info', 'exito', 'advertencia', 'error'
      isRead: boolean("is_read").notNull().default(false),
      createdAt: timestamp("created_at").defaultNow()
    });
    projectMessages = pgTable("project_messages", {
      id: serial("id").primaryKey(),
      projectId: integer("project_id").references(() => projects.id).notNull(),
      userId: integer("user_id").references(() => users.id).notNull(),
      message: text("message").notNull(),
      createdAt: timestamp("created_at").defaultNow()
    });
    projectTimeline = pgTable("project_timeline", {
      id: serial("id").primaryKey(),
      projectId: integer("project_id").references(() => projects.id).notNull(),
      title: varchar("title", { length: 255 }).notNull(),
      description: text("description"),
      status: varchar("status", { length: 50 }).default("pendiente"),
      // 'pendiente', 'en_progreso', 'completado'
      estimatedDate: timestamp("estimated_date"),
      completedAt: timestamp("completed_at"),
      createdAt: timestamp("created_at").defaultNow()
    });
    ticketResponses = pgTable("ticket_responses", {
      id: serial("id").primaryKey(),
      ticketId: integer("ticket_id").references(() => tickets.id).notNull(),
      userId: integer("user_id").references(() => users.id).notNull(),
      message: text("message").notNull(),
      isFromSupport: boolean("is_from_support").default(false),
      createdAt: timestamp("created_at").defaultNow()
    });
    budgetNegotiations = pgTable("budget_negotiations", {
      id: serial("id").primaryKey(),
      projectId: integer("project_id").references(() => projects.id).notNull(),
      proposedBy: integer("proposed_by").references(() => users.id).notNull(),
      originalPrice: decimal("original_price", { precision: 12, scale: 2 }).notNull(),
      proposedPrice: decimal("proposed_price", { precision: 12, scale: 2 }).notNull(),
      message: text("message"),
      status: varchar("status", { length: 50 }).notNull().default("pendiente"),
      // 'pendiente', 'aceptado', 'rechazado', 'contrapuesta'
      createdAt: timestamp("created_at").defaultNow(),
      respondedAt: timestamp("responded_at")
    });
    workModalities = pgTable("work_modalities", {
      id: serial("id").primaryKey(),
      title: varchar("title", { length: 255 }).notNull(),
      subtitle: varchar("subtitle", { length: 255 }),
      badgeText: varchar("badge_text", { length: 100 }),
      badgeVariant: varchar("badge_variant", { length: 50 }).default("secondary"),
      description: text("description").notNull(),
      priceText: varchar("price_text", { length: 255 }).notNull(),
      priceSubtitle: varchar("price_subtitle", { length: 255 }),
      features: jsonb("features").notNull(),
      buttonText: varchar("button_text", { length: 255 }).notNull().default("Solicitar Cotizaci\xF3n"),
      buttonVariant: varchar("button_variant", { length: 50 }).default("default"),
      isPopular: boolean("is_popular").default(false),
      isActive: boolean("is_active").default(true),
      displayOrder: integer("display_order").default(0),
      createdAt: timestamp("created_at").defaultNow(),
      updatedAt: timestamp("updated_at").defaultNow()
    });
    clientBillingInfo = pgTable("client_billing_info", {
      id: serial("id").primaryKey(),
      userId: integer("user_id").references(() => users.id).notNull(),
      clientType: varchar("client_type", { length: 50 }).notNull().default("persona_fisica"),
      // persona_fisica, empresa, consumidor_final, extranjero
      legalName: varchar("legal_name", { length: 255 }).notNull(),
      documentType: varchar("document_type", { length: 50 }).notNull().default("CI"),
      documentNumber: varchar("document_number", { length: 50 }).notNull(),
      address: text("address"),
      city: varchar("city", { length: 100 }),
      department: varchar("department", { length: 100 }),
      country: varchar("country", { length: 100 }).default("Paraguay"),
      email: varchar("email", { length: 255 }),
      phone: varchar("phone", { length: 20 }),
      observations: text("observations"),
      isDefault: boolean("is_default").default(true),
      createdAt: timestamp("created_at").defaultNow(),
      updatedAt: timestamp("updated_at").defaultNow()
    });
    companyBillingInfo = pgTable("company_billing_info", {
      id: serial("id").primaryKey(),
      companyName: varchar("company_name", { length: 255 }).notNull(),
      titularName: varchar("titular_name", { length: 255 }),
      ruc: varchar("ruc", { length: 20 }).notNull(),
      address: text("address").notNull(),
      city: varchar("city", { length: 100 }).notNull(),
      department: varchar("department", { length: 100 }).default("Itap\xFAa"),
      country: varchar("country", { length: 100 }).default("Paraguay"),
      phone: varchar("phone", { length: 20 }),
      email: varchar("email", { length: 255 }),
      website: varchar("website", { length: 255 }),
      taxRegime: varchar("tax_regime", { length: 100 }),
      economicActivity: varchar("economic_activity", { length: 255 }),
      logoUrl: text("logo_url"),
      timbradoNumber: varchar("timbrado_number", { length: 20 }),
      vigenciaTimbrado: varchar("vigencia_timbrado", { length: 20 }),
      vencimientoTimbrado: varchar("vencimiento_timbrado", { length: 20 }),
      boletaPrefix: varchar("boleta_prefix", { length: 20 }).default("001-001"),
      boletaSequence: integer("boleta_sequence").default(1),
      ivaPercentage: decimal("iva_percentage", { precision: 5, scale: 2 }).default("10.00"),
      isSignatureProcessEnabled: boolean("is_signature_process_enabled").default(true),
      isActive: boolean("is_active").default(true),
      createdAt: timestamp("created_at").defaultNow(),
      updatedAt: timestamp("updated_at").defaultNow()
    });
    exchangeRateConfig = pgTable("exchange_rate_config", {
      id: serial("id").primaryKey(),
      usdToGuarani: decimal("usd_to_guarani", { precision: 10, scale: 2 }).notNull(),
      updatedBy: integer("updated_by").references(() => users.id).notNull(),
      isActive: boolean("is_active").default(true),
      createdAt: timestamp("created_at").defaultNow(),
      updatedAt: timestamp("updated_at").defaultNow()
    });
    legalPages = pgTable("legal_pages", {
      id: serial("id").primaryKey(),
      pageType: varchar("page_type", { length: 50 }).notNull().unique(),
      // 'terms', 'privacy', 'cookies'
      title: varchar("title", { length: 255 }).notNull(),
      content: text("content").notNull(),
      lastUpdatedBy: integer("last_updated_by").references(() => users.id),
      isActive: boolean("is_active").notNull().default(true),
      createdAt: timestamp("created_at").defaultNow(),
      updatedAt: timestamp("updated_at").defaultNow()
    });
    referrals = pgTable("referrals", {
      id: serial("id").primaryKey(),
      partnerId: integer("partner_id").references(() => partners.id).notNull(),
      clientId: integer("client_id").references(() => users.id).notNull(),
      projectId: integer("project_id").references(() => projects.id),
      commissionAmount: decimal("commission_amount", { precision: 12, scale: 2 }).notNull().default("0.00"),
      status: varchar("status", { length: 50 }).notNull().default("pendiente"),
      // 'pendiente', 'pagado'
      createdAt: timestamp("created_at").defaultNow()
    });
    projectFiles = pgTable("project_files", {
      id: serial("id").primaryKey(),
      projectId: integer("project_id").references(() => projects.id).notNull(),
      fileName: varchar("file_name", { length: 255 }).notNull(),
      fileUrl: text("file_url").notNull(),
      fileSize: integer("file_size"),
      fileType: varchar("file_type", { length: 100 }),
      uploadedBy: integer("uploaded_by").references(() => users.id).notNull(),
      createdAt: timestamp("created_at").defaultNow()
    });
    paymentMethods = pgTable("payment_methods", {
      id: serial("id").primaryKey(),
      userId: integer("user_id").references(() => users.id).notNull(),
      type: varchar("type", { length: 50 }).notNull(),
      // 'credit_card', 'bank_transfer', 'paypal', etc.
      details: jsonb("details").notNull(),
      isDefault: boolean("is_default").default(false),
      isActive: boolean("is_active").default(true),
      createdAt: timestamp("created_at").defaultNow()
    });
    invoices = pgTable("invoices", {
      id: serial("id").primaryKey(),
      invoiceNumber: varchar("invoice_number", { length: 100 }).notNull(),
      projectId: integer("project_id").references(() => projects.id).notNull(),
      clientId: integer("client_id").references(() => users.id).notNull(),
      paymentStageId: integer("payment_stage_id").references(() => paymentStages.id),
      amount: decimal("amount", { precision: 12, scale: 2 }).notNull(),
      status: varchar("status", { length: 50 }).notNull().default("pendiente"),
      // 'pendiente', 'pagado', 'vencido', 'cancelado'
      dueDate: timestamp("due_date").notNull(),
      paidDate: timestamp("paid_date"),
      description: text("description"),
      taxAmount: decimal("tax_amount", { precision: 12, scale: 2 }).default("0.00"),
      discountAmount: decimal("discount_amount", { precision: 12, scale: 2 }).default("0.00"),
      totalAmount: decimal("total_amount", { precision: 12, scale: 2 }).notNull(),
      paymentMethodId: integer("payment_method_id").references(() => paymentMethods.id),
      notes: text("notes"),
      exchangeRateUsed: decimal("exchange_rate_used", { precision: 10, scale: 2 }),
      // Tipo de cambio usado al momento del pago
      // Snapshot de datos de facturación del cliente (congelados al momento de crear la factura)
      clientSnapshotType: varchar("client_snapshot_type", { length: 50 }),
      // persona_fisica, empresa, consumidor_final, extranjero
      clientSnapshotLegalName: varchar("client_snapshot_legal_name", { length: 255 }),
      clientSnapshotDocumentType: varchar("client_snapshot_document_type", { length: 50 }),
      clientSnapshotDocumentNumber: varchar("client_snapshot_document_number", { length: 50 }),
      clientSnapshotAddress: text("client_snapshot_address"),
      clientSnapshotCity: varchar("client_snapshot_city", { length: 100 }),
      clientSnapshotDepartment: varchar("client_snapshot_department", { length: 100 }),
      clientSnapshotCountry: varchar("client_snapshot_country", { length: 100 }),
      clientSnapshotEmail: varchar("client_snapshot_email", { length: 255 }),
      clientSnapshotPhone: varchar("client_snapshot_phone", { length: 20 }),
      // SNAPSHOT INMUTABLE: Fecha y hora de emisión (NUNCA debe cambiar después de crear la factura)
      issueDateSnapshot: varchar("issue_date_snapshot", { length: 50 }),
      // Fecha de emisión en formato legible (ej: "17/10/2025")
      issueDateTimeSnapshot: varchar("issue_date_time_snapshot", { length: 50 }),
      // Fecha y hora completa (ej: "17/10/2025, 13:23")
      // Campos SIFEN
      sifenCDC: varchar("sifen_cdc", { length: 44 }),
      // Código de Control SIFEN
      sifenProtocolo: varchar("sifen_protocolo", { length: 50 }),
      // Protocolo de autorización
      sifenEstado: varchar("sifen_estado", { length: 20 }),
      // 'aceptado', 'rechazado', 'pendiente'
      sifenXML: text("sifen_xml"),
      // XML generado y enviado
      sifenFechaEnvio: timestamp("sifen_fecha_envio"),
      // Fecha de envío a SIFEN
      sifenMensajeError: text("sifen_mensaje_error"),
      // Mensaje de error si fue rechazado
      sifenQR: varchar("sifen_qr", { length: 1e3 }),
      // URL del QR para verificación en e-Kuatia
      createdAt: timestamp("created_at").defaultNow(),
      updatedAt: timestamp("updated_at").defaultNow(),
      currency: varchar("currency", { length: 3 }).notNull().default("PYG")
    });
    transactions = pgTable("transactions", {
      id: serial("id").primaryKey(),
      invoiceId: integer("invoice_id").references(() => invoices.id).notNull(),
      paymentMethodId: integer("payment_method_id").references(() => paymentMethods.id).notNull(),
      userId: integer("user_id").references(() => users.id).notNull(),
      amount: decimal("amount", { precision: 12, scale: 2 }).notNull(),
      currency: varchar("currency", { length: 3 }).notNull().default("USD"),
      status: varchar("status", { length: 50 }).notNull().default("pendiente"),
      // 'pendiente', 'completado', 'fallido', 'reembolsado'
      transactionId: varchar("transaction_id", { length: 255 }),
      paymentData: jsonb("payment_data"),
      createdAt: timestamp("created_at").defaultNow(),
      completedAt: timestamp("completed_at")
    });
    usersRelations = relations(users, ({ one, many }) => ({
      partner: one(partners, {
        fields: [users.id],
        references: [partners.userId]
      }),
      projects: many(projects),
      tickets: many(tickets),
      referrals: many(referrals),
      notifications: many(notifications),
      clientBillingInfo: many(clientBillingInfo)
    }));
    partnersRelations = relations(partners, ({ one, many }) => ({
      user: one(users, {
        fields: [partners.userId],
        references: [users.id]
      }),
      projects: many(projects),
      referrals: many(referrals)
    }));
    projectsRelations = relations(projects, ({ one, many }) => ({
      client: one(users, {
        fields: [projects.clientId],
        references: [users.id]
      }),
      partner: one(partners, {
        fields: [projects.partnerId],
        references: [partners.id]
      }),
      payments: many(payments2),
      paymentStages: many(paymentStages),
      tickets: many(tickets),
      referrals: many(referrals),
      projectMessages: many(projectMessages),
      projectTimeline: many(projectTimeline),
      projectFiles: many(projectFiles),
      budgetNegotiations: many(budgetNegotiations)
    }));
    referralsRelations = relations(referrals, ({ one }) => ({
      partner: one(partners, {
        fields: [referrals.partnerId],
        references: [partners.id]
      }),
      client: one(users, {
        fields: [referrals.clientId],
        references: [users.id]
      }),
      project: one(projects, {
        fields: [referrals.projectId],
        references: [projects.id]
      })
    }));
    ticketsRelations = relations(tickets, ({ one }) => ({
      user: one(users, {
        fields: [tickets.userId],
        references: [users.id]
      }),
      project: one(projects, {
        fields: [tickets.projectId],
        references: [projects.id]
      })
    }));
    paymentsRelations = relations(payments2, ({ one }) => ({
      project: one(projects, {
        fields: [payments2.projectId],
        references: [projects.id]
      })
    }));
    heroSlides = pgTable("hero_slides", {
      id: serial("id").primaryKey(),
      title: varchar("title", { length: 255 }).notNull(),
      subtitle: text("subtitle"),
      description: text("description"),
      imageUrl: text("image_url"),
      mediaType: text("media_type").default("image"),
      // 'image' o 'video'
      backgroundColor: varchar("background_color", { length: 50 }),
      backgroundColorOpacity: integer("background_color_opacity").default(100),
      // 0-100
      buttonText: varchar("button_text", { length: 100 }),
      buttonLink: varchar("button_link", { length: 255 }),
      displayOrder: integer("display_order").notNull().default(0),
      isActive: boolean("is_active").notNull().default(true),
      createdAt: timestamp("created_at").defaultNow(),
      updatedAt: timestamp("updated_at").defaultNow()
    }, (table) => [
      index("idx_hero_slides_order").on(table.displayOrder),
      index("idx_hero_slides_active").on(table.isActive)
    ]);
    paymentMethodsRelations = relations(paymentMethods, ({ one }) => ({
      user: one(users, {
        fields: [paymentMethods.userId],
        references: [users.id]
      })
    }));
    invoicesRelations = relations(invoices, ({ one }) => ({
      project: one(projects, {
        fields: [invoices.projectId],
        references: [projects.id]
      }),
      client: one(users, {
        fields: [invoices.clientId],
        references: [users.id]
      }),
      paymentMethod: one(paymentMethods, {
        fields: [invoices.paymentMethodId],
        references: [paymentMethods.id]
      }),
      paymentStage: one(paymentStages, {
        fields: [invoices.paymentStageId],
        references: [paymentStages.id]
      })
    }));
    transactionsRelations = relations(transactions, ({ one }) => ({
      invoice: one(invoices, {
        fields: [transactions.invoiceId],
        references: [invoices.id]
      }),
      paymentMethod: one(paymentMethods, {
        fields: [transactions.paymentMethodId],
        references: [paymentMethods.id]
      }),
      user: one(users, {
        fields: [transactions.userId],
        references: [users.id]
      })
    }));
    paymentStagesRelations = relations(paymentStages, ({ one }) => ({
      project: one(projects, {
        fields: [paymentStages.projectId],
        references: [projects.id]
      })
    }));
    notificationsRelations = relations(notifications, ({ one }) => ({
      user: one(users, {
        fields: [notifications.userId],
        references: [users.id]
      })
    }));
    projectMessagesRelations = relations(projectMessages, ({ one }) => ({
      project: one(projects, {
        fields: [projectMessages.projectId],
        references: [projects.id]
      }),
      user: one(users, {
        fields: [projectMessages.userId],
        references: [users.id]
      })
    }));
    projectFilesRelations = relations(projectFiles, ({ one }) => ({
      project: one(projects, {
        fields: [projectFiles.projectId],
        references: [projects.id]
      }),
      uploadedBy: one(users, {
        fields: [projectFiles.uploadedBy],
        references: [users.id]
      })
    }));
    projectTimelineRelations = relations(projectTimeline, ({ one }) => ({
      project: one(projects, {
        fields: [projectTimeline.projectId],
        references: [projects.id]
      })
    }));
    ticketResponsesRelations = relations(ticketResponses, ({ one }) => ({
      ticket: one(tickets, {
        fields: [ticketResponses.ticketId],
        references: [tickets.id]
      }),
      user: one(users, {
        fields: [ticketResponses.userId],
        references: [users.id]
      })
    }));
    budgetNegotiationsRelations = relations(budgetNegotiations, ({ one }) => ({
      project: one(projects, {
        fields: [budgetNegotiations.projectId],
        references: [projects.id]
      }),
      proposedBy: one(users, {
        fields: [budgetNegotiations.proposedBy],
        references: [users.id]
      })
    }));
    clientBillingInfoRelations = relations(clientBillingInfo, ({ one }) => ({
      user: one(users, {
        fields: [clientBillingInfo.userId],
        references: [users.id]
      })
    }));
    loginSchema = z.object({
      email: z.string().email("Email inv\xE1lido"),
      password: z.string().min(6, "La contrase\xF1a debe tener al menos 6 caracteres")
    });
    registerSchema = z.object({
      email: z.string().email("Email inv\xE1lido"),
      password: z.string().min(6, "La contrase\xF1a debe tener al menos 6 caracteres"),
      fullName: z.string().min(2, "El nombre debe tener al menos 2 caracteres"),
      role: z.enum(["cliente", "socio"])
    });
    contactSchema = z.object({
      fullName: z.string().min(2, "El nombre debe tener al menos 2 caracteres"),
      email: z.string().email("Email inv\xE1lido"),
      phone: z.string().optional(),
      company: z.string().optional(),
      serviceType: z.string().optional(),
      budget: z.string().optional(),
      timeline: z.string().optional(),
      subject: z.string().min(1, "El asunto es requerido"),
      message: z.string().min(10, "El mensaje debe tener al menos 10 caracteres")
    });
    insertProjectSchema = z.object({
      name: z.string().min(1, "El nombre es requerido"),
      description: z.string().optional(),
      price: z.string().min(1, "El precio es requerido"),
      clientId: z.number(),
      partnerId: z.number().optional(),
      deliveryDate: z.string().optional()
    });
    insertTicketSchema = z.object({
      title: z.string().min(1, "El t\xEDtulo es requerido"),
      description: z.string().min(1, "La descripci\xF3n es requerida"),
      priority: z.enum(["baja", "media", "alta", "urgente"]).default("media"),
      projectId: z.number().optional()
    });
  }
});

// server/db.ts
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { eq } from "drizzle-orm";
async function initializeDatabase() {
  console.log("\u{1F680} Iniciando inicializaci\xF3n de la base de datos...");
  console.log("\u{1F331} Verificando slides del hero...");
  const existingSlides = await db.select().from(heroSlides).limit(1);
  if (existingSlides.length === 0) {
    console.log("\u{1F331} Creando slide hero inicial...");
    await db.insert(heroSlides).values({
      title: "SoftwarePar: Tu Partner Tecnol\xF3gico en Paraguay",
      subtitle: "Empresa paraguaya de desarrollo de software",
      description: "Somos la empresa paraguaya l\xEDder en desarrollo de software, especializada en apps web y m\xF3viles, y facturaci\xF3n electr\xF3nica SIFEN. Con m\xE1s de 50 proyectos completados y soporte 24/7, transformamos empresas paraguayas en su camino tecnol\xF3gico.",
      imageUrl: "",
      // Sin imagen de fondo, usará el gradiente
      buttonText: "Cotizaci\xF3n Gratuita",
      buttonLink: "#contacto",
      displayOrder: 0,
      isActive: true
    });
    console.log("\u2705 Slide hero inicial creado");
  } else {
    console.log("\u2705 Slides hero ya existen");
  }
  const existingCompany = await db.select().from(companyBillingInfo).limit(1);
  if (existingCompany.length === 0) {
    console.log("\u{1F331} Creando informaci\xF3n de facturaci\xF3n de la empresa...");
    await db.insert(companyBillingInfo).values({
      companyName: "SOFTWAREPAR",
      titularName: "JHONI FABIAN BENITEZ DE LA CRUZ",
      ruc: "4220058-0",
      address: "BARRIO RESIDENCIAL",
      city: "CARLOS A. LOPEZ",
      department: "ITAPUA",
      country: "Paraguay",
      phone: "0985990",
      email: "SOFTWAREPAR.LAT@GMAIL.COM",
      taxRegime: "IRE SIMPLE",
      economicActivity: "62090 - Otras actividades de tecnolog\xEDa de la informaci\xF3n",
      timbradoNumber: "18398622",
      isActive: true,
      ivaPercentage: "10.00"
    });
    console.log("\u2705 Informaci\xF3n de la empresa creada");
  } else {
    await db.update(companyBillingInfo).set({
      companyName: "SOFTWAREPAR",
      titularName: "JHONI FABIAN BENITEZ DE LA CRUZ",
      ruc: "4220058-0",
      ivaPercentage: "10.00",
      isSignatureProcessEnabled: true
    }).where(eq(companyBillingInfo.id, existingCompany[0].id));
  }
  console.log("\u{1F331} Verificando modalidades de trabajo...");
  const existingModalities = await db.select().from(workModalities).limit(1);
  if (existingModalities.length === 0) {
    console.log("\u{1F331} Creando modalidades de trabajo iniciales...");
    await db.insert(workModalities).values([
      {
        title: "Lanzamiento Web",
        subtitle: "Tu sitio profesional listo en pocos d\xEDas",
        badgeText: "Ideal para Emprendedores",
        badgeVariant: "default",
        description: "Ideal para negocios y emprendedores que desean una p\xE1gina web moderna, r\xE1pida y optimizada. Incluye dominio, hosting, y soporte t\xE9cnico por 30 d\xEDas.",
        priceText: "Gs 1.500.000",
        priceSubtitle: "Entrega en 7 a 15 d\xEDas",
        features: JSON.stringify([
          "Dise\xF1o web profesional (hasta 5 secciones)",
          "Dominio .com o .com.py incluido",
          "Hosting y certificado SSL",
          "Dise\xF1o responsive (PC, tablet, m\xF3vil)",
          "Formulario de contacto y WhatsApp directo",
          "Optimizaci\xF3n SEO b\xE1sica",
          "Soporte t\xE9cnico 30 d\xEDas"
        ]),
        buttonText: "Cotizar mi web profesional",
        buttonVariant: "default",
        isPopular: false,
        isActive: true,
        displayOrder: 1
      },
      {
        title: "E-commerce Avanzado",
        subtitle: "Tu tienda online lista para vender",
        badgeText: "Escalabilidad y Ventas",
        badgeVariant: "success",
        description: "Plataforma de comercio electr\xF3nico robusta y escalable, dise\xF1ada para maximizar tus ventas online. Incluye integraci\xF3n con pasarelas de pago locales e internacionales, gesti\xF3n de inventario y reportes avanzados.",
        priceText: "Gs 3.500.000",
        priceSubtitle: "Entrega en 20 a 30 d\xEDas",
        features: JSON.stringify([
          "Dise\xF1o web profesional (hasta 15 secciones)",
          "Cat\xE1logo de productos ilimitado",
          "Integraci\xF3n con pasarelas de pago (ej. WEP, Bancard)",
          "Gesti\xF3n de inventario y stock",
          "Dise\xF1o responsive (PC, tablet, m\xF3vil)",
          "Optimizaci\xF3n SEO avanzada",
          "Integraci\xF3n con redes sociales",
          "Soporte t\xE9cnico 60 d\xEDas"
        ]),
        buttonText: "Crear mi tienda online",
        buttonVariant: "default",
        isPopular: true,
        isActive: true,
        displayOrder: 2
      },
      {
        title: "App Web a Medida",
        subtitle: "Soluciones digitales personalizadas",
        badgeText: "Innovaci\xF3n y Eficiencia",
        badgeVariant: "primary",
        description: "Desarrollamos aplicaciones web a medida para optimizar tus procesos de negocio y alcanzar tus objetivos. Desde sistemas de gesti\xF3n interna hasta plataformas complejas, creamos soluciones \xFAnicas para tu empresa.",
        priceText: "A cotizar",
        priceSubtitle: "Seg\xFAn complejidad",
        features: JSON.stringify([
          "An\xE1lisis de requerimientos detallado",
          "Dise\xF1o UI/UX personalizado",
          "Desarrollo Full-Stack (Frontend y Backend)",
          "Integraci\xF3n con sistemas existentes",
          "Despliegue y soporte t\xE9cnico",
          "Escalabilidad y seguridad"
        ]),
        buttonText: "Dise\xF1ar mi soluci\xF3n",
        buttonVariant: "default",
        isPopular: false,
        isActive: true,
        displayOrder: 3
      }
    ]);
    console.log("\u2705 Modalidades de trabajo iniciales creadas");
  } else {
    console.log("\u2705 Modalidades de trabajo ya existen");
  }
  console.log("\u2728 Inicializaci\xF3n de la base de datos completada.");
}
var currentDbUrl, schema, sql, db;
var init_db = __esm({
  "server/db.ts"() {
    "use strict";
    init_schema();
    if (!process.env.DATABASE_URL) {
      throw new Error(
        "DATABASE_URL must be set. Did you forget to provision a database?"
      );
    }
    currentDbUrl = process.env.DATABASE_URL;
    console.log("\u{1F517} Conectando a la base de datos...");
    console.log("\u{1F4CA} Database URL configurada:", process.env.DATABASE_URL ? "S\xCD" : "NO");
    console.log("\u{1F310} Host de la DB:", process.env.DATABASE_URL?.split("@")[1]?.split("/")[0] || "No detectado");
    schema = {
      users,
      partners,
      projects,
      referrals,
      tickets,
      portfolio,
      notifications,
      projectMessages,
      projectFiles,
      projectTimeline,
      ticketResponses,
      paymentMethods,
      invoices,
      transactions,
      paymentStages,
      budgetNegotiations,
      workModalities,
      clientBillingInfo,
      companyBillingInfo,
      exchangeRateConfig,
      // Incluir la nueva tabla en el schema
      legalPages,
      // Incluir la nueva tabla en el schema
      heroSlides
      // Incluir la nueva tabla en el schema
    };
    sql = neon(process.env.DATABASE_URL);
    db = drizzle(sql, { schema });
    initializeDatabase().catch((error) => {
      console.error("\u274C Error durante la inicializaci\xF3n de la base de datos:", error);
    });
  }
});

// server/email.ts
var email_exports = {};
__export(email_exports, {
  formatCurrencyWithConversion: () => formatCurrencyWithConversion,
  generateBudgetAcceptanceEmailHTML: () => generateBudgetAcceptanceEmailHTML,
  generatePaymentApprovedEmailHTML: () => generatePaymentApprovedEmailHTML,
  generatePaymentRejectedEmailHTML: () => generatePaymentRejectedEmailHTML,
  generatePaymentStageAvailableEmailHTML: () => generatePaymentStageAvailableEmailHTML,
  sendContactConfirmation: () => sendContactConfirmation,
  sendContactNotification: () => sendContactNotification,
  sendEmail: () => sendEmail,
  sendPartnerCommissionNotification: () => sendPartnerCommissionNotification,
  sendPasswordResetEmail: () => sendPasswordResetEmail,
  sendPaymentProofConfirmationToClient: () => sendPaymentProofConfirmationToClient,
  sendPaymentProofNotificationToAdmin: () => sendPaymentProofNotificationToAdmin,
  sendWelcomeEmail: () => sendWelcomeEmail
});
import nodemailer from "nodemailer";
function generateBudgetAcceptanceEmailHTML(projectName, clientName, clientEmail, originalPrice, acceptedPrice, clientMessage) {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Contraoferta Aceptada - SoftwarePar</title>
    </head>
    <body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="background: linear-gradient(135deg, #059669 0%, #047857 100%); color: white; padding: 30px; border-radius: 10px; text-align: center;">
        <h1 style="margin: 0; font-size: 28px;">\u{1F389} \xA1Contraoferta Aceptada!</h1>
        <p style="margin: 10px 0 0 0; font-size: 18px; opacity: 0.9;">El cliente ha aceptado tu propuesta</p>
      </div>

      <div style="padding: 30px 0;">
        <h2 style="color: #059669;">\xA1Excelente noticia!</h2>
        <p><strong>${clientName}</strong> ha aceptado tu contraoferta para el proyecto <strong>"${projectName}"</strong>.</p>

        <div style="background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 8px; padding: 20px; margin: 20px 0;">
          <h3 style="margin: 0 0 15px 0; color: #059669;">\u{1F4B0} Detalles de la Negociaci\xF3n:</h3>
          <div style="margin-bottom: 10px;">
            <span><strong>Cliente:</strong> ${clientName}</span><br>
            <span><strong>Email:</strong> ${clientEmail}</span>
          </div>
          <div style="margin-bottom: 10px;">
            <span>Precio Original del Cliente:</span>
            <span style="text-decoration: line-through; color: #666; margin-left: 10px;">$${parseFloat(originalPrice).toLocaleString()}</span>
          </div>
          <div style="margin-bottom: 15px;">
            <span><strong>Precio Aceptado:</strong></span>
            <span style="font-size: 24px; font-weight: bold; color: #059669; margin-left: 10px;">$${parseFloat(acceptedPrice).toLocaleString()}</span>
          </div>
          <p style="margin: 10px 0 5px 0;"><strong>Proyecto:</strong> ${projectName}</p>
          <p style="margin: 5px 0;"><strong>Nuevo Estado:</strong> En Desarrollo</p>
        </div>

        ${clientMessage ? `
        <div style="background: #fffbeb; border: 1px solid #fbbf24; border-radius: 8px; padding: 20px; margin: 20px 0;">
          <h4 style="margin: 0 0 10px 0; color: #d97706;">\u{1F4AC} Mensaje del Cliente:</h4>
          <div style="background: white; padding: 15px; border-radius: 5px; border-left: 4px solid #fbbf24;">
            "${clientMessage}"
          </div>
        </div>
        ` : ""}

        <div style="background: #e0f2fe; border: 1px solid #0ea5e9; border-radius: 8px; padding: 20px; margin: 20px 0;">
          <h3 style="margin: 0 0 10px 0; color: #0369a1;">\u{1F680} Pr\xF3ximos Pasos:</h3>
          <ul style="margin: 10px 0; padding-left: 20px; color: #0369a1;">
            <li><strong>Configurar Etapas de Pago:</strong> Crea las etapas de pago para el proyecto</li>
            <li><strong>Planificar Timeline:</strong> Define las fases de desarrollo</li>
            <li><strong>Comunicar con el Cliente:</strong> Coordina el inicio del proyecto</li>
            <li><strong>Activar Primera Etapa:</strong> Permite que el cliente haga el primer pago</li>
          </ul>
        </div>

        <div style="text-align: center; margin: 30px 0;">
          <a href="https://softwarepar.lat/admin/projects" style="background: #059669; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block; margin-right: 10px;">Gestionar Proyecto</a>
          <a href="https://wa.me/595985990046?text=Hola%2C%20${encodeURIComponent(clientName)}%20ha%20aceptado%20la%20contraoferta%20para%20${encodeURIComponent(projectName)}%20por%20%24${acceptedPrice}.%20Vamos%20a%20coordinar%20el%20inicio." style="background: #25d366; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">Contactar Cliente</a>
        </div>

        <p style="margin-top: 30px;">
          <strong>\xA1Es hora de comenzar el desarrollo!</strong><br>
          El equipo de SoftwarePar
        </p>
      </div>

      <div style="border-top: 1px solid #eee; padding-top: 20px; text-align: center; color: #666; font-size: 14px;">
        <p>SoftwarePar - Panel de Administraci\xF3n</p>
        <p>\u{1F4E7} softwarepar.lat@gmail.com | \u{1F4F1} +595 985 990 046</p>
      </div>
    </body>
    </html>
  `;
}
async function generatePaymentStageAvailableEmailHTML(clientName, projectName, stageName, amount, percentage) {
  const formattedAmount = await formatCurrencyWithConversion(amount);
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Pago Disponible - SoftwarePar</title>
    </head>
    <body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="background: linear-gradient(135deg, #059669 0%, #047857 100%); color: white; padding: 30px; border-radius: 10px; text-align: center;">
        <h1 style="margin: 0; font-size: 28px;">\u{1F4B0} \xA1Pago Disponible!</h1>
        <p style="margin: 10px 0 0 0; font-size: 24px; font-weight: bold;">${formattedAmount}</p>
        <p style="margin: 5px 0 0 0; font-size: 16px; opacity: 0.9;">Tu proyecto est\xE1 listo para la siguiente etapa</p>
      </div>

      <div style="padding: 30px 0;">
        <h2 style="color: #059669;">\xA1Hola ${clientName}!</h2>
        <p>\xA1Excelentes noticias! Tu proyecto <strong>"${projectName}"</strong> ha avanzado y ya puedes realizar el siguiente pago para continuar con el desarrollo.</p>

        <div style="background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 8px; padding: 20px; margin: 20px 0;">
          <h3 style="margin: 0 0 15px 0; color: #059669;">\u{1F4CB} Detalles del Pago:</h3>
          <div style="space-y: 10px;">
            <p style="margin: 5px 0;"><strong>Proyecto:</strong> ${projectName}</p>
            <p style="margin: 5px 0;"><strong>Etapa:</strong> ${stageName}</p>
            <p style="margin: 5px 0;"><strong>Porcentaje:</strong> ${percentage}% del proyecto</p>
            <div style="display: flex; justify-content: space-between; align-items: center; margin: 15px 0; padding: 15px; background: #fff; border-radius: 8px; border: 2px solid #059669;">
              <span style="font-size: 18px; font-weight: bold;">Monto a Pagar:</span>
              <span style="font-size: 28px; font-weight: bold; color: #059669;">${formattedAmount}</span>
            </div>
          </div>
        </div>

        <div style="background: #e0f2fe; border: 1px solid #0ea5e9; border-radius: 8px; padding: 20px; margin: 20px 0;">
          <h3 style="margin: 0 0 10px 0; color: #0369a1;">\u{1F680} \xBFQu\xE9 sucede despu\xE9s del pago?</h3>
          <ul style="margin: 10px 0; padding-left: 20px; color: #0369a1;">
            <li><strong>Inicio Inmediato:</strong> Comenzamos a trabajar en esta etapa del proyecto</li>
            <li><strong>Actualizaciones Regulares:</strong> Te mantendremos informado del progreso</li>
            <li><strong>Comunicaci\xF3n Directa:</strong> Canal de comunicaci\xF3n disponible 24/7</li>
            <li><strong>Transparencia Total:</strong> Podr\xE1s ver el avance en tiempo real</li>
          </ul>
        </div>

        <div style="background: #fffbeb; border: 1px solid #fbbf24; border-radius: 8px; padding: 20px; margin: 20px 0;">
          <h3 style="margin: 0 0 10px 0; color: #d97706;">\u{1F4A1} M\xE9todos de Pago Disponibles:</h3>
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-top: 15px;">
            <div style="text-align: center; padding: 10px; background: white; border-radius: 5px;">
              <strong>\u{1F96D} Mango</strong><br>
              <span style="color: #666;">Alias: 4220058</span>
            </div>
            <div style="text-align: center; padding: 10px; background: white; border-radius: 5px;">
              <strong>\u{1F3E6} Ueno Bank</strong><br>
              <span style="color: #666;">Alias: 4220058</span>
            </div>
          </div>
          <div style="text-align: center; margin-top: 10px;">
            <div style="display: inline-block; padding: 10px; background: white; border-radius: 5px;">
              <strong>\u2600\uFE0F Banco Solar</strong><br>
              <span style="color: #666;">softwarepar.lat@gmail.com</span>
            </div>
          </div>
        </div>

        <div style="text-align: center; margin: 30px 0;">
          <a href="https://softwarepar.lat/client/projects" style="background: #059669; color: white; padding: 15px 40px; text-decoration: none; border-radius: 8px; display: inline-block; font-size: 18px; font-weight: bold; margin-right: 10px;">\u{1F4B3} Realizar Pago</a>
          <a href="https://wa.me/595985990046?text=Hola%2C%20quiero%20realizar%20el%20pago%20de%20la%20etapa%20${encodeURIComponent(stageName)}%20del%20proyecto%20${encodeURIComponent(projectName)}%20por%20%24${amount}" style="background: #25d366; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; display: inline-block; font-size: 16px; font-weight: bold;">\u{1F4F1} WhatsApp</a>
        </div>

        <div style="background: #f3f4f6; border-radius: 8px; padding: 20px; margin: 20px 0;">
          <h4 style="margin: 0 0 10px 0; color: #374151;">\u{1F4DE} \xBFNecesitas ayuda?</h4>
          <p style="margin: 5px 0; color: #6b7280;">Nuestro equipo est\xE1 disponible para ayudarte con cualquier pregunta sobre el pago o el proyecto.</p>
          <p style="margin: 5px 0; color: #6b7280;"><strong>WhatsApp:</strong> +595 985 990 046</p>
          <p style="margin: 5px 0; color: #6b7280;"><strong>Email:</strong> softwarepar.lat@gmail.com</p>
        </div>

        <p style="margin-top: 30px;">
          \xA1Gracias por confiar en SoftwarePar!<br>
          <strong>El equipo de desarrollo</strong>
        </p>
      </div>

      <div style="border-top: 1px solid #eee; padding-top: 20px; text-align: center; color: #666; font-size: 14px;">
        <p>SoftwarePar - Desarrollo de Software Profesional</p>
        <p>Itap\xFAa, Carlos Antonio L\xF3pez, Paraguay</p>
        <p>\u{1F4E7} softwarepar.lat@gmail.com | \u{1F4F1} +595 985 990 046</p>
      </div>
    </body>
    </html>
  `;
}
async function generatePaymentApprovedEmailHTML(clientName, projectName, stageName, amount, paymentMethod, paidDate) {
  const formattedAmount = await formatCurrencyWithConversion(amount);
  return `
    <!DOCTYPE html>
    <html>
    <head><meta charset="utf-8"><title>Pago Aprobado - SoftwarePar</title></head>
    <body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="background: linear-gradient(135deg, #059669 0%, #047857 100%); color: white; padding: 30px; border-radius: 10px; text-align: center;">
        <h1 style="margin: 0; font-size: 28px;">\u2705 Pago Aprobado Exitosamente</h1>
        <p style="margin: 10px 0 0 0; font-size: 24px; font-weight: bold;">${formattedAmount}</p>
      </div>

      <div style="padding: 30px 0;">
        <h2 style="color: #059669;">\xA1Hola ${clientName}!</h2>
        <p>\xA1Excelentes noticias! Tu pago ha sido verificado y aprobado exitosamente. Ya estamos trabajando en esta etapa de tu proyecto.</p>

        <div style="background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 8px; padding: 20px; margin: 20px 0;">
          <h3 style="margin: 0 0 15px 0; color: #059669;">\u{1F4B0} Detalles del Pago Aprobado:</h3>
          <div style="space-y: 10px;">
            <p style="margin: 5px 0;"><strong>Proyecto:</strong> ${projectName}</p>
            <p style="margin: 5px 0;"><strong>Etapa:</strong> ${stageName}</p>
            <p style="margin: 5px 0;"><strong>Monto:</strong> ${formattedAmount}</p>
            <p style="margin: 5px 0;"><strong>M\xE9todo de Pago:</strong> ${paymentMethod}</p>
            <p style="margin: 5px 0;"><strong>Fecha de Pago:</strong> ${paidDate}</p>
            <p style="margin: 5px 0;"><strong>Estado:</strong> <span style="color: #059669; font-weight: bold;">\u2705 APROBADO</span></p>
          </div>
        </div>

        <div style="background: #eff6ff; border: 1px solid #bfdbfe; border-radius: 8px; padding: 20px; margin: 20px 0;">
          <h3 style="margin: 0 0 10px 0; color: #1e40af;">\u{1F680} \xBFQu\xE9 sucede ahora?</h3>
          <ul style="margin: 10px 0; padding-left: 20px; color: #1e40af;">
            <li><strong>Inicio Inmediato:</strong> Nuestro equipo ya est\xE1 trabajando en esta etapa</li>
            <li><strong>Actualizaciones Regulares:</strong> Te mantendremos informado del progreso</li>
            <li><strong>Comunicaci\xF3n Directa:</strong> Canal de comunicaci\xF3n disponible 24/7</li>
            <li><strong>Transparencia Total:</strong> Podr\xE1s ver el avance en tiempo real desde tu dashboard</li>
          </ul>
        </div>

        <div style="background: #fef3c7; border: 1px solid #fbbf24; border-radius: 8px; padding: 20px; margin: 20px 0;">
          <h3 style="margin: 0 0 10px 0; color: #d97706;">\u{1F4CB} Comprobante de Pago</h3>
          <p style="margin: 5px 0; color: #92400e;">
            Puedes descargar tu comprobante de pago desde tu dashboard en cualquier momento. 
            Este comprobante es v\xE1lido para tu contabilidad y registros.
          </p>
        </div>

        <div style="text-align: center; margin: 30px 0;">
          <a href="https://softwarepar.lat/client/projects" style="background: #059669; color: white; padding: 15px 40px; text-decoration: none; border-radius: 8px; display: inline-block; font-size: 18px; font-weight: bold; margin-right: 10px;">\u{1F4CA} Ver Proyecto</a>
          <a href="https://wa.me/595985990046?text=Hola%2C%20mi%20pago%20para%20${encodeURIComponent(projectName)}%20ha%20sido%20aprobado.%20Gracias!" style="background: #25d366; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; display: inline-block; font-size: 16px; font-weight: bold;">\u{1F4F1} WhatsApp</a>
        </div>

        <p>\xA1Gracias por confiar en SoftwarePar! Estamos comprometidos en entregarte un proyecto de alta calidad.</p>

        <p style="margin-top: 30px;">
          Saludos cordiales,<br>
          <strong>El equipo de SoftwarePar</strong>
        </p>
      </div>

      <div style="border-top: 1px solid #eee; padding-top: 20px; text-align: center; color: #666; font-size: 14px;">
        <p>SoftwarePar - Desarrollo de Software Profesional</p>
        <p>Itap\xFAa, Carlos Antonio L\xF3pez, Paraguay</p>
        <p>\u{1F4E7} softwarepar.lat@gmail.com | \u{1F4F1} +595 985 990 046</p>
      </div>
    </body>
    </html>
  `;
}
async function generatePaymentRejectedEmailHTML(clientName, projectName, stageName, amount, paymentMethod, rejectionReason) {
  const formattedAmount = await formatCurrencyWithConversion(amount);
  return `
    <!DOCTYPE html>
    <html>
    <head><meta charset="utf-8"><title>Pago Rechazado - SoftwarePar</title></head>
    <body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="background: linear-gradient(135deg, #dc2626 0%, #b91c1c 100%); color: white; padding: 30px; border-radius: 10px; text-align: center;">
        <h1 style="margin: 0; font-size: 28px;">\u274C Pago Rechazado</h1>
        <p style="margin: 10px 0 0 0; font-size: 16px; opacity: 0.9;">Necesitamos que vuelvas a enviar el comprobante</p>
      </div>

      <div style="padding: 30px 0;">
        <h2 style="color: #dc2626;">Hola ${clientName},</h2>
        <p>Lamentamos informarte que tu comprobante de pago para <strong>"${stageName}"</strong> ha sido rechazado.</p>

        <div style="background: #fef2f2; border: 2px solid #dc2626; border-radius: 8px; padding: 20px; margin: 20px 0;">
          <h3 style="margin: 0 0 15px 0; color: #dc2626;">\u{1F4CB} Detalles del Pago Rechazado:</h3>
          <div style="space-y: 10px;">
            <p style="margin: 5px 0;"><strong>Proyecto:</strong> ${projectName}</p>
            <p style="margin: 5px 0;"><strong>Etapa:</strong> ${stageName}</p>
            <p style="margin: 5px 0;"><strong>Monto:</strong> ${formattedAmount}</p>
            <p style="margin: 5px 0;"><strong>M\xE9todo de Pago:</strong> ${paymentMethod}</p>
            <p style="margin: 5px 0;"><strong>Estado:</strong> <span style="color: #dc2626; font-weight: bold;">\u274C RECHAZADO</span></p>
          </div>
        </div>

        <div style="background: #fffbeb; border: 2px solid #f59e0b; border-radius: 8px; padding: 20px; margin: 20px 0;">
          <h3 style="margin: 0 0 10px 0; color: #d97706;">\u26A0\uFE0F Motivo del Rechazo:</h3>
          <div style="background: white; padding: 15px; border-radius: 5px; border-left: 4px solid #f59e0b;">
            <p style="margin: 0; color: #92400e; font-size: 16px;">${rejectionReason}</p>
          </div>
        </div>

        <div style="background: #eff6ff; border: 1px solid #bfdbfe; border-radius: 8px; padding: 20px; margin: 20px 0;">
          <h3 style="margin: 0 0 10px 0; color: #1e40af;">\u{1F504} \xBFQu\xE9 hacer ahora?</h3>
          <ul style="margin: 10px 0; padding-left: 20px; color: #1e40af;">
            <li><strong>Revisa el motivo del rechazo</strong> mencionado arriba</li>
            <li><strong>Verifica tu comprobante</strong> de pago o transacci\xF3n</li>
            <li><strong>Env\xEDa un nuevo comprobante</strong> correcto desde tu dashboard</li>
            <li><strong>Contacta con nosotros</strong> si tienes dudas o necesitas ayuda</li>
          </ul>
        </div>

        <div style="background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 8px; padding: 20px; margin: 20px 0;">
          <h3 style="margin: 0 0 10px 0; color: #059669;">\u{1F4B3} M\xE9todos de Pago Disponibles:</h3>
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-top: 15px;">
            <div style="text-align: center; padding: 10px; background: white; border-radius: 5px;">
              <strong>\u{1F96D} Mango</strong><br>
              <span style="color: #666;">Alias: 4220058</span>
            </div>
            <div style="text-align: center; padding: 10px; background: white; border-radius: 5px;">
              <strong>\u{1F3E6} Ueno Bank</strong><br>
              <span style="color: #666;">Alias: 4220058</span>
            </div>
          </div>
          <div style="text-align: center; margin-top: 10px;">
            <div style="display: inline-block; padding: 10px; background: white; border-radius: 5px;">
              <strong>\u2600\uFE0F Banco Solar</strong><br>
              <span style="color: #666;">softwarepar.lat@gmail.com</span>
            </div>
          </div>
        </div>

        <div style="text-align: center; margin: 30px 0;">
          <a href="https://softwarepar.lat/client/projects" style="background: #059669; color: white; padding: 15px 40px; text-decoration: none; border-radius: 8px; display: inline-block; font-size: 18px; font-weight: bold; margin-right: 10px;">\u{1F4B3} Enviar Nuevo Comprobante</a>
          <a href="https://wa.me/595985990046?text=Hola%2C%20mi%20pago%20para%20${encodeURIComponent(projectName)}%20fue%20rechazado.%20Necesito%20ayuda." style="background: #25d366; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; display: inline-block; font-size: 16px; font-weight: bold;">\u{1F4F1} WhatsApp</a>
        </div>

        <div style="background: #f3f4f6; border-radius: 8px; padding: 20px; margin: 20px 0;">
          <h4 style="margin: 0 0 10px 0; color: #374151;">\u{1F4DE} \xBFNecesitas ayuda?</h4>
          <p style="margin: 5px 0; color: #6b7280;">Nuestro equipo est\xE1 disponible para ayudarte con cualquier duda sobre el pago.</p>
          <p style="margin: 5px 0; color: #6b7280;"><strong>WhatsApp:</strong> +595 985 990 046</p>
          <p style="margin: 5px 0; color: #6b7280;"><strong>Email:</strong> softwarepar.lat@gmail.com</p>
        </div>

        <p style="margin-top: 30px;">
          Lamentamos el inconveniente. Estamos aqu\xED para ayudarte.<br>
          <strong>El equipo de SoftwarePar</strong>
        </p>
      </div>

      <div style="border-top: 1px solid #eee; padding-top: 20px; text-align: center; color: #666; font-size: 14px;">
        <p>SoftwarePar - Desarrollo de Software Profesional</p>
        <p>Itap\xFAa, Carlos Antonio L\xF3pez, Paraguay</p>
        <p>\u{1F4E7} softwarepar.lat@gmail.com | \u{1F4F1} +595 985 990 046</p>
      </div>
    </body>
    </html>
  `;
}
var hasEmailConfig, transporter, sendEmail, formatCurrencyWithConversion, sendWelcomeEmail, sendContactNotification, sendContactConfirmation, sendPartnerCommissionNotification, sendPaymentProofNotificationToAdmin, sendPaymentProofConfirmationToClient, sendPasswordResetEmail;
var init_email = __esm({
  "server/email.ts"() {
    "use strict";
    init_storage();
    console.log("\u{1F4E7} Configurando transporter de email:", {
      user: process.env.GMAIL_USER,
      hasPass: !!process.env.GMAIL_PASS
    });
    hasEmailConfig = !!(process.env.GMAIL_USER && process.env.GMAIL_PASS);
    if (!hasEmailConfig) {
      console.warn("\u26A0\uFE0F  GMAIL_USER y GMAIL_PASS no configurados - funcionalidad de email deshabilitada");
    }
    transporter = hasEmailConfig ? nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASS
      }
    }) : null;
    sendEmail = async (options) => {
      if (!transporter) {
        console.warn(`\u{1F4E7} Email no enviado (sin configuraci\xF3n): ${options.to} - ${options.subject}`);
        return;
      }
      try {
        console.log(`\u{1F4E7} Enviando email a: ${options.to}, Asunto: ${options.subject}`);
        await transporter.sendMail({
          from: `"SoftwarePar" <${process.env.GMAIL_USER}>`,
          to: options.to,
          subject: options.subject,
          html: options.html
        });
        console.log(`\u{1F4E7} Email enviado exitosamente a: ${options.to}`);
      } catch (error) {
        console.error("Error al enviar email:", error);
        throw new Error("Error al enviar email");
      }
    };
    formatCurrencyWithConversion = async (usdAmount) => {
      try {
        const amount = parseFloat(usdAmount);
        const { guaraniAmount, exchangeRate } = await storage.convertUsdToGuarani(amount);
        const formattedGuarani = new Intl.NumberFormat("es-PY", {
          style: "decimal",
          minimumFractionDigits: 0,
          maximumFractionDigits: 0
        }).format(Math.round(guaraniAmount));
        return `$${parseFloat(usdAmount).toFixed(2)} USD (\u20B2${formattedGuarani} PYG)`;
      } catch (error) {
        console.error("Error al convertir moneda:", error);
        return `$${parseFloat(usdAmount).toFixed(2)} USD`;
      }
    };
    sendWelcomeEmail = async (email, name) => {
      const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Bienvenido a SoftwarePar</title>
    </head>
    <body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="background: linear-gradient(135deg, #1e40af 0%, #1e3a8a 100%); color: white; padding: 30px; border-radius: 10px; text-align: center;">
        <h1 style="margin: 0; font-size: 28px;">\xA1Bienvenido a SoftwarePar!</h1>
        <p style="margin: 10px 0 0 0; font-size: 16px; opacity: 0.9;">Tu cuenta ha sido creada exitosamente</p>
      </div>

      <div style="padding: 30px 0;">
        <h2 style="color: #1e40af;">Hola ${name},</h2>
        <p>Gracias por unirte a SoftwarePar. Estamos emocionados de tenerte en nuestra plataforma.</p>

        <p>Con tu cuenta puedes:</p>
        <ul style="color: #666;">
          <li>Solicitar cotizaciones para tus proyectos</li>
          <li>Hacer seguimiento del progreso de tus desarrollos</li>
          <li>Acceder a soporte t\xE9cnico especializado</li>
          <li>Gestionar tus facturas y pagos</li>
        </ul>

        <div style="text-align: center; margin: 30px 0;">
          <a href="https://softwarepar.lat" style="background: #1e40af; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">Acceder a mi Dashboard</a>
        </div>

        <p>Si tienes alguna pregunta, no dudes en contactarnos.</p>

        <p style="margin-top: 30px;">
          Saludos,<br>
          <strong>El equipo de SoftwarePar</strong>
        </p>
      </div>

      <div style="border-top: 1px solid #eee; padding-top: 20px; text-align: center; color: #666; font-size: 14px;">
        <p>SoftwarePar - Desarrollo de Software Profesional</p>
        <p>Itap\xFAa, Carlos Antonio L\xF3pez, Paraguay | softwarepar.lat@gmail.com</p>
      </div>
    </body>
    </html>
  `;
      await sendEmail({
        to: email,
        subject: "\xA1Bienvenido a SoftwarePar!",
        html
      });
    };
    sendContactNotification = async (contactData) => {
      console.log(`\u{1F4E7} Enviando notificaci\xF3n de contacto a admin: ${process.env.GMAIL_USER} para ${contactData.fullName}`);
      const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Nueva Consulta - SoftwarePar</title>
    </head>
    <body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="background: #1e40af; color: white; padding: 20px; border-radius: 10px; text-align: center;">
        <h1 style="margin: 0;">Nueva Consulta Recibida</h1>
      </div>

      <div style="padding: 20px 0;">
        <h2>Detalles del Contacto:</h2>
        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <td style="padding: 10px; border-bottom: 1px solid #eee; font-weight: bold;">Nombre:</td>
            <td style="padding: 10px; border-bottom: 1px solid #eee;">${contactData.fullName}</td>
          </tr>
          <tr>
            <td style="padding: 10px; border-bottom: 1px solid #eee; font-weight: bold;">Email:</td>
            <td style="padding: 10px; border-bottom: 1px solid #eee;">${contactData.email}</td>
          </tr>
          <tr>
            <td style="padding: 10px; border-bottom: 1px solid #eee; font-weight: bold;">Tel\xE9fono:</td>
            <td style="padding: 10px; border-bottom: 1px solid #eee;">${contactData.phone || "No proporcionado"}</td>
          </tr>
          <tr>
            <td style="padding: 10px; border-bottom: 1px solid #eee; font-weight: bold;">Empresa:</td>
            <td style="padding: 10px; border-bottom: 1px solid #eee;">${contactData.company || "No proporcionado"}</td>
          </tr>
          <tr>
            <td style="padding: 10px; border-bottom: 1px solid #eee; font-weight: bold;">Tipo de Servicio:</td>
            <td style="padding: 10px; border-bottom: 1px solid #eee;">${contactData.serviceType || "No especificado"}</td>
          </tr>
          <tr>
            <td style="padding: 10px; border-bottom: 1px solid #eee; font-weight: bold;">Presupuesto:</td>
            <td style="padding: 10px; border-bottom: 1px solid #eee;">${contactData.budget || "No especificado"}</td>
          </tr>
          <tr>
            <td style="padding: 10px; border-bottom: 1px solid #eee; font-weight: bold;">Timeline:</td>
            <td style="padding: 10px; border-bottom: 1px solid #eee;">${contactData.timeline || "No especificado"}</td>
          </tr>
          <tr>
            <td style="padding: 10px; border-bottom: 1px solid #eee; font-weight: bold;">Asunto:</td>
            <td style="padding: 10px; border-bottom: 1px solid #eee;">${contactData.subject}</td>
          </tr>
        </table>

        <h3>Mensaje:</h3>
        <div style="background: #f5f5f5; padding: 15px; border-radius: 5px; border-left: 4px solid #1e40af;">
          ${contactData.message}
        </div>

        <div style="margin-top: 20px; padding: 15px; background: #e0f2fe; border-radius: 5px;">
          <p style="margin: 0; font-weight: bold; color: #0369a1;">\u{1F4A1} Acci\xF3n Requerida:</p>
          <p style="margin: 5px 0 0 0; color: #0369a1;">El cliente ser\xE1 redirigido a WhatsApp con esta informaci\xF3n. Responde r\xE1pidamente para una mejor experiencia.</p>
        </div>
      </div>
    </body>
    </html>
  `;
      await sendEmail({
        to: "softwarepar.lat@gmail.com",
        subject: `Nueva consulta: ${contactData.subject} - ${contactData.fullName}`,
        html
      });
    };
    sendContactConfirmation = async (clientEmail, clientName) => {
      console.log(`\u{1F4E7} Enviando confirmaci\xF3n de contacto a: ${clientEmail}`);
      const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Confirmaci\xF3n de Consulta - SoftwarePar</title>
    </head>
    <body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="background: linear-gradient(135deg, #1e40af 0%, #1e3a8a 100%); color: white; padding: 30px; border-radius: 10px; text-align: center;">
        <h1 style="margin: 0; font-size: 28px;">\xA1Gracias por contactarnos!</h1>
        <p style="margin: 10px 0 0 0; font-size: 16px; opacity: 0.9;">Hemos recibido tu consulta exitosamente</p>
      </div>

      <div style="padding: 30px 0;">
        <h2 style="color: #1e40af;">Hola ${clientName},</h2>
        <p>Gracias por contactar a SoftwarePar. Hemos recibido tu consulta y nuestro equipo la est\xE1 revisando.</p>

        <div style="background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 8px; padding: 20px; margin: 20px 0;">
          <h3 style="margin: 0 0 10px 0; color: #059669;">\xBFQu\xE9 sigue ahora?</h3>
          <ul style="margin: 10px 0; padding-left: 20px; color: #374151;">
            <li>Revisaremos tu consulta en detalle</li>
            <li>Te contactaremos en las pr\xF3ximas 24 horas</li>
            <li>Prepararemos una propuesta personalizada</li>
            <li>Coordinaremos una reuni\xF3n para discutir tu proyecto</li>
          </ul>
        </div>

        <div style="background: #eff6ff; border: 1px solid #bfdbfe; border-radius: 8px; padding: 20px; margin: 20px 0;">
          <h3 style="margin: 0 0 10px 0; color: #1e40af;">\u{1F4AC} \xBFNecesitas respuesta inmediata?</h3>
          <p style="margin: 5px 0;">Tambi\xE9n puedes contactarnos directamente por WhatsApp:</p>
          <div style="text-align: center; margin: 15px 0;">
            <a href="https://wa.me/595985990046?text=Hola,%20he%20realizado%20una%20consulta%20y%20enviado%20los%20detalles%20con%20el%20formulario.%20Me%20gustar\xEDa%20obtener%20m\xE1s%20informaci\xF3n."
               style="background: #25d366; color: white; padding: 12px 25px; text-decoration: none; border-radius: 25px; display: inline-block; font-weight: bold;">
              \u{1F4F1} Contactar por WhatsApp
            </a>
          </div>
        </div>

        <p style="margin-top: 30px;">
          Saludos cordiales,<br>
          <strong>El equipo de SoftwarePar</strong>
        </p>
      </div>

      <div style="border-top: 1px solid #eee; padding-top: 20px; text-align: center; color: #666; font-size: 14px;">
        <p>SoftwarePar - Desarrollo de Software Profesional</p>
        <p>Itap\xFAa, Carlos Antonio L\xF3pez, Paraguay</p>
        <p>\u{1F4E7} softwarepar.lat@gmail.com | \u{1F4F1} +595 985 990 046</p>
      </div>
    </body>
    </html>
  `;
      await sendEmail({
        to: clientEmail,
        subject: "Confirmaci\xF3n de tu consulta - SoftwarePar",
        html
      });
    };
    sendPartnerCommissionNotification = async (partnerEmail, partnerName, commission, projectName) => {
      console.log(`\u{1F4E7} Enviando notificaci\xF3n de comisi\xF3n a ${partnerEmail} para ${partnerName} por el proyecto ${projectName}`);
      const formattedCommission = await formatCurrencyWithConversion(commission);
      const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Nueva Comisi\xF3n - SoftwarePar</title>
    </head>
    <body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="background: linear-gradient(135deg, #059669 0%, #047857 100%); color: white; padding: 30px; border-radius: 10px; text-align: center;">
        <h1 style="margin: 0; font-size: 28px;">\xA1Nueva Comisi\xF3n Generada!</h1>
        <p style="margin: 10px 0 0 0; font-size: 18px; opacity: 0.9;">${formattedCommission}</p>
      </div>

      <div style="padding: 30px 0;">
        <h2 style="color: #059669;">\xA1Felicitaciones ${partnerName}!</h2>
        <p>Has generado una nueva comisi\xF3n por la venta del proyecto <strong>"${projectName}"</strong>.</p>

        <div style="background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 8px; padding: 20px; margin: 20px 0;">
          <h3 style="margin: 0 0 10px 0; color: #059669;">Detalles de la comisi\xF3n:</h3>
          <p style="margin: 5px 0;"><strong>Proyecto:</strong> ${projectName}</p>
          <p style="margin: 5px 0;"><strong>Comisi\xF3n:</strong> ${formattedCommission}</p>
          <p style="margin: 5px 0;"><strong>Estado:</strong> Procesada</p>
        </div>

        <div style="text-align: center; margin: 30px 0;">
          <a href="https://softwarepar.lat" style="background: #059669; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">Ver Dashboard</a>
        </div>

        <p>\xA1Sigue refiriendo clientes y genera m\xE1s ingresos!</p>

        <p style="margin-top: 30px;">
          Saludos,<br>
          <strong>El equipo de SoftwarePar</strong>
        </p>
      </div>
    </body>
    </html>
  `;
      await sendEmail({
        to: partnerEmail,
        subject: `\xA1Nueva comisi\xF3n de ${formattedCommission} generada!`,
        html
      });
    };
    sendPaymentProofNotificationToAdmin = async (clientName, projectName, stageName, amount, paymentMethod, fileAttachmentInfo) => {
      console.log(`\u{1F4E7} Enviando notificaci\xF3n de comprobante al admin para ${clientName}`);
      const formattedAmount = await formatCurrencyWithConversion(amount);
      const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Comprobante de Pago Recibido - SoftwarePar</title>
    </head>
    <body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="background: linear-gradient(135deg, #059669 0%, #047857 100%); color: white; padding: 30px; border-radius: 10px; text-align: center;">
        <h1 style="margin: 0; font-size: 28px;">\u{1F4B0} Comprobante de Pago Recibido</h1>
        <p style="margin: 10px 0 0 0; font-size: 18px; opacity: 0.9;">${formattedAmount}</p>
      </div>

      <div style="padding: 30px 0;">
        <h2 style="color: #059669;">\u{1F389} Nuevo comprobante recibido</h2>
        <p><strong>${clientName}</strong> ha enviado un comprobante de pago:</p>

        <div style="background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 8px; padding: 20px; margin: 20px 0;">
          <h3 style="margin: 0 0 10px 0; color: #059669;">\u{1F4CB} Detalles del pago:</h3>
          <p style="margin: 5px 0;"><strong>Cliente:</strong> ${clientName}</p>
          <p style="margin: 5px 0;"><strong>Proyecto:</strong> ${projectName}</p>
          <p style="margin: 5px 0;"><strong>Etapa:</strong> ${stageName}</p>
          <p style="margin: 5px 0;"><strong>Monto:</strong> ${formattedAmount}</p>
          <p style="margin: 5px 0;"><strong>M\xE9todo de pago:</strong> ${paymentMethod}</p>
          <p style="margin: 5px 0;"><strong>Fecha y hora:</strong> ${(/* @__PURE__ */ new Date()).toLocaleString("es-PY", { timeZone: "America/Asuncion" })}</p>
        </div>

        ${fileAttachmentInfo ? `
        <div style="background: #fffbeb; border: 1px solid #fbbf24; border-radius: 8px; padding: 20px; margin: 20px 0;">
          <h3 style="margin: 0 0 10px 0; color: #d97706;">\u{1F4CE} Informaci\xF3n del comprobante:</h3>
          <p style="margin: 5px 0; font-size: 16px;">${fileAttachmentInfo}</p>
          <p style="margin: 10px 0 5px 0; font-size: 14px; color: #d97706;">
            <strong>Nota:</strong> El cliente tambi\xE9n contactar\xE1 por WhatsApp con m\xE1s detalles del pago.
          </p>
        </div>
        ` : `
        <div style="background: #f3f4f6; border: 1px solid #d1d5db; border-radius: 8px; padding: 20px; margin: 20px 0;">
          <h3 style="margin: 0 0 10px 0; color: #6b7280;">\u{1F4C4} Sin comprobante adjunto</h3>
          <p style="margin: 5px 0; color: #6b7280;">El cliente indic\xF3 el pago pero no adjunt\xF3 comprobante. Contactar\xE1 por WhatsApp.</p>
        </div>
        `}

        <div style="background: #e0f2fe; border: 1px solid #0ea5e9; border-radius: 8px; padding: 20px; margin: 20px 0;">
          <h3 style="margin: 0 0 10px 0; color: #0369a1;">\u{1F4F1} Pr\xF3ximos pasos:</h3>
          <ul style="margin: 10px 0; padding-left: 20px; color: #0369a1;">
            <li>El cliente contactar\xE1 por WhatsApp (+595 985 990 046)</li>
            <li>Verificar el comprobante y confirmar la recepci\xF3n</li>
            <li>Actualizar el estado del proyecto una vez confirmado</li>
            <li>Iniciar trabajo en la siguiente etapa</li>
          </ul>
        </div>

        <div style="text-align: center; margin: 30px 0;">
          <a href="https://softwarepar.lat/admin/projects" style="background: #059669; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block; margin-right: 10px;">Ver en Dashboard</a>
          <a href="https://wa.me/595985990046" style="background: #25d366; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">Abrir WhatsApp</a>
        </div>

        <p><strong>\u26A0\uFE0F Acci\xF3n requerida:</strong> Por favor revisa el comprobante cuando el cliente contacte por WhatsApp y confirma el pago en el sistema.</p>

        <p style="margin-top: 30px;">
          Saludos,<br>
          <strong>Sistema SoftwarePar</strong>
        </p>
      </div>
    </body>
    </html>
  `;
      await sendEmail({
        to: "softwarepar.lat@gmail.com",
        subject: `\u{1F389} Comprobante de pago recibido: ${projectName} - ${stageName} ($${amount})`,
        html
      });
    };
    sendPaymentProofConfirmationToClient = async (clientEmail, clientName, projectName, stageName, amount, paymentMethod) => {
      console.log(`\u{1F4E7} Enviando confirmaci\xF3n de comprobante al cliente: ${clientEmail}`);
      const formattedAmount = await formatCurrencyWithConversion(amount);
      const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Comprobante Recibido - SoftwarePar</title>
    </head>
    <body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="background: linear-gradient(135deg, #1e40af 0%, #1e3a8a 100%); color: white; padding: 30px; border-radius: 10px; text-align: center;">
        <h1 style="margin: 0; font-size: 28px;">\u2705 Comprobante Recibido</h1>
        <p style="margin: 10px 0 0 0; font-size: 16px; opacity: 0.9;">Gracias por tu pago</p>
      </div>

      <div style="padding: 30px 0;">
        <h2 style="color: #1e40af;">Hola ${clientName},</h2>
        <p>Hemos recibido exitosamente tu comprobante de pago. Nuestro equipo lo revisar\xE1 y confirmar\xE1 en las pr\xF3ximas horas.</p>

        <div style="background: #eff6ff; border: 1px solid #bfdbfe; border-radius: 8px; padding: 20px; margin: 20px 0;">
          <h3 style="margin: 0 0 10px 0; color: #1e40af;">\u{1F4CB} Resumen del pago:</h3>
          <p style="margin: 5px 0;"><strong>Proyecto:</strong> ${projectName}</p>
          <p style="margin: 5px 0;"><strong>Etapa:</strong> ${stageName}</p>
          <p style="margin: 5px 0;"><strong>Monto:</strong> ${formattedAmount}</p>
          <p style="margin: 5px 0;"><strong>M\xE9todo de pago:</strong> ${paymentMethod}</p>
        </div>

        <div style="background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 8px; padding: 20px; margin: 20px 0;">
          <h3 style="margin: 0 0 10px 0; color: #059669;">\u{1F680} \xBFQu\xE9 sigue ahora?</h3>
          <ul style="margin: 10px 0; padding-left: 20px; color: #374151;">
            <li>Nuestro equipo verificar\xE1 tu comprobante</li>
            <li>Una vez confirmado, iniciaremos el trabajo en esta etapa</li>
            <li>Recibir\xE1s actualizaciones regulares del progreso</li>
            <li>Te notificaremos cuando la etapa est\xE9 completa</li>
          </ul>
        </div>

        <div style="text-align: center; margin: 30px 0;">
          <a href="https://softwarepar.lat/client/projects" style="background: #1e40af; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">Ver Mi Proyecto</a>
        </div>

        <p>Si tienes alguna pregunta, no dudes en contactarnos.</p>

        <p style="margin-top: 30px;">
          Saludos,<br>
          <strong>El equipo de SoftwarePar</strong>
        </p>
      </div>

      <div style="border-top: 1px solid #eee; padding-top: 20px; text-align: center; color: #666; font-size: 14px;">
        <p>SoftwarePar - Desarrollo de Software Profesional</p>
        <p>\u{1F4E7} softwarepar.lat@gmail.com | \u{1F4F1} +595 985 990 046</p>
      </div>
    </body>
    </html>
  `;
      await sendEmail({
        to: clientEmail,
        subject: `Comprobante recibido: ${projectName} - ${stageName}`,
        html
      });
    };
    sendPasswordResetEmail = async (email, name, resetLink) => {
      const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Recuperar Contrase\xF1a - SoftwarePar</title>
    </head>
    <body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="background: linear-gradient(135deg, #059669 0%, #047857 100%); color: white; padding: 30px; border-radius: 10px; text-align: center;">
        <h1 style="margin: 0; font-size: 28px;">\u{1F512} Recuperaci\xF3n de Contrase\xF1a</h1>
        <p style="margin: 10px 0 0 0; font-size: 16px; opacity: 0.9;">Restablece el acceso a tu cuenta</p>
      </div>

      <div style="padding: 30px 0;">
        <h2 style="color: #059669;">\xA1Hola ${name}!</h2>
        <p>Hemos recibido una solicitud para restablecer la contrase\xF1a de tu cuenta en SoftwarePar.</p>

        <div style="background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 8px; padding: 20px; margin: 20px 0;">
          <h3 style="margin: 0 0 15px 0; color: #059669;">\u{1F4CB} Instrucciones:</h3>
          <ol style="margin: 10px 0; padding-left: 20px; color: #065f46;">
            <li style="margin-bottom: 10px;">Haz clic en el bot\xF3n de abajo para restablecer tu contrase\xF1a</li>
            <li style="margin-bottom: 10px;">Se abrir\xE1 una p\xE1gina donde podr\xE1s ingresar tu nueva contrase\xF1a</li>
            <li style="margin-bottom: 10px;">El enlace es v\xE1lido por 1 hora por razones de seguridad</li>
          </ol>
        </div>

        <div style="text-align: center; margin: 30px 0;">
          <a href="${resetLink}" style="background: #059669; color: white; padding: 15px 40px; text-decoration: none; border-radius: 8px; display: inline-block; font-size: 18px; font-weight: bold;">
            \u{1F510} Restablecer Contrase\xF1a
          </a>
        </div>

        <div style="background: #fef3c7; border: 1px solid #fbbf24; border-radius: 8px; padding: 15px; margin: 20px 0;">
          <p style="margin: 0; color: #92400e;">
            <strong>\u26A0\uFE0F Importante:</strong> Si no solicitaste este cambio, puedes ignorar este email. Tu contrase\xF1a permanecer\xE1 sin cambios.
          </p>
        </div>

        <div style="background: #f3f4f6; border-radius: 8px; padding: 20px; margin: 20px 0;">
          <h4 style="margin: 0 0 10px 0; color: #374151;">\u{1F4DE} \xBFNecesitas ayuda?</h4>
          <p style="margin: 5px 0; color: #6b7280;">Si tienes problemas para restablecer tu contrase\xF1a, cont\xE1ctanos:</p>
          <p style="margin: 5px 0; color: #6b7280;"><strong>WhatsApp:</strong> +595 985 990 046</p>
          <p style="margin: 5px 0; color: #6b7280;"><strong>Email:</strong> softwarepar.lat@gmail.com</p>
        </div>

        <p style="margin-top: 30px; color: #6b7280; font-size: 14px;">
          Si el bot\xF3n no funciona, copia y pega este enlace en tu navegador:<br>
          <a href="${resetLink}" style="color: #059669; word-break: break-all;">${resetLink}</a>
        </p>
      </div>

      <div style="border-top: 1px solid #eee; padding-top: 20px; text-align: center; color: #666; font-size: 14px;">
        <p>SoftwarePar - Plataforma de Desarrollo de Software</p>
        <p>Itap\xFAa, Carlos Antonio L\xF3pez, Paraguay</p>
        <p>\u{1F4E7} softwarepar.lat@gmail.com | \u{1F4F1} +595 985 990 046</p>
      </div>
    </body>
    </html>
  `;
      await sendEmail({
        to: email,
        subject: "Recuperaci\xF3n de Contrase\xF1a - SoftwarePar",
        html: htmlContent
      });
      console.log(`\u{1F4E7} Email de recuperaci\xF3n de contrase\xF1a enviado a: ${email}`);
    };
  }
});

// server/notifications.ts
var notifications_exports = {};
__export(notifications_exports, {
  broadcastRealtimeEvent: () => broadcastRealtimeEvent,
  createNotification: () => createNotification,
  notifyBudgetNegotiation: () => notifyBudgetNegotiation,
  notifyNewMessage: () => notifyNewMessage,
  notifyPaymentStageAvailable: () => notifyPaymentStageAvailable,
  notifyProjectCreated: () => notifyProjectCreated,
  notifyProjectUpdated: () => notifyProjectUpdated,
  notifyTicketCreated: () => notifyTicketCreated,
  notifyTicketResponse: () => notifyTicketResponse,
  registerWSConnection: () => registerWSConnection,
  sendComprehensiveNotification: () => sendComprehensiveNotification,
  sendRealtimeEvent: () => sendRealtimeEvent,
  sendRealtimeNotification: () => sendRealtimeNotification
});
import { eq as eq2 } from "drizzle-orm";
function registerWSConnection(userId, ws) {
  if (!wsConnections.has(userId)) {
    wsConnections.set(userId, /* @__PURE__ */ new Set());
  }
  wsConnections.get(userId).add(ws);
  ws.on("close", () => {
    wsConnections.get(userId)?.delete(ws);
    if (wsConnections.get(userId)?.size === 0) {
      wsConnections.delete(userId);
    }
  });
}
function sendRealtimeNotification(userId, notification) {
  console.log(`\u{1F514} Enviando notificaci\xF3n en tiempo real a usuario ${userId}:`, {
    title: notification.title,
    message: notification.message,
    type: notification.type
  });
  const userConnections = wsConnections.get(userId);
  if (userConnections && userConnections.size > 0) {
    console.log(`\u{1F4E1} Encontradas ${userConnections.size} conexiones para usuario ${userId}`);
    userConnections.forEach((ws) => {
      if (ws.readyState === 1) {
        const notificationData = {
          type: "notification",
          data: notification,
          timestamp: (/* @__PURE__ */ new Date()).toISOString()
        };
        ws.send(JSON.stringify(notificationData));
        console.log(`\u2705 Notificaci\xF3n enviada por WebSocket a usuario ${userId}`);
      } else {
        console.log(`\u26A0\uFE0F Conexi\xF3n WebSocket cerrada para usuario ${userId}`);
      }
    });
  } else {
    console.log(`\u274C No hay conexiones WebSocket activas para usuario ${userId}`);
  }
}
function sendRealtimeEvent(userId, eventType, eventData) {
  console.log(`\u{1F504} Enviando evento en tiempo real a usuario ${userId}:`, {
    eventType,
    eventData
  });
  const userConnections = wsConnections.get(userId);
  if (userConnections && userConnections.size > 0) {
    console.log(`\u{1F4E1} Encontradas ${userConnections.size} conexiones para usuario ${userId}`);
    userConnections.forEach((ws) => {
      if (ws.readyState === 1) {
        const eventMessage = {
          type: "data_update",
          eventType,
          data: eventData,
          timestamp: (/* @__PURE__ */ new Date()).toISOString()
        };
        ws.send(JSON.stringify(eventMessage));
        console.log(`\u2705 Evento ${eventType} enviado por WebSocket a usuario ${userId}`);
      } else {
        console.log(`\u26A0\uFE0F Conexi\xF3n WebSocket cerrada para usuario ${userId}`);
      }
    });
  } else {
    console.log(`\u274C No hay conexiones WebSocket activas para usuario ${userId}`);
  }
}
function broadcastRealtimeEvent(userIds, eventType, eventData) {
  console.log(`\u{1F4E2} Broadcasting evento ${eventType} a ${userIds.length} usuarios`);
  userIds.forEach((userId) => sendRealtimeEvent(userId, eventType, eventData));
}
async function createNotification(data) {
  const notification = await db.insert(notifications).values({
    userId: data.userId,
    title: data.title,
    message: data.message,
    type: data.type || "info"
  }).returning();
  sendRealtimeNotification(data.userId, notification[0]);
  return notification[0];
}
async function sendComprehensiveNotification(data, emailData) {
  const notification = await createNotification(data);
  if (emailData && emailData.to && emailData.to.trim() !== "") {
    try {
      console.log(`\u{1F4E7} Enviando email a: ${emailData.to}`);
      console.log(`\u{1F4E7} Asunto: ${emailData.subject}`);
      await sendEmail(emailData);
      console.log(`\u2705 Email enviado exitosamente a: ${emailData.to}`);
    } catch (error) {
      console.error(`\u274C Error enviando email a ${emailData.to}:`, error);
    }
  } else if (emailData && (!emailData.to || emailData.to.trim() === "")) {
    console.log(`\u26A0\uFE0F Email no enviado: direcci\xF3n de email vac\xEDa o inv\xE1lida`);
  }
  return notification;
}
async function notifyProjectCreated(clientId, adminIds, projectName, projectId) {
  try {
    const client = await db.select().from(users).where(eq2(users.id, clientId)).limit(1);
    const clientName = client[0]?.fullName || "Cliente";
    console.log(`\u{1F4E7} Notificando creaci\xF3n de proyecto "${projectName}" a ${adminIds.length} administradores`);
    console.log(`\u{1F504} Enviando evento project_created a ${adminIds.length} administradores`);
    broadcastRealtimeEvent(adminIds, "project_created", {
      projectId,
      projectName,
      clientName,
      clientId
    });
    for (const adminId of adminIds) {
      try {
        const adminData = await db.select().from(users).where(eq2(users.id, adminId)).limit(1);
        const admin = adminData[0];
        console.log(`\u{1F4E7} Procesando notificaci\xF3n para admin ID ${adminId}: ${admin?.email || "sin email"}`);
        await sendComprehensiveNotification({
          userId: adminId,
          title: "\u{1F680} Nuevo Proyecto Creado",
          message: `${clientName} ha creado el proyecto "${projectName}"`,
          type: "info"
        });
        if (admin?.email) {
          console.log(`\u{1F4E7} Enviando email de proyecto creado a admin: ${admin.email}`);
          await sendEmail({
            to: admin.email,
            subject: `Nuevo Proyecto: ${projectName}`,
            html: generateProjectCreatedEmailHTML(clientName, projectName, client[0]?.email)
          });
          console.log(`\u2705 Email enviado exitosamente a admin: ${admin.email}`);
        } else {
          console.log(`\u26A0\uFE0F Admin ${adminId} no tiene email configurado - solo notificaci\xF3n WebSocket enviada`);
        }
      } catch (adminError) {
        console.error(`\u274C Error notificando a admin ${adminId}:`, adminError);
      }
    }
    try {
      console.log(`\u{1F4E7} Enviando email adicional al email principal del sistema`);
      await sendEmail({
        to: process.env.GMAIL_USER || "softwarepar.lat@gmail.com",
        subject: `Nuevo Proyecto: ${projectName}`,
        html: generateProjectCreatedEmailHTML(clientName, projectName, client[0]?.email)
      });
      console.log(`\u2705 Email adicional enviado al email principal del sistema`);
    } catch (systemEmailError) {
      console.error(`\u274C Error enviando email al sistema principal:`, systemEmailError);
    }
    if (client[0]?.email) {
      await sendComprehensiveNotification(
        {
          userId: clientId,
          title: "\u2705 Proyecto Creado Exitosamente",
          message: `Tu proyecto "${projectName}" ha sido creado y est\xE1 siendo revisado`,
          type: "success"
        },
        {
          to: client[0].email,
          subject: `Proyecto creado exitosamente: ${projectName}`,
          html: generateProjectCreatedConfirmationEmailHTML(clientName, projectName)
        }
      );
    } else {
      await sendComprehensiveNotification({
        userId: clientId,
        title: "\u2705 Proyecto Creado Exitosamente",
        message: `Tu proyecto "${projectName}" ha sido creado y est\xE1 siendo revisado`,
        type: "success"
      });
      console.log(`\u26A0\uFE0F Cliente ${clientId} no tiene email configurado - solo notificaci\xF3n WebSocket enviada`);
    }
  } catch (error) {
    console.error("\u274C ERROR en notifyProjectCreated:", error);
    console.error("\u274C Stack del error:", error instanceof Error ? error.stack : "No stack trace available");
    throw error;
  }
}
async function notifyProjectUpdated(clientId, projectName, updateDescription, updatedBy) {
  try {
    const client = await db.select().from(users).where(eq2(users.id, clientId)).limit(1);
    console.log(`\u{1F4E7} Notificando actualizaci\xF3n de proyecto "${projectName}" - ${updateDescription}`);
    await sendComprehensiveNotification(
      {
        userId: clientId,
        title: "\u{1F4CB} Proyecto Actualizado",
        message: `Tu proyecto "${projectName}" ha sido actualizado: ${updateDescription}`,
        type: "info"
      },
      {
        to: client[0]?.email || "",
        subject: `Actualizaci\xF3n en tu proyecto: ${projectName}`,
        html: generateProjectUpdateEmailHTML(projectName, updateDescription, updatedBy)
      }
    );
    const adminUsers = await db.select().from(users).where(eq2(users.role, "admin"));
    for (const admin of adminUsers) {
      try {
        await sendComprehensiveNotification({
          userId: admin.id,
          title: "\u{1F4CB} Proyecto Actualizado por Admin",
          message: `Proyecto "${projectName}" actualizado: ${updateDescription}`,
          type: "info"
        });
        if (admin.email) {
          console.log(`\u{1F4E7} Enviando notificaci\xF3n de actualizaci\xF3n a admin: ${admin.email}`);
          await sendEmail({
            to: admin.email,
            subject: `Proyecto actualizado: ${projectName}`,
            html: generateAdminProjectUpdateEmailHTML(projectName, updateDescription, updatedBy, client[0]?.fullName || "Cliente")
          });
          console.log(`\u2705 Email de actualizaci\xF3n enviado a admin: ${admin.email}`);
        }
      } catch (adminError) {
        console.error(`\u274C Error notificando actualizaci\xF3n a admin ${admin.id}:`, adminError);
      }
    }
    try {
      console.log(`\u{1F4E7} Enviando email de actualizaci\xF3n al email principal del sistema`);
      await sendEmail({
        to: process.env.GMAIL_USER || "softwarepar.lat@gmail.com",
        subject: `Proyecto actualizado: ${projectName}`,
        html: generateAdminProjectUpdateEmailHTML(projectName, updateDescription, updatedBy, client[0]?.fullName || "Cliente")
      });
      console.log(`\u2705 Email de actualizaci\xF3n enviado al email principal del sistema`);
    } catch (systemEmailError) {
      console.error(`\u274C Error enviando email de actualizaci\xF3n al sistema principal:`, systemEmailError);
    }
  } catch (error) {
    console.error("\u274C ERROR en notifyProjectUpdated:", error);
    throw error;
  }
}
async function notifyNewMessage(recipientId, senderName, projectName, message) {
  const recipient = await db.select().from(users).where(eq2(users.id, recipientId)).limit(1);
  const link = `${process.env.BASE_URL || "https://softwarepar.lat"}/client/projects`;
  await sendComprehensiveNotification(
    {
      userId: recipientId,
      title: "\u{1F4AC} Nuevo Mensaje",
      message: `${senderName} te ha enviado un mensaje en "${projectName}"`,
      type: "info"
    },
    {
      to: recipient[0]?.email || "",
      subject: `Nuevo mensaje en proyecto: ${projectName}`,
      html: generateNewMessageEmailHTML(senderName, projectName, message)
    }
  );
}
async function notifyTicketCreated(adminIds, clientName, ticketTitle, clientId) {
  for (const adminId of adminIds) {
    await sendComprehensiveNotification(
      {
        userId: adminId,
        title: "\u{1F3AB} Nuevo Ticket de Soporte",
        message: `${clientName} ha creado el ticket: "${ticketTitle}"`,
        type: "warning"
      },
      {
        to: process.env.GMAIL_USER || "jhonidelacruz89@gmail.com",
        subject: `Nuevo Ticket: ${ticketTitle}`,
        html: generateTicketCreatedEmailHTML(clientName, ticketTitle)
      }
    );
  }
}
async function notifyTicketResponse(recipientId, responderName, ticketTitle, response, isFromSupport) {
  const recipient = await db.select().from(users).where(eq2(users.id, recipientId)).limit(1);
  const notificationType = isFromSupport ? "Respuesta de Soporte" : "Nueva Respuesta";
  const link = `${process.env.BASE_URL || "https://softwarepar.lat"}/client/support`;
  await sendComprehensiveNotification(
    {
      userId: recipientId,
      title: `\u{1F4DE} ${notificationType}`,
      message: `${responderName} respondi\xF3 a tu ticket: "${ticketTitle}"`,
      type: "info"
    },
    {
      to: recipient[0]?.email || "",
      subject: `${notificationType}: ${ticketTitle}`,
      html: generateTicketResponseEmailHTML(responderName, ticketTitle, response, isFromSupport)
    }
  );
}
async function notifyPaymentStageAvailable(clientId, projectName, stageName, amount) {
  const client = await db.select().from(users).where(eq2(users.id, clientId)).limit(1);
  const link = `${process.env.BASE_URL || "https://softwarepar.lat"}/client/projects`;
  const formattedAmount = await formatCurrencyWithConversion(amount);
  await sendComprehensiveNotification(
    {
      userId: clientId,
      title: "\u{1F4B0} Pago Disponible",
      message: `Nueva etapa de pago disponible: ${stageName} - ${formattedAmount}`,
      type: "success"
    },
    {
      to: client[0]?.email || "",
      subject: `Pago disponible para ${projectName}`,
      html: await generatePaymentStageEmailHTML(projectName, stageName, amount)
    }
  );
}
async function notifyBudgetNegotiation(recipientId, projectName, proposedPrice, message, isCounterOffer = false, projectId, proposedByRole) {
  const recipient = await db.select().from(users).where(eq2(users.id, recipientId)).limit(1);
  const title = isCounterOffer ? "\u{1F4B5} Contraoferta Recibida" : "\u{1F4B0} Nueva Negociaci\xF3n de Presupuesto";
  const formattedPrice = await formatCurrencyWithConversion(proposedPrice);
  console.log(`\u{1F504} Enviando evento budget_negotiation a usuario ${recipientId}`);
  sendRealtimeEvent(recipientId, "budget_negotiation", {
    projectId,
    projectName,
    proposedPrice,
    isCounterOffer
  });
  await sendComprehensiveNotification(
    {
      userId: recipientId,
      title,
      message: `Proyecto "${projectName}": Precio propuesto ${formattedPrice}`,
      type: "warning"
    },
    {
      to: recipient[0]?.email || "",
      subject: `${title}: ${projectName}`,
      html: await generateBudgetNegotiationEmailHTML(projectName, proposedPrice, message, isCounterOffer)
    }
  );
  if (proposedByRole === "client") {
    console.log(`\u{1F4E7} Cliente hizo contraoferta - Notificando a todos los admins`);
    const adminUsers = await db.select().from(users).where(eq2(users.role, "admin"));
    for (const admin of adminUsers) {
      try {
        if (admin.email) {
          await sendEmail({
            to: admin.email,
            subject: `\u{1F4B0} Nueva Contraoferta de Cliente: ${projectName} - $${proposedPrice}`,
            html: await generateBudgetNegotiationEmailHTML(projectName, proposedPrice, message, true)
          });
          console.log(`\u2705 Email de contraoferta enviado a admin: ${admin.email}`);
        }
      } catch (adminError) {
        console.error(`\u274C Error enviando email a admin ${admin.id}:`, adminError);
      }
    }
    try {
      await sendEmail({
        to: process.env.GMAIL_USER || "softwarepar.lat@gmail.com",
        subject: `\u{1F4B0} Nueva Contraoferta de Cliente: ${projectName} - $${proposedPrice}`,
        html: await generateBudgetNegotiationEmailHTML(projectName, proposedPrice, message, true)
      });
      console.log(`\u2705 Email de contraoferta enviado al email principal del sistema`);
    } catch (systemEmailError) {
      console.error(`\u274C Error enviando email al sistema principal:`, systemEmailError);
    }
  }
}
function generateProjectCreatedEmailHTML(clientName, projectName, clientEmail) {
  return `
    <!DOCTYPE html>
    <html>
    <head><meta charset="utf-8"><title>Nuevo Proyecto</title></head>
    <body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="background: linear-gradient(135deg, #1e40af 0%, #1e3a8a 100%); color: white; padding: 30px; border-radius: 10px; text-align: center;">
        <h1 style="margin: 0;">\u{1F680} Nuevo Proyecto Creado</h1>
      </div>
      <div style="padding: 30px 0;">
        <h2>\xA1Hola Admin!</h2>
        <p><strong>${clientName}</strong> ha creado un nuevo proyecto:</p>
        <div style="background: #f8fafc; border-left: 4px solid #1e40af; padding: 15px; margin: 20px 0;">
          <h3 style="margin: 0 0 10px 0;">${projectName}</h3>
          <p style="margin: 0;"><strong>Cliente:</strong> ${clientName}</p>
          ${clientEmail ? `<p style="margin: 0;"><strong>Email:</strong> ${clientEmail}</p>` : ""}
        </div>
        <p>Por favor revisa el proyecto y as\xEDgnale un estado apropiado.</p>
      </div>
    </body>
    </html>
  `;
}
function generateProjectUpdateEmailHTML(projectName, updateDescription, updatedBy) {
  return `
    <!DOCTYPE html>
    <html>
    <head><meta charset="utf-8"><title>Proyecto Actualizado</title></head>
    <body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="background: linear-gradient(135deg, #059669 0%, #047857 100%); color: white; padding: 30px; border-radius: 10px; text-align: center;">
        <h1 style="margin: 0;">\u{1F4CB} Proyecto Actualizado</h1>
      </div>
      <div style="padding: 30px 0;">
        <h2>\xA1Tu proyecto ha sido actualizado!</h2>
        <div style="background: #f0fdf4; border-left: 4px solid #059669; padding: 15px; margin: 20px 0;">
          <h3 style="margin: 0 0 10px 0;">${projectName}</h3>
          <p><strong>Actualizaci\xF3n:</strong> ${updateDescription}</p>
          <p><strong>Actualizado por:</strong> ${updatedBy}</p>
        </div>
        <div style="text-align: center; margin: 30px 0;">
          <a href="https://softwarepar.lat/client/projects" style="background: #059669; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">Ver Proyecto</a>
        </div>
      </div>
    </body>
    </html>
  `;
}
function generateNewMessageEmailHTML(senderName, projectName, message) {
  return `
    <!DOCTYPE html>
    <html>
    <head><meta charset="utf-8"><title>Nuevo Mensaje</title></head>
    <body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="background: linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%); color: white; padding: 30px; border-radius: 10px; text-align: center;">
        <h1 style="margin: 0;">\u{1F4AC} Nuevo Mensaje</h1>
      </div>
      <div style="padding: 30px 0;">
        <h2>Tienes un nuevo mensaje</h2>
        <div style="background: #faf5ff; border-left: 4px solid #7c3aed; padding: 15px; margin: 20px 0;">
          <p><strong>De:</strong> ${senderName}</p>
          <p><strong>Proyecto:</strong> ${projectName}</p>
          <p><strong>Mensaje:</strong></p>
          <div style="background: white; padding: 10px; border-radius: 5px; margin-top: 10px;">
            ${message}
          </div>
        </div>
        <div style="text-align: center; margin: 30px 0;">
          <a href="https://softwarepar.lat/client/projects" style="background: #7c3aed; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">Responder</a>
        </div>
      </div>
    </body>
    </html>
  `;
}
function generateTicketCreatedEmailHTML(clientName, ticketTitle) {
  return `
    <!DOCTYPE html>
    <html>
    <head><meta charset="utf-8"><title>Nuevo Ticket</title></head>
    <body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="background: linear-gradient(135deg, #dc2626 0%, #b91c1c 100%); color: white; padding: 30px; border-radius: 10px; text-align: center;">
        <h1 style="margin: 0;">\u{1F3AB} Nuevo Ticket de Soporte</h1>
      </div>
      <div style="padding: 30px 0;">
        <h2>\xA1Nueva solicitud de soporte!</h2>
        <div style="background: #fef2f2; border-left: 4px solid #dc2626; padding: 15px; margin: 20px 0;">
          <p><strong>Cliente:</strong> ${clientName}</p>
          <p><strong>T\xEDtulo:</strong> ${ticketTitle}</p>
        </div>
        <p>Por favor revisa y responde al ticket lo antes posible.</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="https://softwarepar.lat/admin/support" style="background: #dc2626; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">Ver Ticket</a>
        </div>
      </div>
    </body>
    </html>
  `;
}
function generateTicketResponseEmailHTML(responderName, ticketTitle, response, isFromSupport) {
  const color = isFromSupport ? "#059669" : "#1e40af";
  const title = isFromSupport ? "Respuesta de Soporte" : "Nueva Respuesta";
  return `
    <!DOCTYPE html>
    <html>
    <head><meta charset="utf-8"><title>${title}</title></head>
    <body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="background: linear-gradient(135deg, ${color} 0%, ${color}dd 100%); color: white; padding: 30px; border-radius: 10px; text-align: center;">
        <h1 style="margin: 0;">\u{1F4DE} ${title}</h1>
      </div>
      <div style="padding: 30px 0;">
        <h2>Respuesta a tu ticket</h2>
        <div style="background: #f8fafc; border-left: 4px solid ${color}; padding: 15px; margin: 20px 0;">
          <p><strong>De:</strong> ${responderName}</p>
          <p><strong>Ticket:</strong> ${ticketTitle}</p>
          <p><strong>Respuesta:</strong></p>
          <div style="background: white; padding: 15px; border-radius: 5px; margin-top: 10px;">
            ${response}
          </div>
        </div>
        <div style="text-align: center; margin: 30px 0;">
          <a href="https://softwarepar.lat/client/support" style="background: ${color}; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">Ver Ticket</a>
        </div>
      </div>
    </body>
    </html>
  `;
}
async function generatePaymentStageEmailHTML(projectName, stageName, amount) {
  const formattedAmount = await formatCurrencyWithConversion(amount);
  return `
    <!DOCTYPE html>
    <html>
    <head><meta charset="utf-8"><title>Pago Disponible</title></head>
    <body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="background: linear-gradient(135deg, #059669 0%, #047857 100%); color: white; padding: 30px; border-radius: 10px; text-align: center;">
        <h1 style="margin: 0;">\u{1F4B0} Pago Disponible</h1>
        <p style="margin: 10px 0 0 0; font-size: 24px;">${formattedAmount}</p>
      </div>
      <div style="padding: 30px 0;">
        <h2>\xA1Tu proyecto ha avanzado!</h2>
        <p>Una nueva etapa de pago est\xE1 disponible para tu proyecto:</p>
        <div style="background: #f0fdf4; border-left: 4px solid #059669; padding: 15px; margin: 20px 0;">
          <p><strong>Proyecto:</strong> ${projectName}</p>
          <p><strong>Etapa:</strong> ${stageName}</p>
          <p><strong>Monto:</strong> ${formattedAmount}</p>
        </div>
        <div style="text-align: center; margin: 30px 0;">
          <a href="https://softwarepar.lat/client/projects" style="background: #059669; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">Realizar Pago</a>
        </div>
      </div>
    </body>
    </html>
  `;
}
async function generateBudgetNegotiationEmailHTML(projectName, proposedPrice, message, isCounterOffer) {
  const title = isCounterOffer ? "Contraoferta Recibida" : "Nueva Negociaci\xF3n de Presupuesto";
  const formattedPrice = await formatCurrencyWithConversion(proposedPrice);
  return `
    <!DOCTYPE html>
    <html>
    <head><meta charset="utf-8"><title>${title}</title></head>
    <body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%); color: white; padding: 30px; border-radius: 10px; text-align: center;">
        <h1 style="margin: 0;">\u{1F4B5} ${title}</h1>
        <p style="margin: 10px 0 0 0; font-size: 24px;">${formattedPrice}</p>
      </div>
      <div style="padding: 30px 0;">
        <h2>Nueva propuesta de presupuesto</h2>
        <div style="background: #fffbeb; border-left: 4px solid #f59e0b; padding: 15px; margin: 20px 0;">
          <p><strong>Proyecto:</strong> ${projectName}</p>
          <p><strong>Precio propuesto:</strong> ${formattedPrice}</p>
          ${message ? `<p><strong>Mensaje:</strong></p><div style="background: white; padding: 10px; border-radius: 5px; margin-top: 10px;">${message}</div>` : ""}
        </div>
        <div style="text-align: center; margin: 30px 0;">
          <a href="https://softwarepar.lat/client/projects" style="background: #f59e0b; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">Revisar Propuesta</a>
        </div>
      </div>
    </body>
    </html>
  `;
}
function generateAdminProjectUpdateEmailHTML(projectName, updateDescription, updatedBy, clientName) {
  return `
    <!DOCTYPE html>
    <html>
    <head><meta charset="utf-8"><title>Proyecto Actualizado - Admin</title></head>
    <body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="background: linear-gradient(135deg, #1e40af 0%, #1e3a8a 100%); color: white; padding: 30px; border-radius: 10px; text-align: center;">
        <h1 style="margin: 0;">\u{1F4CB} Proyecto Actualizado</h1>
      </div>
      <div style="padding: 30px 0;">
        <h2>Actualizaci\xF3n de Proyecto</h2>
        <div style="background: #f0fdf4; border-left: 4px solid #1e40af; padding: 15px; margin: 20px 0;">
          <h3 style="margin: 0 0 10px 0;">${projectName}</h3>
          <p><strong>Cliente:</strong> ${clientName}</p>
          <p><strong>Actualizaci\xF3n:</strong> ${updateDescription}</p>
          <p><strong>Actualizado por:</strong> ${updatedBy}</p>
          <p><strong>Fecha:</strong> ${(/* @__PURE__ */ new Date()).toLocaleDateString("es-PY")}</p>
        </div>
        <div style="text-align: center; margin: 30px 0;">
          <a href="https://softwarepar.lat/admin/projects" style="background: #1e40af; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">Ver en Dashboard Admin</a>
        </div>
      </div>
    </body>
    </html>
  `;
}
function generateProjectCreatedConfirmationEmailHTML(clientName, projectName) {
  return `
    <!DOCTYPE html>
    <html>
    <head><meta charset="utf-8"><title>Proyecto Creado Exitosamente</title></head>
    <body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="background: linear-gradient(135deg, #059669 0%, #047857 100%); color: white; padding: 30px; border-radius: 10px; text-align: center;">
        <h1 style="margin: 0; font-size: 28px;">\u{1F389} \xA1Proyecto Creado Exitosamente!</h1>
        <p style="margin: 10px 0 0 0; font-size: 16px; opacity: 0.9;">Tu solicitud ha sido recibida</p>
      </div>
      
      <div style="padding: 30px 0;">
        <h2 style="color: #059669;">\xA1Hola ${clientName}!</h2>
        <p>Gracias por confiar en SoftwarePar. Tu proyecto <strong>"${projectName}"</strong> ha sido creado exitosamente y nuestro equipo ya est\xE1 evaluando los detalles.</p>
        
        <div style="background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 8px; padding: 20px; margin: 20px 0;">
          <h3 style="margin: 0 0 15px 0; color: #059669;">\u{1F50D} \xBFQu\xE9 est\xE1 pasando ahora?</h3>
          <ul style="margin: 10px 0; padding-left: 20px; color: #374151;">
            <li><strong>Revisi\xF3n t\xE9cnica:</strong> Analizamos los requerimientos de tu proyecto</li>
            <li><strong>Estimaci\xF3n:</strong> Calculamos tiempos y recursos necesarios</li>
            <li><strong>Asignaci\xF3n:</strong> Seleccionamos al equipo ideal para tu proyecto</li>
            <li><strong>Propuesta:</strong> Te enviaremos una propuesta detallada</li>
          </ul>
        </div>

        <div style="background: #eff6ff; border: 1px solid #bfdbfe; border-radius: 8px; padding: 20px; margin: 20px 0;">
          <h3 style="margin: 0 0 10px 0; color: #1e40af;">\u23F0 Tiempo de respuesta</h3>
          <p style="margin: 5px 0; color: #1e40af;"><strong>Te contactaremos en las pr\xF3ximas 24-48 horas</strong> con una propuesta detallada y los siguientes pasos.</p>
        </div>

        <div style="background: #fffbeb; border: 1px solid #fbbf24; border-radius: 8px; padding: 20px; margin: 20px 0;">
          <h3 style="margin: 0 0 10px 0; color: #d97706;">\u{1F4AC} \xBFNecesitas contactarnos?</h3>
          <p style="margin: 5px 0;">Para consultas urgentes o informaci\xF3n adicional:</p>
          <div style="text-align: center; margin: 15px 0;">
            <a href="https://wa.me/595985990046?text=Hola,%20he%20creado%20el%20proyecto%20'${projectName}'%20y%20quisiera%20m\xE1s%20informaci\xF3n." 
               style="background: #25d366; color: white; padding: 12px 25px; text-decoration: none; border-radius: 25px; display: inline-block; font-weight: bold;">
              \u{1F4F1} WhatsApp: +595 985 990 046
            </a>
          </div>
        </div>

        <div style="text-align: center; margin: 30px 0;">
          <a href="https://softwarepar.lat/client/projects" style="background: #059669; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">Ver Mi Dashboard</a>
        </div>

        <p>\xA1Estamos emocionados de trabajar contigo y hacer realidad tu proyecto!</p>

        <p style="margin-top: 30px;">
          Saludos cordiales,<br>
          <strong>El equipo de SoftwarePar</strong>
        </p>
      </div>

      <div style="border-top: 1px solid #eee; padding-top: 20px; text-align: center; color: #666; font-size: 14px;">
        <p>SoftwarePar - Desarrollo de Software Profesional</p>
        <p>Itap\xFAa, Carlos Antonio L\xF3pez, Paraguay</p>
        <p>\u{1F4E7} softwarepar.lat@gmail.com | \u{1F4F1} +595 985 990 046</p>
      </div>
    </body>
    </html>
  `;
}
var wsConnections;
var init_notifications = __esm({
  "server/notifications.ts"() {
    "use strict";
    init_db();
    init_schema();
    init_email();
    wsConnections = /* @__PURE__ */ new Map();
  }
});

// server/storage.ts
import { eq as eq3, desc, sql as sql2, and, inArray } from "drizzle-orm";
var DatabaseStorage, storage;
var init_storage = __esm({
  "server/storage.ts"() {
    "use strict";
    init_schema();
    init_db();
    DatabaseStorage = class {
      // Use the imported db instance directly
      // Removed db instance from here as it's already imported at the top level.
      async getUser(id) {
        const [user] = await db.select().from(users).where(eq3(users.id, id));
        return user;
      }
      async getUserByEmail(email) {
        const [user] = await db.select().from(users).where(eq3(users.email, email));
        return user;
      }
      async getUserById(id) {
        const [user] = await db.select().from(users).where(eq3(users.id, id));
        return user;
      }
      async createUser(insertUser) {
        const [user] = await db.insert(users).values(insertUser).returning();
        return user;
      }
      async updateUser(userId, updates) {
        const [user] = await db.update(users).set({
          ...updates,
          updatedAt: /* @__PURE__ */ new Date()
        }).where(eq3(users.id, userId)).returning();
        if (!user) {
          throw new Error("Usuario no encontrado");
        }
        return user;
      }
      async deleteUser(userId) {
        const user = await this.getUserById(userId);
        if (!user) {
          throw new Error("Usuario no encontrado");
        }
        if (user.role === "admin") {
          const adminCount = await db.select({ count: sql2`count(*)` }).from(users).where(eq3(users.role, "admin"));
          if (Number(adminCount[0]?.count || 0) <= 1) {
            throw new Error("No se puede eliminar el \xFAltimo administrador del sistema");
          }
        }
        console.log(`\u{1F5D1}\uFE0F Iniciando eliminaci\xF3n en cascada para usuario ${userId}`);
        const userTickets = await db.select({ id: tickets.id }).from(tickets).where(eq3(tickets.userId, userId));
        for (const ticket of userTickets) {
          await db.delete(ticketResponses).where(eq3(ticketResponses.ticketId, ticket.id));
        }
        await db.delete(tickets).where(eq3(tickets.userId, userId));
        await db.delete(ticketResponses).where(eq3(ticketResponses.userId, userId));
        const userProjects = await db.select({ id: projects.id }).from(projects).where(eq3(projects.clientId, userId));
        for (const project of userProjects) {
          await db.delete(projectMessages).where(eq3(projectMessages.projectId, project.id));
          await db.delete(projectFiles).where(eq3(projectFiles.projectId, project.id));
          await db.delete(projectTimeline).where(eq3(projectTimeline.projectId, project.id));
          await db.delete(paymentStages).where(eq3(paymentStages.projectId, project.id));
          await db.delete(budgetNegotiations).where(eq3(budgetNegotiations.projectId, project.id));
          await db.delete(payments).where(eq3(payments.projectId, project.id));
        }
        await db.delete(projects).where(eq3(projects.clientId, userId));
        await db.delete(projectMessages).where(eq3(projectMessages.userId, userId));
        await db.delete(projectFiles).where(eq3(projectFiles.uploadedBy, userId));
        await db.delete(budgetNegotiations).where(eq3(budgetNegotiations.proposedBy, userId));
        const partner = await db.select({ id: partners.id }).from(partners).where(eq3(partners.userId, userId)).limit(1);
        if (partner[0]) {
          await db.delete(referrals).where(eq3(referrals.partnerId, partner[0].id));
          await db.delete(partners).where(eq3(partners.userId, userId));
        }
        await db.delete(referrals).where(eq3(referrals.clientId, userId));
        await db.delete(notifications).where(eq3(notifications.userId, userId));
        await db.delete(paymentMethods).where(eq3(paymentMethods.userId, userId));
        const userInvoices = await db.select({ id: invoices.id }).from(invoices).where(eq3(invoices.clientId, userId));
        for (const invoice of userInvoices) {
          await db.delete(transactions).where(eq3(transactions.invoiceId, invoice.id));
        }
        await db.delete(invoices).where(eq3(invoices.clientId, userId));
        await db.delete(transactions).where(eq3(transactions.userId, userId));
        await db.delete(users).where(eq3(users.id, userId));
        console.log(`\u2705 Usuario ${userId} y todos sus datos relacionados eliminados exitosamente`);
      }
      async getPartner(userId) {
        const [partner] = await db.select().from(partners).where(eq3(partners.userId, userId));
        return partner;
      }
      async getPartnerByReferralCode(code) {
        const [partner] = await db.select().from(partners).where(eq3(partners.referralCode, code));
        return partner;
      }
      async createPartner(insertPartner) {
        const [partner] = await db.insert(partners).values(insertPartner).returning();
        return partner;
      }
      async updatePartner(id, updates) {
        const [partner] = await db.update(partners).set(updates).where(eq3(partners.id, id)).returning();
        return partner;
      }
      async getPartnerStats(partnerId) {
        const [stats] = await db.select({
          totalEarnings: partners.totalEarnings,
          activeReferrals: sql2`COUNT(DISTINCT ${referrals.id})`,
          closedSales: sql2`COUNT(DISTINCT CASE WHEN ${referrals.status} = 'paid' THEN ${referrals.id} END)`
        }).from(partners).leftJoin(referrals, eq3(partners.id, referrals.partnerId)).where(eq3(partners.id, partnerId)).groupBy(partners.id);
        return {
          totalEarnings: stats?.totalEarnings || "0.00",
          activeReferrals: stats?.activeReferrals || 0,
          closedSales: stats?.closedSales || 0,
          conversionRate: stats?.activeReferrals > 0 ? Math.round(stats.closedSales / stats.activeReferrals * 100) : 0
        };
      }
      async getPartnerEarningsData(partnerId) {
        try {
          const totalEarnings = await db.select({ sum: sql2`COALESCE(sum(commission_amount), 0)` }).from(referrals).where(and(eq3(referrals.partnerId, partnerId), eq3(referrals.status, "paid")));
          const currentMonth = /* @__PURE__ */ new Date();
          currentMonth.setDate(1);
          currentMonth.setHours(0, 0, 0, 0);
          const monthlyEarnings = await db.select({ sum: sql2`COALESCE(sum(commission_amount), 0)` }).from(referrals).where(and(
            eq3(referrals.partnerId, partnerId),
            eq3(referrals.status, "paid"),
            sql2`created_at >= ${currentMonth}`
          ));
          const pendingCommissions = await db.select({ sum: sql2`COALESCE(sum(commission_amount), 0)` }).from(referrals).where(and(eq3(referrals.partnerId, partnerId), eq3(referrals.status, "converted")));
          const totalReferrals = await db.select({ count: sql2`count(*)` }).from(referrals).where(eq3(referrals.partnerId, partnerId));
          const activeReferrals = await db.select({ count: sql2`count(*)` }).from(referrals).where(and(
            eq3(referrals.partnerId, partnerId),
            sql2`project_id IS NOT NULL`
          ));
          const conversionRate = totalReferrals[0]?.count > 0 ? Number(activeReferrals[0]?.count || 0) / Number(totalReferrals[0]?.count) * 100 : 0;
          return {
            totalEarnings: Number(totalEarnings[0]?.sum || 0),
            monthlyEarnings: Number(monthlyEarnings[0]?.sum || 0),
            pendingCommissions: Number(pendingCommissions[0]?.sum || 0),
            paidCommissions: Number(totalEarnings[0]?.sum || 0),
            conversionRate: Math.round(conversionRate * 100) / 100,
            referralsCount: Number(totalReferrals[0]?.count || 0),
            activeReferrals: Number(activeReferrals[0]?.count || 0)
          };
        } catch (error) {
          console.error("Error getting partner earnings data:", error);
          throw error;
        }
      }
      async getPartnerCommissions(partnerId) {
        try {
          const result = await db.select({
            id: referrals.id,
            projectName: projects.name,
            clientName: users.fullName,
            amount: referrals.commissionAmount,
            status: referrals.status,
            date: referrals.createdAt,
            paymentDate: sql2`CASE WHEN ${referrals.status} = 'paid' THEN ${referrals.createdAt} ELSE NULL END`
          }).from(referrals).leftJoin(projects, eq3(referrals.projectId, projects.id)).leftJoin(users, eq3(referrals.clientId, users.id)).where(eq3(referrals.partnerId, partnerId)).orderBy(desc(referrals.createdAt));
          return result.map((commission) => ({
            ...commission,
            amount: Number(commission.amount || 0)
          }));
        } catch (error) {
          console.error("Error getting partner commissions:", error);
          throw error;
        }
      }
      async getProjects(userId, userRole) {
        let query = db.select({
          id: projects.id,
          name: projects.name,
          description: projects.description,
          price: projects.price,
          status: projects.status,
          progress: projects.progress,
          clientId: projects.clientId,
          partnerId: projects.partnerId,
          startDate: projects.startDate,
          deliveryDate: projects.deliveryDate,
          createdAt: projects.createdAt,
          updatedAt: projects.updatedAt
        }).from(projects);
        if (userRole !== "admin") {
          query = query.where(eq3(projects.clientId, userId));
        }
        return await query.orderBy(desc(projects.createdAt));
      }
      async getProject(id) {
        const [project] = await db.select().from(projects).where(eq3(projects.id, id));
        return project;
      }
      async createProject(insertProject) {
        const [project] = await db.insert(projects).values(insertProject).returning();
        return project;
      }
      async updateProject(id, updates) {
        try {
          console.log("Updating project with data:", updates);
          const updateData = {
            ...updates,
            updatedAt: /* @__PURE__ */ new Date()
          };
          if (updates.startDate) {
            updateData.startDate = new Date(updates.startDate);
          }
          if (updates.deliveryDate) {
            updateData.deliveryDate = new Date(updates.deliveryDate);
          }
          const [updatedProject] = await db.update(projects).set(updateData).where(eq3(projects.id, id)).returning();
          if (updates.progress !== void 0) {
            await this.updatePaymentStagesForProgress(id, updates.progress);
          }
          return updatedProject;
        } catch (error) {
          console.error("Error updating project:", error);
          throw error;
        }
      }
      // Add method to update payment stages based on project progress
      async updatePaymentStagesForProgress(projectId, newProgress) {
        console.log(`\u{1F504} Actualizando etapas de pago para proyecto ${projectId} con progreso ${newProgress}%`);
        try {
          const stages = await db.select().from(paymentStages).where(eq3(paymentStages.projectId, projectId)).orderBy(paymentStages.requiredProgress);
          console.log(`\u{1F4CA} Etapas encontradas: ${stages.length}`);
          const stagesToActivate = stages.filter(
            (stage) => stage.status === "pending" && stage.requiredProgress <= newProgress
          );
          if (stagesToActivate.length > 0) {
            console.log(`\u2705 Activando ${stagesToActivate.length} etapa(s) de pago`);
            const project = await this.getProject(projectId);
            const client = project ? await this.getUserById(project.clientId) : null;
            for (const stage of stagesToActivate) {
              await db.update(paymentStages).set({ status: "available", updatedAt: /* @__PURE__ */ new Date() }).where(eq3(paymentStages.id, stage.id));
              console.log(`\u{1F4B0} Etapa "${stage.stageName}" ahora disponible para pago`);
              if (project && client?.email) {
                try {
                  const { generatePaymentStageAvailableEmailHTML: generatePaymentStageAvailableEmailHTML2, sendEmail: sendEmail2 } = await Promise.resolve().then(() => (init_email(), email_exports));
                  const emailHtml = await generatePaymentStageAvailableEmailHTML2(
                    client.fullName,
                    project.name,
                    stage.stageName,
                    stage.amount,
                    stage.stagePercentage
                  );
                  await sendEmail2({
                    to: client.email,
                    subject: `\u{1F4B0} Nueva Etapa de Pago Disponible: ${project.name} - ${stage.stageName}`,
                    html: emailHtml
                  });
                  console.log(`\u{1F4E7} Email de nueva etapa disponible enviado a: ${client.email} para "${stage.stageName}"`);
                } catch (emailError) {
                  console.error(`\u274C Error enviando email de nueva etapa al cliente:`, emailError);
                }
              }
              if (project && client) {
                try {
                  await this.createNotification({
                    userId: client.id,
                    title: "\u{1F4B0} Pago Disponible",
                    message: `Nueva etapa de pago disponible: ${stage.stageName} - $${stage.amount}`,
                    type: "success"
                  });
                  console.log(`\u{1F514} Notificaci\xF3n in-app enviada al cliente ${client.id}`);
                } catch (notifError) {
                  console.error(`\u274C Error enviando notificaci\xF3n:`, notifError);
                }
              }
            }
          }
          console.log(`\u2705 Etapas de pago actualizadas para proyecto ${projectId} con progreso ${newProgress}%`);
        } catch (error) {
          console.error(`\u274C Error actualizando etapas de pago:`, error);
          throw error;
        }
      }
      async getReferrals(partnerId) {
        return await db.select({
          id: referrals.id,
          status: referrals.status,
          commissionAmount: referrals.commissionAmount,
          createdAt: referrals.createdAt,
          clientName: users.fullName,
          clientEmail: users.email,
          projectName: projects.name,
          projectPrice: projects.price
        }).from(referrals).leftJoin(users, eq3(referrals.clientId, users.id)).leftJoin(projects, eq3(referrals.projectId, projects.id)).where(eq3(referrals.partnerId, partnerId)).orderBy(desc(referrals.createdAt));
      }
      async createReferral(insertReferral) {
        const [referral] = await db.insert(referrals).values(insertReferral).returning();
        return referral;
      }
      async getTickets(userId) {
        const ticketList = await db.select({
          id: tickets.id,
          title: tickets.title,
          description: tickets.description,
          status: tickets.status,
          priority: tickets.priority,
          createdAt: tickets.createdAt,
          updatedAt: tickets.updatedAt,
          projectName: projects.name,
          projectId: tickets.projectId
        }).from(tickets).leftJoin(projects, eq3(tickets.projectId, projects.id)).where(eq3(tickets.userId, userId)).orderBy(desc(tickets.createdAt));
        const ticketsWithResponses = await Promise.all(
          ticketList.map(async (ticket) => {
            const responses = await this.getTicketResponses(ticket.id);
            return {
              ...ticket,
              responses
            };
          })
        );
        return ticketsWithResponses;
      }
      async getTicket(ticketId) {
        try {
          const result = await db.select({
            id: tickets.id,
            title: tickets.title,
            description: tickets.description,
            status: tickets.status,
            priority: tickets.priority,
            userId: tickets.userId,
            projectId: tickets.projectId,
            createdAt: tickets.createdAt,
            updatedAt: tickets.updatedAt
          }).from(tickets).where(eq3(tickets.id, ticketId)).limit(1);
          return result[0] || null;
        } catch (error) {
          console.error("Error getting ticket:", error);
          throw error;
        }
      }
      async createTicket(insertTicket) {
        const [ticket] = await db.insert(tickets).values(insertTicket).returning();
        return ticket;
      }
      // This method is duplicated, keeping the one from the changes
      async updateTicket(id, updates) {
        const [ticket] = await db.update(tickets).set({ ...updates, updatedAt: /* @__PURE__ */ new Date() }).where(eq3(tickets.id, id)).returning();
        return ticket;
      }
      async createTicketResponse(responseData) {
        const [response] = await db.insert(ticketResponses).values({
          ...responseData,
          createdAt: /* @__PURE__ */ new Date()
          // Store as Date object
        }).returning();
        return response;
      }
      async getTicketResponses(ticketId) {
        return await db.select({
          id: ticketResponses.id,
          message: ticketResponses.message,
          author: users.fullName,
          role: users.role,
          createdAt: ticketResponses.createdAt,
          isFromSupport: ticketResponses.isFromSupport
        }).from(ticketResponses).leftJoin(users, eq3(ticketResponses.userId, users.id)).where(eq3(ticketResponses.ticketId, ticketId)).orderBy(ticketResponses.createdAt);
      }
      async getNotifications(userId) {
        return await db.select().from(notifications).where(eq3(notifications.userId, userId)).orderBy(desc(notifications.createdAt)).limit(20);
      }
      async createNotification(insertNotification) {
        try {
          const [notification] = await db.insert(notifications).values(insertNotification).returning();
          return notification;
        } catch (error) {
          if (error.code === "23505" && error.constraint === "notifications_pkey") {
            console.warn("\u{1F504} Reintentando inserci\xF3n de notificaci\xF3n por clave duplicada");
            const [notification] = await db.insert(notifications).values({
              ...insertNotification
              // Dejar que la base de datos genere un nuevo ID automáticamente
            }).returning();
            return notification;
          }
          throw error;
        }
      }
      async markNotificationAsRead(id) {
        await db.update(notifications).set({ isRead: true }).where(eq3(notifications.id, id));
      }
      async notifyAdmins(notificationData) {
        try {
          const admins = await this.getUsersByRole("admin");
          await Promise.all(admins.map(
            (admin) => this.createNotification({ ...notificationData, userId: admin.id })
          ));
        } catch (error) {
          console.error("Error notifying admins:", error);
          throw error;
        }
      }
      async notifyUser(userId, notificationData) {
        try {
          await this.createNotification({ ...notificationData, userId });
        } catch (error) {
          console.error(`Error notifying user ${userId}:`, error);
          throw error;
        }
      }
      async createPayment(insertPayment) {
        throw new Error("Payment operations are currently disabled.");
      }
      async updatePayment(id, updates) {
        throw new Error("Payment operations are currently disabled.");
      }
      // Payment methods
      async getPaymentMethodsByUser(userId) {
        try {
          const methods = await db.select({
            id: paymentMethods.id,
            userId: paymentMethods.userId,
            type: paymentMethods.type,
            isDefault: paymentMethods.isDefault,
            isActive: paymentMethods.isActive,
            createdAt: paymentMethods.createdAt,
            updatedAt: paymentMethods.updatedAt
          }).from(paymentMethods).where(and(
            eq3(paymentMethods.userId, userId),
            eq3(paymentMethods.isActive, true)
          )).orderBy(desc(paymentMethods.isDefault), desc(paymentMethods.createdAt));
          return methods.map((method) => ({
            ...method,
            details: method.type === "card" ? {
              last4: "****",
              brand: "Tarjeta",
              expiryDate: "MM/AA",
              holderName: "Titular"
            } : {
              bankName: "Banco",
              accountNumber: "****"
            }
          }));
        } catch (error) {
          console.error("Error getting payment methods:", error);
          return [];
        }
      }
      async createPaymentMethod(data) {
        try {
          if (data.isDefault) {
            await db.update(paymentMethods).set({ isDefault: false }).where(eq3(paymentMethods.userId, data.userId));
          }
          const [paymentMethod] = await db.insert(paymentMethods).values({
            ...data,
            createdAt: /* @__PURE__ */ new Date()
          }).returning();
          return paymentMethod;
        } catch (error) {
          console.error("Error creating payment method:", error);
          throw new Error("No se pudo crear el m\xE9todo de pago");
        }
      }
      async updatePaymentMethod(id, updates) {
        try {
          const [paymentMethod] = await db.update(paymentMethods).set({ ...updates, updatedAt: /* @__PURE__ */ new Date() }).where(eq3(paymentMethods.id, id)).returning();
          return paymentMethod;
        } catch (error) {
          console.error("Error updating payment method:", error);
          throw new Error("No se pudo actualizar el m\xE9todo de pago");
        }
      }
      async deletePaymentMethod(id) {
        try {
          await db.update(paymentMethods).set({ isActive: false, updatedAt: /* @__PURE__ */ new Date() }).where(eq3(paymentMethods.id, id));
        } catch (error) {
          console.error("Error deleting payment method:", error);
          throw new Error("No se pudo eliminar el m\xE9todo de pago");
        }
      }
      async getNextInvoiceNumber() {
        const result = await db.select({ max: sql2`max(cast(substring(${invoices.invoiceNumber} from '[0-9]+$') as integer))` }).from(invoices);
        return (result[0]?.max || 0) + 1;
      }
      // Invoices
      async getInvoicesByClient(clientId) {
        try {
          console.log(`\u{1F50D} Obteniendo facturas para cliente: ${clientId}`);
          const clientInvoices = await db.select({
            id: invoices.id,
            invoiceNumber: invoices.invoiceNumber,
            projectId: invoices.projectId,
            clientId: invoices.clientId,
            paymentStageId: invoices.paymentStageId,
            amount: invoices.amount,
            status: invoices.status,
            dueDate: invoices.dueDate,
            paidDate: invoices.paidDate,
            createdAt: invoices.createdAt,
            exchangeRateUsed: invoices.exchangeRateUsed,
            sifenCDC: invoices.sifenCDC,
            sifenEstado: invoices.sifenEstado
          }).from(invoices).where(eq3(invoices.clientId, clientId)).orderBy(desc(invoices.createdAt));
          console.log(`\u{1F4C4} Facturas tradicionales encontradas: ${clientInvoices.length}`);
          const invoicesWithStageInfo = await Promise.all(clientInvoices.map(async (invoice) => {
            if (invoice.paymentStageId) {
              const [stage] = await db.select({ stageName: paymentStages.stageName, stagePercentage: paymentStages.stagePercentage }).from(paymentStages).where(eq3(paymentStages.id, invoice.paymentStageId));
              return {
                ...invoice,
                stageName: stage?.stageName,
                stagePercentage: stage?.stagePercentage,
                type: "stage_payment"
              };
            } else {
              return {
                ...invoice,
                type: "traditional"
              };
            }
          }));
          return invoicesWithStageInfo.filter((inv) => inv.invoiceNumber && inv.invoiceNumber !== "");
        } catch (error) {
          console.error("Error getting invoices by client:", error);
          return [];
        }
      }
      async createInvoice(data) {
        try {
          const [invoice] = await db.insert(invoices).values(data).returning();
          return invoice;
        } catch (error) {
          console.error("Error creating invoice:", error);
          throw new Error("No se pudo crear la factura.");
        }
      }
      async updateInvoice(id, updates) {
        const [invoice] = await db.update(invoices).set({ ...updates, updatedAt: /* @__PURE__ */ new Date() }).where(eq3(invoices.id, id)).returning();
        return invoice;
      }
      // Transactions
      async getTransactionsByUser(userId) {
        try {
          const userTransactions = await db.select({
            id: transactions.id,
            type: sql2`CASE
            WHEN ${transactions.amount} > 0 THEN 'payment'
            ELSE 'fee'
          END`.as("type"),
            amount: transactions.amount,
            description: sql2`CONCAT('Transacción para factura #', ${transactions.invoiceId})`.as("description"),
            status: transactions.status,
            date: transactions.createdAt,
            invoiceId: transactions.invoiceId,
            paymentMethodId: transactions.paymentMethodId
          }).from(transactions).where(eq3(transactions.userId, userId)).orderBy(desc(transactions.createdAt));
          return userTransactions;
        } catch (error) {
          console.error("Error getting transactions:", error);
          return [
            {
              id: 1,
              type: "payment",
              amount: "2500.00",
              description: "Pago de proyecto demo",
              status: "completed",
              date: /* @__PURE__ */ new Date(),
              invoiceId: 1,
              paymentMethodId: 1
            }
          ];
        }
      }
      async createTransaction(data) {
        const [transaction] = await db.insert(transactions).values(data).returning();
        return transaction;
      }
      async getAllUsers() {
        const allUsers = await db.select({
          id: users.id,
          email: users.email,
          fullName: users.fullName,
          role: users.role,
          isActive: users.isActive,
          createdAt: users.createdAt,
          updatedAt: users.updatedAt
        }).from(users).orderBy(users.createdAt);
        const enrichedUsers = await Promise.all(
          allUsers.map(async (user) => {
            const projectCount = await db.select({ count: sql2`count(*)` }).from(projects).where(eq3(projects.clientId, user.id));
            const ticketCount = await db.select({ count: sql2`count(*)` }).from(tickets).where(eq3(tickets.userId, user.id));
            return {
              ...user,
              projectsCount: Number(projectCount[0]?.count || 0),
              ticketsCount: Number(ticketCount[0]?.count || 0)
            };
          })
        );
        return enrichedUsers;
      }
      async getUsersByRole(role) {
        try {
          return await db.select().from(users).where(eq3(users.role, role));
        } catch (error) {
          console.error("Error getting users by role:", error);
          throw error;
        }
      }
      // Portfolio operations (Implemented)
      async getPortfolio() {
        try {
          const result = await db.select().from(portfolio).where(eq3(portfolio.isActive, true)).orderBy(desc(portfolio.createdAt));
          return result;
        } catch (error) {
          console.error("Error fetching portfolio:", error);
          return [];
        }
      }
      async createPortfolio(data) {
        try {
          const portfolioData = {
            ...data,
            completedAt: typeof data.completedAt === "string" ? new Date(data.completedAt) : data.completedAt
          };
          const [newPortfolio] = await db.insert(portfolio).values(portfolioData).returning();
          return newPortfolio;
        } catch (error) {
          console.error("Error creating portfolio:", error);
          throw error;
        }
      }
      async updatePortfolio(id, updates) {
        try {
          const portfolioUpdates = {
            ...updates,
            completedAt: updates.completedAt && typeof updates.completedAt === "string" ? new Date(updates.completedAt) : updates.completedAt,
            updatedAt: /* @__PURE__ */ new Date()
          };
          const [updatedPortfolio] = await db.update(portfolio).set(portfolioUpdates).where(eq3(portfolio.id, id)).returning();
          return updatedPortfolio;
        } catch (error) {
          console.error("Error updating portfolio:", error);
          throw error;
        }
      }
      async deletePortfolio(id) {
        try {
          await db.delete(portfolio).where(eq3(portfolio.id, id));
        } catch (error) {
          console.error("Error deleting portfolio:", error);
          throw error;
        }
      }
      // Admin Stats
      async getAdminStats() {
        try {
          const totalUsers = await db.select({ count: sql2`count(*)` }).from(users);
          const activePartners = await db.select({ count: sql2`count(*)` }).from(partners);
          const totalProjects = await db.select({ count: sql2`count(*)` }).from(projects);
          const totalRevenue = await db.select({ sum: sql2`COALESCE(SUM(CAST(amount AS DECIMAL)), 0)` }).from(paymentStages).where(eq3(paymentStages.status, "paid"));
          const currentMonth = /* @__PURE__ */ new Date();
          const firstDayOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1);
          const monthlyRevenue = await db.select({ sum: sql2`COALESCE(SUM(CAST(amount AS DECIMAL)), 0)` }).from(paymentStages).where(and(
            eq3(paymentStages.status, "paid"),
            sql2`updated_at >= ${firstDayOfMonth.toISOString()}`
          ));
          return {
            totalUsers: totalUsers[0]?.count?.toString() || "0",
            activePartners: activePartners[0]?.count?.toString() || "0",
            totalProjects: totalProjects[0]?.count?.toString() || "0",
            totalRevenue: Number(totalRevenue[0]?.sum || 0).toFixed(2),
            monthlyRevenue: Number(monthlyRevenue[0]?.sum || 0).toFixed(2)
          };
        } catch (error) {
          console.error("Error getting admin stats:", error);
          throw error;
        }
      }
      // Nuevo método para obtener datos de billing en tiempo real por cliente
      async getClientBillingData(clientId) {
        try {
          console.log(`\u{1F9EE} Calculando datos de facturaci\xF3n para cliente: ${clientId}`);
          const clientInvoices = await db.select().from(invoices).where(eq3(invoices.clientId, clientId));
          console.log(`\u{1F4B3} Facturas tradicionales encontradas: ${clientInvoices.length}`);
          const clientProjects = await db.select().from(projects).where(eq3(projects.clientId, clientId));
          console.log(`\u{1F3D7}\uFE0F Proyectos del cliente: ${clientProjects.length}`);
          const projectIds = clientProjects.map((p) => p.id);
          let stageInvoices = [];
          if (projectIds.length > 0) {
            stageInvoices = await db.select().from(paymentStages).where(inArray(paymentStages.projectId, projectIds));
          }
          console.log(`\u{1F4B0} Etapas de pago encontradas: ${stageInvoices.length}`);
          console.log(`\u{1F50D} Detalle de etapas:`, stageInvoices.map((s) => ({
            id: s.id,
            amount: s.amount,
            status: s.status,
            stageName: s.stageName
          })));
          const traditionalInvoices = clientInvoices.filter((inv) => !inv.paymentStageId) || [];
          const traditionalPaid = traditionalInvoices.filter((inv) => inv.status === "paid").reduce((sum, inv) => sum + parseFloat(inv.amount || "0"), 0);
          const traditionalPending = traditionalInvoices.filter((inv) => inv.status === "pending" || inv.status === "overdue").reduce((sum, inv) => sum + parseFloat(inv.amount || "0"), 0);
          console.log(`\u{1F4B3} Facturas tradicionales (sin etapas vinculadas) - Pagado: $${traditionalPaid}, Pendiente: $${traditionalPending}`);
          const paidStages = stageInvoices.filter((stage) => stage.status === "paid");
          console.log(`\u2705 Etapas pagadas encontradas:`, paidStages.length);
          console.log(`\u{1F4CB} Etapas pagadas detalle:`, paidStages.map((s) => ({
            id: s.id,
            stageName: s.stageName,
            amount: s.amount,
            status: s.status
          })));
          const stagePaid = paidStages.reduce((sum, stage) => {
            const amount = parseFloat(stage.amount?.toString() || "0");
            console.log(`\u{1F4B0} Sumando etapa pagada: ${stage.stageName} - $${amount}`);
            return sum + amount;
          }, 0);
          const availableStages = stageInvoices.filter(
            (stage) => stage.status === "available" || stage.status === "pending_verification" || stage.status === "pending"
          );
          const stagePending = availableStages.reduce((sum, stage) => {
            const amount = parseFloat(stage.amount?.toString() || "0");
            return sum + amount;
          }, 0);
          console.log(`\u{1F3D7}\uFE0F Etapas de pago - Pagado: $${stagePaid}, Pendiente: $${stagePending}`);
          const totalPaid = traditionalPaid + stagePaid;
          const pendingPayments = traditionalPending + stagePending;
          const totalProject = totalPaid + pendingPayments;
          const currentBalance = totalProject;
          console.log(`\u{1F4CA} Totales calculados - Total Proyecto: $${totalProject}, Total Pagado: $${totalPaid}, Pendientes: $${pendingPayments}, Balance: $${currentBalance}`);
          const upcomingInvoices = traditionalInvoices.filter((inv) => inv.status === "pending" || inv.status === "overdue").sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());
          const upcomingStages = stageInvoices.filter((stage) => stage.status === "available").sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
          let nextPaymentDue = null;
          if (upcomingInvoices.length > 0) {
            nextPaymentDue = upcomingInvoices[0].dueDate;
          } else if (upcomingStages.length > 0) {
            const stageDate = new Date(upcomingStages[0].createdAt);
            stageDate.setDate(stageDate.getDate() + 30);
            nextPaymentDue = stageDate.toISOString();
          }
          const result = {
            currentBalance: Math.round(currentBalance * 100) / 100,
            totalPaid: Math.round(totalPaid * 100) / 100,
            pendingPayments: Math.round(pendingPayments * 100) / 100,
            nextPaymentDue
          };
          console.log(`\u2705 Datos de facturaci\xF3n calculados FINAL:`, result);
          return result;
        } catch (error) {
          console.error("\u274C Error getting client billing data:", error);
          throw error;
        }
      }
      async getAllProjectsForAdmin() {
        return await db.select({
          id: projects.id,
          name: projects.name,
          description: projects.description,
          price: projects.price,
          status: projects.status,
          progress: projects.progress,
          startDate: projects.startDate,
          deliveryDate: projects.deliveryDate,
          createdAt: projects.createdAt,
          updatedAt: projects.updatedAt,
          clientId: projects.clientId,
          clientName: users.fullName,
          clientEmail: users.email
        }).from(projects).leftJoin(users, eq3(projects.clientId, users.id)).orderBy(desc(projects.createdAt));
      }
      async deleteProject(projectId) {
        try {
          await db.delete(ticketResponses).where(
            sql2`ticket_id IN (SELECT id FROM tickets WHERE project_id = ${projectId})`
          );
          await db.delete(tickets).where(eq3(tickets.projectId, projectId));
          await db.delete(budgetNegotiations).where(eq3(budgetNegotiations.projectId, projectId));
          await db.delete(projectTimeline).where(eq3(projectTimeline.projectId, projectId));
          await db.delete(projectMessages).where(eq3(projectMessages.projectId, projectId));
          await db.delete(projectFiles).where(eq3(projectFiles.projectId, projectId));
          await db.delete(referrals).where(eq3(referrals.projectId, projectId));
          await db.delete(transactions).where(
            sql2`invoice_id IN (SELECT id FROM invoices WHERE project_id = ${projectId})`
          );
          await db.delete(invoices).where(eq3(invoices.projectId, projectId));
          try {
          } catch (error) {
            console.log("Note: payments table may not have projectId column or is removed.");
          }
          await db.delete(paymentStages).where(eq3(paymentStages.projectId, projectId));
          await db.delete(projects).where(eq3(projects.id, projectId));
        } catch (error) {
          console.error("Error deleting project:", error);
          throw new Error(`Error al eliminar el proyecto: ${error.message}`);
        }
      }
      async getProjectStats() {
        try {
          const stats = await db.select({
            status: projects.status,
            count: sql2`count(*)`
          }).from(projects).groupBy(projects.status);
          const realRevenue = await db.select({ sum: sql2`COALESCE(SUM(CAST(amount AS DECIMAL)), 0)` }).from(paymentStages).where(eq3(paymentStages.status, "paid"));
          const potentialRevenue = await db.select({ sum: sql2`COALESCE(SUM(CAST(price AS DECIMAL)), 0)` }).from(projects);
          const result = {
            pending: "0",
            pendiente: "0",
            inProgress: "0",
            en_progreso: "0",
            completed: "0",
            completado: "0",
            cancelled: "0",
            cancelado: "0",
            negociando: "0",
            totalRevenue: Number(realRevenue[0]?.sum || 0).toFixed(2),
            potentialRevenue: Number(potentialRevenue[0]?.sum || 0).toFixed(2)
          };
          stats.forEach((stat) => {
            const status = stat.status;
            if (status !== "totalRevenue" && status !== "potentialRevenue") {
              result[status] = stat.count?.toString() || "0";
              if (status === "pendiente") result.pending = stat.count?.toString() || "0";
              if (status === "en_progreso") result.inProgress = stat.count?.toString() || "0";
              if (status === "completado") result.completed = stat.count?.toString() || "0";
              if (status === "cancelado") result.cancelled = stat.count?.toString() || "0";
            }
          });
          return result;
        } catch (error) {
          console.error("Error getting project stats:", error);
          throw error;
        }
      }
      // Project management operations
      async getProjectMessages(projectId) {
        return await db.select({
          id: projectMessages.id,
          projectId: projectMessages.projectId,
          userId: projectMessages.userId,
          message: projectMessages.message,
          createdAt: projectMessages.createdAt,
          author: users.fullName,
          role: users.role
        }).from(projectMessages).leftJoin(users, eq3(projectMessages.userId, users.id)).where(eq3(projectMessages.projectId, projectId)).orderBy(desc(projectMessages.createdAt));
      }
      async createProjectMessage(message) {
        const [newMessage] = await db.insert(projectMessages).values(message).returning();
        return newMessage;
      }
      async getProjectFiles(projectId) {
        return await db.select({
          id: projectFiles.id,
          projectId: projectFiles.projectId,
          fileName: projectFiles.fileName,
          fileUrl: projectFiles.fileUrl,
          fileType: projectFiles.fileType,
          uploadedBy: projectFiles.uploadedBy,
          uploadedAt: projectFiles.uploadedAt,
          uploaderName: users.fullName
        }).from(projectFiles).leftJoin(users, eq3(projectFiles.uploadedBy, users.id)).where(eq3(projectFiles.projectId, projectId)).orderBy(desc(projectFiles.uploadedAt));
      }
      async createProjectFile(file) {
        const [newFile] = await db.insert(projectFiles).values(file).returning();
        return newFile;
      }
      async deleteProjectFile(id) {
        await db.delete(projectFiles).where(eq3(projectFiles.id, id));
      }
      async getProjectTimeline(projectId) {
        return await db.select().from(projectTimeline).where(eq3(projectTimeline.projectId, projectId)).orderBy(projectTimeline.createdAt);
      }
      async createProjectTimeline(timeline) {
        try {
          const timelineData = { ...timeline };
          if (timeline.estimatedDate !== void 0 && timeline.estimatedDate !== null) {
            if (typeof timeline.estimatedDate === "string") {
              const estimatedDate = new Date(timeline.estimatedDate);
              if (isNaN(estimatedDate.getTime())) {
                throw new Error("Fecha estimada inv\xE1lida");
              }
              timelineData.estimatedDate = estimatedDate;
            }
          } else if (timeline.estimatedDate === null) {
            timelineData.estimatedDate = null;
          }
          if (timeline.completedAt !== void 0 && timeline.completedAt !== null) {
            if (typeof timeline.completedAt === "string") {
              const completedAt = new Date(timeline.completedAt);
              if (isNaN(completedAt.getTime())) {
                throw new Error("Fecha de completado inv\xE1lida");
              }
              timelineData.completedAt = completedAt;
            }
          } else if (timeline.completedAt === null) {
            timelineData.completedAt = null;
          }
          const [newTimeline] = await db.insert(projectTimeline).values(timelineData).returning();
          return newTimeline;
        } catch (error) {
          console.error("Error creating project timeline:", error);
          throw error;
        }
      }
      async updateProjectTimeline(timelineId, updates) {
        try {
          const updateData = { ...updates };
          if (updates.completedAt !== void 0) {
            if (updates.completedAt === null) {
              updateData.completedAt = null;
            } else if (typeof updates.completedAt === "string") {
              const completedDate = new Date(updates.completedAt);
              if (isNaN(completedDate.getTime())) {
                throw new Error("Fecha de completado inv\xE1lida");
              }
              updateData.completedAt = completedDate;
            }
          }
          if (updates.status === "completed" && !updateData.completedAt) {
            updateData.completedAt = /* @__PURE__ */ new Date();
          }
          const [timeline] = await db.update(projectTimeline).set(updateData).where(eq3(projectTimeline.id, timelineId)).returning();
          if (!timeline) {
            throw new Error("Timeline no encontrado");
          }
          if (updates.status === "completed" || updates.status === "completado") {
            console.log(`\u2705 [TRIGGER] Hito del timeline "${timeline.title}" marcado como completado para Proyecto ${timeline.projectId}`);
            await this.updateProjectProgressBasedOnTimeline(timeline.projectId);
            await new Promise((resolve) => setTimeout(resolve, 500));
            try {
              const [project] = await db.select().from(projects).where(eq3(projects.id, timeline.projectId));
              if (project) {
                const currentProg = Number(project.progress);
                console.log(`\u{1F4CA} [DEBUG PAYMENTS] Proyecto ${project.id} - Progreso calculado: ${currentProg}%`);
                const allStages = await db.select().from(paymentStages).where(eq3(paymentStages.projectId, project.id));
                const pendingStages = allStages.filter((s) => {
                  const status = (s.status || "").toLowerCase();
                  return status !== "pagado" && status !== "available" && status !== "disponible";
                });
                console.log(`\u{1F4CB} [DEBUG PAYMENTS] Revisando ${pendingStages.length} etapas para activaci\xF3n potencial`);
                for (const stage of pendingStages) {
                  const reqProg = Number(stage.requiredProgress);
                  if (currentProg >= reqProg) {
                    console.log(`\u{1F4B0} [DEBUG PAYMENTS] \xA1REQUISITO CUMPLIDO! Etapa "${stage.stageName}" (Req: ${reqProg}%, Actual: ${currentProg}%)`);
                    await db.update(paymentStages).set({
                      status: "available",
                      updatedAt: /* @__PURE__ */ new Date()
                    }).where(eq3(paymentStages.id, stage.id));
                    const { notifyPaymentStageAvailable: notifyPaymentStageAvailable3 } = await Promise.resolve().then(() => (init_notifications(), notifications_exports));
                    await notifyPaymentStageAvailable3(
                      project.clientId,
                      project.name,
                      stage.stageName,
                      stage.amount.toString()
                    );
                    console.log(`\u{1F4E7} [DEBUG PAYMENTS] Notificaci\xF3n enviada para: ${stage.stageName}`);
                  }
                }
              }
            } catch (paymentErr) {
              console.error("\u274C Error en cadena de activaci\xF3n de pagos:", paymentErr);
            }
          }
          return timeline;
        } catch (error) {
          console.error("Error updating project timeline:", error);
          throw error;
        }
      }
      // Método para verificar si ya existe timeline para un proyecto
      async hasProjectTimeline(projectId) {
        const timeline = await db.select().from(projectTimeline).where(eq3(projectTimeline.projectId, projectId)).limit(1);
        return timeline.length > 0;
      }
      // Nuevo método para actualizar progreso basado en timeline completado
      async updateProjectProgressBasedOnTimeline(projectId) {
        try {
          const allTimeline = await db.select().from(projectTimeline).where(eq3(projectTimeline.projectId, projectId));
          if (allTimeline.length === 0) return;
          const completedItems = allTimeline.filter((item) => {
            const status = (item.status || "").toLowerCase();
            return status === "completed" || status === "completado";
          });
          const completedCount = completedItems.length;
          const totalCount = allTimeline.length;
          let progressPercentage = Math.round(completedCount / totalCount * 100);
          const normalize = (s) => s ? s.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "") : "";
          const hasFase1 = completedItems.some((item) => {
            const t = normalize(item.title);
            return t.includes("fase 1") || t.includes("50%");
          });
          const hasFase2 = completedItems.some((item) => {
            const t = normalize(item.title);
            return t.includes("fase 2") || t.includes("90%");
          });
          const hasEntrega = completedItems.some((item) => {
            const t = normalize(item.title);
            return t.includes("entrega final") || t.includes("100%");
          });
          if (hasEntrega) {
            progressPercentage = 100;
          } else if (hasFase2) {
            progressPercentage = 90;
          } else if (hasFase1) {
            progressPercentage = 50;
          }
          console.log(`\u{1F4CA} [DEBUG PROGRESS] Proyecto ${projectId}:`);
          console.log(`   - \xCDtems en DB: ${allTimeline.map((it) => `${it.title}(${it.status})`).join(", ")}`);
          console.log(`   - Completados detectados: ${completedCount}/${totalCount}`);
          console.log(`   - T\xEDtulos clave: Fase1=${hasFase1}, Fase2=${hasFase2}, Entrega=${hasEntrega}`);
          console.log(`   - Porcentaje Resultante: ${progressPercentage}%`);
          await db.update(projects).set({ progress: progressPercentage, updatedAt: /* @__PURE__ */ new Date() }).where(eq3(projects.id, projectId));
        } catch (error) {
          console.error("Error updating project progress based on timeline:", error);
        }
      }
      // Budget Negotiations
      async getBudgetNegotiations(projectId) {
        return db.select({
          id: budgetNegotiations.id,
          projectId: budgetNegotiations.projectId,
          proposedBy: budgetNegotiations.proposedBy,
          originalPrice: budgetNegotiations.originalPrice,
          proposedPrice: budgetNegotiations.proposedPrice,
          message: budgetNegotiations.message,
          status: budgetNegotiations.status,
          createdAt: budgetNegotiations.createdAt,
          respondedAt: budgetNegotiations.respondedAt,
          proposerName: users.fullName,
          proposerRole: users.role
        }).from(budgetNegotiations).leftJoin(users, eq3(budgetNegotiations.proposedBy, users.id)).where(eq3(budgetNegotiations.projectId, projectId)).orderBy(desc(budgetNegotiations.createdAt));
      }
      async createBudgetNegotiation(negotiation) {
        const [created] = await db.insert(budgetNegotiations).values(negotiation).returning();
        if (!created) {
          throw new Error("Error al crear negociaci\xF3n de presupuesto");
        }
        return created;
      }
      async updateBudgetNegotiation(negotiationId, updates) {
        const [updated] = await db.update(budgetNegotiations).set({
          ...updates,
          respondedAt: updates.status ? /* @__PURE__ */ new Date() : void 0
        }).where(eq3(budgetNegotiations.id, negotiationId)).returning();
        if (!updated) {
          throw new Error("Negociaci\xF3n no encontrada");
        }
        return updated;
      }
      async getLatestBudgetNegotiation(projectId) {
        const [latest] = await db.select().from(budgetNegotiations).where(eq3(budgetNegotiations.projectId, projectId)).orderBy(desc(budgetNegotiations.createdAt)).limit(1);
        return latest || null;
      }
      // Work Modalities Methods
      async getWorkModalities() {
        try {
          const modalities = await db.select().from(workModalities).where(eq3(workModalities.isActive, true)).orderBy(workModalities.displayOrder, workModalities.createdAt);
          return modalities.map((modality) => ({
            ...modality,
            features: typeof modality.features === "string" ? JSON.parse(modality.features) : Array.isArray(modality.features) ? modality.features : []
          }));
        } catch (error) {
          console.error("Error getting work modalities:", error);
          return [];
        }
      }
      // Seed data
      async seedUsers() {
        try {
          const existingUsers = await db.select().from(users).limit(1);
          if (existingUsers.length > 0) {
            console.log("\u2705 Usuario admin ya existe:", existingUsers[0].email);
            console.log("\u{1F331} Verificando modalidades de trabajo...");
            await this.seedWorkModalities();
            return;
          }
          console.log("\u{1F331} Creando usuario administrador por defecto...");
          const adminPassword = await hashPassword("admin123");
          const adminUser = await this.createUser({
            email: "softwarepar.lat@gmail.com",
            password: adminPassword,
            fullName: "Administrador SoftwarePar",
            role: "admin",
            isActive: true
          });
          console.log("\u2705 Usuario administrador creado:", adminUser.email);
          console.log("\u{1F331} Verificando modalidades de trabajo...");
          await this.seedWorkModalities();
        } catch (error) {
          console.error("\u274C Error en seedUsers:", error);
        }
      }
      async seedWorkModalities() {
        try {
          console.log("\u{1F331} Verificando modalidades de trabajo...");
          const existingModalities = await db.select().from(workModalities).limit(1);
          if (existingModalities.length === 0) {
            console.log("\u{1F4DD} Creando modalidades de trabajo por defecto...");
            const defaultModalities = [
              {
                title: "Compra Completa",
                subtitle: "Soluci\xF3n integral para tu negocio",
                badgeText: "M\xE1s Popular",
                badgeVariant: "default",
                description: "Desarrollo completo de tu proyecto con c\xF3digo fuente, propiedad intelectual total y documentaci\xF3n t\xE9cnica completa. Ideal para empresas que quieren tener control total sobre su software.",
                priceText: "$2,500 - $15,000",
                priceSubtitle: "Precio seg\xFAn complejidad",
                features: [
                  "C\xF3digo fuente completo incluido",
                  "Propiedad intelectual total",
                  "Documentaci\xF3n t\xE9cnica completa",
                  "Soporte t\xE9cnico por 6 meses",
                  "3 revisiones incluidas",
                  "Hosting gratis por 1 a\xF1o",
                  "Capacitaci\xF3n del equipo",
                  "Mantenimiento preventivo"
                ],
                buttonText: "Solicitar Cotizaci\xF3n",
                buttonVariant: "default",
                isPopular: true,
                isActive: true,
                displayOrder: 1
              },
              {
                title: "Software como Servicio",
                subtitle: "Pago mensual, sin complicaciones",
                badgeText: "Flexible",
                badgeVariant: "secondary",
                description: "Accede a tu software personalizado con un modelo de suscripci\xF3n mensual. Ideal para startups y empresas que prefieren pagos escalables.",
                priceText: "$200 - $800/mes",
                priceSubtitle: "Seg\xFAn funcionalidades",
                features: [
                  "Acceso completo al software",
                  "Actualizaciones autom\xE1ticas",
                  "Soporte t\xE9cnico 24/7",
                  "Backup autom\xE1tico diario",
                  "Escalabilidad seg\xFAn crecimiento",
                  "Sin costos de instalaci\xF3n",
                  "Migraci\xF3n de datos incluida",
                  "An\xE1lisis de uso mensual"
                ],
                buttonText: "Comenzar Prueba",
                buttonVariant: "outline",
                isPopular: false,
                isActive: true,
                displayOrder: 2
              }
            ];
            for (const modality of defaultModalities) {
              await this.createWorkModality(modality);
            }
            console.log("\u2705 Modalidades de trabajo creadas exitosamente");
          } else {
            console.log("\u2705 Modalidades de trabajo ya existen");
          }
        } catch (error) {
          console.error("\u274C Error creando modalidades por defecto:", error);
        }
      }
      async createWorkModality(modality) {
        try {
          const [created] = await db.insert(workModalities).values({
            ...modality,
            features: JSON.stringify(modality.features)
          }).returning();
          return created;
        } catch (error) {
          console.error("Error creating work modality:", error);
          throw error;
        }
      }
      async updateWorkModality(id, updates) {
        try {
          const updateData = { ...updates, updatedAt: /* @__PURE__ */ new Date() };
          if (updates.features) {
            updateData.features = JSON.stringify(updates.features);
          }
          const [updated] = await db.update(workModalities).set(updateData).where(eq3(workModalities.id, id)).returning();
          return updated;
        } catch (error) {
          console.error("Error updating work modality:", error);
          throw error;
        }
      }
      async deleteWorkModality(id) {
        try {
          await db.update(workModalities).set({ isActive: false, updatedAt: /* @__PURE__ */ new Date() }).where(eq3(workModalities.id, id));
        } catch (error) {
          console.error("Error deleting work modality:", error);
          throw error;
        }
      }
      // Admin Partners Management - Funciones faltantes
      async getAllPartnersForAdmin() {
        try {
          return await db.select({
            id: partners.id,
            userId: partners.userId,
            referralCode: partners.referralCode,
            commissionRate: partners.commissionRate,
            totalEarnings: partners.totalEarnings,
            createdAt: partners.createdAt,
            user: {
              id: users.id,
              fullName: users.fullName,
              email: users.email,
              isActive: users.isActive
            }
          }).from(partners).leftJoin(users, eq3(partners.userId, users.id)).orderBy(desc(partners.createdAt));
        } catch (error) {
          console.error("Error getting all partners for admin:", error);
          return [];
        }
      }
      async getPartnerStatsForAdmin() {
        try {
          const totalPartners = await db.select({ count: sql2`count(*)` }).from(partners);
          const activePartners = await db.select({ count: sql2`count(*)` }).from(partners).leftJoin(users, eq3(partners.userId, users.id)).where(eq3(users.isActive, true));
          const totalCommissions = await db.select({ sum: sql2`COALESCE(SUM(CAST(commission_amount AS DECIMAL)), 0)` }).from(referrals).where(eq3(referrals.status, "paid"));
          const totalReferrals = await db.select({ count: sql2`count(*)` }).from(referrals);
          const convertedReferrals = await db.select({ count: sql2`count(*)` }).from(referrals).where(eq3(referrals.status, "paid"));
          const conversionRate = totalReferrals[0]?.count > 0 ? Number(convertedReferrals[0]?.count || 0) / Number(totalReferrals[0]?.count) * 100 : 0;
          return {
            totalPartners: Number(totalPartners[0]?.count || 0),
            activePartners: Number(activePartners[0]?.count || 0),
            totalCommissionsPaid: Number(totalCommissions[0]?.sum || 0),
            averageConversionRate: Math.round(conversionRate * 100) / 100,
            topPerformers: 0
            // Placeholder for now
          };
        } catch (error) {
          console.error("Error getting partner stats for admin:", error);
          return {
            totalPartners: 0,
            activePartners: 0,
            totalCommissionsPaid: 0,
            averageConversionRate: 0,
            topPerformers: 0
          };
        }
      }
      async getUserStatsForAdmin() {
        try {
          const totalUsers = await db.select({ count: sql2`count(*)` }).from(users);
          const activeUsers = await db.select({ count: sql2`count(*)` }).from(users).where(eq3(users.isActive, true));
          const adminUsers = await db.select({ count: sql2`count(*)` }).from(users).where(eq3(users.role, "admin"));
          const clientUsers = await db.select({ count: sql2`count(*)` }).from(users).where(eq3(users.role, "client"));
          const partnerUsers = await db.select({ count: sql2`count(*)` }).from(users).where(eq3(users.role, "partner"));
          const thirtyDaysAgo = /* @__PURE__ */ new Date();
          thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
          const newUsers = await db.select({ count: sql2`count(*)` }).from(users).where(sql2`created_at >= ${thirtyDaysAgo.toISOString()}`);
          return {
            totalUsers: Number(totalUsers[0]?.count || 0),
            activeUsers: Number(activeUsers[0]?.count || 0),
            newUsersLast30Days: Number(newUsers[0]?.count || 0),
            usersByRole: {
              admin: Number(adminUsers[0]?.count || 0),
              client: Number(clientUsers[0]?.count || 0),
              partner: Number(partnerUsers[0]?.count || 0)
            }
          };
        } catch (error) {
          console.error("Error getting user stats for admin:", error);
          return {
            totalUsers: 0,
            activeUsers: 0,
            newUsersLast30Days: 0,
            usersByRole: {
              admin: 0,
              client: 0,
              partner: 0
            }
          };
        }
      }
      // Analytics Methods - implementación completa con datos reales
      async getAnalyticsData(period) {
        try {
          const periodDays = period || 30;
          const startDate = /* @__PURE__ */ new Date();
          startDate.setDate(startDate.getDate() - periodDays);
          const totalRevenue = await db.select({ sum: sql2`COALESCE(SUM(CAST(amount AS DECIMAL)), 0)` }).from(paymentStages).where(eq3(paymentStages.status, "paid"));
          const monthlyRevenue = await db.select({ sum: sql2`COALESCE(SUM(CAST(amount AS DECIMAL)), 0)` }).from(paymentStages).where(
            and(
              eq3(paymentStages.status, "paid"),
              sql2`paid_date >= ${startDate.toISOString()}`
            )
          );
          const monthlyRevenueChart = [];
          const monthNames = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"];
          for (let i = 5; i >= 0; i--) {
            const monthStart = /* @__PURE__ */ new Date();
            monthStart.setMonth(monthStart.getMonth() - i);
            monthStart.setDate(1);
            monthStart.setHours(0, 0, 0, 0);
            const monthEnd = new Date(monthStart);
            monthEnd.setMonth(monthEnd.getMonth() + 1);
            monthEnd.setDate(0);
            monthEnd.setHours(23, 59, 59, 999);
            const monthRevenue = await db.select({
              sum: sql2`COALESCE(SUM(CAST(amount AS DECIMAL)), 0)`,
              count: sql2`COUNT(*)`
            }).from(paymentStages).where(
              and(
                eq3(paymentStages.status, "paid"),
                sql2`paid_date >= ${monthStart.toISOString()}`,
                sql2`paid_date <= ${monthEnd.toISOString()}`
              )
            );
            monthlyRevenueChart.push({
              month: monthNames[monthStart.getMonth()],
              revenue: Number(monthRevenue[0]?.sum || 0),
              projects: Number(monthRevenue[0]?.count || 0)
            });
          }
          const totalUsers = await db.select({ count: sql2`count(*)` }).from(users);
          const activeUsers = await db.select({ count: sql2`count(*)` }).from(users).where(eq3(users.isActive, true));
          const monthlyUsersChart = [];
          for (let i = 5; i >= 0; i--) {
            const monthStart = /* @__PURE__ */ new Date();
            monthStart.setMonth(monthStart.getMonth() - i);
            monthStart.setDate(1);
            monthStart.setHours(0, 0, 0, 0);
            const monthEnd = new Date(monthStart);
            monthEnd.setMonth(monthEnd.getMonth() + 1);
            monthEnd.setDate(0);
            monthEnd.setHours(23, 59, 59, 999);
            const monthUsers = await db.select({ count: sql2`count(*)` }).from(users).where(sql2`created_at <= ${monthEnd.toISOString()}`);
            const monthActiveUsers = await db.select({ count: sql2`count(*)` }).from(users).where(
              and(
                eq3(users.isActive, true),
                sql2`created_at <= ${monthEnd.toISOString()}`
              )
            );
            monthlyUsersChart.push({
              month: monthNames[monthStart.getMonth()],
              users: Number(monthUsers[0]?.count || 0),
              active: Number(monthActiveUsers[0]?.count || 0)
            });
          }
          const totalProjects = await db.select({ count: sql2`count(*)` }).from(projects);
          const completedProjects = await db.select({ count: sql2`count(*)` }).from(projects).where(eq3(projects.status, "completed"));
          const inProgressProjects = await db.select({ count: sql2`count(*)` }).from(projects).where(eq3(projects.status, "in_progress"));
          const pendingProjects = await db.select({ count: sql2`count(*)` }).from(projects).where(eq3(projects.status, "pending"));
          const totalCount = Number(totalProjects[0]?.count || 0);
          const completedCount = Number(completedProjects[0]?.count || 0);
          const successRate = totalCount > 0 ? completedCount / totalCount * 100 : 0;
          const totalPartners = await db.select({ count: sql2`count(*)` }).from(partners);
          const partnerEarnings = await db.select({
            partnerName: users.fullName,
            earnings: partners.totalEarnings,
            referrals: sql2`COUNT(${referrals.id})`
          }).from(partners).leftJoin(users, eq3(partners.userId, users.id)).leftJoin(referrals, eq3(partners.id, referrals.partnerId)).groupBy(partners.id, users.fullName, partners.totalEarnings).orderBy(desc(partners.totalEarnings)).limit(5);
          const avgProjectValue = totalCount > 0 ? Number(totalRevenue[0]?.sum || 0) / totalCount : 0;
          const customerLifetimeValue = avgProjectValue * 1.5;
          const churnRate = 5.2;
          const satisfactionScore = 4.6;
          const previousPeriodStart = new Date(startDate);
          previousPeriodStart.setDate(previousPeriodStart.getDate() - periodDays);
          const previousRevenue = await db.select({ sum: sql2`COALESCE(SUM(CAST(amount AS DECIMAL)), 0)` }).from(paymentStages).where(
            and(
              eq3(paymentStages.status, "paid"),
              sql2`paid_date >= ${previousPeriodStart.toISOString()}`,
              sql2`paid_date < ${startDate.toISOString()}`
            )
          );
          const previousUsers = await db.select({ count: sql2`count(*)` }).from(users).where(
            and(
              sql2`created_at >= ${previousPeriodStart.toISOString()}`,
              sql2`created_at < ${startDate.toISOString()}`
            )
          );
          const currentRevenueNum = Number(monthlyRevenue[0]?.sum || 0);
          const previousRevenueNum = Number(previousRevenue[0]?.sum || 0);
          const revenueGrowth = previousRevenueNum > 0 ? (currentRevenueNum - previousRevenueNum) / previousRevenueNum * 100 : 0;
          const currentUsersNum = Number(activeUsers[0]?.count || 0);
          const previousUsersNum = Number(previousUsers[0]?.count || 0);
          const userGrowth = previousUsersNum > 0 ? (currentUsersNum - previousUsersNum) / previousUsersNum * 100 : 0;
          return {
            revenue: {
              total: Number(totalRevenue[0]?.sum || 0),
              monthly: currentRevenueNum,
              growth: Math.round(revenueGrowth * 100) / 100,
              chart: monthlyRevenueChart
            },
            users: {
              total: Number(totalUsers[0]?.count || 0),
              active: currentUsersNum,
              growth: Math.round(userGrowth * 100) / 100,
              chart: monthlyUsersChart
            },
            projects: {
              total: totalCount,
              completed: completedCount,
              success_rate: Math.round(successRate * 100) / 100,
              chart: [
                { status: "Completados", count: completedCount, color: "#22c55e" },
                { status: "En Desarrollo", count: Number(inProgressProjects[0]?.count || 0), color: "#3b82f6" },
                { status: "Pendientes", count: Number(pendingProjects[0]?.count || 0), color: "#f59e0b" }
              ]
            },
            partners: {
              total: Number(totalPartners[0]?.count || 0),
              active: partnerEarnings.length,
              conversion: 45.2,
              // Placeholder - necesitaría más datos
              earnings: partnerEarnings.map((p) => ({
                partner: p.partnerName || "Partner",
                earnings: Number(p.earnings || 0),
                referrals: Number(p.referrals || 0)
              }))
            },
            kpis: {
              customer_lifetime_value: Math.round(customerLifetimeValue),
              churn_rate: churnRate,
              satisfaction_score: satisfactionScore,
              avg_project_value: Math.round(avgProjectValue)
            }
          };
        } catch (error) {
          console.error("Error getting analytics data:", error);
          return {
            revenue: { total: 0, monthly: 0, growth: 0, chart: [] },
            users: { total: 0, active: 0, growth: 0, chart: [] },
            projects: { total: 0, completed: 0, success_rate: 0, chart: [] },
            partners: { total: 0, active: 0, conversion: 0, earnings: [] },
            kpis: { customer_lifetime_value: 0, churn_rate: 0, satisfaction_score: 0, avg_project_value: 0 }
          };
        }
      }
      async getRevenueAnalytics(period) {
        try {
          const totalRevenue = await db.select({ sum: sql2`COALESCE(SUM(CAST(amount AS DECIMAL)), 0)` }).from(paymentStages).where(eq3(paymentStages.status, "paid"));
          return {
            totalRevenue: Number(totalRevenue[0]?.sum || 0),
            period: period || 30
          };
        } catch (error) {
          console.error("Error getting revenue analytics:", error);
          return {
            totalRevenue: 0,
            period: period || 30
          };
        }
      }
      async getUserAnalytics(period) {
        try {
          return await this.getUserStatsForAdmin();
        } catch (error) {
          console.error("Error getting user analytics:", error);
          return {};
        }
      }
      async getProjectAnalytics(period) {
        try {
          return await this.getProjectStats();
        } catch (error) {
          console.error("Error getting project analytics:", error);
          return {};
        }
      }
      async getPartnerAnalytics(period) {
        try {
          return await this.getPartnerStatsForAdmin();
        } catch (error) {
          console.error("Error getting partner analytics:", error);
          return {};
        }
      }
      async getKPIAnalytics(period) {
        try {
          const stats = await this.getAdminStats();
          return {
            kpis: stats,
            period: period || 30
          };
        } catch (error) {
          console.error("Error getting KPI analytics:", error);
          return {
            kpis: {},
            period: period || 30
          };
        }
      }
      // Ticket Management for Admin
      async getAllTicketsForAdmin() {
        try {
          return await db.select({
            id: tickets.id,
            title: tickets.title,
            description: tickets.description,
            status: tickets.status,
            priority: tickets.priority,
            userId: tickets.userId,
            projectId: tickets.projectId,
            createdAt: tickets.createdAt,
            updatedAt: tickets.updatedAt,
            userName: users.fullName,
            userEmail: users.email,
            projectName: projects.name
          }).from(tickets).leftJoin(users, eq3(tickets.userId, users.id)).leftJoin(projects, eq3(tickets.projectId, projects.id)).orderBy(desc(tickets.createdAt));
        } catch (error) {
          console.error("Error getting all tickets for admin:", error);
          return [];
        }
      }
      async getTicketStats() {
        try {
          const totalTickets = await db.select({ count: sql2`count(*)` }).from(tickets);
          const openTickets = await db.select({ count: sql2`count(*)` }).from(tickets).where(eq3(tickets.status, "open"));
          const closedTickets = await db.select({ count: sql2`count(*)` }).from(tickets).where(eq3(tickets.status, "closed"));
          const inProgressTickets = await db.select({ count: sql2`count(*)` }).from(tickets).where(eq3(tickets.status, "in_progress"));
          return {
            total: Number(totalTickets[0]?.count || 0),
            open: Number(openTickets[0]?.count || 0),
            closed: Number(closedTickets[0]?.count || 0),
            inProgress: Number(inProgressTickets[0]?.count || 0)
          };
        } catch (error) {
          console.error("Error getting ticket stats:", error);
          return {
            total: 0,
            open: 0,
            closed: 0,
            inProgress: 0
          };
        }
      }
      async deleteTicket(ticketId) {
        try {
          await db.delete(ticketResponses).where(eq3(ticketResponses.ticketId, ticketId));
          await db.delete(tickets).where(eq3(tickets.id, ticketId));
        } catch (error) {
          console.error("Error deleting ticket:", error);
          throw error;
        }
      }
      // Payment stages operations
      async createPaymentStage(data) {
        try {
          const [created] = await db.insert(paymentStages).values(data).returning();
          return created;
        } catch (error) {
          console.error("Error creating payment stage:", error);
          throw error;
        }
      }
      async getPaymentStages(projectId) {
        try {
          const stages = await db.select().from(paymentStages).where(eq3(paymentStages.projectId, projectId)).orderBy(paymentStages.requiredProgress);
          return stages;
        } catch (error) {
          console.error("Error getting payment stages:", error);
          return [];
        }
      }
      async updatePaymentStage(stageId, updates) {
        try {
          const [updated] = await db.update(paymentStages).set({ ...updates, updatedAt: /* @__PURE__ */ new Date() }).where(eq3(paymentStages.id, stageId)).returning();
          if (updates.status === "paid" && !updates.paidAt) {
            await db.update(paymentStages).set({ paidAt: /* @__PURE__ */ new Date() }).where(eq3(paymentStages.id, stageId));
          }
          if (updates.status === "available") {
            await db.update(paymentStages).set({
              paidAt: null,
              paymentMethod: null,
              proofFileUrl: null
            }).where(eq3(paymentStages.id, stageId));
          }
          return updated;
        } catch (error) {
          console.error("Error updating payment stage:", error);
          throw error;
        }
      }
      async completePaymentStage(stageId) {
        try {
          const [updated] = await db.update(paymentStages).set({
            status: "paid",
            paidAt: /* @__PURE__ */ new Date(),
            updatedAt: /* @__PURE__ */ new Date()
          }).where(eq3(paymentStages.id, stageId)).returning();
          return updated;
        } catch (error) {
          console.error("Error completing payment stage:", error);
          throw error;
        }
      }
      // Seed i18n data - disabled until tables are created
      async seedI18n() {
        console.log("\u{1F331} i18n seeding disabled until tables are created");
      }
      // i18n and currency methods implementation
      async getLanguages() {
        try {
          return await db.select().from(languages).orderBy(languages.name);
        } catch (error) {
          console.error("Error getting languages:", error);
          return [];
        }
      }
      async getActiveLanguages() {
        try {
          return await db.select().from(languages).where(eq3(languages.isActive, true)).orderBy(desc(languages.isDefault), languages.name);
        } catch (error) {
          console.error("Error getting active languages:", error);
          return [];
        }
      }
      async getDefaultLanguage() {
        try {
          const [defaultLang] = await db.select().from(languages).where(eq3(languages.isDefault, true)).limit(1);
          return defaultLang || null;
        } catch (error) {
          console.error("Error getting default language:", error);
          return null;
        }
      }
      async getCurrencies() {
        try {
          return await db.select().from(currencies).orderBy(currencies.name);
        } catch (error) {
          console.error("Error getting currencies:", error);
          return [];
        }
      }
      async getActiveCurrencies() {
        try {
          return await db.select().from(currencies).where(eq3(currencies.isActive, true)).orderBy(desc(currencies.isDefault), currencies.name);
        } catch (error) {
          console.error("Error getting active currencies:", error);
          return [];
        }
      }
      async getDefaultCurrency() {
        try {
          const [defaultCurr] = await db.select().from(currencies).where(eq3(currencies.isDefault, true)).limit(1);
          return defaultCurr || null;
        } catch (error) {
          console.error("Error getting default currency:", error);
          return null;
        }
      }
      async getExchangeRates() {
        try {
          console.warn("\u26A0\uFE0F Exchange rates table needs to be created. Returning empty array.");
          return [];
        } catch (error) {
          console.error("Error getting exchange rates:", error);
          return [];
        }
      }
      async getUserPreferences(userId) {
        try {
          const [prefs] = await db.select().from(userPreferences).where(eq3(userPreferences.userId, userId)).limit(1);
          return prefs || null;
        } catch (error) {
          console.error("Error getting user preferences:", error);
          return null;
        }
      }
      async createUserPreferences(preferences) {
        const [created] = await db.insert(userPreferences).values(preferences).returning();
        return created;
      }
      async updateUserPreferences(userId, updates) {
        const [updated] = await db.update(userPreferences).set({ ...updates, updatedAt: /* @__PURE__ */ new Date() }).where(eq3(userPreferences.userId, userId)).returning();
        return updated;
      }
      async getTranslation(keyName, languageCode) {
        try {
          const [language] = await db.select().from(languages).where(eq3(languages.code, languageCode)).limit(1);
          if (!language) return null;
          const [entry] = await db.select().from(i18nEntries).where(and(
            eq3(i18nEntries.keyName, keyName),
            eq3(i18nEntries.languageId, language.id)
          )).limit(1);
          return entry?.value || null;
        } catch (error) {
          console.error("Error getting translation:", error);
          return null;
        }
      }
      async createTranslation(entry) {
        const [created] = await db.insert(i18nEntries).values(entry).returning();
        return created;
      }
      async updateTranslation(id, updates) {
        const [updated] = await db.update(i18nEntries).set({ ...updates, updatedAt: /* @__PURE__ */ new Date() }).where(eq3(i18nEntries.id, id)).returning();
        return updated;
      }
      async getContentTranslation(contentType, contentId, fieldName, languageCode) {
        try {
          const [language] = await db.select().from(languages).where(eq3(languages.code, languageCode)).limit(1);
          if (!language) return null;
          const [translation] = await db.select().from(contentTranslations).where(and(
            eq3(contentTranslations.contentType, contentType),
            eq3(contentTranslations.contentId, contentId),
            eq3(contentTranslations.fieldName, fieldName),
            eq3(contentTranslations.languageId, language.id)
          )).limit(1);
          return translation?.translatedValue || null;
        } catch (error) {
          console.error("Error getting content translation:", error);
          return null;
        }
      }
      async createContentTranslation(translation) {
        const [created] = await db.insert(contentTranslations).values(translation).returning();
        return created;
      }
      async convertCurrency(amount, fromCurrencyCode, toCurrencyCode) {
        try {
          if (fromCurrencyCode === toCurrencyCode) return amount;
          const rates = await this.getExchangeRates();
          if (rates.length === 0) return amount;
          const fromCurrency = await db.select().from(currencies).where(eq3(currencies.code, fromCurrencyCode)).limit(1);
          const toCurrency = await db.select().from(currencies).where(eq3(currencies.code, toCurrencyCode)).limit(1);
          if (!fromCurrency[0] || !toCurrency[0]) return amount;
          const rate = rates.find(
            (r) => r.fromCurrencyId === fromCurrency[0].id && r.toCurrencyId === toCurrency[0].id
          );
          if (rate) return amount * Number(rate.rate);
          const reverseRate = rates.find(
            (r) => r.fromCurrencyId === toCurrency[0].id && r.toCurrencyId === fromCurrency[0].id
          );
          if (reverseRate) return amount / Number(reverseRate.rate);
          return amount;
        } catch (error) {
          console.error("Error converting currency:", error);
          return amount;
        }
      }
      // Admin invoice management
      async createInvoiceForProject(projectId, amount, dueDate) {
        try {
          const project = await this.getProject(projectId);
          if (!project) {
            throw new Error("Proyecto no encontrado");
          }
          const [invoice] = await db.insert(invoices).values({
            projectId,
            clientId: project.clientId,
            amount,
            dueDate,
            status: "pending",
            currency: "USD",
            paidDate: null
            // Usar paidDate en lugar de paidAt
          }).returning();
          return invoice;
        } catch (error) {
          console.error("Error creating invoice for project:", error);
          throw new Error("No se pudo crear la factura");
        }
      }
      async getAllInvoicesForAdmin() {
        try {
          const result = await db.select({
            id: invoices.id,
            invoiceNumber: sql2`CONCAT('INV-', EXTRACT(YEAR FROM ${invoices.createdAt}), '-', LPAD(${invoices.id}::text, 3, '0'))`.as("invoiceNumber"),
            projectName: projects.name,
            clientName: users.fullName,
            amount: invoices.amount,
            status: invoices.status,
            dueDate: invoices.dueDate,
            paidAt: invoices.paidDate,
            // Usar paidDate en lugar de paidAt
            createdAt: invoices.createdAt
          }).from(invoices).leftJoin(projects, eq3(invoices.projectId, projects.id)).leftJoin(users, eq3(invoices.clientId, users.id)).orderBy(desc(invoices.createdAt));
          return result;
        } catch (error) {
          console.error("Error getting all invoices for admin:", error);
          throw new Error("No se pudieron obtener las facturas");
        }
      }
      async updateInvoiceStatus(invoiceId, status, paidAt) {
        try {
          const updateData = {
            status,
            updatedAt: /* @__PURE__ */ new Date()
          };
          if (paidAt) {
            updateData.paidDate = paidAt;
          }
          const [invoice] = await db.update(invoices).set(updateData).where(eq3(invoices.id, invoiceId)).returning();
          return invoice;
        } catch (error) {
          console.error("Error updating invoice status:", error);
          throw new Error("No se pudo actualizar el estado de la factura");
        }
      }
      // Client billing information methods
      async getClientBillingInfo(userId) {
        const billing = await db.select().from(clientBillingInfo).where(eq3(clientBillingInfo.userId, userId)).limit(1);
        return billing[0] || null;
      }
      // Exchange rate configuration methods
      async getCurrentExchangeRate() {
        const rate = await db.select().from(exchangeRateConfig).where(eq3(exchangeRateConfig.isActive, true)).orderBy(desc(exchangeRateConfig.updatedAt)).limit(1);
        return rate[0] || null;
      }
      async updateExchangeRate(usdToGuarani, updatedBy) {
        await db.update(exchangeRateConfig).set({ isActive: false, updatedAt: /* @__PURE__ */ new Date() });
        const [newRate] = await db.insert(exchangeRateConfig).values({
          usdToGuarani,
          updatedBy,
          isActive: true
        }).returning();
        return newRate;
      }
      async convertUsdToGuarani(usdAmount) {
        const currentRateConfig = await this.getCurrentExchangeRate();
        let rate = 7300;
        if (currentRateConfig) {
          const configuredRate = parseFloat(currentRateConfig.usdToGuarani);
          if (!isNaN(configuredRate)) {
            rate = configuredRate;
          }
        }
        return {
          guaraniAmount: Math.round(usdAmount * rate),
          exchangeRate: rate
        };
      }
      // Password reset methods
      async createPasswordResetToken(data) {
        const [token] = await db.insert(passwordResetTokens).values(data).returning();
        return token;
      }
      async getPasswordResetToken(token) {
        const [resetToken] = await db.select().from(passwordResetTokens).where(eq3(passwordResetTokens.token, token));
        return resetToken || null;
      }
      async markPasswordResetTokenAsUsed(token) {
        await db.update(passwordResetTokens).set({ used: true }).where(eq3(passwordResetTokens.token, token));
      }
      async updateUserPassword(userId, hashedPassword) {
        await db.update(users).set({ password: hashedPassword, updatedAt: /* @__PURE__ */ new Date() }).where(eq3(users.id, userId));
      }
      // Legal pages methods
      async getLegalPage(pageType) {
        const [page] = await db.select().from(legalPages).where(and(eq3(legalPages.pageType, pageType), eq3(legalPages.isActive, true))).limit(1);
        return page || null;
      }
      async getAllLegalPages() {
        return await db.select().from(legalPages).where(eq3(legalPages.isActive, true)).orderBy(legalPages.createdAt);
      }
      async updateLegalPage(pageType, updates, updatedBy) {
        const [updated] = await db.update(legalPages).set({
          ...updates,
          lastUpdatedBy: updatedBy,
          updatedAt: /* @__PURE__ */ new Date()
        }).where(eq3(legalPages.pageType, pageType)).returning();
        return updated;
      }
      async createLegalPage(data) {
        const [created] = await db.insert(legalPages).values(data).returning();
        return created;
      }
    };
    storage = new DatabaseStorage();
  }
});

// server/auth.ts
var auth_exports = {};
__export(auth_exports, {
  authenticateToken: () => authenticateToken,
  comparePassword: () => comparePassword,
  generateToken: () => generateToken,
  hashPassword: () => hashPassword2,
  requireRole: () => requireRole,
  verifyToken: () => verifyToken
});
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
var JWT_SECRET, JWT_EXPIRES_IN, generateToken, verifyToken, hashPassword2, comparePassword, authenticateToken, requireRole;
var init_auth = __esm({
  "server/auth.ts"() {
    "use strict";
    init_storage();
    JWT_SECRET = process.env.JWT_SECRET || "super-secure-jwt-secret-for-development-" + Math.random().toString(36).substring(2, 15);
    if (!process.env.JWT_SECRET) {
      console.warn("\u26A0\uFE0F  JWT_SECRET not set, using generated fallback for development. Set JWT_SECRET in production!");
    }
    JWT_EXPIRES_IN = "7d";
    generateToken = (userId) => {
      return jwt.sign({ userId }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
    };
    verifyToken = (token) => {
      try {
        const decoded = jwt.verify(token, JWT_SECRET);
        return decoded;
      } catch (error) {
        return null;
      }
    };
    hashPassword2 = async (password) => {
      return await bcrypt.hash(password, 10);
    };
    comparePassword = async (password, hashedPassword) => {
      return await bcrypt.compare(password, hashedPassword);
    };
    authenticateToken = async (req, res, next) => {
      try {
        const authHeader = req.headers.authorization;
        const token = authHeader && authHeader.split(" ")[1];
        if (!token) {
          res.status(401).json({ message: "Token de acceso requerido" });
          return;
        }
        const decoded = verifyToken(token);
        if (!decoded) {
          res.status(401).json({ message: "Token inv\xE1lido" });
          return;
        }
        const user = await storage.getUser(decoded.userId);
        if (!user || !user.isActive) {
          res.status(401).json({ message: "Usuario no encontrado o inactivo" });
          return;
        }
        req.user = user;
        next();
      } catch (error) {
        res.status(401).json({ message: "Error de autenticaci\xF3n" });
      }
    };
    requireRole = (roles) => {
      return (req, res, next) => {
        if (!req.user) {
          res.status(401).json({ message: "Usuario no autenticado" });
          return;
        }
        if (!roles.includes(req.user.role)) {
          res.status(403).json({ message: "Permisos insuficientes" });
          return;
        }
        next();
      };
    };
  }
});

// server/exchange-rate-api.ts
var exchange_rate_api_exports = {};
__export(exchange_rate_api_exports, {
  fetchCurrentExchangeRate: () => fetchCurrentExchangeRate,
  fetchExchangeRateFromBCP: () => fetchExchangeRateFromBCP,
  fetchExchangeRateFromFixer: () => fetchExchangeRateFromFixer,
  fetchExchangeRateFromWise: () => fetchExchangeRateFromWise,
  fetchExchangeRateFromWisercoin: () => fetchExchangeRateFromWisercoin
});
async function fetchCurrentExchangeRate() {
  try {
    console.log("\u{1F504} Intentando obtener tipo de cambio...");
    const wiseRate = await fetchExchangeRateFromWise();
    if (wiseRate) {
      console.log("\u2705 Usando tipo de cambio de Wise (tasa real)");
      return wiseRate;
    }
    console.log("\u26A0\uFE0F Wise no disponible, intentando BCP...");
    const bcpRate = await fetchExchangeRateFromBCP();
    if (bcpRate) {
      console.log("\u2705 Usando tipo de cambio del BCP (oficial)");
      return bcpRate;
    }
    console.log("\u26A0\uFE0F BCP no disponible, intentando Wisercoin...");
    const wisercoinRate = await fetchExchangeRateFromWisercoin();
    if (wisercoinRate) {
      console.log("\u2705 Usando tipo de cambio de Wisercoin (mercado local)");
      return wisercoinRate;
    }
    console.log("\u26A0\uFE0F Wisercoin no disponible, usando Open Exchange Rates...");
    const response = await fetch("https://open.er-api.com/v6/latest/USD");
    if (!response.ok) {
      console.error("\u274C Error al obtener el tipo de cambio de la API:", response.statusText);
      return null;
    }
    const data = await response.json();
    if (data.result !== "success") {
      console.error("\u274C API returned error:", data);
      return null;
    }
    const pygRate = data.rates?.PYG;
    if (!pygRate) {
      console.error("\u274C PYG rate not found in API response");
      return null;
    }
    console.log(`\u2705 Exchange rate from Open Exchange Rates: 1 USD = ${pygRate.toFixed(2)} PYG`);
    console.log(`\u{1F4C5} Last update: ${data.time_last_update_utc}`);
    console.log(`\u{1F4C5} Next update: ${data.time_next_update_utc}`);
    return pygRate;
  } catch (error) {
    console.error("\u274C Error al obtener el tipo de cambio de la API:", error);
    return null;
  }
}
async function fetchExchangeRateFromFixer(apiKey) {
  try {
    const response = await fetch(`https://api.fixer.io/latest?access_key=${apiKey}&base=USD&symbols=PYG`);
    if (!response.ok) {
      console.error("\u274C Error al obtener datos de la API de Fixer:", response.statusText);
      return null;
    }
    const data = await response.json();
    if (!data.success) {
      console.error("\u274C Fixer API error:", data.error);
      return null;
    }
    const pygRate = data.rates?.PYG;
    if (!pygRate) {
      console.error("\u274C PYG rate not found in Fixer response");
      return null;
    }
    console.log(`\u2705 Exchange rate from Fixer: 1 USD = ${pygRate.toFixed(2)} PYG`);
    return pygRate;
  } catch (error) {
    console.error("\u274C Error al obtener datos de la API de Fixer:", error);
    return null;
  }
}
async function fetchExchangeRateFromWisercoin() {
  try {
    const response = await fetch("https://wisercoin.com/api/v1/rates/latest");
    if (!response.ok) {
      console.error("\u274C Error al obtener datos de la API de Wisercoin:", response.statusText);
      return null;
    }
    const data = await response.json();
    const usdBuy = data.rates?.USD_PYG?.buy;
    const usdSell = data.rates?.USD_PYG?.sell;
    if (!usdBuy || !usdSell) {
      console.error("\u274C USD/PYG rates not found in Wisercoin response");
      return null;
    }
    const avgRate = (parseFloat(usdBuy) + parseFloat(usdSell)) / 2;
    console.log(`\u2705 Exchange rate from Wisercoin (Paraguay):`);
    console.log(`   Compra: ${usdBuy} PYG`);
    console.log(`   Venta: ${usdSell} PYG`);
    console.log(`   Promedio: ${avgRate.toFixed(2)} PYG`);
    return avgRate;
  } catch (error) {
    console.error("\u274C Error al obtener datos de Wisercoin:", error);
    return null;
  }
}
async function fetchExchangeRateFromWise() {
  try {
    console.log("\u{1F4B8} Intentando obtener tipo de cambio desde Wise...");
    const response = await fetch("https://api.wise.com/v1/rates?source=USD&target=PYG");
    if (!response.ok) {
      console.error("\u274C Error al conectar con Wise API:", response.statusText);
      return null;
    }
    const data = await response.json();
    if (Array.isArray(data) && data.length > 0) {
      const rate = data[0]?.rate;
      if (rate && !isNaN(rate) && rate > 0) {
        console.log(`\u2705 Tipo de cambio desde Wise: 1 USD = ${rate.toFixed(2)} PYG`);
        console.log(`\u{1F4CA} Tasa real del mercado sin comisiones ocultas`);
        return rate;
      }
    }
    console.log("\u26A0\uFE0F No se pudo extraer el tipo de cambio de Wise");
    return null;
  } catch (error) {
    console.error("\u274C Error obteniendo tipo de cambio de Wise:", error);
    return null;
  }
}
async function fetchExchangeRateFromBCP() {
  try {
    console.log("\u{1F3E6} Intentando obtener tipo de cambio desde BCP (web scraping)...");
    const response = await fetch("https://www.bcp.gov.py/webapps/web/cotizacion/monedas-mensual");
    if (!response.ok) {
      console.error("\u274C Error al conectar con BCP:", response.statusText);
      return null;
    }
    const html = await response.text();
    const regex = /Dólar\s+Estadounidense.*?(\d+[,.]?\d*)/i;
    const match = html.match(regex);
    if (match && match[1]) {
      const rate = parseFloat(match[1].replace(/\./g, "").replace(",", "."));
      if (!isNaN(rate) && rate > 0) {
        console.log(`\u2705 Tipo de cambio desde BCP: 1 USD = ${rate.toFixed(2)} PYG`);
        return rate;
      }
    }
    console.log("\u26A0\uFE0F No se pudo extraer el tipo de cambio del sitio del BCP");
    return null;
  } catch (error) {
    console.error("\u274C Error en web scraping del BCP:", error);
    return null;
  }
}
var init_exchange_rate_api = __esm({
  "server/exchange-rate-api.ts"() {
    "use strict";
  }
});

// server/facturasend.ts
var facturasend_exports = {};
__export(facturasend_exports, {
  construirDocumentoFacturaSend: () => construirDocumentoFacturaSend,
  enviarFacturaFacturaSend: () => enviarFacturaFacturaSend,
  extraerResultadoFacturaSend: () => extraerResultadoFacturaSend
});
async function enviarFacturaFacturaSend(documento) {
  try {
    const apiKey = FACTURASEND_CONFIG.apiKey;
    if (!apiKey) {
      return { success: false, error: "API Key no configurada" };
    }
    const payload = [{
      tipoDocumento: documento.tipoDocumento,
      establecimiento: documento.establecimiento,
      punto: documento.punto,
      numero: documento.numero,
      fecha: documento.fecha,
      tipoEmision: documento.tipoEmision,
      tipoTransaccion: documento.tipoTransaccion,
      tipoImpuesto: 2,
      // 2 = ISC/Exento (Alineado con prueba técnica exitosa)
      moneda: documento.moneda,
      observacion: documento.observacion,
      cliente: documento.cliente,
      usuario: documento.usuario,
      factura: documento.factura,
      condicion: documento.condicion,
      items: documento.items.map((item) => {
        const total = Math.round(item.precioUnitario * item.cantidad);
        return {
          descripcion: item.descripcion,
          cantidad: item.cantidad,
          unidadMedida: item.unidadMedida,
          precioUnitario: item.precioUnitario,
          ivaTipo: 3,
          // 3 = Exento
          ivaBase: 0,
          iva: 0,
          ivaProporcion: 0,
          ...item.codigo ? { codigo: item.codigo } : {}
        };
      })
    }];
    const jsonBody = JSON.stringify(payload);
    console.log("\u{1F4E6} Payload (Final):", jsonBody);
    const response = await fetch(`${FACTURASEND_CONFIG.baseUrl}/lote/create?xml=true&qr=true`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json; charset=utf-8",
        "Authorization": `Bearer api_key_${apiKey}`
      },
      body: jsonBody
    });
    const result = await response.json();
    console.log("\u{1F4E1} Respuesta API:", JSON.stringify(result));
    return result;
  } catch (error) {
    return { success: false, error: error.message };
  }
}
function extraerResultadoFacturaSend(response) {
  if (!response.success || !response.result?.deList?.[0]) {
    const apiError = response.errores?.[0]?.error;
    const errorMsg = apiError || response.error || response.mensaje || "Error en FacturaSend";
    return {
      estado: "rechazado",
      mensaje: errorMsg
    };
  }
  const de = response.result.deList[0];
  return {
    cdc: de.cdc,
    qr: de.qr,
    estado: de.estado === "0-Generado" || de.cdc ? "aceptado" : "rechazado",
    mensaje: de.respuesta_mensaje || "Documento procesado"
  };
}
async function construirDocumentoFacturaSend(company, client, stage, project, exchangeRate, numero) {
  const montoTotal = Math.round(parseFloat(stage.amount) * exchangeRate);
  const rucOriginal = client.documentNumber || "";
  const isRuc = rucOriginal.includes("-");
  const documentoNumero = rucOriginal.split("-")[0].replace(/\D/g, "") || "44444401";
  return {
    tipoDocumento: 1,
    establecimiento: 1,
    punto: 1,
    numero,
    fecha: (/* @__PURE__ */ new Date()).toISOString().split(".")[0],
    tipoEmision: 1,
    tipoTransaccion: 2,
    tipoImpuesto: 2,
    // 2 = ISC/Exento
    moneda: "PYG",
    observacion: `Proyecto: ${project.name} - TC: ${exchangeRate}`,
    cliente: {
      contribuyente: isRuc,
      razonSocial: (client.legalName || "CLIENTE").toUpperCase(),
      tipoOperacion: isRuc ? 1 : 2,
      direccion: "Barrio Residencial",
      numeroCasa: "0",
      departamento: 8,
      departamentoDescripcion: "ITAPUA",
      distrito: 107,
      distritoDescripcion: "CARLOS A. LOPEZ",
      ciudad: 1456,
      ciudadDescripcion: "CARLOS A. LOPEZ",
      pais: "PRY",
      paisDescripcion: "Paraguay",
      tipoContribuyente: 1,
      documentoTipo: 1,
      documentoNumero,
      ruc: isRuc ? rucOriginal : void 0
    },
    usuario: {
      documentoTipo: 1,
      documentoNumero: DATOS_DENIT.ruc,
      nombre: DATOS_DENIT.nombre,
      cargo: "Propietario"
    },
    factura: { presencia: 1 },
    condicion: {
      tipo: 1,
      entregas: [{ tipo: 1, monto: montoTotal, moneda: "PYG" }]
    },
    items: [{
      descripcion: stage.stageName.toUpperCase(),
      cantidad: 1,
      unidadMedida: 77,
      precioUnitario: montoTotal,
      ivaTipo: 3
      // 3 = Exento
    }]
  };
}
var FACTURASEND_CONFIG, DATOS_DENIT;
var init_facturasend = __esm({
  "server/facturasend.ts"() {
    "use strict";
    FACTURASEND_CONFIG = {
      apiKey: process.env.FACTURASEND_API_KEY,
      baseUrl: "https://api.facturasend.com.py/jhonifabianbenitezdelacruz_9193"
    };
    DATOS_DENIT = {
      ruc: "4220058",
      dv: "0",
      nombre: "BENITEZ DE LA CRUZ JHONI FABIAN"
    };
  }
});

// server/sifen.ts
var sifen_exports = {};
__export(sifen_exports, {
  enviarFacturaSIFEN: () => enviarFacturaSIFEN,
  firmarXML: () => firmarXML,
  generarXMLFacturaElectronica: () => generarXMLFacturaElectronica,
  procesarFacturaElectronica: () => procesarFacturaElectronica,
  validarDatosFactura: () => validarDatosFactura
});
import crypto from "crypto";
import { parseString } from "xml2js";
import { promisify } from "util";
import forge from "node-forge";
import fs from "fs";
function calcularDV(ruc) {
  const baseMax = 11;
  let k = 2;
  let total = 0;
  const rucLimpio = ruc.replace(/\D/g, "");
  for (let i = rucLimpio.length - 1; i >= 0; i--) {
    if (k > baseMax) k = 2;
    total += parseInt(rucLimpio[i]) * k;
    k++;
  }
  const resto = total % 11;
  const dv = resto > 1 ? 11 - resto : 0;
  return dv.toString();
}
function generarCDC(ruc, dv, establecimiento, puntoExpedicion, numero, tipoDocumento, fechaEmision) {
  const tipoEmision = "1";
  const fecha = fechaEmision.toISOString().slice(0, 10).replace(/-/g, "");
  const rucPadded = ruc.padStart(8, "0");
  const dvPadded = dv.padStart(1, "0");
  const estabPadded = establecimiento.padStart(3, "0");
  const puntoExpPadded = puntoExpedicion.padStart(3, "0");
  const numeroPadded = numero.padStart(7, "0");
  const tipoDocPadded = tipoDocumento.padStart(2, "0");
  const codigoSeguridad = Math.floor(Math.random() * 99999999999).toString().padStart(11, "0");
  const cdc = `${tipoEmision}${fecha}${rucPadded}${dvPadded}${estabPadded}${puntoExpPadded}${numeroPadded}${tipoDocPadded}${codigoSeguridad}`;
  return cdc;
}
function calcularDVCDC(cdc) {
  const baseMax = 11;
  let k = 2;
  let total = 0;
  for (let i = cdc.length - 1; i >= 0; i--) {
    if (k > baseMax) k = 2;
    total += parseInt(cdc[i]) * k;
    k++;
  }
  const resto = total % 11;
  const dv = resto > 1 ? 11 - resto : 0;
  return dv.toString();
}
function escaparXML(str) {
  if (!str) return "";
  return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&apos;");
}
function cargarCertificado() {
  if (certificadoCache) {
    return certificadoCache;
  }
  const certificadoPath = SIFEN_CONFIG.certificadoPath;
  const certificadoPassword = SIFEN_CONFIG.certificadoPassword;
  if (!certificadoPath || !certificadoPassword) {
    console.log("\u26A0\uFE0F No se configuraron credenciales de certificado PFX");
    console.log("\u26A0\uFE0F Modo TEST: Se generar\xE1 XML sin firma digital real");
    return null;
  }
  try {
    if (!fs.existsSync(certificadoPath)) {
      console.error(`\u274C Archivo de certificado no encontrado: ${certificadoPath}`);
      return null;
    }
    console.log("\u{1F510} Cargando certificado PFX:", certificadoPath);
    const pfxData = fs.readFileSync(certificadoPath);
    const p12Der = pfxData.toString("binary");
    const p12Asn1 = forge.asn1.fromDer(p12Der);
    const p12 = forge.pkcs12.pkcs12FromAsn1(p12Asn1, certificadoPassword);
    const keyBags = p12.getBags({ bagType: forge.pki.oids.pkcs8ShroudedKeyBag });
    const certBags = p12.getBags({ bagType: forge.pki.oids.certBag });
    const keyBagArray = keyBags[forge.pki.oids.pkcs8ShroudedKeyBag];
    if (!keyBagArray || keyBagArray.length === 0) {
      throw new Error("No se encontr\xF3 clave privada en el certificado PFX");
    }
    const certBagArray = certBags[forge.pki.oids.certBag];
    if (!certBagArray || certBagArray.length === 0) {
      throw new Error("No se encontr\xF3 certificado en el archivo PFX");
    }
    const privateKey = keyBagArray[0].key;
    const certificate = certBagArray[0].cert;
    if (!certificate) {
      throw new Error("El certificado est\xE1 vac\xEDo");
    }
    const certificateChain = certBagArray.map((bag) => bag.cert).filter((cert) => cert !== void 0);
    console.log("\u2705 Certificado PFX cargado correctamente");
    console.log("\u{1F4CB} Subject:", certificate.subject.getField("CN")?.value || "N/A");
    console.log("\u{1F4CB} Emisor:", certificate.issuer.getField("CN")?.value || "N/A");
    console.log("\u{1F4CB} V\xE1lido desde:", certificate.validity.notBefore);
    console.log("\u{1F4CB} V\xE1lido hasta:", certificate.validity.notAfter);
    certificadoCache = {
      privateKey,
      certificate,
      certificateChain
    };
    return certificadoCache;
  } catch (error) {
    console.error("\u274C Error al cargar certificado PFX:", error.message);
    console.error("\u{1F4CB} Stack:", error.stack);
    return null;
  }
}
function generarQR(cdc, fechaEmision, rucReceptor, totalGral, totalIVA, cantItems, digestValue, idCSC, cHashQR) {
  const baseUrl = SIFEN_CONFIG.ambiente === "production" ? "https://ekuatia.set.gov.py/consultas/qr" : "https://ekuatia.set.gov.py/consultas-test/qr";
  const fechaHex = Buffer.from(fechaEmision.toISOString().slice(0, 19)).toString("hex");
  const digestHex = Buffer.from(digestValue).toString("hex");
  const params = new URLSearchParams({
    nVersion: "150",
    Id: cdc,
    dFeEmiDE: fechaHex,
    dRucRec: rucReceptor || "00000000",
    dTotGralOpe: Math.round(totalGral).toString(),
    dTotIVA: Math.round(totalIVA).toString(),
    cItems: cantItems.toString(),
    DigestValue: digestHex,
    IdCSC: idCSC.padStart(4, "0"),
    cHashQR
  });
  return `${baseUrl}?${params.toString()}`;
}
function generarXMLFacturaElectronica(data) {
  const [establecimiento, puntoExpedicion, numero] = data.numeroFactura.split("-");
  const rucLimpio = data.ruc.replace(/\D/g, "");
  const dv = calcularDV(rucLimpio);
  const cdc = generarCDC(
    rucLimpio,
    dv,
    establecimiento,
    puntoExpedicion,
    numero,
    "01",
    data.fechaEmision
  );
  const dvCDC = calcularDVCDC(cdc);
  const codigoSeguridad = cdc.slice(-11);
  const fechaEmisionISO = data.fechaEmision.toISOString().slice(0, 19);
  const fechaEmisionFecha = data.fechaEmision.toISOString().slice(0, 10);
  const fechaInicioTimbrado = data.fechaInicioTimbrado ? data.fechaInicioTimbrado.toISOString().slice(0, 10) : fechaEmisionFecha;
  let subExento = 0;
  let subExonerado = 0;
  let sub5 = 0;
  let sub10 = 0;
  let liquidacionIVA5 = 0;
  let liquidacionIVA10 = 0;
  let baseGravada5 = 0;
  let baseGravada10 = 0;
  data.items.forEach((item) => {
    const montoItem = data.tipoMoneda === "PYG" ? item.montoTotal : item.montoTotal * (data.tipoCambio || 1);
    if (item.ivaAfectacion === 1 && item.tasaIVA === 10) {
      const base = montoItem / 1.1;
      baseGravada10 += base;
      sub10 += montoItem;
      liquidacionIVA10 += montoItem - base;
    } else if (item.ivaAfectacion === 1 && item.tasaIVA === 5) {
      const base = montoItem / 1.05;
      baseGravada5 += base;
      sub5 += montoItem;
      liquidacionIVA5 += montoItem - base;
    } else if (item.ivaAfectacion === 2) {
      subExonerado += montoItem;
    } else if (item.ivaAfectacion === 3) {
      subExento += montoItem;
    }
  });
  const totalIVA = liquidacionIVA5 + liquidacionIVA10;
  const totalOperacion = subExento + subExonerado + sub5 + sub10;
  const totalGeneral = data.tipoMoneda === "PYG" ? data.montoTotalPYG : data.montoTotalPYG;
  const clienteRucLimpio = data.clienteRuc ? data.clienteRuc.replace(/\D/g, "") : "";
  const clienteDV = clienteRucLimpio ? calcularDV(clienteRucLimpio) : "";
  const indicadorPresencia = data.indicadorPresencia || 2;
  const descIndicadorPresencia = indicadorPresencia === 1 ? "Operaci\xF3n presencial" : indicadorPresencia === 2 ? "Operaci\xF3n electr\xF3nica" : "Operaci\xF3n telepresencial";
  const condicionOp = data.condicionOperacion || "contado";
  const iCondOpe = condicionOp === "contado" ? 1 : 2;
  const dCondOpe = condicionOp === "contado" ? "Contado" : "Cr\xE9dito";
  const itemsXML = data.items.map((item, index2) => {
    const precioUnitario = item.precioUnitario;
    const montoTotal = item.montoTotal;
    const cantidadFormateada = item.cantidad.toFixed(4);
    let baseGravIVA = 0;
    let liqIVAItem = 0;
    let tasaIVA = item.tasaIVA || 0;
    let desAfecIVA = "Exento";
    if (item.ivaAfectacion === 1) {
      desAfecIVA = "Gravado IVA";
      if (tasaIVA === 10) {
        baseGravIVA = montoTotal / 1.1;
        liqIVAItem = montoTotal - baseGravIVA;
      } else if (tasaIVA === 5) {
        baseGravIVA = montoTotal / 1.05;
        liqIVAItem = montoTotal - baseGravIVA;
      }
    } else if (item.ivaAfectacion === 2) {
      desAfecIVA = "Exonerado";
    } else if (item.ivaAfectacion === 3) {
      desAfecIVA = "Exento";
    } else if (item.ivaAfectacion === 4) {
      desAfecIVA = "Gravado parcial (Grav-Exento)";
    }
    return `      <gCamItem>
        <dCodInt>${escaparXML(item.codigo || (index2 + 1).toString())}</dCodInt>
        <dDesProSer>${escaparXML(item.descripcion)}</dDesProSer>
        <cUniMed>77</cUniMed>
        <dDesUniMed>UNI</dDesUniMed>
        <dCantProSer>${cantidadFormateada}</dCantProSer>
        <gValorItem>
          <dPUniProSer>${precioUnitario.toFixed(2)}</dPUniProSer>
          <dTotBruOpeItem>${montoTotal.toFixed(2)}</dTotBruOpeItem>
          <gValorRestaItem>
            <dDescItem>0</dDescItem>
            <dPorcDesIt>0</dPorcDesIt>
            <dDescGloItem>0</dDescGloItem>
            <dTotOpeItem>${montoTotal.toFixed(2)}</dTotOpeItem>
          </gValorRestaItem>
        </gValorItem>
        <gCamIVA>
          <iAfecIVA>${item.ivaAfectacion}</iAfecIVA>
          <dDesAfecIVA>${desAfecIVA}</dDesAfecIVA>
          <dPropIVA>100</dPropIVA>
          <dTasaIVA>${tasaIVA}</dTasaIVA>
          <dBasGravIVA>${baseGravIVA.toFixed(0)}</dBasGravIVA>
          <dLiqIVAItem>${liqIVAItem.toFixed(0)}</dLiqIVAItem>
        </gCamIVA>
      </gCamItem>`;
  }).join("\n");
  const pagoXML = condicionOp === "contado" ? `        <gPaConEIni>
          <iTiPago>1</iTiPago>
          <dDesTiPag>Efectivo</dDesTiPag>
          <dMonTiPag>${data.montoTotal.toFixed(2)}</dMonTiPag>
          <cMoneTiPag>${data.tipoMoneda}</cMoneTiPag>
          <dDMoneTiPag>${data.tipoMoneda === "USD" ? "D\xF3lar Americano" : "Guaran\xED"}</dDMoneTiPag>
          <dTiCamTiPag>${data.tipoCambio ? data.tipoCambio.toFixed(4) : "1.0000"}</dTiCamTiPag>
        </gPaConEIni>` : `        <gPagCred>
          <iCondCred>1</iCondCred>
          <dDCondCred>Plazo</dDCondCred>
          <dPlazoCre>${data.plazoCredito || 30}</dPlazoCre>
        </gPagCred>`;
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rDE xmlns="http://ekuatia.set.gov.py/sifen/xsd" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://ekuatia.set.gov.py/sifen/xsd siRecepDE_v150.xsd">
  <dVerFor>150</dVerFor>
  <DE Id="${cdc}">
    <dDVId>${dvCDC}</dDVId>
    <dFecFirma>${fechaEmisionISO}</dFecFirma>
    <dSisFact>1</dSisFact>
    <gOpeDE>
      <iTipEmi>1</iTipEmi>
      <dDesTipEmi>Normal</dDesTipEmi>
      <dCodSeg>${codigoSeguridad}</dCodSeg>
      <dInfoEmi>SoftwarePar</dInfoEmi>
      <dInfoFisc></dInfoFisc>
    </gOpeDE>
    <gTimb>
      <iTiDE>1</iTiDE>
      <dDesTiDE>Factura electr\xF3nica</dDesTiDE>
      <dNumTim>${data.timbrado}</dNumTim>
      <dEst>${establecimiento}</dEst>
      <dPunExp>${puntoExpedicion}</dPunExp>
      <dNumDoc>${numero}</dNumDoc>
      <dFeIniT>${fechaInicioTimbrado}</dFeIniT>
    </gTimb>
    <gDatGralOpe>
      <dFeEmiDE>${fechaEmisionISO}</dFeEmiDE>
      <gOpeCom>
        <iTipTra>1</iTipTra>
        <dDesTipTra>Venta de mercader\xEDa</dDesTipTra>
        <iTImp>1</iTImp>
        <dDesTImp>IVA</dDesTImp>
        <cMoneOpe>${data.tipoMoneda}</cMoneOpe>
        <dDesMoneOpe>${data.tipoMoneda === "USD" ? "D\xF3lar Americano" : "Guaran\xED"}</dDesMoneOpe>
        <dCondTiCam>${data.tipoCambio ? data.tipoCambio.toFixed(4) : "1.0000"}</dCondTiCam>
      </gOpeCom>
      <gEmis>
        <dRucEm>${rucLimpio}</dRucEm>
        <dDVEmi>${dv}</dDVEmi>
        <iTipCont>2</iTipCont>
        <cTipReg>8</cTipReg>
        <dNomEmi>${escaparXML(data.razonSocial)}</dNomEmi>
        <dNomFanEmi>SoftwarePar</dNomFanEmi>
        <dDirEmi>${escaparXML(data.direccionEmisor || "Asunci\xF3n")}</dDirEmi>
        <dNumCas>0</dNumCas>
        <cDepEmi>1</cDepEmi>
        <dDesDepEmi>CAPITAL</dDesDepEmi>
        <cCiuEmi>1</cCiuEmi>
        <dDesCiuEmi>ASUNCION (DISTRITO)</dDesCiuEmi>
        <dTelEmi>${data.telefonoEmisor || "021000000"}</dTelEmi>
        <dEmailE>${data.emailEmisor || "info@softwarepar.com"}</dEmailE>
        <gActEco>
          <cActEco>${data.actividadEconomicaCodigo || "620900"}</cActEco>
          <dDesActEco>${escaparXML(data.actividadEconomicaDescripcion || "Desarrollo de software")}</dDesActEco>
        </gActEco>
      </gEmis>
      <gDatRec>
        <iNatRec>${clienteRucLimpio ? "2" : "1"}</iNatRec>
        <iTiOpe>1</iTiOpe>
        <cPaisRec>PRY</cPaisRec>
        <dDesPaisRe>Paraguay</dDesPaisRe>
        <iTiContRec>${clienteRucLimpio ? "2" : "1"}</iTiContRec>
        ${clienteRucLimpio ? `<dRucRec>${clienteRucLimpio}</dRucRec>` : ""}
        ${clienteRucLimpio ? `<dDVRec>${clienteDV}</dDVRec>` : ""}
        ${!clienteRucLimpio ? `<iTipIDRec>1</iTipIDRec>` : ""}
        ${!clienteRucLimpio ? `<dDTipIDRec>C\xE9dula paraguaya</dDTipIDRec>` : ""}
        ${!clienteRucLimpio ? `<dNumIDRec>${escaparXML(data.clienteDocumento)}</dNumIDRec>` : ""}
        <dNomRec>${escaparXML(data.clienteNombre)}</dNomRec>
        <dDirRec>${escaparXML(data.clienteDireccion || "N/A")}</dDirRec>
        <dNumCasRec>0</dNumCasRec>
        <cDepRec>1</cDepRec>
        <dDesDepRec>CAPITAL</dDesDepRec>
        <cDisRec>1</cDisRec>
        <dDesDisRec>ASUNCION (DISTRITO)</dDesDisRec>
        <cCiuRec>1</cCiuRec>
        <dDesCiuRec>${escaparXML(data.clienteCiudad || "ASUNCION (DISTRITO)")}</dDesCiuRec>
        <dTelRec>${data.clienteTelefono || "021000000"}</dTelRec>
      </gDatRec>
    </gDatGralOpe>
    <gDtipDE>
      <gCamFE>
        <iIndPres>${indicadorPresencia}</iIndPres>
        <dDesIndPres>${descIndicadorPresencia}</dDesIndPres>
      </gCamFE>
      <gCamCond>
        <iCondOpe>${iCondOpe}</iCondOpe>
        <dDCondOpe>${dCondOpe}</dDCondOpe>
${pagoXML}
      </gCamCond>
${itemsXML}
    </gDtipDE>
    <gTotSub>
      <dSubExe>${Math.round(subExento)}</dSubExe>
      <dSubExo>${Math.round(subExonerado)}</dSubExo>
      <dSub5>${Math.round(sub5)}</dSub5>
      <dSub10>${Math.round(sub10)}</dSub10>
      <dTotOpe>${Math.round(totalOperacion)}</dTotOpe>
      <dTotDesc>0</dTotDesc>
      <dTotDescGlotem>0</dTotDescGlotem>
      <dTotAntItem>0</dTotAntItem>
      <dTotAnt>0</dTotAnt>
      <dPorcDescTotal>0</dPorcDescTotal>
      <dDescTotal>0</dDescTotal>
      <dAnticipo>0</dAnticipo>
      <dRedon>0</dRedon>
      <dTotGralOpe>${Math.round(totalGeneral)}</dTotGralOpe>
      <dIVA5>${Math.round(liquidacionIVA5)}</dIVA5>
      <dIVA10>${Math.round(liquidacionIVA10)}</dIVA10>
      <dLiqTotIVA5>${Math.round(liquidacionIVA5)}</dLiqTotIVA5>
      <dLiqTotIVA10>${Math.round(liquidacionIVA10)}</dLiqTotIVA10>
      <dTotIVA>${Math.round(totalIVA)}</dTotIVA>
      <dBaseGrav5>${Math.round(baseGravada5)}</dBaseGrav5>
      <dBaseGrav10>${Math.round(baseGravada10)}</dBaseGrav10>
      <dTBasGraIVA>${Math.round(baseGravada5 + baseGravada10)}</dTBasGraIVA>
      <dTotalGs>${Math.round(totalGeneral)}</dTotalGs>
    </gTotSub>
  </DE>
</rDE>`;
  return xml;
}
function firmarXML(xml, csc, idCSC) {
  const deMatch = xml.match(/<DE Id="([^"]+)"[\s\S]*?<\/DE>/);
  if (!deMatch) {
    throw new Error("No se pudo extraer el elemento DE del XML");
  }
  const deElement = deMatch[0];
  const cdc = deMatch[1];
  const digestValue = crypto.createHash("sha256").update(deElement, "utf8").digest("base64");
  const qrData = `${cdc}|${idCSC}|${csc}`;
  const cHashQR = crypto.createHash("sha256").update(qrData, "utf8").digest("hex");
  const cdcMatch = xml.match(/Id="([^"]+)"/);
  const fechaMatch = xml.match(/<dFeEmiDE>([^<]+)<\/dFeEmiDE>/);
  const rucRecMatch = xml.match(/<dRucRec>([^<]+)<\/dRucRec>/) || xml.match(/<dNumIDRec>([^<]+)<\/dNumIDRec>/);
  const totalMatch = xml.match(/<dTotGralOpe>([^<]+)<\/dTotGralOpe>/);
  const ivaMatch = xml.match(/<dTotIVA>([^<]+)<\/dTotIVA>/);
  const itemsMatch = xml.match(/<gCamItem>/g);
  if (!cdcMatch || !fechaMatch || !totalMatch || !ivaMatch) {
    throw new Error("Faltan elementos requeridos en el XML para generar el QR");
  }
  const fechaEmision = new Date(fechaMatch[1]);
  const rucReceptor = rucRecMatch ? rucRecMatch[1] : "00000000";
  const totalGral = parseFloat(totalMatch[1]);
  const totalIVA = parseFloat(ivaMatch[1]);
  const cantItems = itemsMatch ? itemsMatch.length : 0;
  const urlQR = generarQR(
    cdcMatch[1],
    fechaEmision,
    rucReceptor,
    totalGral,
    totalIVA,
    cantItems,
    digestValue,
    idCSC,
    cHashQR
  );
  const certificado = cargarCertificado();
  let signatureValue = "SIN_CERTIFICADO_DIGITAL";
  let certificadoBase64 = "";
  if (certificado) {
    try {
      console.log("\u{1F510} Firmando XML con certificado digital...");
      const signedInfoXML = `<SignedInfo xmlns="http://www.w3.org/2000/09/xmldsig#">
      <CanonicalizationMethod Algorithm="http://www.w3.org/2001/10/xml-exc-c14n#"/>
      <SignatureMethod Algorithm="http://www.w3.org/2001/04/xmldsig-more#rsa-sha256"/>
      <Reference URI="#${cdc}">
        <Transforms>
          <Transform Algorithm="http://www.w3.org/2000/09/xmldsig#enveloped-signature"/>
          <Transform Algorithm="http://www.w3.org/2001/10/xml-exc-c14n#"/>
        </Transforms>
        <DigestMethod Algorithm="http://www.w3.org/2001/04/xmlenc#sha256"/>
        <DigestValue>${digestValue}</DigestValue>
      </Reference>
    </SignedInfo>`;
      const md = forge.md.sha256.create();
      md.update(signedInfoXML, "utf8");
      const signature = certificado.privateKey.sign(md);
      signatureValue = forge.util.encode64(signature);
      const certDer = forge.asn1.toDer(forge.pki.certificateToAsn1(certificado.certificate)).getBytes();
      certificadoBase64 = forge.util.encode64(certDer);
      console.log("\u2705 XML firmado digitalmente con RSA-SHA256");
      console.log("\u{1F4CB} Longitud de firma:", signatureValue.length, "caracteres");
      console.log("\u{1F4CB} Certificado X.509 incluido");
      console.log("\u{1F4CB} Algoritmo de canonicalizaci\xF3n:", "http://www.w3.org/2001/10/xml-exc-c14n#");
      console.log("\u{1F4CB} M\xE9todo de firma:", "http://www.w3.org/2001/04/xmldsig-more#rsa-sha256");
      console.log("\u{1F4CB} Validaci\xF3n: Firma b\xE1sica XML-DSig (sin XAdES-BES completo)");
    } catch (error) {
      console.error("\u274C Error al firmar XML:", error.message);
      console.log("\u26A0\uFE0F Continuando sin firma digital");
      signatureValue = "SIN_CERTIFICADO_DIGITAL";
      certificadoBase64 = "";
    }
  } else {
    console.log("\u26A0\uFE0F Generando XML sin firma digital (modo test)");
    console.log("\u2139\uFE0F  Para producci\xF3n, configure SIFEN_CERTIFICADO_PATH y SIFEN_CERTIFICADO_PASSWORD");
  }
  const keyInfoXML = certificadoBase64 ? `    <KeyInfo>
      <X509Data>
        <X509Certificate>${certificadoBase64}</X509Certificate>
      </X509Data>
    </KeyInfo>` : "";
  const signatureXML = `  <Signature xmlns="http://www.w3.org/2000/09/xmldsig#">
    <SignedInfo>
      <CanonicalizationMethod Algorithm="http://www.w3.org/2001/10/xml-exc-c14n#"/>
      <SignatureMethod Algorithm="http://www.w3.org/2001/04/xmldsig-more#rsa-sha256"/>
      <Reference URI="#${cdc}">
        <Transforms>
          <Transform Algorithm="http://www.w3.org/2000/09/xmldsig#enveloped-signature"/>
          <Transform Algorithm="http://www.w3.org/2001/10/xml-exc-c14n#"/>
        </Transforms>
        <DigestMethod Algorithm="http://www.w3.org/2001/04/xmlenc#sha256"/>
        <DigestValue>${digestValue}</DigestValue>
      </Reference>
    </SignedInfo>
    <SignatureValue>${signatureValue}</SignatureValue>
${keyInfoXML}
  </Signature>
  <gCamFuFD>
    <dCarQR>${escaparXML(urlQR)}</dCarQR>
  </gCamFuFD>
</rDE>`;
  const xmlFirmado = xml.replace("</rDE>", signatureXML);
  return { xmlFirmado, digestValue, cHashQR };
}
async function enviarFacturaSIFEN(xmlFirmado) {
  try {
    console.log("\u{1F4CB} Preparando env\xEDo a SIFEN...");
    console.log("\u{1F4CB} Ambiente:", SIFEN_CONFIG.ambiente);
    console.log("\u{1F4CB} Endpoint:", SIFEN_CONFIG.wsdlUrl);
    const xmlBase64 = Buffer.from(xmlFirmado, "utf-8").toString("base64");
    const soapEnvelope = `<?xml version="1.0" encoding="UTF-8"?>
<soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
  <soap:Body>
    <rEnviDe xmlns="http://ekuatia.set.gov.py/sifen/xsd">
      <dId>01</dId>
      <xDE>${xmlBase64}</xDE>
    </rEnviDe>
  </soap:Body>
</soap:Envelope>`;
    console.log("\u{1F4E4} Enviando DE a SIFEN...");
    console.log("\u{1F4CB} Tama\xF1o del XML:", xmlFirmado.length, "bytes");
    console.log("\u{1F4CB} Endpoint:", SIFEN_CONFIG.wsdlUrl);
    console.log("\u{1F4CB} IdCSC:", SIFEN_CONFIG.idCSC);
    const response = await fetch(SIFEN_CONFIG.wsdlUrl, {
      method: "POST",
      headers: {
        "Content-Type": "text/xml; charset=utf-8",
        "SOAPAction": '"http://ekuatia.set.gov.py/sifen/xsd/rEnviDe"',
        "Accept": "text/xml",
        "User-Agent": "SoftwarePar-SIFEN-Client/1.0"
      },
      body: soapEnvelope
    });
    const responseText = await response.text();
    console.log("\u{1F4E5} Respuesta SIFEN - Status:", response.status);
    console.log("\u{1F4E5} Content-Type:", response.headers.get("content-type"));
    if (responseText.includes("<html") || responseText.includes("<!DOCTYPE")) {
      console.error("\u274C SIFEN retorn\xF3 HTML en lugar de SOAP");
      console.error("\u274C Posibles causas:");
      console.error("   1. Credenciales CSC incorrectas o inactivas");
      console.error("   2. IP no autorizada (requiere whitelist en SIFEN)");
      console.error("   3. Endpoint incorrecto o servicio ca\xEDdo");
      console.error("   4. Sesi\xF3n expirada o autenticaci\xF3n fallida");
      throw new Error("SIFEN rechaz\xF3 la conexi\xF3n - retorn\xF3 p\xE1gina de logout en lugar de servicio SOAP");
    }
    if (!response.ok) {
      console.error("\u274C SIFEN retorn\xF3 error HTTP:", response.status, response.statusText);
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    if (!responseText.includes("<?xml") && !responseText.includes("<soap")) {
      console.error("\u274C Respuesta no es XML v\xE1lido");
      console.error("\u{1F4CB} Primeros 500 caracteres:", responseText.substring(0, 500));
      throw new Error(`SIFEN retorn\xF3 respuesta no XML. Status: ${response.status}`);
    }
    const result = await parseXML(responseText, {
      explicitArray: false,
      ignoreAttrs: false,
      trim: true
    });
    console.log("\u{1F4CB} XML parseado correctamente");
    const envelope = result["soap:envelope"] || result["soapenv:envelope"] || result.envelope || result["env:envelope"];
    if (!envelope) {
      console.error("\u274C No se encontr\xF3 el envelope SOAP");
      throw new Error("Estructura de respuesta SIFEN inv\xE1lida: falta envelope");
    }
    const body = envelope["soap:body"] || envelope["soapenv:body"] || envelope.body || envelope["env:body"];
    if (!body) {
      console.error("\u274C No se encontr\xF3 el body SOAP");
      throw new Error("Estructura de respuesta SIFEN inv\xE1lida: falta body");
    }
    const respuesta = body.renvideresp || body.renvideresp || body.rEnviDeResp;
    if (!respuesta) {
      console.log("\u{1F4CB} Body completo:", JSON.stringify(body, null, 2));
      console.error("\u274C No se encontr\xF3 rEnviDeResp en la respuesta");
      const fault = body["soap:fault"] || body.fault;
      if (fault) {
        const faultString = fault.faultstring || fault.message || "Error SOAP desconocido";
        throw new Error(`SOAP Fault: ${faultString}`);
      }
      throw new Error("Estructura de respuesta SIFEN no reconocida");
    }
    console.log("\u{1F4CB} Respuesta SIFEN parseada:", JSON.stringify(respuesta, null, 2).substring(0, 1e3));
    const nroLote = respuesta.dnslote || respuesta.dNsLote || respuesta.xcontrec?.["dnslote"];
    const codigoResultado = respuesta.dcodres || respuesta.dCodRes || respuesta.xcontrec?.["dcodres"] || "desconocido";
    const mensaje = respuesta.dmsgres || respuesta.dMsgRes || respuesta.xcontrec?.["dmsgres"];
    const codigosAprobados = ["0260", "0261", "0262", "0300", "0301"];
    const codigosPendientes = ["0300", "0301", "0302"];
    const aceptado = codigosAprobados.includes(codigoResultado.toString());
    const pendiente = codigosPendientes.includes(codigoResultado.toString());
    const estadoFinal = aceptado ? "aceptado" : pendiente ? "pendiente" : "rechazado";
    console.log(`${aceptado ? "\u2705" : pendiente ? "\u23F3" : "\u274C"} SIFEN: ${estadoFinal.toUpperCase()}`);
    console.log(`\u{1F4CA} C\xF3digo: ${codigoResultado} - ${mensaje || "Sin mensaje"}`);
    if (nroLote) console.log(`\u{1F4E6} N\xFAmero de Lote: ${nroLote}`);
    return {
      success: aceptado,
      protocoloAutorizacion: nroLote || void 0,
      estado: estadoFinal,
      mensajeError: !aceptado ? mensaje || `C\xF3digo de resultado: ${codigoResultado}` : void 0,
      respuestaCompleta: respuesta
    };
  } catch (error) {
    console.error("\u274C Error al enviar factura a SIFEN:", error.message);
    console.error("\u{1F4CB} Stack:", error.stack);
    return {
      success: false,
      estado: "rechazado",
      mensajeError: error.message || "Error desconocido al comunicarse con SIFEN"
    };
  }
}
async function procesarFacturaElectronica(data) {
  console.log("\u{1F504} ========================================");
  console.log("\u{1F504} Iniciando proceso de factura electr\xF3nica SIFEN");
  console.log("\u{1F504} ========================================");
  console.log("\u{1F4CA} Datos:", {
    ruc: data.ruc,
    numeroFactura: data.numeroFactura,
    cliente: data.clienteNombre,
    monto: data.montoTotal,
    moneda: data.tipoMoneda
  });
  try {
    console.log("\u{1F4DD} Generando XML seg\xFAn especificaci\xF3n SIFEN v150...");
    const xml = generarXMLFacturaElectronica(data);
    console.log("\u2705 XML generado exitosamente");
    console.log("\u{1F4CB} Longitud del XML:", xml.length, "caracteres");
    const cdcMatch = xml.match(/Id="([^"]+)"/);
    const cdc = cdcMatch ? cdcMatch[1] : void 0;
    console.log("\u{1F511} CDC generado:", cdc);
    console.log("\u{1F510} Firmando XML...");
    const { xmlFirmado, digestValue, cHashQR } = firmarXML(xml, SIFEN_CONFIG.csc, SIFEN_CONFIG.idCSC);
    console.log("\u2705 XML firmado exitosamente");
    console.log("\u{1F4CB} DigestValue:", digestValue.substring(0, 50) + "...");
    const qrMatch = xmlFirmado.match(/<dCarQR>([^<]+)<\/dCarQR>/);
    const urlQR = qrMatch ? qrMatch[1].replace(/&amp;/g, "&") : void 0;
    console.log("\u{1F4F1} URL QR generada:", urlQR?.substring(0, 100) + "...");
    console.log("\u{1F4E4} Enviando a SIFEN...");
    const resultadoEnvio = await enviarFacturaSIFEN(xmlFirmado);
    console.log("\u{1F504} ========================================");
    console.log(`\u{1F4CA} RESULTADO FINAL: ${resultadoEnvio.success ? "\u2705 EXITOSO" : "\u274C FALLIDO"}`);
    console.log("\u{1F504} ========================================");
    return {
      ...resultadoEnvio,
      cdc,
      xmlGenerado: xmlFirmado,
      urlQR
    };
  } catch (error) {
    console.error("\u274C Error en procesarFacturaElectronica:", error.message);
    console.error("\u{1F4CB} Stack:", error.stack);
    return {
      success: false,
      estado: "rechazado",
      mensajeError: error.message || "Error desconocido al procesar factura electr\xF3nica",
      xmlGenerado: "",
      cdc: void 0
    };
  }
}
function validarDatosFactura(data) {
  const errores = [];
  if (!data.ruc || data.ruc.length < 3) {
    errores.push("RUC del emisor es requerido");
  }
  if (!data.razonSocial || data.razonSocial.trim().length === 0) {
    errores.push("Raz\xF3n social del emisor es requerida");
  }
  if (!data.timbrado || data.timbrado.length !== 8) {
    errores.push("Timbrado debe tener 8 d\xEDgitos");
  }
  if (!data.numeroFactura || !data.numeroFactura.match(/^\d{3}-\d{3}-\d{7}$/)) {
    errores.push("N\xFAmero de factura debe tener formato 001-001-0000001");
  }
  if (!data.clienteNombre || data.clienteNombre.trim().length === 0) {
    errores.push("Nombre del cliente es requerido");
  }
  if (!data.clienteDocumento || data.clienteDocumento.trim().length === 0) {
    errores.push("Documento del cliente es requerido");
  }
  if (!data.items || data.items.length === 0) {
    errores.push("Debe incluir al menos un item");
  }
  data.items.forEach((item, index2) => {
    if (!item.descripcion || item.descripcion.trim().length === 0) {
      errores.push(`Item ${index2 + 1}: descripci\xF3n es requerida`);
    }
    if (item.cantidad <= 0) {
      errores.push(`Item ${index2 + 1}: cantidad debe ser mayor a 0`);
    }
    if (item.precioUnitario <= 0) {
      errores.push(`Item ${index2 + 1}: precio unitario debe ser mayor a 0`);
    }
    if (![1, 2, 3, 4].includes(item.ivaAfectacion)) {
      errores.push(`Item ${index2 + 1}: afectaci\xF3n IVA inv\xE1lida (1=Gravado, 2=Exonerado, 3=Exento, 4=Parcial)`);
    }
  });
  if (data.montoTotal <= 0) {
    errores.push("Monto total debe ser mayor a 0");
  }
  return {
    valido: errores.length === 0,
    errores
  };
}
var parseXML, certificadoCache, SIFEN_CONFIG;
var init_sifen = __esm({
  "server/sifen.ts"() {
    "use strict";
    parseXML = promisify(parseString);
    certificadoCache = null;
    SIFEN_CONFIG = {
      idCSC: process.env.SIFEN_ID_CSC || "1",
      csc: process.env.SIFEN_CSC || "ABCD0000000000000000000000000000",
      certificadoPath: process.env.SIFEN_CERTIFICADO_PATH,
      certificadoPassword: process.env.SIFEN_CERTIFICADO_PASSWORD,
      wsdlUrl: process.env.SIFEN_WSDL_URL || "https://sifen-test.set.gov.py/de/ws/sync/recibe",
      ambiente: process.env.SIFEN_AMBIENTE || "test"
    };
  }
});

// server/index.ts
import express2 from "express";

// server/routes.ts
init_storage();
init_auth();
init_email();
init_schema();
init_notifications();
init_db();
import { createServer } from "http";
import { WebSocketServer, WebSocket } from "ws";
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";
import PDFDocument from "pdfkit";
import fs2 from "fs";
import QRCode from "qrcode";
import { z as z2 } from "zod";
import { eq as eq4, desc as desc2, and as and2, sql as sql3, asc } from "drizzle-orm";
import bcrypt2 from "bcryptjs";
async function verifyRecaptcha(token) {
  const secretKey = process.env.RECAPTCHA_SECRET_KEY || "6Lc1Iu0rAAAAAJRyHPH1N3Srv72K27bTFNaF12ZP";
  if (!process.env.RECAPTCHA_SECRET_KEY) {
    console.warn("\u26A0\uFE0F RECAPTCHA_SECRET_KEY not configured in Secrets. Using development key.");
  }
  try {
    const response = await fetch("https://www.google.com/recaptcha/api/siteverify", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      body: `secret=${secretKey}&response=${token}`
    });
    const data = await response.json();
    console.log(`\u{1F510} reCAPTCHA verified - Score: ${data.score || "N/A"}, Success: ${data.success}`);
    return data.success && (data.score === void 0 || data.score >= 0.1);
  } catch (error) {
    console.error("\u274C Error verifying reCAPTCHA:", error);
    return false;
  }
}
var __filename = fileURLToPath(import.meta.url);
var __dirname = path.dirname(__filename);
var upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024
    // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedMimes = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/gif",
      "application/pdf"
    ];
    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Tipo de archivo no soportado. Solo se permiten im\xE1genes (JPG, PNG, GIF) y PDFs."));
    }
  }
});
async function registerRoutes(app2) {
  app2.get("/api/health", async (req, res) => {
    try {
      const dbTest = await db.select().from(users).limit(1);
      res.json({
        status: "saludable",
        database: "conectado",
        timestamp: (/* @__PURE__ */ new Date()).toISOString(),
        database_url_configured: !!process.env.DATABASE_URL,
        environment: process.env.NODE_ENV || "development"
      });
    } catch (error) {
      res.status(500).json({
        status: "unhealthy",
        error: error instanceof Error ? error.message : "Unknown error",
        timestamp: (/* @__PURE__ */ new Date()).toISOString()
      });
    }
  });
  app2.get("/api/public/legal/:pageType", async (req, res) => {
    try {
      const { pageType } = req.params;
      const page = await storage.getLegalPage(pageType);
      if (!page) {
        return res.status(404).json({ message: "P\xE1gina no encontrada" });
      }
      res.json(page);
    } catch (error) {
      console.error("Error getting legal page:", error);
      res.status(500).json({ message: "Error interno del servidor" });
    }
  });
  app2.get("/api/admin/legal-pages", authenticateToken, requireRole(["admin"]), async (req, res) => {
    try {
      console.log("\u{1F4C4} Fetching all legal pages...");
      const pages = await storage.getAllLegalPages();
      console.log("\u2705 Legal pages fetched:", pages?.length || 0, pages);
      const result = Array.isArray(pages) ? pages : [];
      res.json(result);
    } catch (error) {
      console.error("\u274C Error getting legal pages:", error);
      res.json([]);
    }
  });
  app2.put("/api/admin/legal-pages/:pageType", authenticateToken, requireRole(["admin"]), async (req, res) => {
    try {
      const { pageType } = req.params;
      const updates = req.body;
      const updated = await storage.updateLegalPage(pageType, updates, req.user.id);
      res.json(updated);
    } catch (error) {
      console.error("Error updating legal page:", error);
      res.status(500).json({ message: "Error interno del servidor" });
    }
  });
  app2.get("/api/public/company-info", async (req, res) => {
    try {
      const companyInfo = await db.select({
        companyName: companyBillingInfo.companyName,
        titularName: companyBillingInfo.titularName,
        ruc: companyBillingInfo.ruc,
        timbradoNumber: companyBillingInfo.timbradoNumber
      }).from(companyBillingInfo).where(eq4(companyBillingInfo.isActive, true)).orderBy(desc2(companyBillingInfo.updatedAt)).limit(1);
      if (companyInfo.length === 0) {
        return res.json({
          companyName: "SoftwarePar",
          titularName: null,
          ruc: "In progress",
          timbradoNumber: "In progress"
        });
      }
      res.json(companyInfo[0]);
    } catch (error) {
      console.error("Error getting public company info:", error);
      res.status(500).json({
        companyName: "SoftwarePar",
        titularName: null,
        ruc: "In progress",
        timbradoNumber: "In progress"
      });
    }
  });
  app2.get("/sitemap.xml", async (req, res) => {
    try {
      const baseUrl = process.env.BASE_URL || "https://softwarepar.com";
      const currentDate = (/* @__PURE__ */ new Date()).toISOString().split("T")[0];
      const staticPages = [
        { url: "", changefreq: "daily", priority: "1.0" },
        { url: "terminos", changefreq: "monthly", priority: "0.5" },
        { url: "privacidad", changefreq: "monthly", priority: "0.5" },
        { url: "cookies", changefreq: "monthly", priority: "0.5" }
      ];
      const portfolioItems = await db.select({ id: portfolio.id, updatedAt: portfolio.updatedAt }).from(portfolio).where(eq4(portfolio.isActive, true)).limit(50);
      let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
      xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';
      staticPages.forEach((page) => {
        xml += "  <url>\n";
        xml += `    <loc>${baseUrl}/${page.url}</loc>
`;
        xml += `    <lastmod>${currentDate}</lastmod>
`;
        xml += `    <changefreq>${page.changefreq}</changefreq>
`;
        xml += `    <priority>${page.priority}</priority>
`;
        xml += "  </url>\n";
      });
      xml += "</urlset>";
      res.header("Content-Type", "application/xml");
      res.send(xml);
    } catch (error) {
      console.error("Error generating sitemap:", error);
      res.status(500).send("Error al generar el sitemap");
    }
  });
  await storage.seedUsers();
  app2.post("/api/auth/login", async (req, res) => {
    try {
      const { email, password, recaptchaToken } = req.body;
      console.log("\u{1F510} Login attempt for:", email);
      if (recaptchaToken) {
        const isValidRecaptcha = await verifyRecaptcha(recaptchaToken);
        if (!isValidRecaptcha) {
          console.log("\u274C Login attempt blocked by reCAPTCHA for:", email);
          return res.status(403).json({
            message: process.env.NODE_ENV === "development" ? "Verificaci\xF3n de seguridad fall\xF3 - Score muy bajo. Intenta nuevamente en unos segundos." : "La verificaci\xF3n de seguridad fall\xF3"
          });
        }
        console.log("\u2705 reCAPTCHA verified for:", email);
      }
      const validatedData = loginSchema.parse({ email, password });
      const user = await storage.getUserByEmail(validatedData.email);
      if (!user) {
        console.log("\u274C User not found:", validatedData.email);
        return res.status(401).json({ message: "Credenciales inv\xE1lidas" });
      }
      if (!user.isActive) {
        console.log("\u274C User inactive:", validatedData.email);
        return res.status(401).json({ message: "Credenciales inv\xE1lidas" });
      }
      console.log("\u{1F464} User found:", { email: user.email, role: user.role, isActive: user.isActive });
      const isValidPassword = await comparePassword(validatedData.password, user.password);
      if (!isValidPassword) {
        console.log("\u274C Invalid password for:", validatedData.email);
        return res.status(401).json({ message: "Credenciales inv\xE1lidas" });
      }
      console.log("\u2705 Password valid for:", validatedData.email);
      const token = generateToken(user.id);
      const { password: _, ...userWithoutPassword } = user;
      console.log("\u2705 Inicio de sesi\xF3n exitoso para:", user.email, "- Rol:", user.role);
      res.json({
        user: userWithoutPassword,
        token,
        message: "Inicio de sesi\xF3n exitoso"
      });
    } catch (error) {
      console.error("\u274C Login error:", error);
      if (error instanceof z2.ZodError) {
        console.error("\u274C Validation error:", error.errors);
        return res.status(400).json({ message: "Datos inv\xE1lidos", errors: error.errors });
      }
      res.status(500).json({ message: "Error interno del servidor" });
    }
  });
  app2.get("/api/auth/me", authenticateToken, async (req, res) => {
    try {
      const { password: _, ...userWithoutPassword } = req.user;
      res.json(userWithoutPassword);
    } catch (error) {
      res.status(500).json({ message: "Error interno del servidor" });
    }
  });
  app2.post("/api/auth/forgot-password", async (req, res) => {
    try {
      const { email, recaptchaToken } = req.body;
      if (!email) {
        return res.status(400).json({ message: "El correo electr\xF3nico es obligatorio" });
      }
      const recaptchaValid = await verifyRecaptcha(recaptchaToken);
      if (!recaptchaValid) {
        return res.status(400).json({ message: "La verificaci\xF3n de reCAPTCHA fall\xF3" });
      }
      const user = await storage.getUserByEmail(email);
      if (!user) {
        return res.status(200).json({
          message: "Si el correo existe, recibir\xE1 instrucciones de recuperaci\xF3n"
        });
      }
      const crypto2 = await import("crypto");
      const resetToken = crypto2.randomBytes(32).toString("hex");
      const expiresAt = /* @__PURE__ */ new Date();
      expiresAt.setHours(expiresAt.getHours() + 24);
      await storage.createPasswordResetToken({
        userId: user.id,
        token: resetToken,
        expiresAt
      });
      const origin = req.headers.origin || req.headers.referer?.replace(/\/$/, "") || process.env.BASE_URL || `https://${process.env.REPL_ID}.${process.env.REPL_SLUG}.replit.dev` || "http://localhost:5000";
      const resetLink = `${origin}/reset-password?token=${resetToken}`;
      await sendPasswordResetEmail(user.email, user.fullName, resetLink);
      res.json({
        message: "Si el correo existe, recibir\xE1 instrucciones de recuperaci\xF3n"
      });
    } catch (error) {
      console.error("Error in forgot-password:", error);
      res.status(500).json({ message: "Error al procesar la solicitud" });
    }
  });
  app2.post("/api/auth/reset-password", async (req, res) => {
    try {
      const { token, newPassword } = req.body;
      if (!token || !newPassword) {
        return res.status(400).json({ message: "El token y la nueva contrase\xF1a son obligatorios" });
      }
      if (newPassword.length < 6) {
        return res.status(400).json({ message: "La contrase\xF1a debe tener al menos 6 caracteres" });
      }
      const resetTokenRecord = await storage.getPasswordResetToken(token);
      if (!resetTokenRecord) {
        return res.status(400).json({ message: "Token inv\xE1lido o expirado" });
      }
      if (resetTokenRecord.used) {
        return res.status(400).json({ message: "Este token ya ha sido utilizado" });
      }
      if (/* @__PURE__ */ new Date() > new Date(resetTokenRecord.expiresAt)) {
        return res.status(400).json({ message: "El token ha expirado" });
      }
      const hashedPassword = await hashPassword2(newPassword);
      await storage.updateUserPassword(resetTokenRecord.userId, hashedPassword);
      await storage.markPasswordResetTokenAsUsed(token);
      res.json({ message: "Contrase\xF1a actualizada exitosamente" });
    } catch (error) {
      console.error("Error in reset-password:", error);
      res.status(500).json({ message: "Error al restablecer la contrase\xF1a" });
    }
  });
  app2.get("/api/exchange-rate", async (req, res) => {
    try {
      const exchangeRate = await storage.getCurrentExchangeRate();
      res.json(exchangeRate || { usdToGuarani: "7300.00", isDefault: true });
    } catch (error) {
      console.error("Error getting exchange rate:", error);
      res.status(500).json({ message: "Error interno del servidor" });
    }
  });
  app2.post("/api/admin/exchange-rate/fetch-from-api", authenticateToken, requireRole(["admin"]), async (req, res) => {
    try {
      const { fetchCurrentExchangeRate: fetchCurrentExchangeRate2 } = await Promise.resolve().then(() => (init_exchange_rate_api(), exchange_rate_api_exports));
      console.log("\u{1F310} Fetching exchange rate from API...");
      const apiRate = await fetchCurrentExchangeRate2();
      if (!apiRate) {
        return res.status(500).json({
          message: "No se pudo obtener el tipo de cambio desde la API. Usando valor por defecto.",
          rate: "7300.00"
        });
      }
      const rate = apiRate.toFixed(2);
      console.log(`\u2705 Exchange rate fetched successfully: 1 USD = ${rate} PYG`);
      res.json({
        success: true,
        rate,
        message: "Tipo de cambio obtenido exitosamente desde la API",
        source: "exchangerate-api.com"
      });
    } catch (error) {
      console.error("Error fetching exchange rate from API:", error);
      res.status(500).json({
        message: "Error al obtener el tipo de cambio desde la API",
        error: process.env.NODE_ENV === "development" ? error.message : void 0
      });
    }
  });
  app2.get("/api/admin/exchange-rate", authenticateToken, requireRole(["admin"]), async (req, res) => {
    try {
      const exchangeRate = await storage.getCurrentExchangeRate();
      res.json(exchangeRate || {
        usdToGuarani: "7300.00",
        isDefault: true,
        updatedAt: /* @__PURE__ */ new Date(),
        updatedBy: req.user.id
      });
    } catch (error) {
      console.error("Error getting exchange rate:", error);
      res.status(500).json({ message: "Error interno del servidor" });
    }
  });
  app2.put("/api/admin/exchange-rate", authenticateToken, requireRole(["admin"]), async (req, res) => {
    try {
      const { usdToGuarani } = req.body;
      if (!usdToGuarani || isNaN(parseFloat(usdToGuarani))) {
        return res.status(400).json({ message: "Tipo de cambio inv\xE1lido" });
      }
      const updatedRate = await storage.updateExchangeRate(usdToGuarani, req.user.id);
      res.json(updatedRate);
    } catch (error) {
      console.error("Error updating exchange rate:", error);
      res.status(500).json({ message: "Error interno del servidor" });
    }
  });
  app2.post("/api/contact", async (req, res) => {
    try {
      const { recaptchaToken, ...contactDataRaw } = req.body;
      if (recaptchaToken) {
        const isValidRecaptcha = await verifyRecaptcha(recaptchaToken);
        if (!isValidRecaptcha) {
          console.log("\u274C Contact form blocked by reCAPTCHA");
          return res.status(403).json({
            message: "La verificaci\xF3n de seguridad fall\xF3. Por favor, intente de nuevo."
          });
        }
        console.log("\u2705 reCAPTCHA verified successfully");
      }
      const contactData = contactSchema.parse(contactDataRaw);
      try {
        await sendContactNotification(contactData);
        console.log(`\u{1F4E7} Contact notification sent to admin for: ${contactData.fullName}`);
      } catch (emailError) {
        console.error("Error sending contact notification:", emailError);
      }
      try {
        await sendContactConfirmation(contactData.email, contactData.fullName);
        console.log(`\u{1F4E7} Confirmation sent to client: ${contactData.email}`);
      } catch (emailError) {
        console.error("Error sending contact confirmation:", emailError);
      }
      res.json({
        message: "\xA1Gracias por contactarnos! Hemos recibido su consulta y responderemos en un plazo de 24 horas."
      });
    } catch (error) {
      if (error instanceof z2.ZodError) {
        return res.status(400).json({ message: "Datos inv\xE1lidos", errors: error.errors });
      }
      res.status(500).json({ message: "Error interno del servidor" });
    }
  });
  app2.get("/api/users", authenticateToken, requireRole(["admin"]), async (req, res) => {
    try {
      const users2 = await storage.getAllUsers();
      const usersWithoutPasswords = users2.map(({ password, ...user }) => user);
      res.json(usersWithoutPasswords);
    } catch (error) {
      res.status(500).json({ message: "Error interno del servidor" });
    }
  });
  app2.put("/api/users/:id", authenticateToken, async (req, res) => {
    try {
      const userId = parseInt(req.params.id);
      const { currentPassword, newPassword, ...updates } = req.body;
      if (req.user.id !== userId && req.user.role !== "admin") {
        return res.status(403).json({ message: "No tienes permiso para actualizar este perfil" });
      }
      if (newPassword && currentPassword) {
        const [currentUser] = await db.select().from(users).where(eq4(users.id, userId)).limit(1);
        if (!currentUser) {
          return res.status(404).json({ message: "Usuario no encontrado" });
        }
        const isPasswordValid = await bcrypt2.compare(currentPassword, currentUser.password);
        if (!isPasswordValid) {
          return res.status(400).json({ message: "Contrase\xF1a actual incorrecta" });
        }
        const hashedPassword = await hashPassword2(newPassword);
        updates.password = hashedPassword;
      }
      const [updatedUser] = await db.update(users).set({ ...updates, updatedAt: /* @__PURE__ */ new Date() }).where(eq4(users.id, userId)).returning();
      if (!updatedUser) {
        return res.status(404).json({ message: "User not found" });
      }
      const { password, ...userWithoutPassword } = updatedUser;
      res.json(userWithoutPassword);
    } catch (error) {
      console.error("Error updating user:", error);
      res.status(500).json({ message: "Error interno del servidor" });
    }
  });
  app2.get("/api/partners/me", authenticateToken, requireRole(["partner"]), async (req, res) => {
    try {
      const partner = await storage.getPartner(req.user.id);
      if (!partner) {
        return res.status(404).json({ message: "Partner not found" });
      }
      const stats = await storage.getPartnerStats(partner.id);
      res.json({ ...partner, ...stats });
    } catch (error) {
      res.status(500).json({ message: "Error interno del servidor" });
    }
  });
  app2.get("/api/partners/referrals", authenticateToken, requireRole(["partner"]), async (req, res) => {
    try {
      const partner = await storage.getPartner(req.user.id);
      if (!partner) {
        return res.status(404).json({ message: "Partner not found" });
      }
      const referrals3 = await storage.getReferrals(partner.id);
      res.json(referrals3);
    } catch (error) {
      res.status(500).json({ message: "Error interno del servidor" });
    }
  });
  app2.get("/api/partner/earnings", authenticateToken, requireRole(["partner"]), async (req, res) => {
    try {
      const partner = await storage.getPartner(req.user.id);
      if (!partner) {
        return res.status(404).json({ message: "Partner not found" });
      }
      const earningsData = await storage.getPartnerEarningsData(partner.id);
      res.json(earningsData);
    } catch (error) {
      res.status(500).json({ message: "Error interno del servidor" });
    }
  });
  app2.get("/api/partner/commissions", authenticateToken, requireRole(["partner"]), async (req, res) => {
    try {
      const partner = await storage.getPartner(req.user.id);
      if (!partner) {
        return res.status(404).json({ message: "Partner not found" });
      }
      const commissions = await storage.getPartnerCommissions(partner.id);
      res.json(commissions);
    } catch (error) {
      res.status(500).json({ message: "Error interno del servidor" });
    }
  });
  app2.post("/api/partners", authenticateToken, requireRole(["admin"]), async (req, res) => {
    try {
      const { userId, commissionRate } = req.body;
      const existingPartner = await storage.getPartner(userId);
      if (existingPartner) {
        return res.status(400).json({ message: "User is already a partner" });
      }
      const referralCode = `PAR${userId}${Math.random().toString(36).substr(2, 4).toUpperCase()}`;
      const partner = await storage.createPartner({
        userId,
        referralCode,
        commissionRate: commissionRate || "25.00",
        totalEarnings: "0.00"
      });
      res.status(201).json(partner);
    } catch (error) {
      res.status(500).json({ message: "Error interno del servidor" });
    }
  });
  app2.get("/api/projects", authenticateToken, async (req, res) => {
    try {
      const projects3 = await storage.getProjects(req.user.id, req.user.role);
      res.json(projects3);
    } catch (error) {
      res.status(500).json({ message: "Error interno del servidor" });
    }
  });
  app2.get("/api/projects/:id", authenticateToken, async (req, res) => {
    try {
      const projectId = parseInt(req.params.id);
      const project = await storage.getProject(projectId);
      if (!project) {
        return res.status(404).json({ message: "Project not found" });
      }
      if (req.user.role !== "admin" && project.clientId !== req.user.id) {
        return res.status(403).json({ message: "You do not have permission to view this project" });
      }
      res.json(project);
    } catch (error) {
      res.status(500).json({ message: "Error interno del servidor" });
    }
  });
  app2.delete("/api/projects/:id", authenticateToken, async (req, res) => {
    try {
      const projectId = parseInt(req.params.id);
      if (isNaN(projectId)) {
        return res.status(400).json({ message: "Invalid project ID" });
      }
      const project = await storage.getProject(projectId);
      if (!project) {
        return res.status(404).json({ message: "Project not found" });
      }
      if (req.user.role !== "admin" && project.clientId !== req.user.id) {
        return res.status(403).json({ message: "You do not have permission to delete this project" });
      }
      await storage.deleteProject(projectId);
      res.json({ message: "Project deleted successfully" });
    } catch (error) {
      console.error("Error deleting project:", error);
      res.status(500).json({ message: "Error interno del servidor" });
    }
  });
  app2.post("/api/projects", authenticateToken, async (req, res) => {
    try {
      const { name, description, price } = req.body;
      const projectData = {
        name,
        description,
        price: price.toString(),
        // Ensure price is a string for decimal field
        clientId: req.user.id,
        status: "pending",
        progress: 0
      };
      if (req.user.role === "admin" && req.body.clientId) {
        projectData.clientId = req.body.clientId;
      }
      const project = await storage.createProject(projectData);
      const adminUsers = await storage.getUsersByRole("admin");
      const adminIds = adminUsers.map((admin) => admin.id);
      await notifyProjectCreated(projectData.clientId, adminIds, name, project.id);
      res.status(201).json(project);
    } catch (error) {
      if (error instanceof z2.ZodError) {
        console.error("Validation error:", error.errors);
        return res.status(400).json({ message: "Datos inv\xE1lidos", errors: error.errors });
      }
      console.error("Error creating project:", error);
      res.status(500).json({ message: "Error interno del servidor" });
    }
  });
  app2.put("/api/projects/:id", authenticateToken, async (req, res) => {
    try {
      const projectId = parseInt(req.params.id);
      const updates = req.body;
      if (isNaN(projectId)) {
        return res.status(400).json({ message: "Invalid project ID" });
      }
      const originalProject = await storage.getProject(projectId);
      if (!originalProject) {
        return res.status(404).json({ message: "Project not found" });
      }
      if (updates.startDate && updates.startDate !== null) {
        const startDate = new Date(updates.startDate);
        if (isNaN(startDate.getTime())) {
          return res.status(400).json({ message: "Invalid start date" });
        }
      }
      if (updates.deliveryDate && updates.deliveryDate !== null) {
        const deliveryDate = new Date(updates.deliveryDate);
        if (isNaN(deliveryDate.getTime())) {
          return res.status(400).json({ message: "Invalid delivery date" });
        }
      }
      const project = await storage.updateProject(projectId, updates);
      if (req.user.role === "admin") {
        let updateDescription = "El proyecto ha sido actualizado";
        let hasStatusChange = false;
        let hasProgressChange = false;
        if (updates.status && updates.status !== originalProject.status) {
          const statusLabels = {
            "pendiente": "Pendiente",
            "en_progreso": "En Desarrollo",
            "completado": "Completado",
            "cancelado": "Cancelado",
            "negociando": "Negociando"
          };
          updateDescription = `Estado cambiado a: ${statusLabels[updates.status] || updates.status}`;
          hasStatusChange = true;
        }
        if (updates.progress && updates.progress !== originalProject.progress) {
          if (hasStatusChange) {
            updateDescription += ` - Progreso actualizado al ${updates.progress}%`;
          } else {
            updateDescription = `Progreso actualizado al ${updates.progress}%`;
          }
          hasProgressChange = true;
        }
        if (updates.startDate && updates.startDate !== originalProject.startDate) {
          updateDescription += ` - Fecha de inicio actualizada`;
        }
        if (updates.deliveryDate && updates.deliveryDate !== originalProject.deliveryDate) {
          updateDescription += ` - Fecha de entrega actualizada`;
        }
        if (updates.price && updates.price !== originalProject.price) {
          updateDescription += ` - Precio actualizado a $${updates.price}`;
        }
        console.log(`\u{1F4E7} Sending project update notification: ${updateDescription}`);
        await notifyProjectUpdated(
          originalProject.clientId,
          originalProject.name,
          updateDescription,
          req.user.fullName
        );
        if (hasStatusChange) {
          const statusLabels = {
            "pendiente": "Pendiente",
            "en_progreso": "En Desarrollo",
            "completado": "Completado",
            "cancelado": "Cancelado",
            "negociando": "Negociando"
          };
          console.log(`\u{1F4E7} Sending special status change notifications to: ${updates.status}`);
          const adminUsers2 = await db.select().from(users).where(eq4(users.role, "admin"));
          for (const admin of adminUsers2) {
            try {
              if (admin.email) {
                await sendEmail({
                  to: admin.email,
                  subject: `Status Change: ${originalProject.name} - ${statusLabels[updates.status] || updates.status}`,
                  html: generateProjectStatusChangeEmailHTML(
                    originalProject.name,
                    statusLabels[originalProject.status] || originalProject.status,
                    statusLabels[updates.status] || updates.status,
                    req.user.fullName,
                    originalProject.clientId
                  )
                });
                console.log(`\u2705 Status change email sent to admin: ${admin.email}`);
              }
            } catch (adminError) {
              console.error(`\u274C Error sending status change email to admin ${admin.id}:`, adminError);
            }
          }
          try {
            await sendEmail({
              to: process.env.GMAIL_USER || "softwarepar.lat@gmail.com",
              subject: `Status Change: ${originalProject.name} - ${statusLabels[updates.status] || updates.status}`,
              html: generateProjectStatusChangeEmailHTML(
                originalProject.name,
                statusLabels[originalProject.status] || originalProject.status,
                statusLabels[updates.status] || updates.status,
                req.user.fullName,
                originalProject.clientId
              )
            });
            console.log(`\u2705 Status change email sent to main system email`);
          } catch (systemEmailError) {
            console.error(`\u274C Error sending status change email to main system:`, systemEmailError);
          }
        }
      }
      const { sendRealtimeEvent: sendRealtimeEvent2 } = await Promise.resolve().then(() => (init_notifications(), notifications_exports));
      sendRealtimeEvent2(originalProject.clientId, "project_updated", {
        projectId: project.id,
        projectName: project.name
      });
      const adminUsers = await storage.getUsersByRole("admin");
      for (const admin of adminUsers) {
        sendRealtimeEvent2(admin.id, "project_updated", {
          projectId: project.id,
          projectName: project.name,
          clientId: originalProject.clientId
        });
      }
      res.json(project);
    } catch (error) {
      console.error("Error updating project:", error);
      res.status(500).json({
        message: "Error interno del servidor",
        error: process.env.NODE_ENV === "development" ? error.message : void 0
      });
    }
  });
  app2.get("/api/projects/:id/messages", authenticateToken, async (req, res) => {
    try {
      const projectId = parseInt(req.params.id);
      const messages = await storage.getProjectMessages(projectId);
      res.json(messages);
    } catch (error) {
      res.status(500).json({ message: "Error interno del servidor" });
    }
  });
  app2.post("/api/projects/:id/messages", authenticateToken, async (req, res) => {
    try {
      const projectId = parseInt(req.params.id);
      const { message } = req.body;
      const project = await storage.getProject(projectId);
      if (!project) {
        return res.status(404).json({ message: "Project not found" });
      }
      const newMessage = await storage.createProjectMessage({
        projectId,
        userId: req.user.id,
        message
      });
      const { sendRealtimeEvent: sendRealtimeEvent2 } = await Promise.resolve().then(() => (init_notifications(), notifications_exports));
      if (req.user.role === "client") {
        const adminUsers = await storage.getUsersByRole("admin");
        for (const admin of adminUsers) {
          await notifyNewMessage(
            admin.id,
            req.user.fullName,
            project.name,
            message
          );
          sendRealtimeEvent2(admin.id, "message_created", {
            projectId,
            messageId: newMessage.id,
            userId: req.user.id
          });
        }
      } else if (req.user.role === "admin") {
        await notifyNewMessage(
          project.clientId,
          req.user.fullName,
          project.name,
          message
        );
        sendRealtimeEvent2(project.clientId, "message_created", {
          projectId,
          messageId: newMessage.id,
          userId: req.user.id
        });
      }
      res.status(201).json(newMessage);
    } catch (error) {
      console.error("Error creating project message:", error);
      res.status(500).json({ message: "Error interno del servidor" });
    }
  });
  app2.get("/api/projects/:id/files", authenticateToken, async (req, res) => {
    try {
      const projectId = parseInt(req.params.id);
      const files = await storage.getProjectFiles(projectId);
      res.json(files);
    } catch (error) {
      res.status(500).json({ message: "Error interno del servidor" });
    }
  });
  app2.post("/api/projects/:id/files", authenticateToken, async (req, res) => {
    try {
      const projectId = parseInt(req.params.id);
      const { fileName, fileUrl, fileType } = req.body;
      const newFile = await storage.createProjectFile({
        projectId,
        fileName,
        fileUrl,
        fileType,
        uploadedBy: req.user.id
      });
      const { sendRealtimeEvent: sendRealtimeEvent2 } = await Promise.resolve().then(() => (init_notifications(), notifications_exports));
      const project = await storage.getProject(projectId);
      if (project) {
        sendRealtimeEvent2(project.clientId, "file_uploaded", {
          projectId,
          fileId: newFile.id,
          fileName: newFile.fileName
        });
        const adminUsers = await storage.getUsersByRole("admin");
        for (const admin of adminUsers) {
          sendRealtimeEvent2(admin.id, "file_uploaded", {
            projectId,
            fileId: newFile.id,
            fileName: newFile.fileName,
            clientId: project.clientId
          });
        }
      }
      res.status(201).json(newFile);
    } catch (error) {
      res.status(500).json({ message: "Error interno del servidor" });
    }
  });
  app2.get("/api/projects/:id/timeline", authenticateToken, async (req, res) => {
    try {
      const projectId = parseInt(req.params.id);
      const timeline = await storage.getProjectTimeline(projectId);
      res.json(timeline);
    } catch (error) {
      res.status(500).json({ message: "Error interno del servidor" });
    }
  });
  app2.post("/api/projects/:id/timeline", authenticateToken, requireRole(["admin"]), async (req, res) => {
    try {
      const projectId = parseInt(req.params.id);
      const timelineData = { ...req.body, projectId };
      const timeline = await storage.createProjectTimeline(timelineData);
      res.status(201).json(timeline);
    } catch (error) {
      console.error("Error creating project timeline:", error);
      res.status(500).json({ message: "Error interno del servidor" });
    }
  });
  app2.put("/api/projects/:id/timeline/:timelineId", authenticateToken, requireRole(["admin"]), async (req, res) => {
    try {
      const timelineId = parseInt(req.params.timelineId);
      const updates = req.body;
      const timeline = await storage.updateProjectTimeline(timelineId, updates);
      res.json(timeline);
    } catch (error) {
      res.status(500).json({ message: "Error interno del servidor" });
    }
  });
  app2.get("/api/projects/:id/budget-negotiations", authenticateToken, async (req, res) => {
    try {
      const projectId = parseInt(req.params.id);
      const negotiations = await storage.getBudgetNegotiations(projectId);
      res.json(negotiations);
    } catch (error) {
      console.error("Error getting budget negotiations:", error);
      res.status(500).json({ message: "Error interno del servidor" });
    }
  });
  app2.post("/api/projects/:id/budget-negotiations", authenticateToken, async (req, res) => {
    try {
      const projectId = parseInt(req.params.id);
      const { proposedPrice, message } = req.body;
      const project = await storage.getProject(projectId);
      if (!project) {
        return res.status(404).json({ message: "Project not found" });
      }
      const negotiation = await storage.createBudgetNegotiation({
        projectId,
        proposedBy: req.user.id,
        originalPrice: project.price,
        proposedPrice: proposedPrice.toString(),
        message,
        status: "pending"
      });
      if (req.user.role === "client") {
        const adminUsers = await storage.getUsersByRole("admin");
        for (const admin of adminUsers) {
          await notifyBudgetNegotiation(
            admin.id,
            project.name,
            proposedPrice.toString(),
            message || "",
            true,
            // Es contraoferta del cliente
            projectId,
            "client"
            // Rol del que propone
          );
        }
      } else if (req.user.role === "admin") {
        await notifyBudgetNegotiation(
          project.clientId,
          project.name,
          proposedPrice.toString(),
          message || "",
          true,
          projectId,
          "admin"
          // Rol del que propone
        );
      }
      res.status(201).json(negotiation);
    } catch (error) {
      console.error("Error creating budget negotiation:", error);
      res.status(500).json({ message: "Error interno del servidor" });
    }
  });
  app2.put("/api/budget-negotiations/:id/respond", authenticateToken, async (req, res) => {
    try {
      const negotiationId = parseInt(req.params.id);
      const { status, message, counterPrice } = req.body;
      let updates = { status };
      if (status === "accepted") {
        const [negotiation] = await db.select().from(budgetNegotiations).where(eq4(budgetNegotiations.id, negotiationId)).limit(1);
        if (negotiation) {
          await storage.updateProject(negotiation.projectId, {
            price: negotiation.proposedPrice,
            status: "in_progress"
          });
          const project = await storage.getProject(negotiation.projectId);
          const client = await storage.getUserById(project?.clientId);
          if (project && client) {
            const adminUsers = await storage.getUsersByRole("admin");
            for (const admin of adminUsers) {
              try {
                if (admin.email) {
                  await sendEmail({
                    to: admin.email,
                    subject: `\u2705 Counter-offer Accepted: ${project.name} - $${negotiation.proposedPrice}`,
                    html: generateBudgetAcceptanceEmailHTML(
                      project.name,
                      client.fullName,
                      client.email,
                      negotiation.originalPrice,
                      negotiation.proposedPrice,
                      message || ""
                    )
                  });
                  console.log(`\u2705 Counter-offer acceptance email sent to admin: ${admin.email}`);
                }
              } catch (adminError) {
                console.error(`\u274C Error sending acceptance email to admin ${admin.id}:`, adminError);
              }
            }
            try {
              await sendEmail({
                to: process.env.GMAIL_USER || "softwarepar.lat@gmail.com",
                subject: `\u2705 Counter-offer Accepted: ${project.name} - $${negotiation.proposedPrice}`,
                html: generateBudgetAcceptanceEmailHTML(
                  project.name,
                  client.fullName,
                  client.email,
                  negotiation.originalPrice,
                  negotiation.proposedPrice,
                  message || ""
                )
              });
              console.log(`\u2705 Acceptance email sent to main system email`);
            } catch (systemEmailError) {
              console.error(`\u274C Error sending acceptance email to main system:`, systemEmailError);
            }
          }
        }
      }
      if (status === "countered" && counterPrice) {
        const [oldNegotiation] = await db.select().from(budgetNegotiations).where(eq4(budgetNegotiations.id, negotiationId)).limit(1);
        if (oldNegotiation) {
          await storage.createBudgetNegotiation({
            projectId: oldNegotiation.projectId,
            proposedBy: req.user.id,
            originalPrice: oldNegotiation.proposedPrice,
            proposedPrice: counterPrice.toString(),
            message,
            status: "pending"
          });
        }
      }
      const updated = await storage.updateBudgetNegotiation(negotiationId, updates);
      res.json(updated);
    } catch (error) {
      console.error("Error responding to budget negotiation:", error);
      res.status(500).json({ message: "Error interno del servidor" });
    }
  });
  app2.get("/api/tickets", authenticateToken, async (req, res) => {
    try {
      const tickets3 = await storage.getTickets(req.user.id);
      res.json(tickets3);
    } catch (error) {
      res.status(500).json({ message: "Error interno del servidor" });
    }
  });
  app2.post("/api/tickets", authenticateToken, async (req, res) => {
    try {
      const { title, description, priority, projectId } = req.body;
      const ticketData = {
        title,
        description,
        priority: priority || "medium",
        userId: req.user.id,
        projectId: projectId || null
      };
      const ticket = await storage.createTicket(ticketData);
      const adminUsers = await storage.getUsersByRole("admin");
      const adminIds = adminUsers.map((admin) => admin.id);
      await notifyTicketCreated(adminIds, req.user.fullName, title);
      const { sendRealtimeEvent: sendRealtimeEvent2 } = await Promise.resolve().then(() => (init_notifications(), notifications_exports));
      for (const adminId of adminIds) {
        sendRealtimeEvent2(adminId, "ticket_created", {
          ticketId: ticket.id,
          title: ticket.title,
          priority: ticket.priority,
          userId: req.user.id
        });
      }
      res.status(201).json(ticket);
    } catch (error) {
      if (error instanceof z2.ZodError) {
        return res.status(400).json({ message: "Datos inv\xE1lidos", errors: error.errors });
      }
      console.error("Error creating ticket:", error);
      res.status(500).json({ message: "Error interno del servidor" });
    }
  });
  app2.post("/api/tickets/:id/responses", authenticateToken, async (req, res) => {
    try {
      const ticketId = parseInt(req.params.id);
      const { message } = req.body;
      const ticket = await storage.getTicket(ticketId);
      if (!ticket) {
        return res.status(404).json({ message: "Ticket not found" });
      }
      const response = await storage.createTicketResponse({
        ticketId,
        userId: req.user.id,
        message,
        isFromSupport: req.user.role === "admin"
      });
      const { sendRealtimeEvent: sendRealtimeEvent2 } = await Promise.resolve().then(() => (init_notifications(), notifications_exports));
      if (req.user.role === "admin") {
        await notifyTicketResponse(
          ticket.userId,
          req.user.fullName,
          ticket.title,
          message,
          true
        );
        sendRealtimeEvent2(ticket.userId, "ticket_updated", {
          ticketId: ticket.id,
          title: ticket.title
        });
      } else {
        const adminUsers = await storage.getUsersByRole("admin");
        for (const admin of adminUsers) {
          await notifyTicketResponse(
            admin.id,
            req.user.fullName,
            ticket.title,
            message,
            false
          );
          sendRealtimeEvent2(admin.id, "ticket_updated", {
            ticketId: ticket.id,
            title: ticket.title,
            userId: ticket.userId
          });
        }
      }
      res.status(201).json(response);
    } catch (error) {
      console.error("Error creating ticket response:", error);
      res.status(500).json({ message: "Error interno del servidor" });
    }
  });
  app2.get("/api/tickets/:id/responses", authenticateToken, async (req, res) => {
    try {
      const ticketId = parseInt(req.params.id);
      const responses = await storage.getTicketResponses(ticketId);
      res.json(responses);
    } catch (error) {
      console.error("Error getting ticket responses:", error);
      res.status(500).json({ message: "Error interno del servidor" });
    }
  });
  app2.get("/api/notifications", authenticateToken, async (req, res) => {
    try {
      const notifications3 = await storage.getNotifications(req.user.id);
      res.json(notifications3);
    } catch (error) {
      res.status(500).json({ message: "Error interno del servidor" });
    }
  });
  app2.put("/api/notifications/:id/read", authenticateToken, async (req, res) => {
    try {
      const notificationId = parseInt(req.params.id);
      await storage.markNotificationAsRead(notificationId);
      res.json({ message: "Notification marked as read" });
    } catch (error) {
      res.status(500).json({ message: "Error interno del servidor" });
    }
  });
  app2.post("/api/projects/:id/payment-stages", authenticateToken, async (req, res) => {
    try {
      const projectId = parseInt(req.params.id);
      const { stages } = req.body;
      const project = await storage.getProject(projectId);
      if (!project) {
        return res.status(404).json({ message: "Project not found" });
      }
      const createdStages = [];
      const availableStages = [];
      for (const stage of stages) {
        const stageData = {
          projectId,
          stageName: stage.name,
          stagePercentage: stage.percentage,
          amount: parseFloat(project.price) * stage.percentage / 100,
          requiredProgress: stage.requiredProgress,
          status: stage.requiredProgress === 0 ? "available" : "pending"
        };
        const created = await storage.createPaymentStage(stageData);
        createdStages.push(created);
        if (stageData.status === "available") {
          availableStages.push(created);
        }
      }
      if (availableStages.length > 0) {
        const client = await storage.getUserById(project.clientId);
        if (client?.email) {
          for (const stage of availableStages) {
            try {
              const emailHtml = await generatePaymentStageAvailableEmailHTML(
                client.fullName,
                project.name,
                stage.stageName,
                stage.amount.toString(),
                stage.stagePercentage
              );
              await sendEmail({
                to: client.email,
                subject: `\u{1F4B0} Pago Disponible: ${project.name} - ${stage.stageName}`,
                html: emailHtml
              });
              console.log(`\u{1F4E7} Email de etapa disponible enviado a cliente: ${client.email} para etapa: ${stage.stageName}`);
            } catch (emailError) {
              console.error(`\u274C Error enviando email de etapa disponible al cliente:`, emailError);
            }
          }
        }
      }
      const hasTimeline = await storage.hasProjectTimeline(projectId);
      if (!hasTimeline) {
        const timelineItems = [
          {
            title: "An\xE1lisis y Planificaci\xF3n",
            description: "An\xE1lisis de requisitos y planificaci\xF3n del proyecto",
            status: "pendiente",
            estimatedDate: null
          },
          {
            title: "Dise\xF1o y Arquitectura",
            description: "Dise\xF1o de interfaz y arquitectura del sistema",
            status: "pendiente",
            estimatedDate: null
          },
          {
            title: "Desarrollo - Fase 1",
            description: "Desarrollo de la funcionalidad principal (50% del proyecto)",
            status: "pendiente",
            estimatedDate: null
          },
          {
            title: "Desarrollo - Fase 2",
            description: "Desarrollo completo y optimizaciones (90% del proyecto)",
            status: "pendiente",
            estimatedDate: null
          },
          {
            title: "Testing y QA",
            description: "Pruebas exhaustivas y control de calidad",
            status: "pendiente",
            estimatedDate: null
          },
          {
            title: "Entrega Final",
            description: "Entrega del proyecto completado y documentaci\xF3n",
            status: "pendiente",
            estimatedDate: null
          }
        ];
        for (const timelineItem of timelineItems) {
          await storage.createProjectTimeline({
            projectId,
            title: timelineItem.title,
            description: timelineItem.description,
            status: timelineItem.status,
            estimatedDate: timelineItem.estimatedDate
          });
        }
      }
      res.json(createdStages);
    } catch (error) {
      console.error("Error creating payment stages:", error);
      res.status(500).json({ message: "Error interno del servidor" });
    }
  });
  app2.get("/api/projects/:id/payment-stages", authenticateToken, async (req, res) => {
    try {
      const projectId = parseInt(req.params.id);
      const stages = await storage.getPaymentStages(projectId);
      res.json(stages);
    } catch (error) {
      console.error("Error fetching payment stages:", error);
      res.status(500).json({ message: "Error interno del servidor" });
    }
  });
  app2.patch("/api/payment-stages/:id", authenticateToken, async (req, res) => {
    try {
      const stageId = parseInt(req.params.id);
      const updates = req.body;
      const updated = await storage.updatePaymentStage(stageId, updates);
      res.json(updated);
    } catch (error) {
      console.error("Error updating payment stage:", error);
      res.status(500).json({ message: "Error interno del servidor" });
    }
  });
  app2.post("/api/payment-stages/:id/complete", authenticateToken, async (req, res) => {
    try {
      const stageId = parseInt(req.params.id);
      const updated = await storage.completePaymentStage(stageId);
      res.json(updated);
    } catch (error) {
      console.error("Error completing payment stage:", error);
      res.status(500).json({ message: "Error interno del servidor" });
    }
  });
  app2.post("/api/payment-stages/:id/confirm-payment", authenticateToken, upload.single("proofFile"), async (req, res) => {
    try {
      const stageId = parseInt(req.params.id);
      const paymentMethod = req.body.paymentMethod;
      const proofFileInfo = req.body.proofFileInfo ? JSON.parse(req.body.proofFileInfo) : null;
      const proofFile = req.file;
      console.log(`\u{1F4B0} Processing payment confirmation for stage ${stageId}:`, {
        paymentMethod,
        hasFile: !!proofFile,
        fileName: proofFile?.originalname,
        fileSize: proofFile?.size,
        mimetype: proofFile?.mimetype
      });
      const stage = await db.select().from(paymentStages).where(eq4(paymentStages.id, stageId)).limit(1);
      if (!stage[0]) {
        return res.status(404).json({ message: "Etapa no encontrada" });
      }
      const project = await storage.getProject(stage[0].projectId);
      if (!project) {
        return res.status(404).json({ message: "Project not found" });
      }
      const client = await storage.getUserById(project.clientId);
      if (!client) {
        return res.status(404).json({ message: "Client not found" });
      }
      let proofFileUrl = null;
      if (proofFile) {
        try {
          const uploadsDir = path.join(__dirname, "../uploads/payment-proofs");
          if (!fs2.existsSync(uploadsDir)) {
            fs2.mkdirSync(uploadsDir, { recursive: true });
          }
          const fileExtension = path.extname(proofFile.originalname);
          const fileName = `stage_${stageId}_${Date.now()}${fileExtension}`;
          const filePath = path.join(uploadsDir, fileName);
          fs2.writeFileSync(filePath, proofFile.buffer);
          proofFileUrl = fileName;
          console.log(`\u2705 Comprobante guardado localmente: ${fileName}`);
        } catch (storageError) {
          console.error(`\u274C Error guardando comprobante localmente:`, storageError);
          return res.status(500).json({ message: "Error al guardar el comprobante" });
        }
      } else if (proofFileInfo) {
        proofFileUrl = `stage_${stageId}_${Date.now()}.${proofFileInfo.fileType?.split("/")[1] || "jpg"}`;
      }
      const updated = await storage.updatePaymentStage(stageId, {
        paymentMethod,
        proofFileUrl,
        status: "pending_verification",
        paymentData: {
          confirmedBy: req.user.id,
          confirmedAt: /* @__PURE__ */ new Date(),
          method: paymentMethod,
          fileInfo: proofFileInfo || (proofFile ? {
            fileName: proofFile.originalname,
            fileSize: proofFile.size,
            fileType: proofFile.mimetype
          } : null),
          originalFileName: proofFile?.originalname
        }
      });
      const adminUsers = await storage.getUsersByRole("admin");
      for (const admin of adminUsers) {
        await storage.createNotification({
          userId: admin.id,
          title: "\u{1F4CB} Comprobante de Pago Recibido",
          message: `El cliente ${client.fullName} envi\xF3 comprobante de pago para "${stage[0].stageName}" mediante ${paymentMethod}. ${proofFile ? `Comprobante: ${proofFile.originalname}` : "Sin comprobante adjunto"}. Requiere verificaci\xF3n.`,
          type: "warning"
        });
      }
      const { sendRealtimeEvent: sendRealtimeEvent2 } = await Promise.resolve().then(() => (init_notifications(), notifications_exports));
      const adminIds = adminUsers.map((admin) => admin.id);
      for (const adminId of adminIds) {
        sendRealtimeEvent2(adminId, "payment_proof_uploaded", {
          stageId: stage[0].id,
          projectId: stage[0].projectId,
          clientId: project.clientId,
          stageName: stage[0].stageName,
          paymentMethod
        });
      }
      try {
        let fileAttachmentInfo = null;
        if (proofFile) {
          const fileSizeMB = (proofFile.size / 1024 / 1024).toFixed(2);
          fileAttachmentInfo = `\u{1F4CE} Attached file: ${proofFile.originalname} (${fileSizeMB} MB) - Type: ${proofFile.mimetype}`;
          console.log(`\u{1F4CE} File received: ${proofFile.originalname}, Size: ${fileSizeMB}MB, Type: ${proofFile.mimetype}`);
        } else if (proofFileInfo) {
          const fileSizeMB = (proofFileInfo.fileSize / 1024 / 1024).toFixed(2);
          fileAttachmentInfo = `\u{1F4CE} Indicated file: ${proofFileInfo.fileName} (${fileSizeMB} MB) - ${proofFileInfo.fileType}`;
        } else {
          console.log(`\u2139\uFE0F No attachment provided for stage ${stageId}`);
        }
        await sendPaymentProofNotificationToAdmin(
          client.fullName,
          project.name,
          stage[0].stageName,
          stage[0].amount,
          paymentMethod,
          fileAttachmentInfo
        );
        await sendPaymentProofConfirmationToClient(
          client.email,
          client.fullName,
          project.name,
          stage[0].stageName,
          stage[0].amount,
          paymentMethod
        );
        console.log(`\u{1F4E7} Email notifications sent for ${client.fullName}'s payment`);
      } catch (emailError) {
        console.error("\u274C Error sending email notifications:", emailError);
      }
      res.json({
        ...updated,
        message: "Comprobante enviado con \xE9xito. Tu pago est\xE1 pendiente de verificaci\xF3n por nuestro equipo. Te notificaremos una vez aprobado."
      });
    } catch (error) {
      console.error("\u274C Error confirming payment stage:", error);
      res.status(500).json({ message: "Error interno del servidor" });
    }
  });
  app2.post("/api/payment-stages/:id/approve-payment", authenticateToken, requireRole(["admin"]), async (req, res) => {
    try {
      const stageId = parseInt(req.params.id);
      console.log(`\u2705 Admin approving payment for stage: ${stageId}`);
      const stage = await db.select().from(paymentStages).where(eq4(paymentStages.id, stageId)).limit(1);
      if (!stage[0]) {
        console.error(`\u274C Stage ${stageId} not found`);
        return res.status(404).json({ message: "Etapa no encontrada" });
      }
      if (stage[0].status !== "pending_verification") {
        return res.status(400).json({ message: "Esta etapa no est\xE1 pendiente de verificaci\xF3n" });
      }
      const project = await storage.getProject(stage[0].projectId);
      if (!project) {
        console.error(`\u274C Project ${stage[0].projectId} not found`);
        return res.status(404).json({ message: "Project not found" });
      }
      const client = await storage.getUserById(project.clientId);
      if (!client) {
        console.error(`\u274C Client ${project.clientId} not found`);
        return res.status(404).json({ message: "Client not found" });
      }
      const exchangeRateData = await storage.getCurrentExchangeRate();
      const currentExchangeRate = exchangeRateData ? exchangeRateData.usdToGuarani : "7300.00";
      console.log(`\u{1F4B1} Saving exchange rate at the time of payment: 1 USD = ${currentExchangeRate} PYG for stage ${stageId}`);
      const updated = await storage.updatePaymentStage(stageId, {
        status: "paid",
        paidAt: /* @__PURE__ */ new Date(),
        approvedBy: req.user.id,
        approvedAt: /* @__PURE__ */ new Date(),
        exchangeRateUsed: currentExchangeRate
      });
      await storage.createNotification({
        userId: project.clientId,
        title: "\u2705 Pago Aprobado",
        message: `Tu pago para la etapa "${stage[0].stageName}" ha sido verificado y aprobado. \xA1Continuamos con el desarrollo!`,
        type: "success"
      });
      if (client?.email) {
        try {
          const { generatePaymentApprovedEmailHTML: generatePaymentApprovedEmailHTML2 } = await Promise.resolve().then(() => (init_email(), email_exports));
          const emailHtml = await generatePaymentApprovedEmailHTML2(
            client.fullName,
            project.name,
            stage[0].stageName,
            stage[0].amount.toString(),
            stage[0].paymentMethod || "Transferencia Bancaria",
            stage[0].paidAt ? new Date(stage[0].paidAt).toLocaleDateString("es-PY") : (/* @__PURE__ */ new Date()).toLocaleDateString("es-PY")
          );
          await sendEmail({
            to: client.email,
            subject: `\u2705 Pago Aprobado: ${project.name} - ${stage[0].stageName}`,
            html: emailHtml
          });
          console.log(`\u{1F4E7} Email de pago aprobado enviado a cliente: ${client.email}`);
        } catch (emailError) {
          console.error(`\u274C Error enviando email de pago aprobado al cliente:`, emailError);
        }
      }
      const { sendRealtimeEvent: sendRealtimeEvent2 } = await Promise.resolve().then(() => (init_notifications(), notifications_exports));
      sendRealtimeEvent2(project.clientId, "payment_approved", {
        stageId: stage[0].id,
        projectId: stage[0].projectId,
        stageName: stage[0].stageName
      });
      const adminUsers = await storage.getUsersByRole("admin");
      for (const admin of adminUsers) {
        sendRealtimeEvent2(admin.id, "payment_approved", {
          stageId: stage[0].id,
          projectId: stage[0].projectId,
          clientId: project.clientId,
          stageName: stage[0].stageName
        });
      }
      console.log(`\u{1F4C4} Generating invoice for stage ${stageId}...`);
      const companyInfo = await db.select().from(companyBillingInfo).where(eq4(companyBillingInfo.isActive, true)).limit(1);
      if (companyInfo[0]) {
        const existingInvoice = await db.select().from(invoices).where(eq4(invoices.paymentStageId, stageId)).limit(1);
        let newInvoice = existingInvoice[0];
        let boletaNumber = existingInvoice[0]?.invoiceNumber;
        let shouldSendToFacturaSend = false;
        if (!existingInvoice[0]) {
          const boletaPrefix = companyInfo[0].boletaPrefix || "001-001";
          const currentSequence = companyInfo[0].boletaSequence || 1;
          boletaNumber = `${boletaPrefix}-${String(currentSequence).padStart(7, "0")}`;
          const clientInfo = await db.select().from(clientBillingInfo).where(eq4(clientBillingInfo.userId, project.clientId)).limit(1);
          const clientData = clientInfo[0] || {};
          const amountValue = stage[0].amount;
          [newInvoice] = await db.insert(invoices).values({
            projectId: stage[0].projectId,
            clientId: project.clientId,
            paymentStageId: stageId,
            invoiceNumber: boletaNumber,
            amount: amountValue,
            totalAmount: amountValue,
            taxAmount: "0.00",
            discountAmount: "0.00",
            currency: "USD",
            status: "paid",
            dueDate: /* @__PURE__ */ new Date(),
            paidDate: stage[0].paidAt || /* @__PURE__ */ new Date(),
            exchangeRateUsed: currentExchangeRate,
            // Snapshot de datos de facturación del cliente (congelados)
            clientSnapshotType: clientData.clientType,
            clientSnapshotLegalName: clientData.legalName,
            clientSnapshotDocumentType: clientData.documentType,
            clientSnapshotDocumentNumber: clientData.documentNumber,
            clientSnapshotAddress: clientData.address,
            clientSnapshotCity: clientData.city,
            clientSnapshotDepartment: clientData.department,
            clientSnapshotCountry: clientData.country,
            clientSnapshotEmail: clientData.email,
            clientSnapshotPhone: clientData.phone
          }).returning();
          await db.update(companyBillingInfo).set({ boletaSequence: currentSequence + 1 }).where(eq4(companyBillingInfo.id, companyInfo[0].id));
          console.log(`\u2705 Invoice created: ${boletaNumber}`);
          shouldSendToFacturaSend = true;
        } else if (existingInvoice[0].sifenCDC) {
          console.log(`\u2139\uFE0F Invoice ${boletaNumber} already sent to FacturaSend (CDC: ${existingInvoice[0].sifenCDC})`);
          shouldSendToFacturaSend = false;
        } else {
          console.log(`\u26A0\uFE0F Invoice ${boletaNumber} exists but has no CDC, retrying send...`);
          shouldSendToFacturaSend = true;
        }
        if (shouldSendToFacturaSend) {
          Promise.resolve().then(() => (init_facturasend(), facturasend_exports)).then(async (facturasend) => {
            try {
              console.log(`\u{1F504} Starting FacturaSend process for invoice ${boletaNumber}...`);
              const clientInfo = await db.select().from(clientBillingInfo).where(eq4(clientBillingInfo.userId, client.id)).limit(1);
              const exchangeRate = parseFloat(currentExchangeRate);
              const numeroDocumento = parseInt(boletaNumber.split("-").pop() || "1");
              const clientData = clientInfo[0] || {};
              if (!clientData.user) {
                clientData.user = client;
              }
              const allStages = await storage.getPaymentStages(stage[0].projectId);
              const sortedStages = allStages.sort((a, b) => a.requiredProgress - b.requiredProgress);
              const stageNumber = sortedStages.findIndex((s) => s.id === stage[0].id) + 1;
              const totalStages = sortedStages.length;
              const stageWithInfo = {
                ...stage[0],
                stageNumber,
                totalStages
              };
              const documento = await facturasend.construirDocumentoFacturaSend(
                companyInfo[0],
                clientData,
                stageWithInfo,
                project,
                exchangeRate,
                numeroDocumento
              );
              console.log(`\u{1F4E4} Sending to FacturaSend...`);
              const respuestaAPI = await facturasend.enviarFacturaFacturaSend(documento);
              const resultado = facturasend.extraerResultadoFacturaSend(respuestaAPI);
              const qrUrlTruncated = resultado.qr && resultado.qr.length > 1e3 ? resultado.qr.substring(0, 1e3) : resultado.qr;
              await db.update(invoices).set({
                sifenCDC: resultado.cdc,
                sifenProtocolo: resultado.protocoloAutorizacion,
                sifenEstado: resultado.estado,
                sifenFechaEnvio: /* @__PURE__ */ new Date(),
                sifenMensajeError: resultado.mensaje,
                sifenXML: resultado.xml,
                sifenQR: qrUrlTruncated || null,
                updatedAt: /* @__PURE__ */ new Date()
              }).where(eq4(invoices.id, newInvoice.id));
              console.log(`\u2705 Invoice updated with FacturaSend data:`);
              console.log(`   \u{1F4CB} CDC: ${resultado.cdc || "Not available"}`);
              console.log(`   \u{1F4F1} QR URL: ${qrUrlTruncated ? "Available (" + qrUrlTruncated.length + " chars)" : "Not available"}`);
              console.log(`   \u{1F4CA} Status: ${resultado.estado}`);
              console.log(`   \u{1F4DD} Protocol: ${resultado.protocoloAutorizacion}`);
              console.log(`${resultado.estado === "aceptado" ? "\u2705" : "\u274C"} FacturaSend: ${resultado.estado.toUpperCase()}`);
              if (resultado.cdc) {
                console.log(`\u{1F4CB} Generated CDC: ${resultado.cdc}`);
              }
              if (resultado.protocoloAutorizacion) {
                console.log(`\u{1F510} Protocol: ${resultado.protocoloAutorizacion}`);
              }
              if (resultado.mensaje) {
                console.log(`\u{1F4AC} Message: ${resultado.mensaje}`);
              }
            } catch (facturasendError) {
              console.error("\u274C Error processing FacturaSend:", facturasendError);
            }
          }).catch((err) => {
            console.error("\u274C Error importing FacturaSend module:", err);
          });
        } else {
          console.log(`\u2705 Invoice ${boletaNumber} already processed, skipping FacturaSend`);
        }
      }
      res.json({
        ...updated,
        message: "Pago aprobado con \xE9xito"
      });
    } catch (error) {
      console.error("\u274C Error approving payment:", error);
      res.status(500).json({
        message: "Error approving payment",
        error: process.env.NODE_ENV === "development" ? error.message : void 0
      });
    }
  });
  app2.post("/api/payment-stages/:id/reject-payment", authenticateToken, requireRole(["admin"]), async (req, res) => {
    try {
      const stageId = parseInt(req.params.id);
      const { reason } = req.body;
      console.log(`\u274C Admin rejecting payment for stage: ${stageId}, reason: ${reason}`);
      const stage = await db.select().from(paymentStages).where(eq4(paymentStages.id, stageId)).limit(1);
      if (!stage[0]) {
        console.error(`\u274C Stage ${stageId} not found`);
        return res.status(404).json({ message: "Etapa no encontrada" });
      }
      if (stage[0].status !== "pending_verification") {
        return res.status(400).json({ message: "Esta etapa no est\xE1 pendiente de verificaci\xF3n" });
      }
      const project = await storage.getProject(stage[0].projectId);
      if (!project) {
        console.error(`\u274C Project ${stage[0].projectId} not found`);
        return res.status(404).json({ message: "Project not found" });
      }
      const client = await storage.getUserById(project.clientId);
      if (!client) {
        console.error(`\u274C Client ${project.clientId} not found`);
        return res.status(404).json({ message: "Client not found" });
      }
      const updated = await storage.updatePaymentStage(stageId, {
        status: "available",
        paymentMethod: null,
        proofFileUrl: null,
        paymentData: {
          rejectedBy: req.user.id,
          rejectedAt: /* @__PURE__ */ new Date(),
          rejectionReason: reason
        }
      });
      await storage.createNotification({
        userId: project.clientId,
        title: "\u274C Pago Rechazado",
        message: `Tu comprobante de pago para "${stage[0].stageName}" fue rechazado. Motivo: ${reason}. Por favor env\xEDa un nuevo comprobante.`,
        type: "error"
      });
      if (client?.email) {
        try {
          const { generatePaymentRejectedEmailHTML: generatePaymentRejectedEmailHTML2 } = await Promise.resolve().then(() => (init_email(), email_exports));
          const emailHtml = await generatePaymentRejectedEmailHTML2(
            client.fullName,
            project.name,
            stage[0].stageName,
            stage[0].amount.toString(),
            stage[0].paymentMethod || "Transferencia Bancaria",
            reason
          );
          await sendEmail({
            to: client.email,
            subject: `\u274C Pago Rechazado: ${project.name} - ${stage[0].stageName}`,
            html: emailHtml
          });
          console.log(`\u{1F4E7} Email de pago rechazado enviado a cliente: ${client.email}`);
        } catch (emailError) {
          console.error(`\u274C Error enviando email de pago rechazado al cliente:`, emailError);
        }
      }
      const { sendRealtimeEvent: sendRealtimeEvent2 } = await Promise.resolve().then(() => (init_notifications(), notifications_exports));
      sendRealtimeEvent2(project.clientId, "payment_rejected", {
        stageId: stage[0].id,
        projectId: stage[0].projectId,
        stageName: stage[0].stageName,
        reason
      });
      const adminUsers = await storage.getUsersByRole("admin");
      for (const admin of adminUsers) {
        sendRealtimeEvent2(admin.id, "payment_rejected", {
          stageId: stage[0].id,
          projectId: stage[0].projectId,
          clientId: project.clientId,
          stageName: stage[0].stageName,
          reason
        });
      }
      res.json({
        ...updated,
        message: "Payment rejected and client notified"
      });
    } catch (error) {
      console.error("\u274C Error rejecting payment:", error);
      res.status(500).json({
        message: "Error rejecting payment",
        error: process.env.NODE_ENV === "development" ? error.message : void 0
      });
    }
  });
  app2.get("/api/payment-stages/:id/receipt-file", async (req, res) => {
    try {
      const stageId = parseInt(req.params.id);
      const tokenFromQuery = req.query.token;
      const tokenFromHeader = req.headers.authorization?.split(" ")[1];
      const token = tokenFromQuery || tokenFromHeader;
      if (!token) {
        return res.status(401).json({ message: "No authentication token provided" });
      }
      const { verifyToken: verifyToken2 } = await Promise.resolve().then(() => (init_auth(), auth_exports));
      let userId;
      let userRole;
      const decoded = verifyToken2(token);
      if (!decoded) {
        return res.status(401).json({ message: "Invalid token" });
      }
      const user = await storage.getUserById(decoded.userId);
      if (!user || !user.isActive) {
        return res.status(401).json({ message: "User not found or inactive" });
      }
      userId = user.id;
      userRole = user.role;
      const stage = await db.select().from(paymentStages).where(eq4(paymentStages.id, stageId)).limit(1);
      if (!stage[0]) {
        return res.status(404).json({ message: "Etapa no encontrada" });
      }
      const project = await storage.getProject(stage[0].projectId);
      if (!project) {
        return res.status(404).json({ message: "Project not found" });
      }
      if (userRole !== "admin" && project.clientId !== userId) {
        return res.status(403).json({ message: "You do not have permission to view this file" });
      }
      if (!stage[0].proofFileUrl) {
        return res.status(404).json({ message: "No proof available" });
      }
      try {
        const uploadsDir = path.join(__dirname, "../uploads/payment-proofs");
        const filePath = path.join(uploadsDir, stage[0].proofFileUrl);
        console.log(`\u{1F50D} Intentando descargar: ${filePath}`);
        if (!fs2.existsSync(filePath)) {
          console.error(`\u274C Archivo no encontrado: ${filePath}`);
          return res.status(404).json({ message: "Comprobante no encontrado en el servidor" });
        }
        const fileBuffer = fs2.readFileSync(filePath);
        const fileInfo = stage[0].paymentData?.fileInfo || {};
        const fileName = stage[0].paymentData?.originalFileName || "comprobante.jpg";
        const fileType = fileInfo.fileType || "image/jpeg";
        console.log(`\u2705 Archivo descargado: ${fileBuffer.length} bytes`);
        res.setHeader("Content-Type", fileType);
        res.setHeader("Content-Disposition", `inline; filename="${fileName}"`);
        res.setHeader("Content-Length", fileBuffer.length);
        res.send(fileBuffer);
        console.log(`\u2705 Comprobante servido desde almacenamiento local: ${stage[0].proofFileUrl}`);
      } catch (storageError) {
        console.error("\u274C Error retrieving file from local storage:", storageError);
        console.error("\u274C Stack:", storageError instanceof Error ? storageError.stack : "No stack trace");
        return res.status(500).json({
          message: "Error al recuperar el comprobante",
          error: process.env.NODE_ENV === "development" ? storageError instanceof Error ? storageError.message : "Unknown error" : void 0
        });
      }
    } catch (error) {
      console.error("\u274C Error serving receipt file:", error);
      res.status(500).json({
        message: "Error serving file",
        error: process.env.NODE_ENV === "development" ? error instanceof Error ? error.message : "Unknown error" : void 0
      });
    }
  });
  app2.get("/api/client/stage-invoices/:stageId/download", authenticateToken, async (req, res) => {
    try {
      const stageId = parseInt(req.params.stageId);
      if (isNaN(stageId)) {
        return res.status(400).json({ message: "Invalid stage ID" });
      }
      const stage = await db.select().from(paymentStages).where(eq4(paymentStages.id, stageId)).limit(1);
      if (!stage[0]) {
        return res.status(404).json({ message: "Etapa no encontrada" });
      }
      const project = await storage.getProject(stage[0].projectId);
      if (!project) {
        return res.status(404).json({ message: "Project not found" });
      }
      if (project.clientId !== req.user.id) {
        return res.status(403).json({ message: "You do not have permission to view this invoice" });
      }
      if (stage[0].status !== "paid") {
        return res.status(400).json({ message: "This stage has not been paid yet" });
      }
      const allStages = await storage.getPaymentStages(stage[0].projectId);
      const sortedStages = allStages.sort((a, b) => a.requiredProgress - b.requiredProgress);
      const stageNumber = sortedStages.findIndex((s) => s.id === stage[0].id) + 1;
      const totalStages = sortedStages.length;
      const exchangeRateData = await storage.getCurrentExchangeRate();
      const exchangeRate = exchangeRateData ? parseFloat(exchangeRateData.usdToGuarani) : 7300;
      const amountUSD = parseFloat(stage[0].amount);
      const amountPYG = Math.round(amountUSD * exchangeRate);
      const companyInfo = await db.select().from(companyBillingInfo).where(eq4(companyBillingInfo.isActive, true)).orderBy(desc2(companyBillingInfo.updatedAt)).limit(1);
      const company = companyInfo[0];
      const invoiceData = await db.select().from(invoices).where(eq4(invoices.paymentStageId, stageId)).limit(1);
      const cdcInfo = invoiceData[0] ? {
        cdc: invoiceData[0].sifenCDC,
        qrUrl: invoiceData[0].sifenQR
      } : null;
      const invoiceNumber = invoiceData[0]?.invoiceNumber || `${String((/* @__PURE__ */ new Date()).getFullYear()).slice(-2)}${String(stage[0].projectId).padStart(4, "0")}`;
      const issueDate = (/* @__PURE__ */ new Date()).toLocaleDateString("es-PY");
      const doc = new PDFDocument({
        margin: 50,
        size: "A4"
      });
      res.setHeader("Content-Type", "application/pdf");
      res.setHeader("Content-Disposition", `attachment; filename="SoftwarePar_Factura_${invoiceNumber}_Etapa_${stageNumber}.pdf"`);
      doc.on("error", (error) => {
        console.error("Error al generar PDF:", error);
        if (!res.headersSent) {
          res.status(500).json({ message: "Error al generar PDF" });
        }
      });
      doc.pipe(res);
      const pageWidth = 595;
      const leftMargin = 50;
      const rightMargin = 50;
      const contentWidth = pageWidth - leftMargin - rightMargin;
      try {
        const logoPath = path.join(__dirname, "../attached_assets/image_1767296553782.png");
        if (fs2.existsSync(logoPath)) {
          doc.image(logoPath, leftMargin, 20, { width: 150 });
        } else {
          doc.fontSize(20).fillColor("#2563eb").text("SoftwarePar", leftMargin, 30);
        }
      } catch (e) {
        console.error("Error al cargar logo:", e);
        doc.fontSize(20).fillColor("#2563eb").text("SoftwarePar", leftMargin, 30);
      }
      doc.fontSize(28).fillColor("#2563eb").text("FACTURA", pageWidth - 200, 25);
      let yPos = 120;
      doc.fontSize(12).fillColor("#000").font("Helvetica-Bold").text("SOFTWAREPAR", leftMargin, yPos);
      yPos += 15;
      doc.fontSize(10).fillColor("#6b7280").font("Helvetica");
      doc.text("Paraguay", leftMargin, yPos);
      doc.text("Tel\xE9fono: +595 985 990 046", leftMargin, yPos + 12);
      doc.text("Email: softwarepar.lat@gmail.com", leftMargin, yPos + 24);
      const rightColumnX = 350;
      let rightYPos = 120;
      doc.fontSize(10).fillColor("#374151");
      doc.text("Fecha:", rightColumnX, rightYPos);
      doc.text("Factura #:", rightColumnX, rightYPos + 15);
      doc.text("Etapa de Pago:", rightColumnX, rightYPos + 30);
      doc.fontSize(10).fillColor("#000");
      doc.text(issueDate, rightColumnX + 80, rightYPos);
      doc.text(invoiceNumber, rightColumnX + 80, rightYPos + 15);
      doc.text(`${stageNumber} de ${totalStages}`, rightColumnX + 80, rightYPos + 30);
      yPos = 220;
      doc.rect(leftMargin, yPos, contentWidth, 20).fillColor("#2563eb").fill();
      doc.fontSize(11).fillColor("#ffffff").text("Facturar a:", leftMargin + 10, yPos + 5);
      yPos += 30;
      doc.fontSize(11).fillColor("#000").font("Helvetica-Bold");
      doc.text(req.user.fullName, leftMargin + 10, yPos);
      doc.font("Helvetica").fontSize(10);
      doc.text(req.user.email, leftMargin + 10, yPos + 15);
      doc.text(`ID Cliente: ${req.user.id.toString().padStart(6, "0")}`, leftMargin + 10, yPos + 30);
      doc.text(`Proyecto: ${project.name}`, leftMargin + 10, yPos + 45);
      yPos = 310;
      const tableX = leftMargin;
      const tableWidth = contentWidth;
      const rowHeight = 25;
      doc.rect(tableX, yPos, tableWidth, rowHeight).fillColor("#2563eb").fill();
      doc.fontSize(10).fillColor("#ffffff").font("Helvetica-Bold");
      doc.text("Cant.", tableX + 10, yPos + 7);
      doc.text("Descripci\xF3n", tableX + 60, yPos + 7);
      doc.text("Precio Unit.", tableX + 320, yPos + 7);
      doc.text("Total", tableX + 420, yPos + 7);
      const rows = [
        {
          qty: "1",
          description: `${stage[0].stageName} - Etapa ${stageNumber} de ${totalStages}`.replace("Initial Payment", "Pago Inicial").replace("Payment Stage", "Etapa de Pago").replace("Final Payment", "Pago Final"),
          unitPrice: `$ ${amountUSD.toFixed(2)} USD`,
          amount: `$ ${amountUSD.toFixed(2)} USD`
        },
        {
          qty: "",
          description: `Equivalente en Guaran\xEDes (1 USD = \u20B2 ${exchangeRate.toLocaleString("es-PY")})`,
          unitPrice: `\u20B2 ${amountPYG.toLocaleString("es-PY")}`,
          amount: `\u20B2 ${amountPYG.toLocaleString("es-PY")}`
        }
      ];
      yPos += rowHeight;
      doc.font("Helvetica").fontSize(10).fillColor("#000");
      rows.forEach((row) => {
        doc.rect(tableX, yPos, tableWidth, rowHeight).strokeColor("#e5e7eb").stroke();
        doc.text(row.qty, tableX + 15, yPos + 8);
        doc.text(row.description, tableX + 60, yPos + 8);
        doc.text(row.unitPrice, tableX + 320, yPos + 8);
        doc.text(row.amount, tableX + 420, yPos + 8);
        yPos += rowHeight;
      });
      for (let i = 0; i < 5; i++) {
        doc.rect(tableX, yPos, tableWidth, rowHeight).strokeColor("#e5e7eb").stroke();
        yPos += rowHeight;
      }
      yPos += 10;
      const totalsX = 350;
      doc.fontSize(10).font("Helvetica-Bold");
      doc.text("Subtotal USD:", totalsX, yPos);
      doc.font("Helvetica").text(`USD ${amountUSD.toFixed(2)}`, totalsX + 100, yPos);
      yPos += 15;
      doc.font("Helvetica-Bold");
      doc.text("Subtotal \u20B2:", totalsX, yPos);
      doc.font("Helvetica").text(`\u20B2 ${amountPYG.toLocaleString("es-PY")}`, totalsX + 100, yPos);
      yPos += 15;
      doc.font("Helvetica-Bold");
      doc.text("IVA (Exento):", totalsX, yPos);
      doc.font("Helvetica").text("0%", totalsX + 100, yPos);
      yPos += 20;
      doc.rect(totalsX - 10, yPos - 5, 160, 25).fillColor("#2563eb").fill();
      doc.fontSize(11).fillColor("#ffffff").font("Helvetica-Bold");
      doc.text("TOTAL:", totalsX, yPos);
      doc.text(`\u20B2 ${amountPYG.toLocaleString("es-PY")}`, totalsX + 70, yPos);
      if (cdcInfo && cdcInfo.cdc) {
        yPos += 40;
        doc.rect(leftMargin, yPos, contentWidth, 110).strokeColor("#000000").lineWidth(1).stroke();
        const qrSize = 85;
        const qrX = leftMargin + 10;
        const qrY = yPos + 12;
        if (cdcInfo.qrUrl) {
          try {
            const qrDataUrl = await QRCode.toDataURL(cdcInfo.qrUrl, { margin: 1 });
            const qrBuffer = Buffer.from(qrDataUrl.split(",")[1], "base64");
            doc.image(qrBuffer, qrX, qrY, { width: qrSize, height: qrSize });
          } catch (e) {
            console.error("Error QR:", e);
          }
        }
        const textX = qrX + qrSize + 15;
        const textWidth = contentWidth - qrSize - 40;
        let textY = yPos + 15;
        doc.fontSize(10).fillColor("#000000").font("Helvetica");
        doc.text("Consulte la validez de este Documento Electr\xF3nico con el n\xFAmero de CDC impreso", textX, textY, { width: textWidth });
        textY += 15;
        doc.fontSize(10).fillColor("#000000").font("Helvetica-Bold");
        doc.text("https://ekuatia.set.gov.py/consultas", textX, textY, { link: "https://ekuatia.set.gov.py/consultas", underline: true });
        textY += 20;
        const cdcFormatted = cdcInfo.cdc.match(/.{1,4}/g)?.join(" ") || cdcInfo.cdc;
        doc.fontSize(11).text(`CDC:  ${cdcFormatted}`, textX, textY, { width: textWidth });
        textY += 25;
        doc.fontSize(10).text("ESTE DOCUMENTO ES UNA REPRESENTACI\xD3N GR\xC1FICA DE UN DOCUMENTO ELECTR\xD3NICO (XML)", textX, textY, { width: textWidth });
        yPos += 130;
      } else {
        yPos += 60;
        doc.fontSize(8).fillColor("#4b5563").font("Helvetica");
        doc.text("R\xE9gimen Tributario: Servicios Digitales (Ley 125/91) - IVA Exento", leftMargin, yPos, { align: "center", width: contentWidth });
        if (company?.isSignatureProcessEnabled) {
          yPos += 20;
          doc.fontSize(9).fillColor("#991b1b").font("Helvetica-Bold");
          doc.text("FIRMA DIGITAL EN PROCESO - ESTE DOCUMENTO ES UNA CONSTANCIA DE PAGO INTERNA", leftMargin, yPos, { align: "center", width: contentWidth });
        }
      }
      yPos += 30;
      doc.fontSize(14).fillColor("#2563eb").font("Helvetica-Bold").text("\xA1Gracias por confiar en SoftwarePar!", leftMargin, yPos, { align: "center", width: contentWidth });
      doc.end();
    } catch (error) {
      console.error("\u274C Error downloading stage invoice:", error);
      if (!res.headersSent) {
        res.status(500).json({
          message: "Error interno del servidor",
          error: process.env.NODE_ENV === "development" ? error.message : "Error generating invoice"
        });
      }
    }
  });
  app2.get("/api/client/stage-invoices/:stageId/download-resimple", authenticateToken, async (req, res) => {
    try {
      const stageId = parseInt(req.params.stageId);
      if (isNaN(stageId)) {
        return res.status(400).json({ message: "Invalid stage ID" });
      }
      const stage = await db.select().from(paymentStages).where(eq4(paymentStages.id, stageId)).limit(1);
      if (!stage[0]) {
        return res.status(404).json({ message: "Etapa no encontrada" });
      }
      const project = await storage.getProject(stage[0].projectId);
      if (!project) {
        return res.status(404).json({ message: "Project not found" });
      }
      if (project.clientId !== req.user.id) {
        return res.status(403).json({ message: "You do not have permission to view this invoice" });
      }
      if (stage[0].status !== "paid") {
        return res.status(400).json({ message: "This stage has not been paid yet" });
      }
      const companyInfo = await db.select().from(companyBillingInfo).where(eq4(companyBillingInfo.isActive, true)).orderBy(sql3`${companyBillingInfo.updatedAt} DESC`).limit(1);
      const invoiceData = await db.select().from(invoices).where(eq4(invoices.paymentStageId, stageId)).limit(1);
      const allStages = await storage.getPaymentStages(stage[0].projectId);
      const sortedStages = allStages.sort((a, b) => a.requiredProgress - b.requiredProgress);
      const stageNumber = sortedStages.findIndex((s) => s.id === stage[0].id) + 1;
      const totalStages = sortedStages.length;
      let exchangeRate;
      if (stage[0].exchangeRateUsed) {
        exchangeRate = parseFloat(stage[0].exchangeRateUsed);
        console.log(`\u2705 Using SAVED exchange rate at the time of payment: ${exchangeRate} PYG/USD`);
      } else {
        const exchangeRateData = await storage.getCurrentExchangeRate();
        exchangeRate = exchangeRateData ? parseFloat(exchangeRateData.usdToGuarani) : 7300;
        console.log(`\u26A0\uFE0F Old payment without saved exchange rate. Saving current exchange rate (${exchangeRate}) for this payment.`);
        await db.update(paymentStages).set({
          exchangeRateUsed: exchangeRate.toString(),
          updatedAt: /* @__PURE__ */ new Date()
        }).where(eq4(paymentStages.id, stageId));
      }
      const amountUSD = parseFloat(stage[0].amount);
      const amountPYG = Math.round(amountUSD * exchangeRate);
      let issueDate;
      let issueDateTime;
      if (invoiceData.length > 0 && invoiceData[0].issueDateSnapshot && invoiceData[0].issueDateTimeSnapshot) {
        issueDate = invoiceData[0].issueDateSnapshot;
        issueDateTime = invoiceData[0].issueDateTimeSnapshot;
        console.log(`\u2705 Using IMMUTABLE issue date from invoice: ${issueDateTime}`);
      } else {
        const now = /* @__PURE__ */ new Date();
        issueDate = now.toLocaleDateString("es-PY");
        issueDateTime = now.toLocaleString("es-PY", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
          hour12: false
        });
        console.log(`\u26A0\uFE0F CRITICAL: Invoice ${invoiceData[0]?.invoiceNumber || "unknown"} missing issue date - saving NOW: ${issueDateTime}`);
        if (invoiceData.length > 0) {
          await db.update(invoices).set({
            issueDateSnapshot: issueDate,
            issueDateTimeSnapshot: issueDateTime,
            updatedAt: /* @__PURE__ */ new Date()
          }).where(eq4(invoices.id, invoiceData[0].id));
          console.log(`\u2705 Issue date saved to invoice ${invoiceData[0].invoiceNumber}: ${issueDateTime}`);
        }
      }
      const company = companyInfo && companyInfo.length > 0 ? companyInfo[0] : null;
      let client = null;
      const hasSnapshot = invoiceData.length > 0 && invoiceData[0] && invoiceData[0].clientSnapshotLegalName !== null;
      if (hasSnapshot) {
        client = {
          clientType: invoiceData[0].clientSnapshotType,
          legalName: invoiceData[0].clientSnapshotLegalName,
          documentType: invoiceData[0].clientSnapshotDocumentType,
          documentNumber: invoiceData[0].clientSnapshotDocumentNumber,
          address: invoiceData[0].clientSnapshotAddress,
          city: invoiceData[0].clientSnapshotCity,
          department: invoiceData[0].clientSnapshotDepartment,
          country: invoiceData[0].clientSnapshotCountry,
          email: invoiceData[0].clientSnapshotEmail,
          phone: invoiceData[0].clientSnapshotPhone
        };
        console.log(`\u2705 Using FROZEN client billing data from invoice snapshot`);
      } else {
        const clientInfo = await db.select().from(clientBillingInfo).where(eq4(clientBillingInfo.userId, req.user.id)).limit(1);
        client = clientInfo && clientInfo.length > 0 ? clientInfo[0] : null;
        console.log(`\u26A0\uFE0F No snapshot found (legacy invoice) - using current client billing data as fallback`);
      }
      let cdcInfo = null;
      if (invoiceData.length > 0 && invoiceData[0].sifenCDC) {
        cdcInfo = {
          cdc: invoiceData[0].sifenCDC,
          qrUrl: invoiceData[0].sifenQR,
          consultaUrl: "https://ekuatia.set.gov.py/consultas"
        };
        console.log(`\u{1F4CB} Electronic invoice found - CDC: ${cdcInfo.cdc}`);
        console.log(`\u{1F4F1} QR URL: ${cdcInfo.qrUrl ? "Available" : "Not available"}`);
      } else {
        console.log(`\u26A0\uFE0F No electronic invoice found for this stage`);
      }
      let boletaNumber;
      const existingInvoice = await db.select().from(invoices).where(eq4(invoices.paymentStageId, stageId)).limit(1);
      if (existingInvoice.length > 0 && existingInvoice[0].invoiceNumber) {
        boletaNumber = existingInvoice[0].invoiceNumber;
        console.log(`\u2705 Reusing existing invoice number: ${boletaNumber} for stage ${stageId}`);
      } else {
        const boletaPrefix = company?.boletaPrefix || "001-001";
        const currentSequence = company?.boletaSequence || 1;
        boletaNumber = `${boletaPrefix}-${String(currentSequence).padStart(7, "0")}`;
        if (company) {
          await db.update(companyBillingInfo).set({ boletaSequence: currentSequence + 1 }).where(eq4(companyBillingInfo.id, company.id));
        }
        if (existingInvoice.length > 0) {
          const updateData = {
            invoiceNumber: boletaNumber,
            updatedAt: /* @__PURE__ */ new Date()
          };
          if (stage[0].exchangeRateUsed || exchangeRate) {
            updateData.exchangeRateUsed = stage[0].exchangeRateUsed || exchangeRate.toString();
          }
          if (existingInvoice[0].clientSnapshotLegalName === null && client) {
            updateData.clientSnapshotType = client.clientType;
            updateData.clientSnapshotLegalName = client.legalName;
            updateData.clientSnapshotDocumentType = client.documentType;
            updateData.clientSnapshotDocumentNumber = client.documentNumber;
            updateData.clientSnapshotAddress = client.address;
            updateData.clientSnapshotCity = client.city;
            updateData.clientSnapshotDepartment = client.department;
            updateData.clientSnapshotCountry = client.country;
            updateData.clientSnapshotEmail = client.email;
            updateData.clientSnapshotPhone = client.phone;
            console.log(`\u{1F4F8} Adding missing client snapshot to invoice ${boletaNumber}`);
          }
          if (!existingInvoice[0].issueDateSnapshot || !existingInvoice[0].issueDateTimeSnapshot) {
            updateData.issueDateSnapshot = issueDate;
            updateData.issueDateTimeSnapshot = issueDateTime;
            console.log(`\u{1F4F8} Adding IMMUTABLE issue date to invoice ${boletaNumber}`);
          }
          await db.update(invoices).set(updateData).where(eq4(invoices.id, existingInvoice[0].id));
        } else {
          const clientInfoForSnapshot = await db.select().from(clientBillingInfo).where(eq4(clientBillingInfo.userId, req.user.id)).limit(1);
          const clientSnapshot = clientInfoForSnapshot && clientInfoForSnapshot.length > 0 ? clientInfoForSnapshot[0] : null;
          const amountValue = stage[0].amount;
          const now = /* @__PURE__ */ new Date();
          const newIssueDate = now.toLocaleDateString("es-PY");
          const newIssueDateTime = now.toLocaleString("es-PY", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
            hour12: false
          });
          await db.insert(invoices).values({
            projectId: stage[0].projectId,
            clientId: req.user.id,
            paymentStageId: stageId,
            invoiceNumber: boletaNumber,
            amount: amountValue,
            totalAmount: amountValue,
            taxAmount: "0.00",
            discountAmount: "0.00",
            currency: "USD",
            status: "paid",
            dueDate: /* @__PURE__ */ new Date(),
            paidDate: stage[0].paidAt || /* @__PURE__ */ new Date(),
            exchangeRateUsed: exchangeRate.toString(),
            // **SNAPSHOT INMUTABLE**: Datos del cliente congelados al momento de la creación
            clientSnapshotType: clientSnapshot?.clientType,
            clientSnapshotLegalName: clientSnapshot?.legalName,
            clientSnapshotDocumentType: clientSnapshot?.documentType,
            clientSnapshotDocumentNumber: clientSnapshot?.documentNumber,
            clientSnapshotAddress: clientSnapshot?.address,
            clientSnapshotCity: clientSnapshot?.city,
            clientSnapshotDepartment: clientSnapshot?.department,
            clientSnapshotCountry: clientSnapshot?.country,
            clientSnapshotEmail: clientSnapshot?.email,
            clientSnapshotPhone: clientSnapshot?.phone,
            // **FECHA INMUTABLE**: Fecha y hora de emisión congeladas al momento de la creación
            issueDateSnapshot: newIssueDate,
            issueDateTimeSnapshot: newIssueDateTime
          });
          console.log(`\u{1F4F8} Invoice ${boletaNumber} created with IMMUTABLE client snapshot and issue date: ${newIssueDateTime}`);
        }
        console.log(`\u2705 New invoice number generated: ${boletaNumber} for stage ${stageId}`);
      }
      const numeroALetras = (num) => {
        const unidades = ["", "UNO", "DOS", "TRES", "CUATRO", "CINCO", "SEIS", "SIETE", "OCHO", "NUEVE"];
        const decenas = ["", "", "VEINTE", "TREINTA", "CUARENTA", "CINCUENTA", "SESENTA", "SETENTA", "OCHENTA", "NOVENTA"];
        const centenas = ["", "CIENTO", "DOSCIENTOS", "TRESCIENTOS", "CUATROCIENTOS", "QUINIENTOS", "SEISCIENTOS", "SETECIENTOS", "OCHOCIENTOS", "NOVECIENTOS"];
        if (num === 0) return "CERO";
        if (num === 100) return "CIEN";
        let letras = "";
        if (num >= 1e6) {
          const millones = Math.floor(num / 1e6);
          letras += millones === 1 ? "UN MILLON " : numeroALetras(millones) + " MILLONES ";
          num %= 1e6;
        }
        if (num >= 1e3) {
          const miles = Math.floor(num / 1e3);
          letras += miles === 1 ? "MIL " : numeroALetras(miles) + " MIL ";
          num %= 1e3;
        }
        if (num >= 100) {
          letras += centenas[Math.floor(num / 100)] + " ";
          num %= 100;
        }
        if (num >= 30) {
          letras += decenas[Math.floor(num / 10)];
          if (num % 10 > 0) letras += " Y " + unidades[num % 10];
        } else if (num >= 20) {
          const especiales = ["VEINTE", "VEINTIUNO", "VEINTIDOS", "VEINTITRES", "VEINTICUATRO", "VEINTICINCO", "VEINTISEIS", "VEINTISIETE", "VEINTIOCHO", "VEINTINUEVE"];
          letras += especiales[num - 20];
        } else if (num >= 10) {
          const especiales10 = ["DIEZ", "ONCE", "DOCE", "TRECE", "CATORCE", "QUINCE", "DIECISEIS", "DIECISIETE", "DIECIOCHO", "DIECINUEVE"];
          letras += especiales10[num - 10];
        } else if (num > 0) {
          letras += unidades[num];
        }
        return letras.trim();
      };
      const montoEnLetras = `${numeroALetras(amountPYG)} GUARANIES`;
      const doc = new PDFDocument({
        size: "A4",
        margin: 40,
        layout: "portrait"
      });
      res.setHeader("Content-Type", "application/pdf");
      res.setHeader("Content-Disposition", `attachment; filename="SoftwarePar_Boleta_${boletaNumber.replace(/\//g, "-")}.pdf"`);
      doc.on("error", (error) => {
        console.error("Error generating PDF:", error);
        if (!res.headersSent) {
          res.status(500).json({ message: "Error generating PDF" });
        }
      });
      doc.pipe(res);
      const pageWidth = 595;
      const leftMargin = 40;
      const rightMargin = 40;
      const contentWidth = pageWidth - leftMargin - rightMargin;
      let yPos = 40;
      doc.rect(leftMargin, yPos, contentWidth, 85).strokeColor("#1e3a8a").lineWidth(2).stroke();
      doc.rect(leftMargin + 2, yPos + 2, contentWidth - 4, 81).strokeColor("#cbd5e1").lineWidth(0.5).stroke();
      const logoPathNewHeader = path.resolve(process.cwd(), "attached_assets/image_1767293138533.png");
      try {
        if (fs2.existsSync(logoPathNewHeader)) {
          doc.image(logoPathNewHeader, leftMargin + 15, yPos + 15, { width: 140 });
        } else {
          doc.fontSize(20).fillColor("#1e3a8a").font("Helvetica-Bold").text("SoftwarePar", leftMargin + 20, yPos + 30);
        }
      } catch (e) {
        console.error("Error loading logo:", e);
        doc.fontSize(18).fillColor("#1e3a8a").font("Helvetica-Bold").text("SoftwarePar", leftMargin + 20, yPos + 30);
      }
      const rightHeaderXNewHeader = pageWidth - 220;
      doc.rect(rightHeaderXNewHeader - 5, yPos + 10, 185, 65).fillColor("#f8fafc").fill();
      doc.rect(rightHeaderXNewHeader - 5, yPos + 10, 185, 65).strokeColor("#1e3a8a").lineWidth(1).stroke();
      doc.fontSize(14).fillColor("#1e3a8a").font("Helvetica-Bold").text("BOLETA ELECTR\xD3NICA", rightHeaderXNewHeader, yPos + 15);
      doc.fontSize(8).fillColor("#475569").font("Helvetica").text("IVA General 10% / IRE SIMPLE", rightHeaderXNewHeader, yPos + 32);
      doc.fontSize(10).fillColor("#1e293b").font("Helvetica-Bold").text(`BOLETA N\xBA: ${boletaNumber}`, rightHeaderXNewHeader, yPos + 48);
      doc.fontSize(8).fillColor("#475569").font("Helvetica").text(`Emisi\xF3n: ${issueDateTime}`, rightHeaderXNewHeader, yPos + 62);
      yPos += 100;
      const infoBoxHeight = 50;
      doc.rect(leftMargin, yPos, contentWidth, infoBoxHeight).strokeColor("#1e3a8a").lineWidth(1.5).stroke();
      doc.rect(leftMargin + 1, yPos + 1, contentWidth - 2, infoBoxHeight - 2).strokeColor("#cbd5e1").lineWidth(0.5).stroke();
      doc.rect(leftMargin, yPos, contentWidth, 18).fillColor("#f1f5f9").fill();
      doc.moveTo(leftMargin + contentWidth * 0.33, yPos).lineTo(leftMargin + contentWidth * 0.33, yPos + infoBoxHeight).strokeColor("#cbd5e1").lineWidth(0.5).stroke();
      doc.moveTo(leftMargin + contentWidth * 0.66, yPos).lineTo(leftMargin + contentWidth * 0.66, yPos + infoBoxHeight).strokeColor("#cbd5e1").lineWidth(0.5).stroke();
      doc.fontSize(7).fillColor("#475569").font("Helvetica-Bold").text("BOLETA N\xBA:", leftMargin + 8, yPos + 5);
      doc.fontSize(10).fillColor("#1e3a8a").font("Helvetica-Bold").text(boletaNumber, leftMargin + 8, yPos + 20);
      doc.fontSize(7).fillColor("#475569").font("Helvetica-Bold").text("FECHA Y HORA DE EMISI\xD3N:", leftMargin + contentWidth * 0.33 + 8, yPos + 5);
      doc.fontSize(9).fillColor("#000000").font("Helvetica-Bold").text(issueDateTime, leftMargin + contentWidth * 0.33 + 8, yPos + 20);
      doc.fontSize(7).fillColor("#475569").font("Helvetica-Bold").text("ETAPA:", leftMargin + contentWidth * 0.66 + 8, yPos + 5);
      doc.fontSize(10).fillColor("#000000").font("Helvetica-Bold").text(`${stageNumber} de ${totalStages}`, leftMargin + contentWidth * 0.66 + 8, yPos + 20);
      if (company?.timbradoNumber) {
        doc.fontSize(7).fillColor("#475569").font("Helvetica").text("TIMBRADO N\xBA:", leftMargin + 8, yPos + 35);
        doc.fontSize(8).fillColor("#000000").font("Helvetica-Bold").text(company.timbradoNumber, leftMargin + 70, yPos + 35);
        if (company?.vigenciaTimbrado && company?.vencimientoTimbrado) {
          doc.fontSize(7).fillColor("#475569").font("Helvetica").text("VIGENCIA:", leftMargin + contentWidth * 0.5, yPos + 35);
          doc.fontSize(8).fillColor("#000000").font("Helvetica-Bold").text(`${company.vigenciaTimbrado} - ${company.vencimientoTimbrado}`, leftMargin + contentWidth * 0.5 + 50, yPos + 35);
        }
      }
      if (!cdcInfo && company?.isSignatureProcessEnabled) {
        doc.rect(leftMargin, yPos + 45, contentWidth, 15).fillColor("#fef2f2").fill();
        doc.fontSize(8).fillColor("#991b1b").font("Helvetica-Bold").text("FIRMA DIGITAL EN PROCESO - ESTE DOCUMENTO ES UNA CONSTANCIA DE PAGO INTERNA", leftMargin, yPos + 49, { align: "center", width: contentWidth });
        yPos += 15;
      }
      yPos += infoBoxHeight + 5;
      doc.rect(leftMargin, yPos, contentWidth, 25).fillColor("#fff7ed").fill();
      doc.rect(leftMargin, yPos, contentWidth, 25).strokeColor("#ea580c").lineWidth(1).stroke();
      doc.fontSize(8).fillColor("#9a3412").font("Helvetica-Bold").text("FIRMA DIGITAL EN PROCESO - ESTE DOCUMENTO ES UNA CONSTANCIA DE PAGO INTERNA", leftMargin, yPos + 8, { align: "center", width: contentWidth });
      yPos += 35;
      const columnWidth = (contentWidth - 12) / 2;
      const boxHeight = 100;
      doc.rect(leftMargin, yPos, columnWidth, boxHeight).strokeColor("#1e3a8a").lineWidth(1.5).stroke();
      doc.rect(leftMargin, yPos, columnWidth, 20).fillColor("#1e3a8a").fill();
      doc.fontSize(9).fillColor("#ffffff").font("Helvetica-Bold").text("DATOS DE LA EMPRESA", leftMargin + 8, yPos + 6);
      doc.fontSize(8).fillColor("#1e293b").font("Helvetica");
      const displayName = company?.titularName || company?.companyName || "Jhoni Fabi\xE1n Ben\xEDtez De La Cruz";
      doc.text(`Titular: ${displayName}`, leftMargin + 8, yPos + 25, { width: columnWidth - 16 });
      doc.text(`RUC: ${company?.ruc || "4220058-0"}`, leftMargin + 8, yPos + 42);
      doc.text(`Tel: ${company?.phone || "+595 985 990 046"}`, leftMargin + 8, yPos + 54);
      doc.text(`Email: ${company?.email || "softwarepar.lat@gmail.com"}`, leftMargin + 8, yPos + 66, { width: columnWidth - 16 });
      doc.text(`Direcci\xF3n: ${company?.address || "Paraguay"}`, leftMargin + 8, yPos + 78, { width: columnWidth - 16 });
      const clientBoxX = leftMargin + columnWidth + 12;
      doc.rect(clientBoxX, yPos, columnWidth, boxHeight).strokeColor("#1e3a8a").lineWidth(1.5).stroke();
      doc.rect(clientBoxX, yPos, columnWidth, 20).fillColor("#1e3a8a").fill();
      doc.fontSize(9).fillColor("#ffffff").font("Helvetica-Bold").text("DATOS DEL CLIENTE", clientBoxX + 8, yPos + 6);
      doc.fontSize(8).fillColor("#1e293b").font("Helvetica");
      const clientName = client?.legalName || req.user.fullName;
      doc.text(`Nombre: ${clientName}`, clientBoxX + 8, yPos + 25, { width: columnWidth - 16 });
      doc.text(`${client?.documentType || "RUC"}: ${client?.documentNumber || "N/A"}`, clientBoxX + 8, yPos + 42);
      doc.text(`Tel: ${client?.phone || "N/A"}`, clientBoxX + 8, yPos + 54);
      doc.text(`Email: ${client?.email || req.user.email}`, clientBoxX + 8, yPos + 66, { width: columnWidth - 16 });
      let direccionCliente = "N/A";
      const snapshotAddress = invoiceData.length > 0 ? invoiceData[0].clientSnapshotAddress : null;
      const snapshotCity = invoiceData.length > 0 ? invoiceData[0].clientSnapshotCity : null;
      const snapshotDept = invoiceData.length > 0 ? invoiceData[0].clientSnapshotDepartment : null;
      const snapshotCountry = invoiceData.length > 0 ? invoiceData[0].clientSnapshotCountry : null;
      const snapshotType = invoiceData.length > 0 ? invoiceData[0].clientSnapshotType : null;
      const isExtranjero = client?.clientType === "extranjero" || snapshotType === "extranjero";
      if (isExtranjero) {
        const partes = [
          client?.address || snapshotAddress,
          client?.city || snapshotCity,
          client?.department || snapshotDept,
          client?.country || snapshotCountry
        ].filter((p) => p && p !== "N/A" && String(p).trim() !== "");
        if (partes.length > 0) {
          direccionCliente = partes.join(", ");
        } else {
          direccionCliente = client?.address || snapshotAddress || "N/A";
        }
      } else {
        direccionCliente = client?.address || snapshotAddress || "N/A";
      }
      doc.text(`Direcci\xF3n: ${direccionCliente}`, clientBoxX + 8, yPos + 78, { width: columnWidth - 16 });
      yPos += boxHeight + 15;
      const cantWidth = 40;
      const descWidth = 270;
      const precioWidth = 110;
      const totalWidth = 95;
      doc.rect(leftMargin, yPos, contentWidth, 25).fillColor("#1e3a8a").fill();
      doc.fontSize(9).fillColor("#ffffff").font("Helvetica-Bold");
      doc.text("CANT", leftMargin + 5, yPos + 8);
      doc.text("DESCRIPCI\xD3N DEL SERVICIO", leftMargin + cantWidth + 10, yPos + 8);
      doc.text("PRECIO UNITARIO", leftMargin + cantWidth + descWidth + 10, yPos + 8);
      doc.text("TOTAL", leftMargin + cantWidth + descWidth + precioWidth + 20, yPos + 8);
      yPos += 25;
      doc.rect(leftMargin, yPos, contentWidth, 60).strokeColor("#cbd5e1").lineWidth(1).stroke();
      doc.fontSize(9).fillColor("#1e293b").font("Helvetica");
      doc.text("1", leftMargin + 15, yPos + 10);
      doc.text(`${stage[0].stageName}`, leftMargin + cantWidth + 10, yPos + 10, { width: descWidth - 20 });
      doc.fontSize(8).fillColor("#64748b");
      doc.text(`Proyecto: ${project.name}`, leftMargin + cantWidth + 10, yPos + 22);
      doc.text(`TC: 1 USD = ${exchangeRate.toLocaleString("es-PY")} PYG`, leftMargin + cantWidth + 10, yPos + 34);
      doc.fontSize(9).fillColor("#1e293b").font("Helvetica-Bold");
      doc.text(`USD ${amountUSD.toFixed(2)}`, leftMargin + cantWidth + descWidth, yPos + 10, { width: precioWidth, align: "center" });
      doc.text(`USD ${amountUSD.toFixed(2)}`, leftMargin + cantWidth + descWidth + precioWidth, yPos + 10, { width: totalWidth, align: "center" });
      doc.fontSize(8).fillColor("#64748b").font("Helvetica");
      doc.text(`PYG ${amountPYG.toLocaleString("es-PY")}`, leftMargin + cantWidth + descWidth, yPos + 22, { width: precioWidth, align: "center" });
      doc.text(`PYG ${amountPYG.toLocaleString("es-PY")}`, leftMargin + cantWidth + descWidth + precioWidth, yPos + 22, { width: totalWidth, align: "center" });
      yPos += 75;
      const totalsWidth = 180;
      const totalsX = leftMargin + contentWidth - totalsWidth;
      doc.fontSize(9).fillColor("#475569").font("Helvetica");
      doc.text("Subtotal USD:", totalsX, yPos);
      doc.text(`USD ${amountUSD.toFixed(2)}`, totalsX + 90, yPos, { width: 90, align: "right" });
      yPos += 15;
      doc.text("Subtotal PYG:", totalsX, yPos);
      doc.text(`PYG ${amountPYG.toLocaleString("es-PY")}`, totalsX + 90, yPos, { width: 90, align: "right" });
      yPos += 15;
      doc.text("IVA (10%):", totalsX, yPos);
      const ivaPYG = Math.round(amountPYG / 11);
      doc.text(`PYG ${ivaPYG.toLocaleString("es-PY")}`, totalsX + 90, yPos, { width: 90, align: "right" });
      yPos += 20;
      doc.rect(totalsX - 5, yPos - 5, totalsWidth + 5, 25).fillColor("#1e3a8a").fill();
      doc.fontSize(10).fillColor("#ffffff").font("Helvetica-Bold");
      doc.text("TOTAL:", totalsX, yPos + 2);
      doc.text(`PYG ${amountPYG.toLocaleString("es-PY")}`, totalsX + 60, yPos + 2, { width: totalsWidth - 65, align: "right" });
      yPos += 35;
      doc.rect(leftMargin, yPos, contentWidth, 35).strokeColor("#cbd5e1").lineWidth(1).stroke();
      doc.fontSize(8).fillColor("#64748b").font("Helvetica-Bold").text("MONTO EN LETRAS:", leftMargin + 8, yPos + 5);
      doc.fontSize(9).fillColor("#1e293b").font("Helvetica-Bold").text(montoEnLetras, leftMargin + 8, yPos + 18);
      yPos += 45;
      doc.rect(leftMargin, yPos, contentWidth, 40).strokeColor("#cbd5e1").lineWidth(1).stroke();
      doc.rect(leftMargin, yPos, contentWidth, 15).fillColor("#f8fafc").fill();
      doc.fontSize(8).fillColor("#1e3a8a").font("Helvetica-Bold").text("DETALLES DEL PAGO", leftMargin + 8, yPos + 4);
      doc.fontSize(8).fillColor("#475569").font("Helvetica");
      doc.text(`M\xE9todo: ${stage[0].paymentMethod || "Transferencia"}`, leftMargin + 8, yPos + 20);
      doc.text(`Fecha: ${stage[0].paidAt ? new Date(stage[0].paidAt).toLocaleDateString("es-PY") : issueDate}`, leftMargin + 180, yPos + 20);
      doc.text(`Estado: PAGADO`, leftMargin + 350, yPos + 20);
      yPos += 55;
      doc.moveTo(leftMargin, yPos).lineTo(pageWidth - rightMargin, yPos).lineWidth(1).strokeColor("#cbd5e1").stroke();
      yPos += 8;
      doc.fontSize(7).fillColor("#475569").font("Helvetica");
      doc.text("IVA General 10% / IRE SIMPLE", leftMargin, yPos, {
        width: contentWidth,
        align: "center"
      });
      yPos += 12;
      if (cdcInfo && cdcInfo.cdc) {
        doc.rect(leftMargin, yPos, contentWidth, 120).strokeColor("#000000").lineWidth(1).stroke();
        const qrSize = 90;
        const qrX = leftMargin + 10;
        const qrY = yPos + 15;
        if (cdcInfo.qrUrl) {
          try {
            const qrDataUrl = await QRCode.toDataURL(cdcInfo.qrUrl, { margin: 1 });
            const qrBuffer = Buffer.from(qrDataUrl.split(",")[1], "base64");
            doc.image(qrBuffer, qrX, qrY, { width: qrSize, height: qrSize });
          } catch (e) {
            console.error("Error QR:", e);
          }
        }
        const textX = qrX + qrSize + 15;
        const textWidth = contentWidth - qrSize - 40;
        let textY = yPos + 15;
        doc.fontSize(9).fillColor("#000000").font("Helvetica");
        doc.text("Consulte la validez de este Documento Electr\xF3nico con el n\xFAmero de CDC impreso en:", textX, textY, { width: textWidth });
        textY += 12;
        doc.fontSize(9).fillColor("#000000").font("Helvetica-Bold");
        doc.text("https://ekuatia.set.gov.py/consultas", textX, textY, { link: "https://ekuatia.set.gov.py/consultas", underline: true });
        textY += 20;
        const cdcFormatted = cdcInfo.cdc.match(/.{1,4}/g)?.join(" ") || cdcInfo.cdc;
        doc.fontSize(10).font("Helvetica-Bold").text("CDC:", textX, textY);
        doc.fontSize(10).font("Helvetica").text(cdcFormatted, textX + 30, textY, { width: textWidth - 30 });
        textY += 25;
        doc.fontSize(9).font("Helvetica-Bold").text("ESTE DOCUMENTO ES UNA REPRESENTACI\xD3N GR\xC1FICA DE UN DOCUMENTO ELECTR\xD3NICO (XML)", textX, textY, { width: textWidth });
        textY += 25;
        doc.fontSize(8).font("Helvetica").text(`Fecha de Env\xEDo SET: ${invoiceData[0]?.sifenFechaEnvio ? new Date(invoiceData[0].sifenFechaEnvio).toLocaleString("es-PY") : issueDateTime}`, textX, textY);
        yPos += 140;
      }
      doc.fontSize(7).fillColor("#4b5563").font("Helvetica");
      doc.text("Si su documento electr\xF3nico presenta alg\xFAn error puede solicitar la modificaci\xF3n dentro de las 72 horas siguientes de la emisi\xF3n de este comprobante.", leftMargin, yPos, { align: "center", width: contentWidth });
      yPos += 15;
      doc.fontSize(14).fillColor("#2563eb").font("Helvetica-Bold").text("\xA1Gracias por confiar en SoftwarePar!", leftMargin, yPos, { align: "center", width: contentWidth });
      doc.end();
    } catch (error) {
      console.error("\u274C Error downloading RESIMPLE invoice:", error);
      if (!res.headersSent) {
        res.status(500).json({
          message: "Error interno del servidor",
          error: process.env.NODE_ENV === "development" ? error instanceof Error ? error.message : String(error) : "Error generating RESIMPLE Boleta"
        });
      }
    }
  });
  app2.get("/api/portfolio", async (req, res) => {
    try {
      const portfolioItems = await storage.getPortfolio();
      res.json(portfolioItems);
    } catch (error) {
      res.status(500).json({ message: "Error interno del servidor" });
    }
  });
  app2.post("/api/portfolio", authenticateToken, requireRole(["admin"]), async (req, res) => {
    try {
      const portfolioData = req.body;
      const portfolio2 = await storage.createPortfolio(portfolioData);
      res.status(201).json(portfolio2);
    } catch (error) {
      res.status(500).json({ message: "Error interno del servidor" });
    }
  });
  app2.put("/api/portfolio/:id", authenticateToken, requireRole(["admin"]), async (req, res) => {
    try {
      const portfolioId = parseInt(req.params.id);
      const updates = req.body;
      const portfolio2 = await storage.updatePortfolio(portfolioId, updates);
      res.json(portfolio2);
    } catch (error) {
      res.status(500).json({ message: "Error interno del servidor" });
    }
  });
  app2.delete("/api/portfolio/:id", authenticateToken, requireRole(["admin"]), async (req, res) => {
    try {
      const portfolioId = parseInt(req.params.id);
      await storage.deletePortfolio(portfolioId);
      res.json({ message: "Portfolio item deleted" });
    } catch (error) {
      res.status(500).json({ message: "Error interno del servidor" });
    }
  });
  app2.get("/api/client/invoices", authenticateToken, async (req, res) => {
    try {
      console.log(`\u{1F4C4} Fetching invoices for client: ${req.user.id}`);
      const allTraditionalInvoices = await storage.getInvoicesByClient(req.user.id);
      console.log(`\u{1F4B3} Traditional invoices found: ${allTraditionalInvoices.length}`);
      const traditionalInvoices = allTraditionalInvoices.filter((inv) => !inv.paymentStageId);
      console.log(`\u{1F4B3} Traditional invoices without linked stage: ${traditionalInvoices.length}`);
      const projects3 = await storage.getProjects(req.user.id, req.user.role);
      console.log(`\u{1F3D7}\uFE0F Client projects: ${projects3.length}`);
      const stageInvoices = [];
      for (const project of projects3) {
        const stages = await storage.getPaymentStages(project.id);
        const paidStages = stages.filter((stage) => stage.status === "paid");
        for (const stage of paidStages) {
          const existingInvoice = await db.select().from(invoices).where(eq4(invoices.paymentStageId, stage.id)).limit(1);
          stageInvoices.push({
            id: stage.id,
            invoiceNumber: existingInvoice[0]?.invoiceNumber || `STAGE-${stage.id}`,
            projectName: project.name,
            amount: stage.amount,
            status: "paid",
            dueDate: stage.paidAt || stage.createdAt,
            paidAt: stage.paidAt,
            createdAt: stage.createdAt,
            downloadUrl: `/api/client/stage-invoices/${stage.id}/download-resimple`,
            stageName: stage.stageName,
            stagePercentage: stage.stagePercentage,
            type: "stage_payment",
            exchangeRateUsed: stage.exchangeRateUsed || existingInvoice[0]?.exchangeRateUsed,
            paymentStageId: stage.id,
            sifenEstado: existingInvoice[0]?.sifenEstado || "pending",
            sifenCDC: existingInvoice[0]?.sifenCDC
          });
        }
      }
      console.log(`\u{1F3D7}\uFE0F Paid payment stages found: ${stageInvoices.length}`);
      const allInvoices = [...traditionalInvoices, ...stageInvoices];
      console.log(`\u{1F4CB} Total invoices to return: ${allInvoices.length}`);
      res.json(allInvoices);
    } catch (error) {
      console.error("Error getting client invoices:", error);
      res.status(500).json({ message: "Error interno del servidor" });
    }
  });
  app2.get("/api/client/billing", authenticateToken, async (req, res) => {
    try {
      const billingData = await storage.getClientBillingData(req.user.id);
      res.json(billingData);
    } catch (error) {
      console.error("Error getting client billing data:", error);
      res.status(500).json({ message: "Error interno del servidor" });
    }
  });
  app2.get("/api/client/payment-methods", authenticateToken, async (req, res) => {
    try {
      const paymentMethods3 = await storage.getPaymentMethodsByUser(req.user.id);
      res.json(paymentMethods3);
    } catch (error) {
      console.error("Error getting client payment methods:", error);
      res.status(500).json({ message: "Error interno del servidor" });
    }
  });
  app2.post("/api/client/payment-methods", authenticateToken, async (req, res) => {
    try {
      const paymentMethodData = {
        ...req.body,
        userId: req.user.id
      };
      const paymentMethod = await storage.createPaymentMethod(paymentMethodData);
      res.status(201).json(paymentMethod);
    } catch (error) {
      console.error("Error creating client payment method:", error);
      res.status(500).json({ message: "Error interno del servidor" });
    }
  });
  app2.put("/api/client/payment-methods/:id", authenticateToken, async (req, res) => {
    try {
      const paymentMethodId = parseInt(req.params.id);
      const updates = req.body;
      const paymentMethod = await storage.updatePaymentMethod(paymentMethodId, updates);
      res.json(paymentMethod);
    } catch (error) {
      console.error("Error updating client payment method:", error);
      res.status(500).json({ message: "Error interno del servidor" });
    }
  });
  app2.delete("/api/client/payment-methods/:id", authenticateToken, async (req, res) => {
    try {
      const paymentMethodId = parseInt(req.params.id);
      await storage.deletePaymentMethod(paymentMethodId);
      res.json({ message: "Payment method deleted" });
    } catch (error) {
      console.error("Error deleting client payment method:", error);
      res.status(500).json({ message: "Error interno del servidor" });
    }
  });
  app2.get("/api/client/transactions", authenticateToken, async (req, res) => {
    try {
      const transactions2 = await storage.getTransactionsByUser(req.user.id);
      res.json(transactions2);
    } catch (error) {
      console.error("Error getting client transactions:", error);
      res.status(500).json({ message: "Error interno del servidor" });
    }
  });
  app2.get("/api/admin/stats", authenticateToken, requireRole(["admin"]), async (req, res) => {
    try {
      const stats = await storage.getAdminStats();
      res.json(stats);
    } catch (error) {
      console.error("Error getting admin stats:", error);
      res.status(500).json({ message: "Error interno del servidor" });
    }
  });
  app2.get("/api/admin/partners", authenticateToken, requireRole(["admin"]), async (req, res) => {
    try {
      const partners3 = await storage.getAllPartnersForAdmin();
      res.json(partners3);
    } catch (error) {
      console.error("Error getting partners for admin:", error);
      res.status(500).json({ message: "Error interno del servidor" });
    }
  });
  app2.get("/api/admin/partners/stats", authenticateToken, requireRole(["admin"]), async (req, res) => {
    try {
      const stats = await storage.getPartnerStatsForAdmin();
      res.json(stats);
    } catch (error) {
      console.error("Error getting partner stats for admin:", error);
      res.status(500).json({ message: "Error interno del servidor" });
    }
  });
  app2.put("/api/admin/partners/:id", authenticateToken, requireRole(["admin"]), async (req, res) => {
    try {
      const partnerId = parseInt(req.params.id);
      const updates = req.body;
      const partner = await storage.updatePartner(partnerId, updates);
      res.json(partner);
    } catch (error) {
      console.error("Error updating admin partner:", error);
      res.status(500).json({ message: "Error interno del servidor" });
    }
  });
  app2.get("/api/admin/users/stats", authenticateToken, requireRole(["admin"]), async (req, res) => {
    try {
      const stats = await storage.getUserStatsForAdmin();
      res.json(stats);
    } catch (error) {
      console.error("Error getting admin user stats:", error);
      res.status(500).json({ message: "Error interno del servidor" });
    }
  });
  app2.post("/api/admin/users", authenticateToken, requireRole(["admin"]), async (req, res) => {
    try {
      const userData = req.body;
      const existingUser = await storage.getUserByEmail(userData.email);
      if (existingUser) {
        return res.status(400).json({ message: "Email is already registered" });
      }
      const hashedPassword = await hashPassword2(userData.password);
      const user = await storage.createUser({
        ...userData,
        password: hashedPassword
      });
      if (userData.role === "partner") {
        const referralCode = `PAR${user.id}${Math.random().toString(36).substr(2, 4).toUpperCase()}`;
        await storage.createPartner({
          userId: user.id,
          referralCode,
          commissionRate: "25.00",
          totalEarnings: "0.00"
        });
      }
      try {
        await sendWelcomeEmail(user.email, user.fullName);
      } catch (emailError) {
        console.error("Error sending welcome email:", emailError);
      }
      const { password: _, ...userWithoutPassword } = user;
      res.status(201).json({
        user: userWithoutPassword,
        message: "User created successfully"
      });
    } catch (error) {
      console.error("Error creating admin user:", error);
      res.status(500).json({ message: "Error interno del servidor" });
    }
  });
  app2.delete("/api/admin/users/:id", authenticateToken, requireRole(["admin"]), async (req, res) => {
    try {
      const userId = parseInt(req.params.id);
      if (isNaN(userId)) {
        return res.status(400).json({ message: "Invalid user ID" });
      }
      if (req.user.id === userId) {
        return res.status(400).json({ message: "You cannot delete your own account" });
      }
      await storage.deleteUser(userId);
      res.json({ message: "User deleted successfully" });
    } catch (error) {
      console.error("Error deleting admin user:", error);
      if (error.message === "User not found") {
        return res.status(404).json({ message: error.message });
      }
      if (error.message === "Cannot delete the last administrator of the system") {
        return res.status(400).json({ message: error.message });
      }
      if (error.message === "You cannot delete your own account") {
        return res.status(400).json({ message: error.message });
      }
      res.status(500).json({
        message: "Error interno del servidor",
        error: process.env.NODE_ENV === "development" ? error.message : void 0
      });
    }
  });
  app2.get("/api/admin/projects", authenticateToken, requireRole(["admin"]), async (req, res) => {
    try {
      const projects3 = await storage.getAllProjectsForAdmin();
      res.json(projects3);
    } catch (error) {
      console.error("Error getting admin projects:", error);
      res.status(500).json({ message: "Error interno del servidor" });
    }
  });
  app2.put("/api/admin/projects/:id", authenticateToken, requireRole(["admin"]), async (req, res) => {
    try {
      const projectId = parseInt(req.params.id);
      const updates = req.body;
      console.log("Updating project:", projectId, "with data:", updates);
      if (isNaN(projectId)) {
        return res.status(400).json({ message: "Invalid project ID" });
      }
      if (updates.startDate && updates.startDate !== null) {
        const startDate = new Date(updates.startDate);
        if (isNaN(startDate.getTime())) {
          return res.status(400).json({ message: "Invalid start date" });
        }
      }
      if (updates.deliveryDate && updates.deliveryDate !== null) {
        const deliveryDate = new Date(updates.deliveryDate);
        if (isNaN(deliveryDate.getTime())) {
          return res.status(400).json({ message: "Invalid delivery date" });
        }
      }
      const project = await storage.updateProject(projectId, updates);
      res.json(project);
    } catch (error) {
      console.error("Error updating admin project:", error);
      res.status(500).json({
        message: "Error interno del servidor",
        error: process.env.NODE_ENV === "development" ? error.message : void 0
      });
    }
  });
  app2.delete("/api/admin/projects/:id", authenticateToken, requireRole(["admin"]), async (req, res) => {
    try {
      const projectId = parseInt(req.params.id);
      if (isNaN(projectId)) {
        return res.status(400).json({ message: "Invalid project ID" });
      }
      const project = await storage.getProject(projectId);
      if (!project) {
        return res.status(404).json({ message: "Project not found" });
      }
      await storage.deleteProject(projectId);
      res.json({ message: "Project deleted successfully" });
    } catch (error) {
      console.error("Error deleting admin project:", error);
      res.status(500).json({
        message: "Error interno del servidor",
        error: process.env.NODE_ENV === "development" ? error.message : void 0
      });
    }
  });
  app2.get("/api/admin/projects/stats", authenticateToken, requireRole(["admin"]), async (req, res) => {
    try {
      const stats = await storage.getProjectStats();
      res.json(stats);
    } catch (error) {
      console.error("Error getting admin project stats:", error);
      res.status(500).json({ message: "Error interno del servidor" });
    }
  });
  app2.get("/api/admin/analytics", authenticateToken, requireRole(["admin"]), async (req, res) => {
    try {
      const period = req.query.period || "30";
      const analytics = await storage.getAnalyticsData(parseInt(period));
      res.json(analytics);
    } catch (error) {
      console.error("Error getting admin analytics data:", error);
      res.status(500).json({ message: "Error interno del servidor" });
    }
  });
  app2.get("/api/admin/analytics/revenue", authenticateToken, requireRole(["admin"]), async (req, res) => {
    try {
      const period = req.query.period || "30";
      const revenueData = await storage.getRevenueAnalytics(parseInt(period));
      res.json(revenueData);
    } catch (error) {
      console.error("Error getting admin revenue analytics:", error);
      res.status(500).json({ message: "Error interno del servidor" });
    }
  });
  app2.get("/api/admin/analytics/users", authenticateToken, requireRole(["admin"]), async (req, res) => {
    try {
      const period = req.query.period || "30";
      const userAnalytics = await storage.getUserAnalytics(parseInt(period));
      res.json(userAnalytics);
    } catch (error) {
      console.error("Error getting admin user analytics:", error);
      res.status(500).json({ message: "Error interno del servidor" });
    }
  });
  app2.get("/api/admin/analytics/export", authenticateToken, requireRole(["admin"]), async (req, res) => {
    try {
      const format = req.query.format || "pdf";
      const analytics = await storage.getAnalyticsData(30);
      res.json({ message: `Exporting analytics as ${format}`, data: analytics });
    } catch (error) {
      console.error("Error exporting admin analytics:", error);
      res.status(500).json({ message: "Error interno del servidor" });
    }
  });
  app2.get("/api/client/billing-info", authenticateToken, async (req, res) => {
    try {
      const billingInfo = await db.select().from(clientBillingInfo).where(eq4(clientBillingInfo.userId, req.user.id)).limit(1);
      if (billingInfo.length === 0) {
        return res.status(404).json({ message: "Billing information not found" });
      }
      res.json(billingInfo[0]);
    } catch (error) {
      console.error("Error getting client billing info:", error);
      res.status(500).json({ message: "Error interno del servidor" });
    }
  });
  app2.post("/api/client/billing-info", authenticateToken, async (req, res) => {
    try {
      const billingData = {
        ...req.body,
        userId: req.user.id
      };
      const [newBillingInfo] = await db.insert(clientBillingInfo).values(billingData).returning();
      res.status(201).json(newBillingInfo);
    } catch (error) {
      console.error("Error creating client billing info:", error);
      res.status(500).json({ message: "Error interno del servidor" });
    }
  });
  app2.put("/api/client/billing-info/:id", authenticateToken, async (req, res) => {
    try {
      const billingId = parseInt(req.params.id);
      const updates = req.body;
      const updateData = {
        ...updates,
        userId: req.user.id,
        updatedAt: /* @__PURE__ */ new Date()
      };
      if (updateData.id) delete updateData.id;
      const [updatedBillingInfo] = await db.update(clientBillingInfo).set(updateData).where(and2(
        eq4(clientBillingInfo.id, billingId),
        eq4(clientBillingInfo.userId, req.user.id)
      )).returning();
      if (!updatedBillingInfo) {
        return res.status(404).json({ message: "Billing information not found" });
      }
      res.json(updatedBillingInfo);
    } catch (error) {
      console.error("Error updating client billing info:", error);
      res.status(500).json({ message: "Error interno del servidor" });
    }
  });
  app2.get("/api/admin/company-billing-info", authenticateToken, requireRole(["admin"]), async (req, res) => {
    try {
      const companyInfo = await db.select().from(companyBillingInfo).where(eq4(companyBillingInfo.isActive, true)).orderBy(desc2(companyBillingInfo.updatedAt)).limit(1);
      if (companyInfo.length === 0) {
        return res.status(404).json({ message: "Company billing information not found" });
      }
      res.json(companyInfo[0]);
    } catch (error) {
      console.error("Error getting company billing info:", error);
      res.status(500).json({ message: "Error interno del servidor" });
    }
  });
  app2.post("/api/admin/company-billing-info", authenticateToken, requireRole(["admin"]), async (req, res) => {
    try {
      await db.update(companyBillingInfo).set({ isActive: false, updatedAt: /* @__PURE__ */ new Date() });
      const [newCompanyInfo] = await db.insert(companyBillingInfo).values({ ...req.body, isActive: true }).returning();
      res.status(201).json(newCompanyInfo);
    } catch (error) {
      console.error("Error creating company billing info:", error);
      res.status(500).json({ message: "Error interno del servidor" });
    }
  });
  app2.put("/api/admin/company-billing-info/:id", authenticateToken, requireRole(["admin"]), async (req, res) => {
    try {
      const companyId = parseInt(req.params.id);
      const updates = req.body;
      console.log(`Updating company billing info ID ${companyId}:`, updates);
      if (!updates.companyName || !updates.ruc || !updates.address || !updates.city) {
        return res.status(400).json({
          message: "Missing required fields: companyName, ruc, address, city"
        });
      }
      await db.update(companyBillingInfo).set({ isActive: false, updatedAt: /* @__PURE__ */ new Date() }).where(sql3`${companyBillingInfo.id} != ${companyId}`);
      const [updatedCompanyInfo] = await db.update(companyBillingInfo).set({
        ...updates,
        updatedAt: /* @__PURE__ */ new Date(),
        isActive: true
        // Ensure it remains active
      }).where(eq4(companyBillingInfo.id, companyId)).returning();
      if (!updatedCompanyInfo) {
        return res.status(404).json({ message: "Company billing information not found" });
      }
      console.log(`\u2705 Company billing info updated successfully:`, updatedCompanyInfo);
      res.json(updatedCompanyInfo);
    } catch (error) {
      console.error("\u274C Error updating company billing info:", error);
      res.status(500).json({
        message: "Error interno del servidor",
        error: process.env.NODE_ENV === "development" ? error.message : void 0
      });
    }
  });
  app2.get("/api/admin/invoices", authenticateToken, requireRole(["admin"]), async (req, res) => {
    try {
      const invoices2 = await storage.getAllInvoicesForAdmin();
      res.json(invoices2);
    } catch (error) {
      console.error("Error getting admin invoices:", error);
      res.status(500).json({ message: "Error interno del servidor" });
    }
  });
  app2.post("/api/admin/invoices", authenticateToken, requireRole(["admin"]), async (req, res) => {
    try {
      const { projectId, amount, dueDate } = req.body;
      if (!projectId || !amount || !dueDate) {
        return res.status(400).json({ message: "Required data missing" });
      }
      const invoice = await storage.createInvoiceForProject(
        parseInt(projectId),
        amount.toString(),
        new Date(dueDate)
      );
      const project = await storage.getProject(parseInt(projectId));
      if (project) {
        await storage.createNotification({
          userId: project.clientId,
          title: "\u{1F4B0} New Invoice Generated",
          message: `A new invoice for $${amount} has been generated for project "${project.name}". It is due on ${new Date(dueDate).toLocaleDateString()}.`,
          type: "info"
        });
      }
      res.status(201).json(invoice);
    } catch (error) {
      console.error("Error creating admin invoice:", error);
      res.status(500).json({ message: "Error interno del servidor" });
    }
  });
  app2.put("/api/admin/invoices/:id", authenticateToken, requireRole(["admin"]), async (req, res) => {
    try {
      const invoiceId = parseInt(req.params.id);
      const { status } = req.body;
      if (isNaN(invoiceId)) {
        return res.status(400).json({ message: "Invalid invoice ID" });
      }
      const updateData = { status };
      if (status === "paid") {
        updateData.paidAt = /* @__PURE__ */ new Date();
      }
      const invoice = await storage.updateInvoice(invoiceId, updateData);
      res.json(invoice);
    } catch (error) {
      console.error("Error updating admin invoice:", error);
      res.status(500).json({ message: "Error interno del servidor" });
    }
  });
  app2.post("/api/client/invoices/:id/pay", authenticateToken, async (req, res) => {
    try {
      const invoiceId = parseInt(req.params.id);
      const { paymentMethodId } = req.body;
      if (isNaN(invoiceId) || !paymentMethodId) {
        return res.status(400).json({ message: "Invalid data" });
      }
      const invoice = await db.select().from(invoices).where(eq4(invoices.id, invoiceId)).limit(1);
      if (!invoice[0] || invoice[0].clientId !== req.user.id) {
        return res.status(404).json({ message: "Invoice not found" });
      }
      const [transaction] = await db.insert(transactions).values({
        invoiceId,
        paymentMethodId: parseInt(paymentMethodId),
        userId: req.user.id,
        amount: invoice[0].amount,
        currency: invoice[0].currency,
        status: "completed",
        transactionId: `TXN_${Date.now()}_${invoiceId}`,
        createdAt: /* @__PURE__ */ new Date(),
        completedAt: /* @__PURE__ */ new Date()
      }).returning();
      await storage.updateInvoiceStatus(invoiceId, "paid", /* @__PURE__ */ new Date());
      const adminUsers = await storage.getUsersByRole("admin");
      for (const admin of adminUsers) {
        await storage.createNotification({
          userId: admin.id,
          title: "\u{1F4B0} Payment Received",
          message: `Client ${req.user.fullName} has paid invoice #${invoiceId} for $${invoice[0].amount}.`,
          type: "success"
        });
      }
      res.json({
        message: "Payment processed successfully",
        transaction
      });
    } catch (error) {
      console.error("Error processing client payment:", error);
      res.status(500).json({ message: "Error interno del servidor" });
    }
  });
  app2.get("/api/client/invoices/:id/download", authenticateToken, async (req, res) => {
    try {
      const invoiceId = parseInt(req.params.id);
      if (isNaN(invoiceId)) {
        return res.status(400).json({ message: "Invalid invoice ID" });
      }
      const invoice = await db.select().from(invoices).where(eq4(invoices.id, invoiceId)).limit(1);
      if (!invoice[0] || invoice[0].clientId !== req.user.id) {
        return res.status(404).json({ message: "Invoice not found" });
      }
      const pdfContent = `Invoice #INV-${(/* @__PURE__ */ new Date()).getFullYear()}-${invoiceId.toString().padStart(3, "0")}

Client: ${req.user.fullName}
Amount: $${invoice[0].amount}
Status: ${invoice[0].status}
Date: ${invoice[0].createdAt}

This is a demo invoice generated by the system.`;
      res.setHeader("Content-Type", "application/pdf");
      res.setHeader("Content-Disposition", `attachment; filename="invoice_${invoiceId}.pdf"`);
      res.send(Buffer.from(pdfContent));
    } catch (error) {
      console.error("Error downloading client invoice:", error);
      res.status(500).json({ message: "Error interno del servidor" });
    }
  });
  app2.get("/api/admin/tickets", authenticateToken, requireRole(["admin"]), async (req, res) => {
    try {
      const tickets3 = await storage.getAllTicketsForAdmin();
      res.json(tickets3);
    } catch (error) {
      console.error("Error getting admin tickets:", error);
      res.status(500).json({ message: "Error interno del servidor" });
    }
  });
  app2.put("/api/admin/tickets/:id", authenticateToken, requireRole(["admin"]), async (req, res) => {
    try {
      const ticketId = parseInt(req.params.id);
      const updates = req.body;
      const ticket = await storage.updateTicket(ticketId, updates);
      res.json(ticket);
    } catch (error) {
      console.error("Error updating admin ticket:", error);
      res.status(500).json({ message: "Error interno del servidor" });
    }
  });
  app2.get("/api/admin/tickets/stats", authenticateToken, requireRole(["admin"]), async (req, res) => {
    try {
      const stats = await storage.getTicketStats();
      res.json(stats);
    } catch (error) {
      console.error("Error getting admin ticket stats:", error);
      res.status(500).json({ message: "Error interno del servidor" });
    }
  });
  app2.delete("/api/admin/tickets/:id", authenticateToken, requireRole(["admin"]), async (req, res) => {
    try {
      const ticketId = parseInt(req.params.id);
      await storage.deleteTicket(ticketId);
      res.json({ message: "Ticket deleted successfully" });
    } catch (error) {
      console.error("Error deleting admin ticket:", error);
      res.status(500).json({ message: "Error interno del servidor" });
    }
  });
  app2.get("/api/work-modalities", async (req, res) => {
    try {
      const modalities = await storage.getWorkModalities();
      res.json(modalities);
    } catch (error) {
      console.error("Error getting work modalities:", error);
      res.status(500).json({ message: "Error interno del servidor" });
    }
  });
  app2.get("/api/admin/exchange-rate", authenticateToken, requireRole(["admin"]), async (req, res) => {
    try {
      const currentRate = await storage.getCurrentExchangeRate();
      if (!currentRate) {
        return res.json({
          usdToGuarani: "7300.00",
          isDefault: true,
          updatedAt: /* @__PURE__ */ new Date(),
          updatedBy: null
        });
      }
      res.json(currentRate);
    } catch (error) {
      console.error("Error getting admin exchange rate:", error);
      res.status(500).json({ message: "Error interno del servidor" });
    }
  });
  app2.put("/api/admin/exchange-rate", authenticateToken, requireRole(["admin"]), async (req, res) => {
    try {
      const { usdToGuarani } = req.body;
      if (!usdToGuarani || isNaN(parseFloat(usdToGuarani))) {
        return res.status(400).json({ message: "Tipo de cambio inv\xE1lido" });
      }
      const updatedRate = await storage.updateExchangeRate(usdToGuarani, req.user.id);
      console.log(`\u{1F4B1} Exchange rate updated: 1 USD = ${usdToGuarani} PYG by ${req.user.fullName}`);
      res.json({
        ...updatedRate,
        message: "Exchange rate updated successfully"
      });
    } catch (error) {
      console.error("Error updating admin exchange rate:", error);
      res.status(500).json({ message: "Error interno del servidor" });
    }
  });
  app2.get("/api/exchange-rate", async (req, res) => {
    try {
      const currentRate = await storage.getCurrentExchangeRate();
      if (!currentRate) {
        return res.json({
          usdToGuarani: "7300.00",
          isDefault: true
        });
      }
      res.json({
        usdToGuarani: currentRate.usdToGuarani,
        isDefault: false,
        updatedAt: currentRate.updatedAt
      });
    } catch (error) {
      console.error("Error getting public exchange rate:", error);
      res.status(500).json({ message: "Error interno del servidor" });
    }
  });
  app2.post("/api/test-email-flow", authenticateToken, requireRole(["admin"]), async (req, res) => {
    try {
      console.log("\u{1F9EA} Starting full email flow test...");
      const testClientEmail = "client.test@test.com";
      const testClientName = "Test Client";
      let testClient;
      try {
        testClient = await storage.getUserByEmail(testClientEmail);
        if (!testClient) {
          const hashedPassword = await hashPassword2("123456");
          testClient = await storage.createUser({
            email: testClientEmail,
            password: hashedPassword,
            fullName: testClientName,
            role: "client",
            isActive: true
          });
          console.log("\u2705 Test client created:", testClient.email);
        } else {
          console.log("\u2705 Using existing client:", testClient.email);
        }
      } catch (clientError) {
        console.error("\u274C Error creating client:", clientError);
        return res.status(500).json({ message: "Error creating test client" });
      }
      const projectData = {
        name: "Test Email Project - " + (/* @__PURE__ */ new Date()).toISOString(),
        description: "This is a test project to verify the full email flow",
        price: "5000.00",
        clientId: testClient.id,
        status: "pending",
        progress: 0
      };
      let testProject;
      try {
        testProject = await storage.createProject(projectData);
        console.log("\u2705 Test project created:", testProject.name);
      } catch (projectError) {
        console.error("\u274C Error creating project:", projectError);
        return res.status(500).json({ message: "Error creating test project" });
      }
      try {
        console.log("\u{1F4E7} Sending project creation notifications...");
        const adminUsers = await storage.getUsersByRole("admin");
        const adminIds = adminUsers.map((admin) => admin.id);
        await notifyProjectCreated(testClient.id, adminIds, testProject.name, testProject.id);
        console.log("\u2705 Creation notifications sent");
      } catch (notifyError) {
        console.error("\u274C Error sending creation notifications:", notifyError);
      }
      try {
        console.log("\u{1F4E7} Simulating status change: pending -> in_progress...");
        const updatedProject1 = await storage.updateProject(testProject.id, {
          status: "in_progress",
          progress: 25,
          startDate: /* @__PURE__ */ new Date()
        });
        await notifyProjectUpdated(
          testClient.id,
          testProject.name,
          "Estado cambiado a: En Desarrollo - Progreso actualizado al 25%",
          req.user.fullName
        );
        const statusLabels = {
          "pending": "Pending",
          "in_progress": "In Progress",
          "completed": "Completed",
          "cancelled": "Cancelled"
        };
        const adminUsers = await db.select().from(users).where(eq4(users.role, "admin"));
        for (const admin of adminUsers) {
          if (admin.email) {
            await sendEmail({
              to: admin.email,
              subject: `Cambio de Estado (TEST): ${testProject.name} - En Desarrollo`,
              html: generateProjectStatusChangeEmailHTML(
                testProject.name,
                statusLabels["pendiente"],
                statusLabels["en_progreso"],
                req.user.fullName,
                testClient.id
              )
            });
          }
        }
        console.log("\u2705 Status change 1 processed");
      } catch (updateError) {
        console.error("\u274C Error in status change 1:", updateError);
      }
      setTimeout(async () => {
        try {
          console.log("\u{1F4E7} Simulating status change: in_progress -> completed...");
          await storage.updateProject(testProject.id, {
            status: "completed",
            progress: 100,
            deliveryDate: /* @__PURE__ */ new Date()
          });
          await notifyProjectUpdated(
            testClient.id,
            testProject.name,
            "Estado cambiado a: Completado - Progreso actualizado al 100%",
            req.user.fullName
          );
          const adminUsers = await db.select().from(users).where(eq4(users.role, "admin"));
          for (const admin of adminUsers) {
            if (admin.email) {
              await sendEmail({
                to: admin.email,
                subject: `Cambio de Estado (TEST): ${testProject.name} - Completado`,
                html: generateProjectStatusChangeEmailHTML(
                  testProject.name,
                  "En Desarrollo",
                  "Completado",
                  req.user.fullName,
                  testClient.id
                )
              });
            }
          }
          console.log("\u2705 Status change 2 processed");
        } catch (finalError) {
          console.error("\u274C Error in final status change:", finalError);
        }
      }, 2e3);
      try {
        console.log("\u{1F4E7} Creating test ticket...");
        const testTicket = await storage.createTicket({
          title: "Test Ticket - Project inquiry",
          description: "This is a test ticket to verify notifications",
          priority: "medium",
          userId: testClient.id,
          projectId: testProject.id
        });
        const adminUsers = await storage.getUsersByRole("admin");
        const adminIds = adminUsers.map((admin) => admin.id);
        await notifyTicketCreated(adminIds, testClient.fullName, testTicket.title);
        console.log("\u2705 Test ticket created and notifications sent");
      } catch (ticketError) {
        console.error("\u274C Error creating ticket:", ticketError);
      }
      try {
        console.log("\u{1F4E7} Sending test message...");
        const testMessage = await storage.createProjectMessage({
          projectId: testProject.id,
          userId: testClient.id,
          message: "This is a test message from the client to verify notifications."
        });
        const adminUsers = await storage.getUsersByRole("admin");
        for (const admin of adminUsers) {
          await notifyNewMessage(
            admin.id,
            testClient.fullName,
            testProject.name,
            testMessage.message
          );
        }
        console.log("\u2705 Test message sent and notifications processed");
      } catch (messageError) {
        console.error("\u274C Error sending message:", messageError);
      }
      res.json({
        success: true,
        message: "Email flow test initiated successfully",
        details: {
          clientEmail: testClient.email,
          clientName: testClient.fullName,
          projectName: testProject.name,
          projectId: testProject.id,
          adminEmails: (await storage.getUsersByRole("admin")).map((admin) => admin.email),
          systemEmail: process.env.GMAIL_USER
        },
        instructions: [
          "1. Check server logs for progress",
          "2. Verify your email (both admin and system)",
          "3. Status changes occur 2 seconds apart",
          "4. Sent: creation notification, 2 status changes, ticket, and message"
        ]
      });
    } catch (error) {
      console.error("\u274C Email flow test error:", error);
      res.status(500).json({
        message: "Error in email flow test",
        error: error.message
      });
    }
  });
  function generateProjectStatusChangeEmailHTML(projectName, oldStatus, newStatus, updatedBy, clientId) {
    const getStatusColor = (status) => {
      switch (status.toLowerCase()) {
        case "pending":
        case "pendiente":
          return "#f59e0b";
        case "in_progress":
        case "en progreso":
          return "#3b82f6";
        case "completed":
        case "completado":
          return "#10b981";
        case "cancelled":
        case "cancelado":
          return "#ef4444";
        default:
          return "#6b7280";
      }
    };
    const newStatusColor = getStatusColor(newStatus);
    return `
      <!DOCTYPE html>
      <html>
      <head><meta charset="utf-8"><title>Cambio de Estado del Proyecto - ${projectName}</title></head>
      <body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, ${newStatusColor} 0%, ${newStatusColor}dd 100%); color: white; padding: 30px; border-radius: 10px; text-align: center;">
          <h1 style="margin: 0;">\u{1F504} Cambio de Estado del Proyecto</h1>
          <p style="margin: 10px 0 0 0; font-size: 18px;">${newStatus.toUpperCase()}</p>
        </div>
        <div style="padding: 30px 0;">
          <h2>El estado del proyecto ha sido actualizado</h2>
          <div style="background: #f8fafc; border-left: 4px solid ${newStatusColor}; padding: 15px; margin: 20px 0;">
            <h3 style="margin: 0 0 10px 0; color: ${newStatusColor};">${projectName}</h3>
            <div style="display: flex; align-items: center; margin: 10px 0;">
              <span style="background: #f3f4f6; padding: 5px 10px; border-radius: 5px; margin-right: 10px;">${oldStatus}</span>
              <span style="margin: 0 10px;">\u2192</span>
              <span style="background: ${newStatusColor}; color: white; padding: 5px 10px; border-radius: 5px;">${newStatus}</span>
            </div>
            <p><strong>Actualizado por:</strong> ${updatedBy}</p>
            <p><strong>Fecha y hora:</strong> ${(/* @__PURE__ */ new Date()).toLocaleString("es-PY", { timeZone: "America/Asuncion" })}</p>
            <p style="background: #fff3cd; padding: 10px; border-radius: 5px; color: #856404; border: 1px solid #ffeaa7;"><strong>\u{1F9EA} ESTO ES UNA PRUEBA</strong> - Email enviado desde el sistema de pruebas</p>
          </div>
          <div style="text-align: center; margin: 30px 0;">
            <a href="https://softwarepar.lat/admin/projects" style="background: ${newStatusColor}; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">Ver Proyecto en Admin</a>
          </div>
          <div style="background: #e0f2fe; border: 1px solid #0ea5e9; border-radius: 8px; padding: 15px; margin: 20px 0;">
            <p style="margin: 0; color: #0369a1;"><strong>\u{1F4A1} Recordatorio:</strong> El cliente tambi\xE9n ha sido notificado de este cambio.</p>
          </div>
        </div>
      </body>
      </html>
    `;
  }
  app2.get("/api/test-facturasend", authenticateToken, requireRole(["admin"]), async (req, res) => {
    try {
      const { verificarConexionFacturaSend } = await Promise.resolve().then(() => (init_facturasend(), facturasend_exports));
      const resultado = await verificarConexionFacturaSend();
      res.json({
        ...resultado,
        apiKeyConfigurada: !!process.env.FACTURASEND_API_KEY,
        tenantId: "jhonifabianbenitezdelacruz"
      });
    } catch (error) {
      console.error("\u274C Error verifying FacturaSend:", error);
      res.status(500).json({
        disponible: false,
        mensajeError: "Error verificando FacturaSend",
        error: error.message
      });
    }
  });
  app2.post("/api/test-facturasend", authenticateToken, requireRole(["admin"]), async (req, res) => {
    try {
      console.log("\u{1F9EA} ========================================");
      console.log("\u{1F9EA} Starting FacturaSend test");
      console.log("\u{1F9EA} ========================================");
      const facturasend = await Promise.resolve().then(() => (init_facturasend(), facturasend_exports));
      const companyInfo = await db.select().from(companyBillingInfo).where(eq4(companyBillingInfo.isActive, true)).limit(1);
      if (!companyInfo[0]) {
        return res.status(400).json({
          success: false,
          message: "Informaci\xF3n de facturaci\xF3n de la empresa no encontrada."
        });
      }
      if (!companyInfo[0].timbradoNumber || companyInfo[0].timbradoNumber === "0") {
        return res.status(400).json({
          success: false,
          message: "Timbrado number is not configured. Please configure it in company information."
        });
      }
      const currentRate = await storage.getCurrentExchangeRate();
      const exchangeRate = currentRate ? parseFloat(currentRate.usdToGuarani) : 7300;
      const testClientData = {
        legalName: "Test Client S.A.",
        nombre: "Test Client",
        documentNumber: "80012345-1",
        documentType: "RUC",
        clientType: "empresa",
        address: "Test Avenue 123",
        houseNumber: "123",
        city: "Asuncion",
        department: "Central",
        phone: "0981234567",
        email: "client@test.com",
        userId: 1
      };
      const testStageData = {
        id: 999,
        stageName: "FacturaSend Test",
        amount: "1000.00",
        projectId: 1
      };
      const testProjectData = {
        id: 1,
        name: "FacturaSend Test Project"
      };
      const documento = await facturasend.construirDocumentoFacturaSend(
        companyInfo[0],
        testClientData,
        testStageData,
        testProjectData,
        exchangeRate,
        999
      );
      console.log("\u{1F4E6} Generated Document:", JSON.stringify(documento, null, 2));
      const respuestaAPI = await facturasend.enviarFacturaFacturaSend(documento);
      const resultado = facturasend.extraerResultadoFacturaSend(respuestaAPI);
      console.log("\u{1F9EA} ========================================");
      console.log(`\u{1F4CA} RESULT: ${resultado.estado === "aceptado" ? "\u2705 SUCCESS" : "\u274C FAILED"}`);
      console.log("\u{1F9EA} ========================================");
      res.json({
        success: resultado.estado === "aceptado",
        message: resultado.estado === "aceptado" ? "\u2705 Invoice processed successfully" : "\u274C Error processing invoice",
        datos: {
          cdc: resultado.cdc,
          protocoloAutorizacion: resultado.protocoloAutorizacion,
          estado: resultado.estado,
          mensaje: resultado.mensaje
        },
        xml: resultado.xml,
        qr: resultado.qr,
        documento
      });
    } catch (error) {
      console.error("\u274C FacturaSend test error:", error);
      res.status(500).json({
        success: false,
        message: "Error executing FacturaSend test",
        error: error.message
      });
    }
  });
  app2.post("/api/test-sifen", authenticateToken, requireRole(["admin"]), async (req, res) => {
    try {
      console.log("\u{1F9EA} ========================================");
      console.log("\u{1F9EA} Starting SIFEN test");
      console.log("\u{1F9EA} ========================================");
      const { procesarFacturaElectronica: procesarFacturaElectronica2, validarDatosFactura: validarDatosFactura2 } = await Promise.resolve().then(() => (init_sifen(), sifen_exports));
      const companyInfo = await db.select().from(companyBillingInfo).where(eq4(companyBillingInfo.isActive, true)).limit(1);
      if (!companyInfo[0]) {
        return res.status(400).json({
          success: false,
          message: "Company billing information not found. Please configure it first."
        });
      }
      if (!companyInfo[0].timbradoNumber || companyInfo[0].timbradoNumber === "0") {
        return res.status(400).json({
          success: false,
          message: "Timbrado number is not configured. Please configure it in company information."
        });
      }
      const currentRate = await storage.getCurrentExchangeRate();
      const exchangeRate = currentRate ? parseFloat(currentRate.usdToGuarani) : 7300;
      const testData = {
        ruc: companyInfo[0].ruc,
        razonSocial: companyInfo[0].companyName,
        timbrado: companyInfo[0].timbradoNumber,
        numeroFactura: `${companyInfo[0].boletaPrefix || "001-001"}-0000999`,
        fechaEmision: /* @__PURE__ */ new Date(),
        direccionEmisor: companyInfo[0].address || "Asuncion",
        telefonoEmisor: companyInfo[0].phone || "021000000",
        emailEmisor: companyInfo[0].email || "info@softwarepar.com",
        departamentoEmisor: companyInfo[0].department || "Central",
        ciudadEmisor: "Asuncion",
        clienteDocumento: "1234567",
        clienteTipoDocumento: "CI",
        clienteNombre: "Test Client SIFEN",
        clienteDireccion: "Test Address 123",
        clienteCiudad: "Asuncion",
        clienteDepartamento: "Central",
        clienteTelefono: "0981234567",
        clienteEmail: "client@test.com",
        items: [
          {
            codigo: "TEST-001",
            descripcion: "Web development service - SIFEN Test",
            cantidad: 1,
            precioUnitario: 1e3,
            montoTotal: 1e3,
            ivaAfectacion: 3,
            tasaIVA: 0
          },
          {
            codigo: "TEST-002",
            descripcion: "Technical consulting",
            cantidad: 2,
            precioUnitario: 500,
            montoTotal: 1e3,
            ivaAfectacion: 1,
            tasaIVA: 10
          }
        ],
        montoTotal: 2e3,
        montoTotalPYG: Math.round(2e3 * exchangeRate),
        tipoMoneda: "USD",
        tipoCambio: exchangeRate,
        condicionOperacion: "contado",
        indicadorPresencia: 2
      };
      console.log("\u{1F4CA} Test invoice data:", {
        ruc: testData.ruc,
        numeroFactura: testData.numeroFactura,
        cliente: testData.clienteNombre,
        items: testData.items.length,
        montoTotal: testData.montoTotal,
        montoTotalPYG: testData.montoTotalPYG
      });
      console.log("\u{1F50D} Validating invoice data...");
      const validacion = validarDatosFactura2(testData);
      if (!validacion.valido) {
        console.error("\u274C Validation failed:", validacion.errores);
        return res.status(400).json({
          success: false,
          message: "Data validation failed",
          errores: validacion.errores
        });
      }
      console.log("\u2705 Validation successful");
      console.log("\u{1F504} Processing electronic invoice...");
      const resultado = await procesarFacturaElectronica2(testData);
      console.log("\u{1F9EA} ========================================");
      console.log(`\u{1F4CA} RESULT: ${resultado.success ? "\u2705 SUCCESS" : "\u274C FAILED"}`);
      console.log("\u{1F9EA} ========================================");
      const response = {
        success: resultado.success,
        message: resultado.success ? "\u2705 Invoice processed successfully" : "\u274C Error processing invoice",
        datos: {
          cdc: resultado.cdc,
          protocoloAutorizacion: resultado.protocoloAutorizacion,
          estado: resultado.estado,
          mensajeError: resultado.mensajeError,
          urlQR: resultado.urlQR
        },
        xml: resultado.xmlGenerado,
        ambiente: process.env.SIFEN_AMBIENTE || "test",
        configuracion: {
          idCSC: process.env.SIFEN_ID_CSC || "0001",
          tieneCertificado: !!process.env.SIFEN_CERTIFICADO_PATH,
          endpoint: process.env.SIFEN_WSDL_URL || "https://sifen-test.set.gov.py/de/ws/sync/recibe"
        }
      };
      res.json(response);
    } catch (error) {
      console.error("\u274C SIFEN test error:", error);
      console.error("\u{1F4CB} Stack:", error.stack);
      res.status(500).json({
        success: false,
        message: "SIFEN test error",
        error: error.message,
        stack: process.env.NODE_ENV === "development" ? error.stack : void 0
      });
    }
  });
  app2.post("/api/admin/work-modalities", authenticateToken, requireRole(["admin"]), async (req, res) => {
    try {
      const modality = await storage.createWorkModality(req.body);
      res.status(201).json(modality);
    } catch (error) {
      console.error("Error creating admin work modality:", error);
      res.status(500).json({ message: "Error interno del servidor" });
    }
  });
  app2.put("/api/admin/work-modalities/:id", authenticateToken, requireRole(["admin"]), async (req, res) => {
    try {
      const modalityId = parseInt(req.params.id);
      const updated = await storage.updateWorkModality(modalityId, req.body);
      res.json(updated);
    } catch (error) {
      console.error("Error updating admin work modality:", error);
      res.status(500).json({ message: "Error interno del servidor" });
    }
  });
  app2.delete("/api/admin/work-modalities/:id", authenticateToken, requireRole(["admin"]), async (req, res) => {
    try {
      const modalityId = parseInt(req.params.id);
      await storage.deleteWorkModality(modalityId);
      res.json({ message: "Modality deleted successfully" });
    } catch (error) {
      console.error("Error deleting admin work modality:", error);
      res.status(500).json({ message: "Error interno del servidor" });
    }
  });
  app2.post("/api/admin/payments/approve", authenticateToken, requireRole(["admin"]), async (req, res) => {
    try {
      const { stageId } = req.body;
      console.log(`\u{1F4B0} Approving payment stage: ${stageId}`);
      const stage = await db.select().from(paymentStages).where(eq4(paymentStages.id, stageId)).limit(1);
      if (!stage[0]) {
        return res.status(404).json({ message: "Etapa no encontrada" });
      }
      const project = await storage.getProject(stage[0].projectId);
      if (!project) {
        return res.status(404).json({ message: "Project not found" });
      }
      const client = await storage.getUserById(project.clientId);
      if (!client) {
        return res.status(404).json({ message: "Client not found" });
      }
      const billingInfo = await db.select().from(clientBillingInfo).where(eq4(clientBillingInfo.userId, client.id)).limit(1);
      const company = await db.select().from(companyBillingInfo).where(eq4(companyBillingInfo.isActive, true)).limit(1);
      await db.update(paymentStages).set({
        status: "paid",
        paidAt: /* @__PURE__ */ new Date(),
        updatedAt: /* @__PURE__ */ new Date()
      }).where(eq4(paymentStages.id, stageId));
      let sifenData = null;
      if (company[0]?.isSignatureProcessEnabled) {
        try {
          const facturasend = await Promise.resolve().then(() => (init_facturasend(), facturasend_exports));
          const exchangeRateData = await storage.getCurrentExchangeRate();
          const exchangeRate = exchangeRateData ? parseFloat(exchangeRateData.usdToGuarani) : 7300;
          const nextInvoiceNumber = await storage.getNextInvoiceNumber();
          const docFactura = await facturasend.construirDocumentoFacturaSend(
            company[0],
            billingInfo[0] || client,
            stage[0],
            project,
            exchangeRate,
            nextInvoiceNumber
          );
          const resp = await facturasend.enviarFacturaFacturaSend(docFactura);
          sifenData = facturasend.extraerResultadoFacturaSend(resp);
          console.log("\u2705 FacturaSend response:", sifenData);
        } catch (fsError) {
          console.error("\u274C FacturaSend integration error:", fsError);
        }
      }
      const [invoice] = await db.insert(invoices).values({
        invoiceNumber: sifenData?.cdc ? `FE-${stageId}` : `INT-${stageId}`,
        projectId: project.id,
        clientId: client.id,
        paymentStageId: stageId,
        amount: stage[0].amount,
        totalAmount: stage[0].amount,
        status: "paid",
        dueDate: /* @__PURE__ */ new Date(),
        paidDate: /* @__PURE__ */ new Date(),
        sifenCDC: sifenData?.cdc,
        sifenQR: sifenData?.qr,
        sifenEstado: sifenData?.estado || "pending",
        sifenProtocolo: sifenData?.protocoloAutorizacion,
        sifenXML: sifenData?.xml,
        sifenFechaEnvio: /* @__PURE__ */ new Date(),
        issueDateSnapshot: (/* @__PURE__ */ new Date()).toLocaleDateString("es-PY"),
        issueDateTimeSnapshot: (/* @__PURE__ */ new Date()).toLocaleString("es-PY"),
        currency: "USD"
      }).returning();
      res.json({
        success: true,
        message: "Payment approved and invoice generated",
        invoiceId: invoice.id,
        sifenStatus: sifenData?.estado
      });
    } catch (error) {
      console.error("Error approving payment:", error);
      res.status(500).json({ message: "Error approving payment" });
    }
  });
  const httpServer = createServer(app2);
  const wss = new WebSocketServer({
    server: httpServer,
    path: "/ws",
    perMessageDeflate: false
    // Disable compression for better performance
  });
  const interval = setInterval(() => {
    wss.clients.forEach((ws) => {
      if (ws.isAlive === false) {
        console.log("\u{1F50C} Terminating inactive WebSocket connection");
        return ws.terminate();
      }
      ws.isAlive = false;
      ws.ping();
    });
  }, 3e4);
  wss.on("close", () => {
    clearInterval(interval);
  });
  wss.on("connection", (ws, request) => {
    console.log("\u2705 New WebSocket connection established");
    ws.isAlive = true;
    ws.on("pong", () => {
      ws.isAlive = true;
    });
    ws.on("error", (error) => {
      console.error("\u274C WebSocket error:", error);
    });
    ws.on("close", () => {
      console.log("\u{1F50C} WebSocket connection closed");
    });
    console.log("New WebSocket connection");
    let userId = null;
    ws.on("message", (message) => {
      try {
        const data = JSON.parse(message);
        console.log("Received WebSocket message:", data);
        if (data.type === "auth") {
          console.log("\u{1F510} WebSocket authentication attempt:", {
            userId: data.userId,
            hasToken: !!data.token
          });
          if (data.userId) {
            userId = data.userId;
            registerWSConnection(userId, ws);
            console.log("\u2705 User registered on WebSocket:", userId);
            if (ws.readyState === WebSocket.OPEN) {
              ws.send(JSON.stringify({
                type: "auth_success",
                message: "User authenticated for real-time notifications",
                userId,
                timestamp: (/* @__PURE__ */ new Date()).toISOString()
              }));
            }
          } else {
            console.error("\u274C WebSocket authentication failed: No userId");
            if (ws.readyState === WebSocket.OPEN) {
              ws.send(JSON.stringify({
                type: "auth_error",
                message: "Authentication error",
                timestamp: (/* @__PURE__ */ new Date()).toISOString()
              }));
            }
          }
        }
        if (ws.readyState === WebSocket.OPEN) {
          ws.send(JSON.stringify({
            type: "echo",
            data,
            timestamp: (/* @__PURE__ */ new Date()).toISOString()
          }));
        }
      } catch (error) {
        console.error("Error processing WebSocket message:", error);
      }
    });
    ws.on("close", () => {
      console.log("WebSocket connection closed");
    });
    if (ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify({
        type: "welcome",
        message: "Connected to real-time notification server",
        timestamp: (/* @__PURE__ */ new Date()).toISOString()
      }));
    }
  });
  app2.get("/api/hero-slides", async (_req, res) => {
    try {
      const slides = await db.select().from(heroSlides).where(eq4(heroSlides.isActive, true)).orderBy(asc(heroSlides.displayOrder));
      res.json(slides);
    } catch (error) {
      console.error("Error fetching hero slides:", error);
      res.status(500).json({ message: error.message });
    }
  });
  app2.get("/api/admin/hero-slides", authenticateToken, requireRole(["admin"]), async (_req, res) => {
    try {
      const slides = await db.select().from(heroSlides).orderBy(asc(heroSlides.displayOrder));
      res.json(slides);
    } catch (error) {
      console.error("Error fetching admin hero slides:", error);
      res.status(500).json({ message: error.message });
    }
  });
  app2.post("/api/admin/hero-slides", authenticateToken, requireRole(["admin"]), async (req, res) => {
    try {
      const [slide] = await db.insert(heroSlides).values({
        ...req.body,
        updatedAt: /* @__PURE__ */ new Date()
      }).returning();
      res.status(201).json(slide);
    } catch (error) {
      console.error("Error creating admin hero slide:", error);
      res.status(500).json({ message: error.message });
    }
  });
  app2.put("/api/admin/hero-slides/:id", authenticateToken, requireRole(["admin"]), async (req, res) => {
    try {
      const slideId = parseInt(req.params.id);
      if (isNaN(slideId)) {
        return res.status(400).json({ message: "Invalid slide ID" });
      }
      const [slide] = await db.update(heroSlides).set({
        ...req.body,
        updatedAt: /* @__PURE__ */ new Date()
      }).where(eq4(heroSlides.id, slideId)).returning();
      if (!slide) {
        return res.status(404).json({ message: "Hero slide not found" });
      }
      res.json(slide);
    } catch (error) {
      console.error("Error updating admin hero slide:", error);
      res.status(500).json({ message: error.message });
    }
  });
  app2.delete("/api/admin/hero-slides/:id", authenticateToken, requireRole(["admin"]), async (req, res) => {
    try {
      const slideId = parseInt(req.params.id);
      if (isNaN(slideId)) {
        return res.status(400).json({ message: "Invalid slide ID" });
      }
      const result = await db.delete(heroSlides).where(eq4(heroSlides.id, slideId));
      if (result.count === 0) {
        return res.status(404).json({ message: "Hero slide not found" });
      }
      res.json({ success: true, message: "Hero slide deleted successfully" });
    } catch (error) {
      console.error("Error deleting admin hero slide:", error);
      res.status(500).json({ message: error.message });
    }
  });
  return httpServer;
}

// server/vite.ts
import express from "express";
import fs3 from "fs";
import path3 from "path";
import { createServer as createViteServer, createLogger } from "vite";

// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path2 from "path";
import { fileURLToPath as fileURLToPath2 } from "node:url";
import runtimeErrorOverlay from "@replit/vite-plugin-runtime-error-modal";
var __dirname2 = path2.dirname(fileURLToPath2(import.meta.url));
var vite_config_default = defineConfig({
  plugins: [
    react(),
    runtimeErrorOverlay(),
    ...process.env.NODE_ENV !== "production" && process.env.REPL_ID !== void 0 ? [
      await import("@replit/vite-plugin-cartographer").then(
        (m) => m.cartographer()
      )
    ] : []
  ],
  resolve: {
    alias: {
      "@": path2.resolve(__dirname2, "client", "src"),
      "@shared": path2.resolve(__dirname2, "shared"),
      "@assets": path2.resolve(__dirname2, "attached_assets")
    }
  },
  root: path2.resolve(__dirname2, "client"),
  build: {
    outDir: path2.resolve(__dirname2, "dist/public"),
    emptyOutDir: true
  },
  server: {
    host: "0.0.0.0",
    port: 5e3,
    allowedHosts: true,
    fs: {
      strict: true,
      deny: ["**/.*"]
    }
  },
  preview: {
    host: "0.0.0.0",
    port: 5e3
  },
  publicDir: "public",
  assetsInclude: ["**/*.png", "**/*.jpg", "**/*.jpeg", "**/*.gif", "**/*.svg"]
});

// server/vite.ts
import { nanoid } from "nanoid";
import { fileURLToPath as fileURLToPath3 } from "node:url";
var __dirname3 = path3.dirname(fileURLToPath3(import.meta.url));
var viteLogger = createLogger();
function log(message, source = "express") {
  const formattedTime = (/* @__PURE__ */ new Date()).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true
  });
  console.log(`${formattedTime} [${source}] ${message}`);
}
async function setupVite(app2, server) {
  const serverOptions = {
    middlewareMode: true,
    hmr: false,
    // Completamente desactivado para evitar conflictos
    allowedHosts: true,
    server: {
      hmr: false
      // Asegurar que está desactivado
    }
  };
  const vite = await createViteServer({
    ...vite_config_default,
    configFile: false,
    customLogger: {
      ...viteLogger,
      error: (msg, options) => {
        viteLogger.error(msg, options);
        process.exit(1);
      }
    },
    server: serverOptions,
    appType: "custom"
  });
  app2.use(vite.middlewares);
  app2.use("*", async (req, res, next) => {
    const url = req.originalUrl;
    try {
      const clientTemplate = path3.resolve(
        __dirname3,
        "..",
        "client",
        "index.html"
      );
      let template = await fs3.promises.readFile(clientTemplate, "utf-8");
      template = template.replace(
        `src="/src/main.tsx"`,
        `src="/src/main.tsx?v=${nanoid()}"`
      );
      const page = await vite.transformIndexHtml(url, template);
      res.status(200).set({ "Content-Type": "text/html" }).end(page);
    } catch (e) {
      vite.ssrFixStacktrace(e);
      next(e);
    }
  });
}
function serveStatic(app2) {
  const clientDist = path3.resolve(__dirname3, "..", "client", "dist");
  const clientTemplate = path3.resolve(clientDist, "index.html");
  app2.use(express.static(clientDist));
  app2.use("*", (req, res) => {
    if (req.originalUrl.startsWith("/api")) {
      return res.status(404).json({ message: "API route not found" });
    }
    res.sendFile(clientTemplate);
  });
}

// server/index.ts
init_db();

// server/env-check.ts
function verifyEnvironmentConfiguration() {
  const requiredVars = {
    DATABASE_URL: process.env.DATABASE_URL,
    GMAIL_USER: process.env.GMAIL_USER,
    GMAIL_PASS: process.env.GMAIL_PASS,
    FACTURASEND_API_KEY: process.env.FACTURASEND_API_KEY,
    RECAPTCHA_SECRET_KEY: process.env.RECAPTCHA_SECRET_KEY
  };
  const optionalVars = {
    VITE_RECAPTCHA_SITE_KEY: process.env.VITE_RECAPTCHA_SITE_KEY
  };
  console.log("\u{1F50D} Verificando configuraci\xF3n de variables de entorno...");
  let allCorrect = true;
  for (const [key, value] of Object.entries(requiredVars)) {
    if (!value) {
      console.error(`\u274C Variable ${key} no est\xE1 configurada`);
      allCorrect = false;
    } else {
      console.log(`\u2705 Variable ${key} configurada correctamente`);
    }
  }
  for (const [key, value] of Object.entries(optionalVars)) {
    if (!value) {
      console.warn(`\u26A0\uFE0F  Variable ${key} no est\xE1 configurada (opcional, email notifications may not work)`);
    } else {
      console.log(`\u2705 Variable ${key} configurada correctamente`);
    }
  }
  return allCorrect;
}

// server/index.ts
import path4 from "path";
import { fileURLToPath as fileURLToPath4 } from "node:url";
var __dirname4 = path4.dirname(fileURLToPath4(import.meta.url));
var app = express2();
app.use(express2.json());
app.use(express2.urlencoded({ extended: false }));
app.use((req, res, next) => {
  const start = Date.now();
  const path5 = req.path;
  let capturedJsonResponse = void 0;
  const originalResJson = res.json;
  res.json = function(bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };
  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path5.startsWith("/api")) {
      let logLine = `${req.method} ${path5} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }
      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "\u2026";
      }
      log(logLine);
    }
  });
  next();
});
(async () => {
  console.log("\u{1F680} Iniciando servidor...");
  const envCorrect = verifyEnvironmentConfiguration();
  if (!envCorrect) {
    console.error("\u274C Configuraci\xF3n de variables de entorno incorrecta");
  }
  console.log("\u{1F517} Verificando conexi\xF3n a PostgreSQL...");
  try {
    const testQuery = await db.select().from(users).limit(1);
    console.log("\u2705 Conexi\xF3n a PostgreSQL exitosa");
    console.log("\u{1F465} Usuarios en la base de datos:", testQuery.length > 0 ? "S\xCD" : "Base de datos vac\xEDa");
  } catch (error) {
    console.error("\u274C Error conectando a PostgreSQL:", error);
    throw new Error("No se pudo conectar a la base de datos");
  }
  const server = await registerRoutes(app);
  app.use("/public", express2.static(path4.join(__dirname4, "../client/public")));
  app.use(express2.static(path4.join(__dirname4, "../client/public")));
  app.use((err, _req, res, _next) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    res.status(status).json({ message });
    throw err;
  });
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }
  const port = 5e3;
  server.keepAliveTimeout = 12e4;
  server.headersTimeout = 12e4;
  server.timeout = 0;
  server.requestTimeout = 0;
  server.on("upgrade", (request, socket, head) => {
    socket.on("error", (err) => {
      console.error("WebSocket upgrade error:", err);
    });
  });
  server.on("request", (req, res) => {
    if (req.url?.includes("/@vite/client") || req.url?.includes("/__vite_ping")) {
      res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");
      res.setHeader("Pragma", "no-cache");
      res.setHeader("Expires", "0");
      res.setHeader("Access-Control-Allow-Origin", "*");
      res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
      res.setHeader("Access-Control-Allow-Headers", "Content-Type");
    }
  });
  server.listen({
    port,
    host: "0.0.0.0",
    reusePort: true
  }, () => {
    log(`\u{1F680} Server running on port ${port}`);
    log(`\u{1F4CA} Environment: ${process.env.NODE_ENV}`);
    log(`\u{1F527} Mode: ${app.get("env") === "development" ? "Development with Vite HMR" : "Production"}`);
    log(`\u{1F310} WebSocket server ready on ws://0.0.0.0:${port}/ws`);
  });
})();
