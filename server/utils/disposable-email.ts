import disposableDomains from 'disposable-email-domains';
import wildcardDomains from 'disposable-email-domains/wildcard.json';

// ~120k known disposable / temporary mail domains (https://github.com/disposable-email-domains/disposable-email-domains).
// Server-only on purpose: the list is far too big for the browser bundle.
const exact = new Set<string>(disposableDomains as string[]);
const wildcard = new Set<string>(wildcardDomains as string[]);

/** True when the address' domain (or a parent domain such as x.mailinator.com -> mailinator.com) is a known disposable provider. */
export function isDisposableEmail(email: string): boolean {
  const domain = email.slice(email.lastIndexOf('@') + 1).toLowerCase();
  const labels = domain.split('.');
  for (let i = 0; i < labels.length - 1; i++) {
    const candidate = labels.slice(i).join('.');
    if (exact.has(candidate) || wildcard.has(candidate)) return true;
  }
  return false;
}
