import { v4 as uuid } from 'uuid';
import Stripe from 'stripe';
import { RegisteredUser } from './User';

export const checkoutSessionCompleted: Stripe.Event = {
  id: 'evt_1KAlGeGTcbQZD9rE8XikGtxw',
  object: 'event',
  api_version: '2020-08-27',
  created: 1640481080,
  data: {
    object: {
      id: 'cs_test_a1Dn6iwAZ4MDsklxSjIlfxOe888rw632R6dvskc2UUjiz6WQaLLoB1Ybkd',
      object: 'checkout.session',
      after_expiration: null,
      allow_promotion_codes: null,
      amount_subtotal: 3300,
      amount_total: 3300,
      automatic_tax: {
        enabled: false,
        status: null,
      },
      billing_address_collection: null,
      cancel_url: 'http://localhost:3000/checkout/?canceled=true',
      client_reference_id: null,
      consent: null,
      consent_collection: null,
      currency: 'eur',
      customer: 'cus_KqSAWq9kDG6IPu',
      customer_details: {
        email: RegisteredUser.email,
        phone: null,
        tax_exempt: 'none',
        tax_ids: [],
      },
      customer_email: null,
      expires_at: 1640567464,
      livemode: false,
      locale: null,
      metadata: {},
      mode: 'payment',
      payment_intent: 'pi_3KAlGOGTcbQZD9rE0WCrFhKH',
      payment_method_options: {},
      payment_method_types: ['card', 'giropay', 'sofort'],
      payment_status: 'paid',
      phone_number_collection: {
        enabled: false,
      },
      recovered_from: null,
      setup_intent: null,
      shipping: null,
      shipping_address_collection: null,
      shipping_options: [],
      shipping_rate: null,
      status: 'complete',
      submit_type: null,
      subscription: null,
      success_url: 'http://localhost:3000/gallery/acryl/',
      total_details: {
        amount_discount: 0,
        amount_shipping: 0,
        amount_tax: 0,
      },
      url: null,
    },
  },
  livemode: false,
  pending_webhooks: 2,
  request: {
    id: null,
    idempotency_key: null,
  },
  type: 'checkout.session.completed',
};

export const priceCreated: Stripe.Event = {
  id: uuid(),
  object: 'event',
  api_version: '2020-08-27',
  created: 1638643801,
  data: {
    object: {
      id: 'pi_3KAk1BGTcbQZD9rE07TfGzRn',
      object: 'price',
      active: true,
      billing_scheme: 'per_unit',
      created: 1638643801,
      currency: 'eur',
      livemode: false,
      lookup_key: null,
      metadata: {},
      nickname: null,
      product: uuid(),
      recurring: null,
      tax_behavior: 'unspecified',
      tiers_mode: null,
      transform_quantity: null,
      type: 'one_time',
      unit_amount: 3300,
      unit_amount_decimal: '3300',
    },
  },
  livemode: false,
  pending_webhooks: 2,
  request: {
    id: uuid(),
    idempotency_key: uuid(),
  },
  type: 'price.created',
};

export const paymentIntentCreated: Stripe.Event = {
  id: uuid(),
  object: 'event',
  api_version: '2020-08-27',
  created: 1638643801,
  data: {
    object: {
      id: 'pi_3KAk1BGTcbQZD9rE07TfGzRn',
      object: 'payment_intent',
      amount: 8800,
      amount_capturable: 0,
      amount_received: 0,
      application: null,
      application_fee_amount: null,
      automatic_payment_methods: null,
      canceled_at: null,
      cancellation_reason: null,
      capture_method: 'automatic',
      charges: {
        object: 'list',
        data: [],
        has_more: false,
        total_count: 0,
        url: '/v1/charges?payment_intent=pi_3K33J7GTcbQZD9rE1dF0gSdL',
      },
      client_secret: uuid(),
      confirmation_method: 'automatic',
      created: 1638643801,
      currency: 'eur',
      customer: null,
      description: null,
      invoice: null,
      last_payment_error: null,
      livemode: false,
      metadata: {},
      next_action: null,
      on_behalf_of: null,
      payment_method: null,
      payment_method_options: {
        card: {
          installments: null,
          network: null,
          request_three_d_secure: 'automatic',
        },
        giropay: {},
        sofort: {
          preferred_language: null,
        },
      },
      payment_method_types: ['card', 'giropay', 'sofort'],
      receipt_email: null,
      review: null,
      setup_future_usage: null,
      shipping: null,
      source: null,
      statement_descriptor: null,
      statement_descriptor_suffix: null,
      status: 'requires_payment_method',
      transfer_data: null,
      transfer_group: null,
    },
  },
  livemode: false,
  pending_webhooks: 2,
  request: {
    id: uuid(),
    idempotency_key: uuid(),
  },
  type: 'payment_intent.created',
};

