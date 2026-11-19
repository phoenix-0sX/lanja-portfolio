<script setup lang="ts">
import { Forminit } from 'forminit';
import { checkEmail } from '#shared/email-rules';

const { t } = useI18n();
const portfolio = usePortfolio();
const contact = computed(() => portfolio.value.contact);
const config = useRuntimeConfig();

// Submissions go through our own server route (/api/forminit), which adds the secret API token.
// The token never reaches the browser.
const forminit = new Forminit({ proxyUrl: '/api/forminit' });

const form = reactive({
  name: '',
  email: '',
  subject: '',
  message: '',
  website: '',
});
type Status = 'idle' | 'sending' | 'success' | 'error';
const status = ref<Status>('idle');

// Guard: at most MAX_SUBMISSIONS requests per browser session (sessionStorage = per tab, cleared when it closes).
// Beyond that, the button still works but the request is silently dropped, so it can't burn the Forminit quota.
const MAX_SUBMISSIONS = 2;
const SUBMISSIONS_KEY = 'lanja_contact_submissions';
let memoryCount = 0; // fallback when sessionStorage is unavailable

function readSubmissionCount(): number {
  try {
    return Number(sessionStorage.getItem(SUBMISSIONS_KEY)) || 0;
  } catch {
    return memoryCount;
  }
}

function decrementSubmissionCount() {
  memoryCount = Math.max(0, readSubmissionCount() - 1);
  try {
    sessionStorage.setItem(SUBMISSIONS_KEY, String(memoryCount));
  } catch {
    /* storage unavailable: the in-memory counter still applies */
  }
}

function incrementSubmissionCount() {
  memoryCount = readSubmissionCount() + 1;
  try {
    sessionStorage.setItem(SUBMISSIONS_KEY, String(memoryCount));
  } catch {
    /* storage unavailable: the in-memory counter still applies */
  }
}

type FieldName = 'name' | 'email' | 'subject' | 'message';
const MIN_MESSAGE_LENGTH = 10;
const errors = reactive<Record<FieldName, string>>({
  name: '',
  email: '',
  subject: '',
  message: '',
});
const submitted = ref(false); // once the visitor has tried to send, fields re-validate live as they type

/** Maps a problem found by the shared email rules (or reported by the server) to a visitor-friendly message. */
function emailProblemMessage(
  problem: 'format' | 'placeholder' | 'disposable' | null,
): string {
  if (problem === 'format') return t('contact.errors.emailInvalid');
  if (problem === 'placeholder') return t('contact.errors.emailFake');
  if (problem === 'disposable') return t('contact.errors.emailDisposable');
  return '';
}

function validateField(field: FieldName): string {
  const value = form[field].trim();
  if (field === 'email') {
    if (!value) return t('contact.errors.email');
    return emailProblemMessage(checkEmail(value));
  }
  if (!value) return t('contact.errors.required');
  if (field === 'message' && value.length < MIN_MESSAGE_LENGTH)
    return t('contact.errors.message', { min: MIN_MESSAGE_LENGTH });
  return '';
}

const fieldNames: FieldName[] = ['name', 'email', 'subject', 'message'];

/** Validates every field, fills `errors`, focuses the first invalid one. Returns true when the form is valid. */
function validateForm(): boolean {
  let firstInvalid: FieldName | undefined;
  for (const field of fieldNames) {
    errors[field] = validateField(field);
    if (errors[field] && !firstInvalid) firstInvalid = field;
  }
  if (firstInvalid) document.getElementById(`contact-${firstInvalid}`)?.focus();
  return !firstInvalid;
}

function onFieldInput(field: FieldName) {
  if (submitted.value || errors[field]) errors[field] = validateField(field);
}

async function submit() {
  // Honeypot: real visitors never fill this hidden field.
  if (form.website) return;

  // Validation first: an invalid form is never sent and never uses up one of the session's submissions.
  submitted.value = true;
  status.value = 'idle';
  if (!validateForm()) return;

  // Session limit reached: swallow the click, send nothing.
  if (readSubmissionCount() >= MAX_SUBMISSIONS) return;

  incrementSubmissionCount();
  status.value = 'sending';

  // Field names follow Forminit's `fi-<block>-<name>` convention.
  const data = new FormData();
  data.append('fi-sender-fullName', form.name.trim());
  data.append('fi-sender-email', form.email.trim());
  data.append('fi-text-subject', form.subject.trim());
  data.append('fi-text-message', form.message.trim());

  const { error } = await forminit.submit(config.public.forminitFormId, data);

  // The server refused the email (placeholder, typo'd provider, disposable domain): show it under the field.
  // Nothing reached Forminit, so give the attempt back.
  if (error?.error === 'EMAIL_REJECTED') {
    decrementSubmissionCount();
    status.value = 'idle';
    errors.email = emailProblemMessage(
      (error as { reason?: 'format' | 'placeholder' | 'disposable' }).reason ??
        'placeholder',
    );
    document.getElementById('contact-email')?.focus();
    return;
  }

  if (error) {
    // Details for the browser console (e.g. a field name Forminit does not know); visitors get the friendly message.
    console.error('[contact] Forminit error:', error);
    status.value = 'error';
    return;
  }

  status.value = 'success';
  Object.assign(form, {
    name: '',
    email: '',
    subject: '',
    message: '',
    website: '',
  });
  submitted.value = false;
  for (const field of fieldNames) errors[field] = '';
}

