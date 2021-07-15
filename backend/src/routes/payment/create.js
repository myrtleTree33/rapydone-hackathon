import { genPaymentUrlPersistent } from '../../services/paymentService.js';

const ACCESS_KEY = 'D8DD679C87C8C9C3A285';
const SECRET_KEY =
  '16fa289b46571f0cfd6c0b6e268f7b798676b1273809fd223d7b6bd4b994b7ca07ac6561b3f9cf01';

async function routes(fastify, opts) {
  fastify.post('/', async (request, reply) => {
    const { amount, country, currency, merchantRefId } = request.body;

    const rapydRes = await genPaymentUrlPersistent({
      accessKey: ACCESS_KEY,
      secretKey: SECRET_KEY,
      amount,
      country,
      currency,
      merchantRefId,
    });

    request.log.info(rapydRes);

    const {
      data: { redirect_url: redirectUrl },
    } = rapydRes;

    return Promise.resolve({
      messages: [
        {
          attachment: {
            type: 'template',
            payload: {
              template_type: 'button',
              text: 'Please make payment via the link',
              buttons: [
                {
                  type: 'web_url',
                  url: redirectUrl,
                  webview_height_ratio: 'compact',
                  title: 'Pay now',
                },
              ],
            },
          },
        },
      ],
    });
  });
}

export default routes;
