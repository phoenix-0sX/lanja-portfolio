import { Forminit } from 'forminit';
import { checkEmail } from '#shared/email-rules';
import { isDisposableEmail } from '../utils/disposable-email';

/**
 * Proxy between the contact form and Forminit.
 * 1. Validates the submission (required fields + email format, placeholder/typo denylist, disposable domains).
 * 2. Only then forwards it to Forminit with the secret API key (which never reaches the browser).
 *
 * Errors are returned as a JSON body (HTTP 200) in the same shape as forminit's own handler, so the
 * browser SDK turns them into `{ error }` and the form can show the right message.
 */

const MAX_BODY_BYTES = 100_000;
const FORM_ID_KEY = 'forminitFormId';

const fail = (
  error: string,
  message: string,
  code: number,
  extra: Record<string, unknown> = {},
) => ({
  success: false,
  error,
  message,
  code,
  ...extra,
});

export default defineEventHandler(async (event) => {
  try {
    const config = useRuntimeConfig(event);

    if (
      Number(getRequestHeader(event, 'content-length') ?? 0) > MAX_BODY_BYTES
    ) {
      return fail('PAYLOAD_TOO_LARGE', 'Request body is too large.', 413);
    }

    const parts = await readMultipartFormData(event);
    if (!parts)
      return fail(
        'UNSUPPORTED_CONTENT_TYPE',
        'Send the form as multipart/form-data.',
        400,
      );

    // Text fields only (the contact form has no file input).
    const fields = new Map<string, string>();
    for (const part of parts) {
      if (part.name && !part.filename)
        fields.set(part.name, part.data.toString('utf8'));
    }

    // Only the configured form can be targeted through this proxy.
    const formId = fields.get(FORM_ID_KEY);
    if (!formId || formId !== config.public.forminitFormId) {
      return fail('INVALID_FORM_ID', 'Unknown form.', 400);
    }
    fields.delete(FORM_ID_KEY);

    // --- Validation -------------------------------------------------------------------------
    const email = (fields.get('fi-sender-email') ?? '').trim();
    if (
      !(fields.get('fi-sender-fullName') ?? '').trim() ||
      !(fields.get('fi-text-message') ?? '').trim()
    ) {
      return fail('MISSING_FIELDS', 'Name and message are required.', 422);
    }

    const problem = checkEmail(email);
    if (problem) {
      return fail('EMAIL_REJECTED', 'Invalid email address.', 422, {
        reason: problem,
      });
    }
    if (isDisposableEmail(email)) {
      return fail(
        'EMAIL_REJECTED',
        'Disposable email addresses are not accepted.',
        422,
        { reason: 'disposable' },
      );
    }

    // --- Forward to Forminit ----------------------------------------------------------------
    const data = new FormData();
    for (const [name, value] of fields) data.append(name, value);

    const forminit = new Forminit({ apiKey: config.forminitApiKey });
    forminit.setUserInfo({
      ip: getRequestIP(event, { xForwardedFor: true }) ?? '127.0.0.1',
      userAgent: getRequestHeader(event, 'user-agent') ?? 'unknown',
      referer: getRequestHeader(event, 'referer'),
    });

    const result = await forminit.submit(formId, data);
    return (
      result.error ?? {
        submission: result.data,
        redirectUrl: result.redirectUrl,
      }
    );
  } catch (error) {
    console.error('[forminit] proxy error:', error);
    return fail('UNKNOWN_ERROR', 'Unknown error.', 500);
  }
});

/**
 * OLD VERSION
 */
// import { createForminitNuxtHandler } from 'forminit/nuxt';

// // Proxy between the browser and Forminit: adds the secret API token on the server.
// // The config is read inside the handler (at request time) so env vars set on the host are honoured.
// export default defineEventHandler(async (event) => {
//   const config = useRuntimeConfig();

//   const forminitHandler = createForminitNuxtHandler({
//     apiKey: config.forminitApiKey,
//   });

//   return await forminitHandler(event);
// });
