import { NextResponse } from "next/server";
import {
  createSupabaseServiceClient,
} from "src/lib/supabase/server";

const QUOTE_BUCKET = process.env.SUPABASE_QUOTE_BUCKET || "quote-files";
const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024;
const ADMIN_API_KEY = process.env.QUOTE_ADMIN_API_KEY;

const isFilled = (value) => typeof value === "string" && value.trim() !== "";

const requireFilledField = (obj, key, label) => {
  if (!isFilled(obj?.[key])) {
    throw new Error(`${label} is required.`);
  }
};

const normalizePhone = (value) => String(value || "").replace(/\D/g, "");

const validateServicesAndFiles = (payload, attachments) => {
  const enabledTabs = Array.isArray(payload.enabledTabs) ? payload.enabledTabs : [];
  const services = payload.services && typeof payload.services === "object"
    ? payload.services
    : {};

  if (enabledTabs.length === 0) {
    throw new Error("At least one service configuration is required.");
  }

  const hasAttachment = (kind) => attachments.some((entry) => entry.kind === kind);

  for (const tab of enabledTabs) {
    if (tab === "fabrication") {
      const fabrication = services.fabrication;
      if (!fabrication || typeof fabrication !== "object") {
        throw new Error("Fabrication details are required.");
      }

      requireFilledField(fabrication, "layers", "Fabrication layers");
      requireFilledField(fabrication, "quantity", "Fabrication quantity");
      requireFilledField(fabrication, "width", "Fabrication width");
      requireFilledField(fabrication, "height", "Fabrication height");
      requireFilledField(fabrication, "discreteDesign", "Fabrication discrete design");
      requireFilledField(fabrication, "boardType", "Fabrication board type");
      requireFilledField(fabrication, "thickness", "Fabrication thickness");
      requireFilledField(fabrication, "copperThickness", "Fabrication copper thickness");
      requireFilledField(fabrication, "pcbFinish", "Fabrication PCB finish");
      requireFilledField(fabrication, "stencilRequirement", "Fabrication stencil requirement");
      requireFilledField(fabrication, "maskColor", "Fabrication mask color");
      requireFilledField(fabrication, "gerberFile", "Fabrication Gerber file");

      if (!hasAttachment("fabrication_gerber")) {
        throw new Error("Fabrication Gerber file upload is required.");
      }
    }

    if (tab === "assembly") {
      const assembly = services.assembly;
      if (!assembly || typeof assembly !== "object") {
        throw new Error("Assembly details are required.");
      }

      requireFilledField(assembly, "units", "Assembly units");
      requireFilledField(assembly, "pcbStencilOption", "Assembly stencil/fabrication option");
      requireFilledField(assembly, "solderType", "Assembly solder type");
      requireFilledField(assembly, "componentsSource", "Assembly component source");
      requireFilledField(assembly, "bomFile", "Assembly BOM file");

      if (!hasAttachment("assembly_bom")) {
        throw new Error("Assembly BOM file upload is required.");
      }
    }

    if (tab === "stencil") {
      const stencil = services.stencil;
      if (!stencil || typeof stencil !== "object") {
        throw new Error("Stencil details are required.");
      }

      requireFilledField(stencil, "gerberFile", "Stencil Gerber file");

      if (!hasAttachment("stencil_gerber")) {
        throw new Error("Stencil Gerber file upload is required.");
      }
    }

    if (tab === "procurement") {
      const procurement = services.procurement;
      if (!procurement || typeof procurement !== "object") {
        throw new Error("Procurement details are required.");
      }

      requireFilledField(procurement, "procurementSource", "Procurement source");

      const rows = Array.isArray(procurement.components) ? procurement.components : [];
      const hasManualComponents = rows.some(
        (row) =>
          isFilled(row?.partNumber) ||
          isFilled(row?.description) ||
          isFilled(row?.manufacturers),
      );

      if (!procurement.componentFile && !hasManualComponents) {
        throw new Error("Upload a component file or add at least one component manually.");
      }

      if (!procurement.componentFile) {
        for (let i = 0; i < rows.length; i += 1) {
          const row = rows[i] || {};
          if (!isFilled(row.partNumber)) {
            throw new Error(`Procurement row ${i + 1}: part number is required.`);
          }
          if (!isFilled(row.description)) {
            throw new Error(`Procurement row ${i + 1}: description is required.`);
          }
          if (!isFilled(row.manufacturers)) {
            throw new Error(`Procurement row ${i + 1}: manufacturer name(s) are required.`);
          }
        }
      }
    }
  }
};

const sanitizeFileName = (value) => {
  return (value || "file")
    .replace(/[^a-zA-Z0-9._-]/g, "_")
    .replace(/_+/g, "_")
    .slice(0, 120);
};

const getPayload = (payloadRaw) => {
  if (typeof payloadRaw !== "string") {
    throw new Error("Invalid request payload.");
  }

  let payload;

  try {
    payload = JSON.parse(payloadRaw);
  } catch {
    throw new Error("Could not parse payload JSON.");
  }

  if (!payload || typeof payload !== "object") {
    throw new Error("Payload is required.");
  }

  if (!payload.contact || typeof payload.contact !== "object") {
    throw new Error("Contact details are required.");
  }

  if (!payload.selectedService || typeof payload.selectedService !== "string") {
    throw new Error("Selected service is required.");
  }

  if (!payload.contact.name?.trim()) {
    throw new Error("Name is required.");
  }

  if (!payload.contact.email?.trim()) {
    throw new Error("Email is required.");
  }

  if (!payload.contact.phone?.trim()) {
    throw new Error("Phone is required.");
  }

  const normalizedPhone = normalizePhone(payload.contact.phone);
  if (!/^\d{10}$/.test(normalizedPhone)) {
    throw new Error("Phone number must be exactly 10 digits.");
  }

  payload.contact.phone = normalizedPhone;

  return payload;
};

