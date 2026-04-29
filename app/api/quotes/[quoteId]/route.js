import { NextResponse } from "next/server";
import { createSupabaseServiceClient } from "src/lib/supabase/server";

const ADMIN_API_KEY = process.env.QUOTE_ADMIN_API_KEY;
const ALLOWED_STATUSES = ["received", "in_review", "quoted", "closed"];

const authorizeAdmin = (request) => {
  if (!ADMIN_API_KEY) {
    return "QUOTE_ADMIN_API_KEY is not configured.";
  }

  const requestKey = request.headers.get("x-admin-api-key");
  if (!requestKey || requestKey !== ADMIN_API_KEY) {
    return "Unauthorized.";
  }

  return null;
};

export async function GET(request, { params }) {
  const authError = authorizeAdmin(request);
  if (authError) {
    return NextResponse.json({ ok: false, error: authError }, { status: 401 });
  }

  try {
    const supabase = createSupabaseServiceClient();
    const quoteId = params?.quoteId;

    if (!quoteId) {
      throw new Error("quoteId is required.");
    }

    const { data: quote, error } = await supabase
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
            created_at,
            file_kind,
            file_name,
            content_type,
            size_bytes,
            bucket,
            storage_path
          )
        `,
      )
      .eq("id", quoteId)
      .single();

    if (error || !quote) {
      throw new Error(error?.message || "Quote not found.");
    }

    const attachments = await Promise.all(
      (quote.quote_attachments || []).map(async (attachment) => {
        const { data: signedUrlData, error: signedUrlError } = await supabase.storage
          .from(attachment.bucket)
          .createSignedUrl(attachment.storage_path, 3600);

        return {
          ...attachment,
          signed_url: signedUrlError ? null : signedUrlData?.signedUrl || null,
          signed_url_error: signedUrlError ? signedUrlError.message : null,
        };
      }),
    );

    return NextResponse.json({
      ok: true,
      quote: {
        ...quote,
        quote_attachments: attachments,
      },
    });
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        error: error instanceof Error ? error.message : "Failed to load quote.",
      },
      { status: 400 },
    );
  }
}

export async function PATCH(request, { params }) {
  const authError = authorizeAdmin(request);
  if (authError) {
    return NextResponse.json({ ok: false, error: authError }, { status: 401 });
  }

  try {
    const quoteId = params?.quoteId;
    if (!quoteId) {
      throw new Error("quoteId is required.");
    }

    const body = await request.json();
    const status = typeof body?.status === "string" ? body.status.trim() : "";

    if (!ALLOWED_STATUSES.includes(status)) {
      throw new Error("Invalid status.");
    }

    const supabase = createSupabaseServiceClient();
    const { data, error } = await supabase
      .from("quotes")
      .update({ status })
      .eq("id", quoteId)
      .select("id, status")
      .single();

    if (error || !data) {
      throw new Error(error?.message || "Failed to update quote status.");
    }

    return NextResponse.json({ ok: true, quote: data });
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        error:
          error instanceof Error
            ? error.message
            : "Failed to update quote status.",
      },
      { status: 400 },
    );
  }
}