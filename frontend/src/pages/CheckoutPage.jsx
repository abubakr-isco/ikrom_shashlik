import { ArrowLeft, ChevronDown, CircleAlert, CircleCheck, LoaderCircle, ShoppingBag } from 'lucide-react';
import { useEffect, useId, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router';
import { CartLine } from '../components/cart/CartLine.jsx';
import { OrderTotals } from '../components/cart/OrderTotals.jsx';
import { FulfillmentToggle } from '../components/checkout/FulfillmentToggle.jsx';
import { SubmitProblem } from '../components/checkout/SubmitProblem.jsx';
import { site } from '../config/site.js';
import { useCart } from '../context/cart.js';
import { usePageTitle } from '../hooks/usePageTitle.js';
import { useI18n } from '../i18n/context.js';
import { calcTotals } from '../lib/cart.js';
import { errorText } from '../lib/errorText.js';
import { formatPrice } from '../lib/format.js';
import { buildOrderText } from '../lib/orderText.js';
import { formatPhone, nextPhoneValue, normalizePhone } from '../lib/phone.js';
import { readJson, removeItem, writeJson } from '../lib/storage.js';
import { hasErrors, validateCheckout } from '../lib/validation.js';
import { buildOrderPayload, OrderSubmitError, submitOrder } from '../services/orderService.js';
import styles from './CheckoutPage.module.css';

// Contact details are kept for the browser session only, not across visits.
const DRAFT_KEY = 'ikrom-checkout-draft';
const EMPTY_FORM = { name: '', phone: '', address: '', comment: '' };
const FIELD_ORDER = ['name', 'phone', 'address', 'comment'];
const FIELDS_WITH_HINT = new Set(['phone', 'comment']);

function loadDraft() {
  const draft = readJson(DRAFT_KEY, null, 'session');
  if (!draft || typeof draft !== 'object') return EMPTY_FORM;
  return Object.fromEntries(Object.keys(EMPTY_FORM).map((key) => [key, typeof draft[key] === 'string' ? draft[key] : '']));
}

export function CheckoutPage() {
  const { t, lang } = useI18n();
  const cart = useCart();
  const ids = { form: useId(), cartError: useId() };
  const [form, setForm] = useState(loadDraft);
  const [touched, setTouched] = useState({});
  const [submitAttempted, setSubmitAttempted] = useState(false);
  const [status, setStatus] = useState({ state: 'idle' });
  // Phones: the order summary starts collapsed unless something in it needs attention.
  const [summaryOpen, setSummaryOpen] = useState(() => cart.lines.some((line) => !line.dish.available));
  const problemRef = useRef(null);
  const cartErrorRef = useRef(null);
  const successRef = useRef(null);

  usePageTitle(`${t('checkout.title')} | Ikrom Shashlik`);

  useEffect(() => writeJson(DRAFT_KEY, form, 'session'), [form]);

  const { lines, totals, fulfillment } = cart;
  const deliveryFee = useMemo(() => calcTotals(lines, 'delivery', site.delivery).deliveryFee, [lines]);
  const validation = validateCheckout(
    { ...form, fulfillment },
    { lines, totals, delivery: site.delivery, limits: site.order },
  );
  const fulfillmentLabel = t(fulfillment === 'delivery' ? 'checkout.delivery' : 'checkout.pickup');
  const normalizedPhone = normalizePhone(form.phone);
  const orderText = buildOrderText({
    lines,
    form: { ...form, fulfillment },
    totals,
    phone: normalizedPhone ? formatPhone(normalizedPhone) : '',
    lang,
    t,
    fulfillmentLabel,
  });

  useEffect(() => {
    if (status.state === 'error') problemRef.current?.focus();
    if (status.state === 'success') {
      // The confirmation replaces a long form: start it from the top.
      window.scrollTo({ top: 0, behavior: 'instant' });
      successRef.current?.focus({ preventScroll: true });
    }
  }, [status]);

  const showError = (field) => (touched[field] || submitAttempted) && validation.fields[field];

  function update(field, value) {
    setForm((current) => ({ ...current, [field]: value }));
    if (status.state === 'error') setStatus({ state: 'idle' });
  }

  async function onSubmit(event) {
    event.preventDefault();
    if (status.state === 'submitting') return;
    setSubmitAttempted(true);

    if (hasErrors(validation)) {
      const firstField = FIELD_ORDER.find((field) => validation.fields[field]);
      if (firstField) document.getElementById(`${ids.form}-${firstField}`)?.focus();
      else cartErrorRef.current?.focus();
      return;
    }

    setStatus({ state: 'submitting' });
    const orderable = lines.filter((line) => line.dish.available);
    const payload = buildOrderPayload({
      lines: orderable,
      form: { ...form, fulfillment },
      totals,
      phone: normalizedPhone,
      lang,
    });

    try {
      const { number } = await submitOrder(payload);
      setStatus({ state: 'success', number, phone: formatPhone(normalizedPhone) });
      cart.clear();
      removeItem(DRAFT_KEY, 'session');
    } catch (error) {
      const kind = error instanceof OrderSubmitError ? error.kind : 'network';
      setStatus({ state: 'error', error: { kind, message: error instanceof OrderSubmitError ? error.message : '' } });
    }
  }

  if (status.state === 'success') {
    return (
      <main id="main" tabIndex={-1} className={`container ${styles.page}`}>
        <section className={styles.success} aria-labelledby="success-title">
          <span className={styles.successIcon}>
            <CircleCheck size={40} aria-hidden="true" />
          </span>
          <h1 id="success-title" ref={successRef} tabIndex={-1} className={styles.successTitle}>
            {t('result.successTitle')}
          </h1>
          {status.number && <p className={styles.orderNumber}>{t('result.successNumber', { number: status.number })}</p>}
          <p className={styles.successText}>{t('result.successText', { phone: status.phone })}</p>
          <Link to="/" className="btn btn-primary btn-lg">
            {t('common.toHome')}
          </Link>
        </section>
      </main>
    );
  }

  if (lines.length === 0) {
    return (
      <main id="main" tabIndex={-1} className={`container ${styles.page}`}>
        <section className={styles.emptyState} aria-labelledby="checkout-empty">
          <span className={styles.emptyIcon}>
            <ShoppingBag size={32} aria-hidden="true" />
          </span>
          <h1 id="checkout-empty" className={styles.emptyTitle}>
            {t('checkout.emptyTitle')}
          </h1>
          <p className={styles.emptyText}>{t('checkout.emptyText')}</p>
          <Link to={{ pathname: '/', hash: '#menu' }} className="btn btn-primary btn-lg">
            {t('cart.toMenu')}
          </Link>
        </section>
      </main>
    );
  }

  const fieldProps = (field) => ({
    id: `${ids.form}-${field}`,
    name: field,
    value: form[field],
    onBlur: () => setTouched((current) => ({ ...current, [field]: true })),
    'aria-invalid': showError(field) ? 'true' : undefined,
    'aria-describedby':
      [showError(field) && `${ids.form}-${field}-error`, FIELDS_WITH_HINT.has(field) && `${ids.form}-${field}-hint`]
        .filter(Boolean)
        .join(' ') || undefined,
  });

  const fieldError = (field) =>
    showError(field) && (
      <p id={`${ids.form}-${field}-error`} className="field-error">
        <CircleAlert size={16} aria-hidden="true" />
        {errorText(validation.fields[field], { t, lang })}
      </p>
    );

  const submitting = status.state === 'submitting';
  const cartError = submitAttempted && validation.cart;

  return (
    <main id="main" tabIndex={-1} className={`container ${styles.page}`}>
      <Link to={{ pathname: '/', hash: '#menu' }} className={`btn btn-quiet ${styles.back}`}>
        <ArrowLeft size={18} aria-hidden="true" />
        {t('checkout.back')}
      </Link>
      <h1 className={styles.title}>{t('checkout.title')}</h1>

      <div className={styles.layout}>
        <form className={styles.form} onSubmit={onSubmit} noValidate aria-describedby={cartError ? ids.cartError : undefined}>
          <fieldset className={styles.fieldset}>
            <legend className={styles.legend}>{t('checkout.fulfillment')}</legend>
            <FulfillmentToggle value={fulfillment} onChange={cart.setFulfillment} deliveryFee={deliveryFee} />
          </fieldset>

          <fieldset className={styles.fieldset}>
            <legend className={styles.legend}>{t('checkout.contacts')}</legend>
            <div className={styles.fields}>
              <div className="field">
                <label className="field-label" htmlFor={`${ids.form}-name`}>
                  {t('checkout.name')}
                </label>
                <input
                  {...fieldProps('name')}
                  className="input"
                  type="text"
                  autoComplete="name"
                  maxLength={site.order.nameMaxLength}
                  placeholder={t('checkout.namePlaceholder')}
                  onChange={(e) => update('name', e.target.value)}
                />
                {fieldError('name')}
              </div>

              <div className="field">
                <label className="field-label" htmlFor={`${ids.form}-phone`}>
                  {t('checkout.phone')}
                </label>
                <div className={styles.phone}>
                  <span className={styles.prefix} aria-hidden="true">
                    +998
                  </span>
                  <input
                    {...fieldProps('phone')}
                    className={`input ${styles.phoneInput}`}
                    type="tel"
                    inputMode="tel"
                    autoComplete="tel"
                    placeholder="90 123-45-67"
                    onChange={(e) => update('phone', nextPhoneValue(form.phone, e.target.value))}
                  />
                </div>
                <p id={`${ids.form}-phone-hint`} className="field-hint">
                  {t('checkout.phoneHint')}
                </p>
                {fieldError('phone')}
              </div>
            </div>
          </fieldset>

          {fulfillment === 'delivery' && (
            <div className="field">
              <label className="field-label" htmlFor={`${ids.form}-address`}>
                {t('checkout.address')}
              </label>
              <input
                {...fieldProps('address')}
                className="input"
                type="text"
                autoComplete="street-address"
                maxLength={site.order.addressMaxLength}
                placeholder={t('checkout.addressPlaceholder')}
                onChange={(e) => update('address', e.target.value)}
              />
              {fieldError('address')}
            </div>
          )}

          <div className="field">
            <label className="field-label" htmlFor={`${ids.form}-comment`}>
              {t('checkout.comment')}
              <small>{t('common.optional')}</small>
            </label>
            <textarea
              {...fieldProps('comment')}
              className="input"
              rows={3}
              maxLength={site.order.commentMaxLength}
              placeholder={t('checkout.commentPlaceholder')}
              onChange={(e) => update('comment', e.target.value)}
            />
            <p id={`${ids.form}-comment-hint`} className={`field-hint ${styles.counter}`}>
              {t('checkout.commentCounter', { count: form.comment.length, max: site.order.commentMaxLength })}
            </p>
            {fieldError('comment')}
          </div>

          {cartError && (
            <p id={ids.cartError} ref={cartErrorRef} tabIndex={-1} className={styles.cartError} role="alert">
              <CircleAlert size={18} aria-hidden="true" />
              {errorText(validation.cart, { t, lang })}
            </p>
          )}

          {status.state === 'error' && (
            <SubmitProblem ref={problemRef} error={status.error} orderText={orderText} onRetry={() => problemRef.current?.closest('form')?.requestSubmit()} />
          )}

          <div className={styles.submitRow}>
            <p className={styles.submitTotal}>
              <span>{t('cart.total')}</span>
              <span className={styles.submitAmount}>{formatPrice(totals.total, lang)}</span>
            </p>
            <button type="submit" className="btn btn-primary btn-lg btn-block" disabled={submitting} aria-busy={submitting}>
              {submitting ? (
                <>
                  <LoaderCircle size={20} className={styles.spinner} aria-hidden="true" />
                  {t('checkout.submitting')}
                </>
              ) : (
                t('checkout.submit')
              )}
            </button>
            <p className={styles.note}>{t('checkout.note')}</p>
          </div>
        </form>

        <aside className={styles.summary} data-open={summaryOpen || undefined} aria-labelledby="summary-title">
          <div className={styles.summaryHead}>
            <h2 id="summary-title" className={styles.summaryTitle}>
              {t('checkout.summary')}
            </h2>
            <button type="button" className="btn btn-quiet btn-sm" onClick={cart.openCart}>
              {t('checkout.edit')}
            </button>
          </div>
          <button
            type="button"
            className={styles.summaryToggle}
            aria-expanded={summaryOpen}
            aria-controls="checkout-summary-body"
            onClick={() => setSummaryOpen((open) => !open)}
          >
            <span>
              <span className="visually-hidden">{t('checkout.showItems')}: </span>
              {t('cart.count', { count: totals.count })}
            </span>
            <span className={styles.toggleTotal}>
              {formatPrice(totals.total, lang)}
              <ChevronDown size={20} aria-hidden="true" className={styles.chevron} />
            </span>
          </button>
          <div id="checkout-summary-body" className={styles.summaryBody}>
            <ul role="list" className={styles.summaryLines}>
              {lines.map((line) => (
                <CartLine key={line.dish.id} line={line} compact />
              ))}
            </ul>
            <OrderTotals totals={totals} fulfillment={fulfillment} />
          </div>
        </aside>
      </div>
    </main>
  );
}