const details = computed(() => [
  {
    key: 'email',
    icon: 'lucide:mail',
    label: t('contact.email'),
    value: contact.value.email,
    href: `mailto:${contact.value.email}`,
    copy: contact.value.email,
  },
  {
    key: 'phone',
    icon: 'lucide:phone',
    label: t('contact.phone'),
    value: contact.value.phoneDisplay,
    href: `tel:${contact.value.phone}`,
    // Copy the dial-ready international number (no spaces) rather than the pretty display format.
    copy: contact.value.phone,
  },
  {
    key: 'location',
    icon: 'lucide:map-pin',
    label: t('contact.location'),
    value: contact.value.location,
    href: undefined,
    copy: undefined,
  },
]);

// --- Copy to clipboard -------------------------------------------------------------------
const copiedKey = ref<string | null>(null);
let copiedTimer: ReturnType<typeof setTimeout> | undefined;

async function writeClipboard(text: string) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    // Fallback for non-secure contexts or blocked Clipboard API
    const area = document.createElement('textarea');
    area.value = text;
    area.setAttribute('readonly', '');
    area.style.cssText = 'position:fixed;top:0;left:0;opacity:0';
    document.body.appendChild(area);
    area.select();
    const ok = document.execCommand('copy');
    area.remove();
    return ok;
  }
}

async function copy(key: string, text: string) {
  if (!(await writeClipboard(text))) return;
  copiedKey.value = key;
  clearTimeout(copiedTimer);
  copiedTimer = setTimeout(() => (copiedKey.value = null), 2000);
}

onBeforeUnmount(() => clearTimeout(copiedTimer));
</script>