const getAttachmentFiles = (formData) => {
  const entries = [
    {
      field: "fabricationGerberFile",
      kind: "fabrication_gerber",
      label: "Fabrication Gerber",
    },
    {
      field: "stencilGerberFile",
      kind: "stencil_gerber",
      label: "Stencil Gerber",
    },
    {
      field: "assemblyBomFile",
      kind: "assembly_bom",
      label: "Assembly BOM",
    },
    {
      field: "procurementComponentFile",
      kind: "procurement_components",
      label: "Procurement Components",
    },
  ];

  return entries
    .map((entry) => ({ ...entry, file: formData.get(entry.field) }))
    .filter((entry) => entry.file instanceof File && entry.file.size > 0);
};

const validateAttachmentSizes = (attachments) => {
  for (const attachment of attachments) {
    if (attachment.file.size > MAX_FILE_SIZE_BYTES) {
      throw new Error(
        `${attachment.label} exceeds 5MB. Please upload a smaller file.`,
      );
    }
  }
};

export async function POST(request) {
  try {
    const supabase = createSupabaseServiceClient();
    const formData = await request.formData();
    const payload = getPayload(formData.get("payload"));

    const attachments = getAttachmentFiles(formData);
    validateAttachmentSizes(attachments);
    validateServicesAndFiles(payload, attachments);

    const quoteRecord = {
      selected_service: payload.selectedService,
      enabled_tabs: Array.isArray(payload.enabledTabs) ? payload.enabledTabs : [],
      contact_name: payload.contact.name?.trim() || null,
      contact_email: payload.contact.email?.trim() || null,
      contact_phone: payload.contact.phone?.trim() || null,
      company_name: payload.contact.companyName?.trim() || null,
      purpose: payload.contact.purpose?.trim() || null,
      comments: payload.contact.comments?.trim() || null,
      services: payload.services && typeof payload.services === "object" ? payload.services : {},
      status: "received",
    };

    const { data: quote, error: quoteInsertError } = await supabase
      .from("quotes")
      .insert(quoteRecord)
      .select("id")
      .single();

    if (quoteInsertError || !quote?.id) {
      const message = quoteInsertError?.message || "Failed to save quote.";
      throw new Error(message);
    }

    const attachmentRows = [];

    for (const attachment of attachments) {
      const safeName = sanitizeFileName(attachment.file.name);
      const path = `quotes/${quote.id}/${attachment.kind}-${Date.now()}-${safeName}`;

      const { error: uploadError } = await supabase.storage
        .from(QUOTE_BUCKET)
        .upload(path, attachment.file, {
          contentType: attachment.file.type || "application/octet-stream",
          upsert: false,
        });

      if (uploadError) {
        throw new Error(uploadError.message || "Failed to upload attachment.");
      }

      attachmentRows.push({
        quote_id: quote.id,
        file_kind: attachment.kind,
        bucket: QUOTE_BUCKET,
        storage_path: path,
        file_name: attachment.file.name,
        content_type: attachment.file.type || null,
        size_bytes: attachment.file.size,
      });
    }

    if (attachmentRows.length > 0) {
      const { error: attachmentInsertError } = await supabase
        .from("quote_attachments")
        .insert(attachmentRows);

      if (attachmentInsertError) {
        throw new Error(attachmentInsertError.message || "Failed to save attachments.");
      }
    }

    return NextResponse.json(
      {
        ok: true,
        quoteId: quote.id,
      },
      { status: 201 },
    );
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        error:
          error instanceof Error
            ? error.message
            : "Unable to submit quote request.",
      },
      { status: 400 },
    );
  }
}

export async function GET(request) {
  try {
    if (!ADMIN_API_KEY) {
      return NextResponse.json(
        {
          ok: false,
          error: "QUOTE_ADMIN_API_KEY is not configured.",
        },
        { status: 500 },
      );
    }

    const requestKey = request.headers.get("x-admin-api-key");

    if (!requestKey || requestKey !== ADMIN_API_KEY) {
      return NextResponse.json(
        {
          ok: false,
          error: "Unauthorized.",
        },
        { status: 401 },
      );
    }

    const supabase = createSupabaseServiceClient();
    const { searchParams } = new URL(request.url);

    const page = Number(searchParams.get("page") || "1");
    const pageSize = Math.min(Number(searchParams.get("pageSize") || "20"), 100);
    const status = searchParams.get("status");

    const from = Math.max((page - 1) * pageSize, 0);
    const to = from + pageSize - 1;

    let query = supabase
      .from("quotes")
      .select(
        `
          id,
          created_at,
          selected_service,
          enabled_tabs,
          contact_name,
          contact_email,
          contact_phone,
          company_name,
          purpose,
          comments,
          services,
          status,
          quote_attachments (
            id,
            file_kind,
            file_name,
            content_type,
            size_bytes,
            bucket,
            storage_path,
            created_at
          )
        `,
        { count: "exact" },
      )
      .order("created_at", { ascending: false })
      .range(from, to);

    if (status) {
      query = query.eq("status", status);
    }

    const { data, count, error } = await query;

    if (error) {
      throw new Error(error.message || "Failed to load quotes.");
    }

    return NextResponse.json({
      ok: true,
      page,
      pageSize,
      total: count || 0,
      quotes: data || [],
    });
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        error:
          error instanceof Error ? error.message : "Failed to load quotes.",
      },
      { status: 400 },
    );
  }
}