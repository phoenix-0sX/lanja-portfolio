<script setup lang="ts">
import { Forminit } from 'forminit';

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

function incrementSubmissionCount() {
  memoryCount = readSubmissionCount() + 1;
  try {
    sessionStorage.setItem(SUBMISSIONS_KEY, String(memoryCount));
  } catch {
    /* storage unavailable: the in-memory counter still applies */
  }
}

async function submit() {
  // Honeypot: real visitors never fill this hidden field.
  if (form.website) return;

  // Session limit reached: swallow the click, send nothing.
  if (readSubmissionCount() >= MAX_SUBMISSIONS) return;

  incrementSubmissionCount();

  status.value = 'sending';

  // Field names follow Forminit's `fi-<block>-<name>` convention.
  const data = new FormData();
  data.append('fi-sender-fullName', form.name);
  data.append('fi-sender-email', form.email);
  data.append('fi-text-subject', form.subject);
  data.append('fi-text-message', form.message);

  const { error } = await forminit.submit(config.public.forminitFormId, data);

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
        emoji="&#9993;&#65039;"
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
            <label class="block text-sm font-medium text-ink">
              {{ t('contact.name') }}
              <input
                v-model.trim="form.name"
                class="field mt-1.5"
                type="text"
                name="name"
                autocomplete="name"
                required
              />
            </label>
            <label class="block text-sm font-medium text-ink">
              {{ t('contact.emailAddress') }}
              <input
                v-model.trim="form.email"
                class="field mt-1.5"
                type="email"
                name="email"
                autocomplete="email"
                required
              />
            </label>
          </div>
          <label class="block text-sm font-medium text-ink">
            {{ t('contact.subject') }}
            <input
              v-model.trim="form.subject"
              class="field mt-1.5"
              type="text"
              name="subject"
              required
            />
          </label>
          <label class="block text-sm font-medium text-ink">
            {{ t('contact.message') }}
            <textarea
              v-model.trim="form.message"
              class="field mt-1.5 min-h-36 resize-y"
              name="message"
              required
            />
          </label>

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
