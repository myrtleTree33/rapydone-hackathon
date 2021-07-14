import https from 'https';
import crypto from 'crypto';

const ACCESS_KEY = 'D8DD679C87C8C9C3A285';
const SECRET_KEY =
  '16fa289b46571f0cfd6c0b6e268f7b798676b1273809fd223d7b6bd4b994b7ca07ac6561b3f9cf01';
const AMOUNT = 11.0;
const COUNTRY = 'SG';
const CURRENCY = 'SGD';

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
      complete_checkout_url: 'https://www.google.com',
      country,
      currency,
      error_checkout_url: 'https://www.yahoo.com',
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