<template>
  <section
    id="contact"
    class="section-y relative overflow-hidden border-t border-line/60 bg-muted/40"
  >
    <div
      class="pointer-events-none absolute -bottom-24 -right-20 size-64 rounded-full bg-art-2/60"
      aria-hidden="true"
    />

    <div class="container-page relative">
      <SectionTitle
        emoji="noto:envelope"
        :title="contact.title"
        :subtitle="contact.intro"
      />

      <div class="grid gap-8 lg:grid-cols-5">
        <div v-reveal class="space-y-4 lg:col-span-2">
          <div
            v-for="item in details"
            :key="item.key"
            class="card flex items-center gap-2 p-2 transition"
            :class="item.href ? 'hover:border-brand' : ''"
          >
            <!-- Main action: click the info itself to call / write -->
            <component
              :is="item.href ? 'a' : 'div'"
              :href="item.href"
              class="flex min-w-0 flex-1 items-center gap-4 rounded-xl p-2"
            >
              <span
                class="grid size-11 shrink-0 place-items-center rounded-xl bg-brand/15 text-brand-deep dark:text-accent"
              >
                <Icon :name="item.icon" class="size-5" />
              </span>
              <span class="min-w-0">
                <span
                  class="block text-xs font-semibold uppercase tracking-wider text-soft"
                  >{{ item.label }}</span
                >
                <span class="block break-words font-medium text-ink">{{
                  item.value
                }}</span>
              </span>
            </component>

            <!-- Secondary action: copy the value (a separate button, never nested inside the link) -->
            <button
              v-if="item.copy"
              type="button"
              class="inline-flex h-10 shrink-0 items-center gap-1.5 rounded-lg border px-2.5 text-xs font-semibold transition active:scale-95 sm:px-3"
              :class="
                copiedKey === item.key
                  ? 'border-brand bg-brand/15 text-brand-deep dark:text-accent'
                  : 'border-line bg-card/70 text-soft hover:border-brand hover:text-brand-deep dark:hover:text-accent'
              "
              :aria-label="t('contact.copyItem', { item: item.label })"
              :title="t('contact.copyItem', { item: item.label })"
              @click="copy(item.key, item.copy)"
            >
              <Icon
                :name="copiedKey === item.key ? 'lucide:check' : 'lucide:copy'"
                class="size-4"
              />
              <span class="hidden sm:inline">{{
                copiedKey === item.key ? t('contact.copied') : t('contact.copy')
              }}</span>
            </button>
          </div>

          <!-- Screen readers: announce the result of the copy action -->
          <p class="sr-only" role="status" aria-live="polite">
            {{ copiedKey ? t('contact.copied') : '' }}
          </p>
          <SocialLinks :links="contact.socialLinks" />
        </div>

        <form
          v-reveal="100"
          class="card space-y-4 p-5 sm:p-7 lg:col-span-3"
          novalidate
          @submit.prevent="submit"
        >
          <div class="grid gap-4 sm:grid-cols-2">
            <div>
              <label
                for="contact-name"
                class="block text-sm font-medium text-ink"
                >{{ t('contact.name') }}</label
              >
              <input
                id="contact-name"
                v-model="form.name"
                class="field mt-1.5"
                :class="errors.name ? 'field-invalid' : ''"
                type="text"
                name="name"
                autocomplete="name"
                required
                :aria-invalid="errors.name ? 'true' : undefined"
                :aria-describedby="
                  errors.name ? 'contact-name-error' : undefined
                "
                @input="onFieldInput('name')"
              />
              <p
                v-if="errors.name"
                id="contact-name-error"
                class="mt-1.5 text-sm text-red-600 dark:text-red-400"
                role="alert"
              >
                {{ errors.name }}
              </p>
            </div>
            <div>
              <label
                for="contact-email"
                class="block text-sm font-medium text-ink"
                >{{ t('contact.emailAddress') }}</label
              >
              <input
                id="contact-email"
                v-model="form.email"
                class="field mt-1.5"
                :class="errors.email ? 'field-invalid' : ''"
                type="email"
                name="email"
                autocomplete="email"
                inputmode="email"
                required
                :aria-invalid="errors.email ? 'true' : undefined"
                :aria-describedby="
                  errors.email ? 'contact-email-error' : undefined
                "
                @input="onFieldInput('email')"
                @blur="form.email && (errors.email = validateField('email'))"
              />
              <p
                v-if="errors.email"
                id="contact-email-error"
                class="mt-1.5 text-sm text-red-600 dark:text-red-400"
                role="alert"
              >
                {{ errors.email }}
              </p>
            </div>
          </div>
          <div>
            <label
              for="contact-subject"
              class="block text-sm font-medium text-ink"
              >{{ t('contact.subject') }}</label
            >
            <input
              id="contact-subject"
              v-model="form.subject"
              class="field mt-1.5"
              :class="errors.subject ? 'field-invalid' : ''"
              type="text"
              name="subject"
              required
              :aria-invalid="errors.subject ? 'true' : undefined"
              :aria-describedby="
                errors.subject ? 'contact-subject-error' : undefined
              "
              @input="onFieldInput('subject')"
            />
            <p
              v-if="errors.subject"
              id="contact-subject-error"
              class="mt-1.5 text-sm text-red-600 dark:text-red-400"
              role="alert"
            >
              {{ errors.subject }}
            </p>
          </div>
          <div>
            <label
              for="contact-message"
              class="block text-sm font-medium text-ink"
              >{{ t('contact.message') }}</label
            >
            <textarea
              id="contact-message"
              v-model="form.message"
              class="field mt-1.5 min-h-36 resize-y"
              :class="errors.message ? 'field-invalid' : ''"
              name="message"
              required
              :aria-invalid="errors.message ? 'true' : undefined"
              :aria-describedby="
                errors.message ? 'contact-message-error' : undefined
              "
              @input="onFieldInput('message')"
            />
            <p
              v-if="errors.message"
              id="contact-message-error"
              class="mt-1.5 text-sm text-red-600 dark:text-red-400"
              role="alert"
            >
              {{ errors.message }}
            </p>
          </div>

          <!-- Honeypot -->
          <input
            v-model="form.website"
            type="text"
            name="website"
            class="hidden"
            tabindex="-1"
            autocomplete="off"
            aria-hidden="true"
          />

          <div class="flex flex-wrap items-center gap-4">
            <button
              type="submit"
              class="btn-primary"
              :disabled="status === 'sending'"
            >
              <Icon
                :name="
                  status === 'sending' ? 'lucide:loader-circle' : 'lucide:send'
                "
                class="size-4"
                :class="status === 'sending' ? 'animate-spin' : ''"
              />
              {{
                status === 'sending'
                  ? t('contact.sending')
                  : contact.form.submitLabel
              }}
            </button>
            <p
              v-if="status === 'success'"
              class="text-sm font-medium text-brand-deep dark:text-accent"
              role="status"
            >
              {{ contact.form.successMessage }}
            </p>
            <p
              v-else-if="status === 'error'"
              class="text-sm font-medium text-red-600 dark:text-red-400"
              role="alert"
            >
              {{ t('contact.error') }}
            </p>
          </div>
        </form>
      </div>
    </div>
  </section>
</template>
