/**
 * Email rules shared by the browser (instant feedback) and the server route (the real gate).
 * Pure functions, no dependencies. The big disposable-domain list lives server-side only
 * (see server/utils/disposable-email.ts) so it never reaches the browser bundle.
 */

export type EmailProblem = 'format' | 'placeholder';

// ---------------------------------------------------------------------------------------------
// 1. Format
// ---------------------------------------------------------------------------------------------

/** Practical check (not the full RFC): ASCII, dot-separated domain, TLD of 2+ letters, no stray dots. */
const EMAIL_RE =
  /^[A-Za-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[A-Za-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[A-Za-z0-9](?:[A-Za-z0-9-]{0,61}[A-Za-z0-9])?\.)+[A-Za-z]{2,63}$/;

export function isValidEmailFormat(email: string): boolean {
  return (
    email.length <= 254 &&
    (email.split('@')[0]?.length ?? 0) <= 64 &&
    EMAIL_RE.test(email)
  );
}

// ---------------------------------------------------------------------------------------------
// 2. Denylist of made-up / placeholder / mistyped addresses
//    Everything is compared in lower case. Add your own entries freely.
// ---------------------------------------------------------------------------------------------

/** Reserved or non-routable TLDs (RFC 2606 / 6761 / 6762): they can never receive mail. */
const RESERVED_TLDS = new Set([
  'test',
  'example',
  'invalid',
  'localhost',
  'local',
  'localdomain',
  'internal',
  'lan',
  'home',
  'corp',
  'intranet',
  'private',
  'domain',
  'tld',
]);

/** Domains people type when they just want to get past the form. */
const PLACEHOLDER_DOMAINS = new Set([
  // documentation / reserved
  'example.com',
  'example.org',
  'example.net',
  'example.edu',
  'example.co',
  'example.io',
  'example.fr',
  'exemple.com',
  'exemple.fr',
  'exemple.org',
  // "test"
  'test.com',
  'test.org',
  'test.net',
  'test.io',
  'test.fr',
  'test.co',
  'test.dev',
  'tests.com',
  'testing.com',
  'testmail.com',
  'testemail.com',
  'test-mail.com',
  'test-email.com',
  'mailtest.com',
  'emailtest.com',
  'tester.com',
  'testtest.com',
  // generic placeholders
  'domain.com',
  'domain.org',
  'domain.net',
  'domain.fr',
  'domain.tld',
  'domaine.com',
  'domaine.fr',
  'yourdomain.com',
  'yourdomain.org',
  'yourdomain.net',
  'yourcompany.com',
  'yourwebsite.com',
  'yoursite.com',
  'yourmail.com',
  'youremail.com',
  'mydomain.com',
  'mycompany.com',
  'mysite.com',
  'company.com',
  'companyname.com',
  'website.com',
  'site.com',
  'email.test',
  'mail.test',
  'sample.com',
  'samples.com',
  'demo.com',
  'dummy.com',
  'dummymail.com',
  'dummyemail.com',
  // "fake / none"
  'fake.com',
  'fake.org',
  'fake.net',
  'fakemail.com',
  'fakeemail.com',
  'fake-mail.com',
  'fakeinbox.com',
  'notreal.com',
  'notarealemail.com',
  'noemail.com',
  'noemail.net',
  'no-email.com',
  'nomail.com',
  'nomail.net',
  'nomail.fr',
  'none.com',
  'none.net',
  'nowhere.com',
  'nothing.com',
  'null.com',
  'nope.com',
  'invalid.com',
  'invalid.net',
  'invalid.org',
  'unknown.com',
  'anonymous.com',
  'anon.com',
  'spam.com',
  'spammer.com',
  'junk.com',
  'trash.com',
  'blah.com',
  'bla.com',
  'blabla.com',
  'lorem.com',
  'foo.com',
  'foo.org',
  'foo.net',
  'bar.com',
  'foobar.com',
  'foobar.org',
  'baz.com',
  // keyboard mashing / repeated characters / digits
  'abc.com',
  'abc.net',
  'abc.org',
  'abcd.com',
  'abcde.com',
  'abc123.com',
  'aaa.com',
  'aaaa.com',
  'aa.com',
  'bb.com',
  'asd.com',
  'asdf.com',
  'asdfg.com',
  'asdfgh.com',
  'asdasd.com',
  'qwe.com',
  'qwer.com',
  'qwert.com',
  'qwerty.com',
  'zxc.com',
  'zxcv.com',
  'zxcvb.com',
  'xxx.com',
  'xxxx.com',
  'xyz.com',
  '123.com',
  '1234.com',
  '12345.com',
  '123456.com',
  '111.com',
  '000.com',
  'a.com',
  'b.com',
  'gmail.test',
  'hotmail.test',
  'yahoo.test',
]);

/** Mistyped versions of the big mail providers: they exist only by accident and bounce. */
const TYPO_DOMAINS = new Set([
  // gmail
  'gmial.com',
  'gmal.com',
  'gmali.com',
  'gamil.com',
  'gnail.com',
  'gmaill.com',
  'gmail.con',
  'gmail.cm',
  'gmail.co',
  'gmail.om',
  'gmail.vom',
  'gmail.cim',
  'gmail.coom',
  'gmail.comm',
  'gmail.ocm',
  'gmail.ccom',
  'gmail.fr',
  'gmail.net',
  'gmail.org',
  'gmail.mg',
  'gmail.cpm',
  'gmail.xom',
  'gmai.com',
  'gmeil.com',
  'gmil.com',
  'gimail.com',
  'gemail.com',
  'googlemail.con',
  'gmail.comc',
  // yahoo
  'yaho.com',
  'yahooo.com',
  'yahoo.con',
  'yahoo.cm',
  'yahoo.co',
  'yhoo.com',
  'yahho.com',
  'yaoo.com',
  'yahoo.comm',
  // hotmail / outlook / live
  'hotmial.com',
  'hotmai.com',
  'hotmal.com',
  'hotnail.com',
  'hotmail.con',
  'hotmail.cm',
  'homail.com',
  'hotmaill.com',
  'outlok.com',
  'outllok.com',
  'outlook.con',
  'outlook.cm',
  'outook.com',
  'otlook.com',
  'live.con',
  'live.cm',
  // icloud / orange / free (common in Madagascar & France)
  'icloud.con',
  'icloud.cm',
  'iclod.com',
  'icoud.com',
  'orange.con',
  'orange.cm',
  'free.con',
  'wanadoo.con',
]);

/** Local parts (before the @) that are obviously placeholders. */
const PLACEHOLDER_LOCALS = new Set([
  // test
  'test',
  'tests',
  'testing',
  'tester',
  'testuser',
  'testmail',
  'testemail',
  'testtest',
  'test.test',
  'test_test',
  'test-test',
  'testaccount',
  'testacc',
  'test.user',
  'test.email',
  'test.mail',
  // example / sample / demo / dummy
  'example',
  'exemple',
  'sample',
  'demo',
  'dummy',
  'placeholder',
  'default',
  'temp',
  'tmp',
  'temporary',
  // fake / none
  'fake',
  'fakeemail',
  'fakemail',
  'fake.email',
  'fake.mail',
  'notreal',
  'notarealemail',
  'not.real',
  'none',
  'null',
  'nil',
  'nobody',
  'nothing',
  'nope',
  'nomail',
  'noemail',
  'no.email',
  'no-email',
  'no_email',
  'unknown',
  'anonymous',
  'anon',
  'anonym',
  'someone',
  'somebody',
  'anyone',
  'anybody',
  'whoever',
  'spam',
  'spammer',
  'junk',
  'trash',
  // no-reply style (cannot be answered)
  'noreply',
  'no-reply',
  'no.reply',
  'no_reply',
  'donotreply',
  'do-not-reply',
  'do.not.reply',
  'do_not_reply',
  'dontreply',
  // "your / my ..." template text
  'email',
  'mail',
  'e-mail',
  'emailaddress',
  'email.address',
  'myemail',
  'mymail',
  'my.email',
  'my.mail',
  'youremail',
  'your.email',
  'your-email',
  'your_email',
  'yourmail',
  'your.mail',
  'yourname',
  'your.name',
  'your_name',
  'your-name',
  'name',
  'username',
  'user',
  'user1',
  'user.name',
  'firstname',
  'lastname',
  'firstname.lastname',
  'first.last',
  'nom',
  'prenom',
  'nom.prenom',
  'prenom.nom',
  'monmail',
  'monemail',
  'mon.email',
  'votreemail',
  'votre.email',
  'adresse',
  'adresse.email',
  'votrenom',
  'votre.nom',
  'votre_nom',
  'votre-nom',
  'pseudo',
  'utilisateur',
  // name placeholders
  'john.doe',
  'johndoe',
  'jane.doe',
  'janedoe',
  'john_doe',
  'jane_doe',
  'joe.bloggs',
  'joebloggs',
  'jean.dupont',
  'jeandupont',
  // programmer filler
  'foo',
  'bar',
  'baz',
  'foobar',
  'foo.bar',
  'foo_bar',
  'bla',
  'blah',
  'blabla',
  'bla.bla',
  'lorem',
  'ipsum',
  'lorem.ipsum',
  'hello.world',
  'helloworld',
  'hello_world',
  'abc',
  'abcd',
  'abcde',
  'abcdef',
  'abc.def',
  'xyz',
  'xxx',
  'xxxx',
  // keyboard mashing
  'asd',
  'asdf',
  'asdfg',
  'asdfgh',
  'asdfghj',
  'asdfghjk',
  'asdfghjkl',
  'asdasd',
  'asdasdasd',
  'sdf',
  'dfg',
  'fgh',
  'qwe',
  'qwer',
  'qwert',
  'qwerty',
  'qwertyu',
  'qwertyui',
  'qwertyuiop',
  'azerty',
  'azertyuiop',
  'wasd',
  'zxc',
  'zxcv',
  'zxcvb',
  'zxcvbn',
  'zxcvbnm',
  'qaz',
  'qazwsx',
  'qazwsxedc',
  'poiuy',
  'poiuytreza',
  'mlkjh',
  'lkjhg',
  'hjkl',
  'ghjk',
  'aze',
  'azer',
  'azert',
  'qsd',
  'qsdf',
  'qsdfg',
  'qsdfgh',
  'wxc',
  'wxcv',
  'wxcvb',
  'abc123',
  'abc1234',
  'qwerty123',
  'qwerty1234',
  'password',
  'passw0rd',
  'letmein',
  'iloveyou',
  'admin123',
  'user123',
  'test123',
  'test1234',
]);

/** Patterns for the same idea: test1, test_user, aaaa, 12345, noreply+x... */
const PLACEHOLDER_LOCAL_PATTERNS: RegExp[] = [
  /^(.)\1{2,}$/, // aaa, xxxx, 1111
  /^\d{1,5}$/, // 1, 12, 12345 (too short to be a real numeric address)
  /^0?123456\d*$/, // 123456, 123456789
  /^(?:test|tester|testing|testeur|essai)[\W_]*(?:user|account|acc|email|mail|name|compte|\d+)?[\W_]*\d*$/, // test1, test_user, test-2
  /^(?:fake|dummy|sample|example|exemple|demo|temp|tmp|placeholder)[\W_]*(?:user|account|acc|email|mail|name|\d+)?[\W_]*\d*$/,
  /^no[\W_]?(?:reply|email|mail|one)[\W_\d]*$/,
  /^(?:do[\W_]?not|dont)[\W_]?(?:reply|answer)[\W_\d]*$/,
  /^(?:asdf|qwer|zxcv|sdfg|dfgh|wert|erty|rtyu|tyui|uiop|azer|qsdf|wxcv)[a-z]*\d*$/, // keyboard runs
  /^(?:abc|xyz)[\W_]?\d*$/,
  /^(?:foo|bar|baz|blah?|lorem)[\W_]?(?:foo|bar|baz|blah?|ipsum)?[\W_]?\d*$/,
  /^[a-z]$/, // single-letter address
];

/** Domain labels that look like a placeholder: test1.com, sample2.net, fake-mail.org ... */
const PLACEHOLDER_DOMAIN_PATTERNS: RegExp[] = [
  /^(?:test|tests|testing|example|exemple|sample|fake|dummy|demo|invalid|nomail|noemail|none|nowhere|placeholder)[\d-]*\.[a-z.]+$/,
  /^([a-z0-9])\1{2,}\.[a-z.]+$/, // aaa.com, 111.net
  /^(?:asdf|qwer|zxcv|azer|qsdf)[a-z]*\.[a-z.]+$/,
];

function splitEmail(email: string): { local: string; domain: string } {
  const at = email.lastIndexOf('@');
  return {
    local: email.slice(0, at).toLowerCase(),
    domain: email.slice(at + 1).toLowerCase(),
  };
}

/**
 * Gmail only allows letters, digits and dots (plus an optional "+tag"), no leading/trailing/double dots,
 * and at most 30 characters. A "gmail.com" address that breaks that cannot exist.
 * (No minimum length: very old accounts can be shorter than today's 6-character rule.)
 */
function isImpossibleGmail(local: string, domain: string): boolean {
  if (domain !== 'gmail.com' && domain !== 'googlemail.com') return false;
  const base = local.split('+')[0] ?? '';
  if (
    !/^[a-z0-9.]+$/.test(base) ||
    base.startsWith('.') ||
    base.endsWith('.') ||
    base.includes('..')
  )
    return true;
  return base.replace(/\./g, '').length > 30;
}

/** True when a well-formed address is obviously made up, a placeholder, a typo'd provider or impossible. */
export function isPlaceholderEmail(email: string): boolean {
  const { local, domain } = splitEmail(email);
  const tld = domain.slice(domain.lastIndexOf('.') + 1);
  return (
    RESERVED_TLDS.has(tld) ||
    PLACEHOLDER_DOMAINS.has(domain) ||
    TYPO_DOMAINS.has(domain) ||
    PLACEHOLDER_DOMAIN_PATTERNS.some((re) => re.test(domain)) ||
    PLACEHOLDER_LOCALS.has(local) ||
    PLACEHOLDER_LOCAL_PATTERNS.some((re) =>
      re.test(local.split('+')[0] ?? local),
    ) ||
    isImpossibleGmail(local, domain)
  );
}

/** Returns the first problem found, or null when the address passes these (browser-safe) rules. */
export function checkEmail(email: string): EmailProblem | null {
  const value = email.trim();
  if (!isValidEmailFormat(value)) return 'format';
  if (isPlaceholderEmail(value)) return 'placeholder';
  return null;
}
