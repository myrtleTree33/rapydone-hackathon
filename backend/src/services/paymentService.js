import https from 'https';
import crypto from 'crypto';

const MAX_TRIES = 5;

export const genPaymentUrlPersistent = async ({
  accessKey,
  secretKey,
  amount,
  country,
  currency,
  merchantRefId,
}) => {
  let response = undefined;
  let numTries = 0;

  while (!response && numTries < MAX_TRIES) {
    try {
      response = await genPaymentUrl({
        accessKey,
        secretKey,
        amount,
        country,
        currency,
        merchantRefId,
      });

      numTries++;
    } catch (e) {
      console.error('Error sending request to Rapyd.  Retrying...');
    }

    return Promise.resolve(response);
  }
};

export const genPaymentUrl = async ({
  accessKey,
  secretKey,
  amount,
  country,
  currency,
  merchantRefId,
}) =>
  new Promise((resolve, reject) => {
    const salt = crypto.randomBytes(12).toString('hex');
    const timestamp = (
      Math.floor(new Date().getTime() / 1000) - 10
    ).toString();
    const method = 'post';
    const path = '/v1/checkout';
    const body = JSON.stringify({
      amount,
      complete_checkout_url:
        'https://docs.google.com/document/d/e/2PACX-1vTj21b4zmJNtPCtzABkOXHKGLRLyy1BCAm9SCZRuOKRgk1sdOEnIlIa1-ON1fpTULFFHS51uBEa8Khs/pub',
      country,
      currency,
      error_checkout_url:
        'https://docs.google.com/document/d/e/2PACX-1vTj21b4zmJNtPCtzABkOXHKGLRLyy1BCAm9SCZRuOKRgk1sdOEnIlIa1-ON1fpTULFFHS51uBEa8Khs/pub',
      merchant_reference_id: merchantRefId,
      language: 'en',
      metadata: {
        merchant_defined: true,
        address: 'ABC street',
      },
    });
    const toSign = `${method}${path}${salt}${timestamp}${accessKey}${secretKey}${body}`;
    let signature = crypto
      .createHmac('sha256', secretKey)
      .update(toSign, 'utf8')
      .digest('hex');
    signature = Buffer.from(signature, 'utf8').toString('base64');

    const req = https.request(
      {
        hostname: 'sandboxapi.rapyd.net',
        port: 443,
        path,
        method,
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': body.length,
          access_key: accessKey,
          salt,
          timestamp,
          signature,
        },
      },
      (res) => {
        res.on('data', (d) => {
          resolve(JSON.parse(d.toString()));
        });
      },
    );

    req.on('error', (error) => {
      reject(error);
    });

    req.write(body);
    req.end();
  });