export const customerCreated: Stripe.Event = {
  id: uuid(),
  object: 'event',
  api_version: '2020-08-27',
  created: 1638643885,
  data: {
    object: {
      id: 'pi_3KAk1BGTcbQZD9rE07TfGzRn',
      object: 'customer',
      address: {
        city: null,
        country: 'DE',
        line1: null,
        line2: null,
        postal_code: null,
        state: null,
      },
      balance: 0,
      created: 1638643885,
      currency: null,
      default_source: null,
      delinquent: false,
      description: null,
      discount: null,
      email: 'tedt@test.de',
      invoice_prefix: 'AC16AF99',
      invoice_settings: {
        custom_fields: null,
        default_payment_method: null,
        footer: null,
      },
      livemode: false,
      metadata: {},
      name: 'Dr. med. Susanne Lenk-Amborn',
      phone: null,
      preferred_locales: [],
      shipping: null,
      tax_exempt: 'none',
    },
  },
  livemode: false,
  pending_webhooks: 2,
  request: {
    id: uuid(),
    idempotency_key: uuid(),
  },
  type: 'customer.created',
};

export const paymentIntentSucceeded: Stripe.Event = {
  id: uuid(),
  object: 'event',
  api_version: '2020-08-27',
  created: 1638643886,
  data: {
    object: {
      id: 'pi_3KAk1BGTcbQZD9rE07TfGzRn',
      object: 'payment_intent',
      amount: 8800,
      amount_capturable: 0,
      amount_received: 8800,
      application: null,
      application_fee_amount: null,
      automatic_payment_methods: null,
      canceled_at: null,
      cancellation_reason: null,
      capture_method: 'automatic',
      charges: {
        object: 'list',
        data: [
          {
            id: uuid(),
            object: 'charge',
            amount: 8800,
            amount_captured: 8800,
            amount_refunded: 0,
            application: null,
            application_fee: null,
            application_fee_amount: null,
            balance_transaction: uuid(),
            billing_details: {
              address: {
                city: null,
                country: 'DE',
                line1: null,
                line2: null,
                postal_code: null,
                state: null,
              },
              email: 'tedt@test.de',
              name: 'Dr. med. Susanne Lenk-Amborn',
              phone: null,
            },
            calculated_statement_descriptor: 'ANATOLYKEHL.COM',
            captured: true,
            created: 1638643885,
            currency: 'eur',
            customer: 'cus_KiUJWNkgUEf9u6',
            description: null,
            destination: null,
            dispute: null,
            disputed: false,
            failure_code: null,
            failure_message: null,
            fraud_details: {},
            invoice: null,
            livemode: false,
            metadata: {},
            on_behalf_of: null,
            order: null,
            outcome: {
              network_status: 'approved_by_network',
              reason: null,
              risk_level: 'normal',
              risk_score: 62,
              seller_message: 'Payment complete.',
              type: 'authorized',
            },
            paid: true,
            payment_intent: uuid(),
            payment_method: uuid(),
            payment_method_details: {
              card: {
                brand: 'visa',
                checks: {
                  address_line1_check: null,
                  address_postal_code_check: null,
                  cvc_check: 'pass',
                },
                country: 'US',
                exp_month: 9,
                exp_year: 2023,
                fingerprint: uuid(),
                funding: 'credit',
                installments: null,
                last4: '4242',
                network: 'visa',
                three_d_secure: null,
                wallet: null,
              },
              type: 'card',
            },
            receipt_email: null,
            receipt_number: null,
            receipt_url:
              'https://pay.stripe.com/receipts/acct_1JbOrxGTcbQZD9rE/ch_3K33J7GTcbQZD9rE1DKKn4au/rcpt_KiUJtmWcz0j17pdKiLIIEtJ1OsHwVIo',
            refunded: false,
            refunds: {
              object: 'list',
              data: [],
              has_more: false,
              total_count: 0,
              url: '/v1/charges/ch_3K33J7GTcbQZD9rE1DKKn4au/refunds',
            },
            review: null,
            shipping: null,
            source: null,
            source_transfer: null,
            statement_descriptor: null,
            statement_descriptor_suffix: null,
            status: 'succeeded',
            transfer_data: null,
            transfer_group: null,
          },
        ],
        has_more: false,
        total_count: 1,
        url: '/v1/charges?payment_intent=pi_3K33J7GTcbQZD9rE1dF0gSdL',
      },
      client_secret: uuid(),
      confirmation_method: 'automatic',
      created: 1638643801,
      currency: 'eur',
      customer: 'cus_KiUJWNkgUEf9u6',
      description: null,
      invoice: null,
      last_payment_error: null,
      livemode: false,
      metadata: {},
      next_action: null,
      on_behalf_of: null,
      payment_method: uuid(),
      payment_method_options: {
        card: {
          installments: null,
          network: null,
          request_three_d_secure: 'automatic',
        },
        giropay: {},
        sofort: {
          preferred_language: null,
        },
      },
      payment_method_types: ['card', 'giropay', 'sofort'],
      receipt_email: null,
      review: null,
      setup_future_usage: null,
      shipping: null,
      source: null,
      statement_descriptor: null,
      statement_descriptor_suffix: null,
      status: 'succeeded',
      transfer_data: null,
      transfer_group: null,
    },
  },
  livemode: false,
  pending_webhooks: 2,
  request: {
    id: uuid(),
    idempotency_key: uuid(),
  },
  type: 'payment_intent.succeeded',
};

