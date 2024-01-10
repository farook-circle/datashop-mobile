import moment from 'moment-timezone';

export const ReceiptTemplate = receipt => `
<!DOCTYPE html>
<html lang="en">
  <head>
    <title>Datashop Receipt</title>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width" />
    <style>
      * {
        box-sizing: border-box;
        margin: 0;
        padding: 0;
        font-family: system-ui, sans-serif;
      }

      body {
        border: 1px solid #f3f3f3;
        max-width: 500px;
        margin: 2rem auto;
        background-color: white;
      }

      main {
        padding: 2rem 2rem 0;
      }

      .title {
        font-size: 0.7rem;
        text-transform: uppercase;
        font-weight: 600;
        color: #606060;
      }

      .transaction-status {
        font-weight: 800;
        text-align: center;
        font-size: 1.5rem;
        color: #536dfe;
        margin: 3rem 0;
      }

      .transaction-detail {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        border-bottom: 1px dashed #eee;
        padding: 14px 0;
      }

      .transaction-detail .label {
        text-transform: uppercase;
        font-size: 10px;
        color: #888888;
      }

      .transaction-detail .value {
        font-weight: 600;
        text-align: right;
        font-size: 12px;
        color: #536dfe;
      }

      .amount {
        max-width: 300px;
        padding: 1rem;
        margin: 1.5rem auto;
      }

      .total-price {
        color: #536dfe;
        font-weight: 700;
        text-align: center;
        margin-bottom: 1.2rem;
      }

      .breakdowns {
        display: flex;
        justify-content: space-between;
        font-size: 10px;
        color: #808080;
        text-transform: uppercase;
        font-weight: 600;
      }

      .footer {
        background: #536dfe;
        padding: 2rem;
        display: flex;
        justify-content: space-between;
        align-items: center;
      }

      .footer a {
        text-decoration: none;
        color: white;
        font-size: 10px;
      }

      .icon-group {
        display: flex;
        align-items: center;
      }

      .icon-group a {
        margin-right: 10px;
      }

      .contactus-label {
        font-size: 10px;
        color: #ffffff;
        text-transform: uppercase;
        font-weight: 600;
        margin-right: 3px;
      }

    </style>
  </head>
  <body>
    <main>
      <div>
        <img
          src="https://firebasestorage.googleapis.com/v0/b/datashop-mobile.appspot.com/o/datashop%2Flogo-colored.png?alt=media&token=ccf476ee-36cb-4ad4-9a26-4118fcfbaf28"
          alt="datashop"
          height="75"
        />
        <p class="title">Payment Receipt</p>
      </div>

      <div class="transaction-status">
        PAYMENT ${receipt?.status?.toUpperCase()}
      </div>

      <div class="transaction-detail">
        <p class="label">Agent</p>
        <p class="value">${receipt.agent}</p>
      </div>

      ${
        receipt?.name
          ? `
      <div class="transaction-detail">
        <p class="label">Name</p>
        <p class="value">${receipt?.name}</p>
      </div>
      `
          : ''
      }

      ${
        receipt?.customer
          ? `
        <div class="transaction-detail">
          <p class="label">Customer</p>
          <p class="value">${receipt?.customer}</p>
        </div>
        `
          : ''
      }

        ${
          receipt?.quantity
            ? `
          <div class="transaction-detail">
            <p class="label">Quantity</p>
            <p class="value">${receipt?.quantity}</p>
          </div>
          `
            : ''
        }

      </div>
      <div class="transaction-detail">
        <p class="label">Transaction ID</p>
        <p class="value">${receipt.transaction_ref}</p>
      </div>
      <div class="transaction-detail">
        <p class="label">Payment Method</p>
        <p class="value">${receipt.payment_method}</p>
      </div>
      <div class="transaction-detail">
        <p class="label">Remark</p>
        <p class="value">${receipt.remark}</p>
      </div>
      <div class="transaction-detail">
      <p class="label">Time</p>
      <p class="value">${moment(receipt.created_at).format('h:mm a')}</p>
    </div>
      <div class="transaction-detail">
        <p class="label">Date</p>
        <p class="value">${moment(receipt.created_at).format(
          'MMMM D, YYYY',
        )}</p>
      </div>
    </main>
    <div class="footer">
      <a href="mailto:datashop@farookcircle.com">datashop@farookcircle.com</a>
      <div class="icon-group">
        <p class="contactus-label">Contact us on:</p>
        <a href="https://wa.me/${receipt?.whatsapp_number}" target="_blank">
          <img src="https://upload.wikimedia.org/wikipedia/commons/5/5e/WhatsApp_icon.png" alt="WhatsApp" width="20" height="20">
        </a>
        <a href="https://play.google.com/store/apps/details?id=com.farookcircle.datashop&pcampaignid=web_share" target="_blank">
          <img src="https://upload.wikimedia.org/wikipedia/commons/0/04/GooglePlaySecond.png" alt="Google Play" width="20" height="20">
        </a>
      </div>
    </div>
  </body>
</html>

`;
