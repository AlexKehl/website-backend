import faker from 'faker';
import Stripe from 'stripe';

export const checkoutSessionCompleted: Stripe.Event = {
  id: faker.datatype.uuid(),
  object: 'event',
  api_version: '2020-08-27',
  created: 1638643543,
  data: {
    object: {
      id: faker.datatype.uuid(),
      object: 'checkout.session',
      after_expiration: null,
      allow_promotion_codes: null,
      amount_subtotal: 8800,
      amount_total: 8800,
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
      customer: 'cus_KiUDDF5m1IBve0',
      customer_details: {
        email: 'tedt@test.de',
        phone: null,
        tax_exempt: 'none',
        tax_ids: [],
      },
      customer_email: null,
      expires_at: 1638729926,
      livemode: false,
      locale: null,
      metadata: {},
      mode: 'payment',
      payment_intent: faker.datatype.uuid(),
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
  id: faker.datatype.uuid(),
  object: 'event',
  api_version: '2020-08-27',
  created: 1638643801,
  data: {
    object: {
      id: faker.datatype.uuid(),
      object: 'price',
      active: true,
      billing_scheme: 'per_unit',
      created: 1638643801,
      currency: 'eur',
      livemode: false,
      lookup_key: null,
      metadata: {},
      nickname: null,
      product: faker.datatype.uuid(),
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
    id: faker.datatype.uuid(),
    idempotency_key: faker.datatype.uuid(),
  },
  type: 'price.created',
};

export const paymentIntentCreated: Stripe.Event = {
  id: faker.datatype.uuid(),
  object: 'event',
  api_version: '2020-08-27',
  created: 1638643801,
  data: {
    object: {
      id: faker.datatype.uuid(),
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
      client_secret: faker.datatype.uuid(),
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
    id: faker.datatype.uuid(),
    idempotency_key: faker.datatype.uuid(),
  },
  type: 'payment_intent.created',
};

export const customerCreated: Stripe.Event = {
  id: faker.datatype.uuid(),
  object: 'event',
  api_version: '2020-08-27',
  created: 1638643885,
  data: {
    object: {
      id: faker.datatype.uuid(),
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
    id: faker.datatype.uuid(),
    idempotency_key: faker.datatype.uuid(),
  },
  type: 'customer.created',
};

export const paymentIntentSucceeded: Stripe.Event = {
  id: faker.datatype.uuid(),
  object: 'event',
  api_version: '2020-08-27',
  created: 1638643886,
  data: {
    object: {
      id: faker.datatype.uuid(),
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
            id: faker.datatype.uuid(),
            object: 'charge',
            amount: 8800,
            amount_captured: 8800,
            amount_refunded: 0,
            application: null,
            application_fee: null,
            application_fee_amount: null,
            balance_transaction: faker.datatype.uuid(),
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
            payment_intent: faker.datatype.uuid(),
            payment_method: faker.datatype.uuid(),
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
                fingerprint: faker.datatype.uuid(),
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
      client_secret: faker.datatype.uuid(),
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
      payment_method: faker.datatype.uuid(),
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
    id: faker.datatype.uuid(),
    idempotency_key: faker.datatype.uuid(),
  },
  type: 'payment_intent.succeeded',
};

export const chargeSucceeded: Stripe.Event = {
  id: faker.datatype.uuid(),
  object: 'event',
  api_version: '2020-08-27',
  created: 1638643886,
  data: {
    object: {
      id: faker.datatype.uuid(),
      object: 'charge',
      amount: 8800,
      amount_captured: 8800,
      amount_refunded: 0,
      application: null,
      application_fee: null,
      application_fee_amount: null,
      balance_transaction: faker.datatype.uuid(),
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
      customer: faker.datatype.uuid(),
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
      payment_intent: faker.datatype.uuid(),
      payment_method: faker.datatype.uuid(),
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
          fingerprint: faker.datatype.uuid(),
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
    id: faker.datatype.uuid(),
    idempotency_key: faker.datatype.uuid(),
  },
  type: 'charge.succeeded',
};