export const chargeSucceeded: Stripe.Event = {
  id: uuid(),
  object: 'event',
  api_version: '2020-08-27',
  created: 1638643886,
  data: {
    object: {
      id: 'pi_3KAk1BGTcbQZD9rE07TfGzRn',
      object: 'charge',
      amount: 8800,
      amount_captured: 8800,
      amount_refunded: 0,
      application: null,
      application_fee: null,
      application_fee_amount: null,
      balance_transaction: uuid(),
      billing_details: {
        address: {
          city: null,
          country: 'DE',
          line1: null,
          line2: null,
          postal_code: null,
          state: null,
        },
        email: 'tedt@test.de',
        name: 'Dr. med. Susanne Lenk-Amborn',
        phone: null,
      },
      calculated_statement_descriptor: 'ANATOLYKEHL.COM',
      captured: true,
      created: 1638643885,
      currency: 'eur',
      customer: uuid(),
      description: null,
      destination: null,
      dispute: null,
      disputed: false,
      failure_code: null,
      failure_message: null,
      fraud_details: {},
      invoice: null,
      livemode: false,
      metadata: {},
      on_behalf_of: null,
      order: null,
      outcome: {
        network_status: 'approved_by_network',
        reason: null,
        risk_level: 'normal',
        risk_score: 62,
        seller_message: 'Payment complete.',
        type: 'authorized',
      },
      paid: true,
      payment_intent: uuid(),
      payment_method: uuid(),
      payment_method_details: {
        card: {
          brand: 'visa',
          checks: {
            address_line1_check: null,
            address_postal_code_check: null,
            cvc_check: 'pass',
          },
          country: 'US',
          exp_month: 9,
          exp_year: 2023,
          fingerprint: uuid(),
          funding: 'credit',
          installments: null,
          last4: '4242',
          network: 'visa',
          three_d_secure: null,
          wallet: null,
        },
        type: 'card',
      },
      receipt_email: null,
      receipt_number: null,
      receipt_url:
        'https://pay.stripe.com/receipts/acct_1JbOrxGTcbQZD9rE/ch_3K33J7GTcbQZD9rE1DKKn4au/rcpt_KiUJtmWcz0j17pdKiLIIEtJ1OsHwVIo',
      refunded: false,
      refunds: {
        object: 'list',
        data: [],
        has_more: false,
        total_count: 0,
        url: '/v1/charges/ch_3K33J7GTcbQZD9rE1DKKn4au/refunds',
      },
      review: null,
      shipping: null,
      source: null,
      source_transfer: null,
      statement_descriptor: null,
      statement_descriptor_suffix: null,
      status: 'succeeded',
      transfer_data: null,
      transfer_group: null,
    },
  },
  livemode: false,
  pending_webhooks: 2,
  request: {
    id: uuid(),
    idempotency_key: uuid(),
  },
  type: 'charge.succeeded',
};

export const paymentIntentCanceled: Stripe.Event = {
  id: 'evt_3K9MJ0GTcbQZD9rE1AZN8L3R',
  object: 'event',
  api_version: '2020-08-27',
  created: 1640233202,
  data: {
    object: {
      id: 'pi_3KAk1BGTcbQZD9rE07TfGzRn',
      object: 'payment_intent',
      amount: 5500,
      amount_capturable: 0,
      amount_received: 0,
      application: null,
      application_fee_amount: null,
      automatic_payment_methods: null,
      canceled_at: 1640233202,
      cancellation_reason: 'automatic',
      capture_method: 'automatic',
      charges: {
        object: 'list',
        data: [],
        has_more: false,
        total_count: 0,
        url: '/v1/charges?payment_intent=pi_3K9MJ0GTcbQZD9rE1UFTrrcH',
      },
      client_secret: uuid(),
      confirmation_method: 'automatic',
      created: 1640146798,
      currency: 'eur',
      customer: null,
      description: null,
      invoice: null,
      last_payment_error: null,
      livemode: false,
      metadata: {},
      next_action: null,
      on_behalf_of: null,
      payment_method: null,
      payment_method_options: {
        card: {
          installments: null,
          network: null,
          request_three_d_secure: 'automatic',
        },
        giropay: {},
        sofort: {
          preferred_language: null,
        },
      },
      payment_method_types: ['card', 'giropay', 'sofort'],
      processing: null,
      receipt_email: null,
      review: null,
      setup_future_usage: null,
      shipping: null,
      source: null,
      statement_descriptor: null,
      statement_descriptor_suffix: null,
      status: 'canceled',
      transfer_data: null,
      transfer_group: null,
    },
  },
  livemode: false,
  pending_webhooks: 2,
  request: {
    id: null,
    idempotency_key: 'a0819569-6d07-4a18-8c99-cf62cd31a51b',
  },
  type: 'payment_intent.canceled',
};

export const session: Stripe.Checkout.Session = {
  id: 'cs_test_a1Dn6iwAZ4MDsklxSjIlfxOe888rw632R6dvskc2UUjiz6WQaLLoB1Ybkd',
  object: 'checkout.session',
  after_expiration: null,
  allow_promotion_codes: null,
  amount_subtotal: 3300,
  amount_total: 3300,
  automatic_tax: { enabled: false, status: null },
  billing_address_collection: null,
  cancel_url: 'http://localhost:3000/checkout/?canceled=true',
  client_reference_id: null,
  consent: null,
  consent_collection: null,
  currency: 'eur',
  customer: null,
  customer_details: null,
  customer_email: null,
  expires_at: 1640564123,
  livemode: false,
  locale: null,
  metadata: {},
  mode: 'payment',
  payment_intent: 'pi_3KAk1BGTcbQZD9rE07TfGzRn',
  payment_method_options: {},
  payment_method_types: ['card', 'giropay', 'sofort'],
  payment_status: 'unpaid',
  phone_number_collection: { enabled: false },
  recovered_from: null,
  setup_intent: null,
  shipping: null,
  shipping_address_collection: null,
  shipping_options: [],
  shipping_rate: null,
  status: 'open',
  submit_type: null,
  subscription: null,
  success_url: 'http://localhost:3000/gallery/acryl/',
  total_details: { amount_discount: 0, amount_shipping: 0, amount_tax: 0 },
  url: 'https://checkout.stripe.com/pay/cs_test_a1Dn6iwAZ4MDsklxSjIlfxOe888rw632R6dvskc2UUjiz6WQaLLoB1Ybkd#fidkdWxOYHwnPyd1blpxYHZxWjA0T2dKd31CUWZnVF9BPHdAYHw2dUo9dVFnaEg0cUFoRkdxdTZ2VFNLVERNYzdfNm1sNmdyU3x3Tk5sNUd9cUNkNj1JMUBwM3VvdjRGXTBzRExOXXVQRElRNTVwdWZVbGJHYCcpJ2N3amhWYHdzYHcnP3F3cGApJ2lkfGpwcVF8dWAnPyd2bGtiaWBabHFgaCcpJ2BrZGdpYFVpZGZgbWppYWB3dic%2FcXdwYHgl',
};
