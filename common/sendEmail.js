const moment = require("moment");
const nodemailer = require("nodemailer");

const regards = "Thanks & Regards";
const service_name = process.env.SERVICE_NAME;
const service_email = process.env.COMPANY_EMAIL;
const signup_email = process.env.SIGNUP_EMAIL;
const service_website = process.env.COMPANY_WEBSITE;
const service_contact_number = process.env.COMPANY_CONTACT_NUMBER;
const service_email_password = process.env.COMPANY_EMAIL_PASSWORD;
const signup_email_password = process.env.SIGNUP_EMAIL_PASSWORD;

const handleTemplates = (user, purpose, value) => {
  console.log(value, "value")
  switch (purpose) {
    // TO FORGOT PASSWORD
    case "FORGOT_PASSWORD":
      return `
      <html>
      <head>
        <style>
          /* Add your styles here */
        </style>
      </head>
      <body>
        <h1>Dear ${user.firstName} ${user.lastName},</h1>
        <p>
          At ${service_name} , the safety of your personal information is our number
          one concern. We've received a request to resend your password.
        </p>
        <p>
          Your password is <strong>${value}</strong>. Login to your ${service_name}
          account by using this password and your username as
          <strong>${user.phone}</strong>.
        </p>
        <p>${regards}</p>
        <p>${service_name} Team</p>
      </body>
    </html>
         
    `;

    // TO WELCOME GREETINGS FOR USER
    case "USER_CONGRATES":
      return `
      <html>
      <head>
        <style>
          /* Add your styles here */
        </style>
      </head>
      <body>
        <h1>Hi ${user.firstName},</h1>
        <p>Thank you for registering you in ${service_name}!</p>
        <p>UserName - ${user.phone}</p>
        <p>
          Please use your phone to log in to your ${service_name}
          account. Feel free to contact our Customer Support at:
          <a href="tel:${service_contact_number}">${service_contact_number}</a> to
          get resolution of any issues related to
          <a href="${service_website}">${service_website}</a>
        </p>
        <p>${regards}</p>
        <p>${service_name} Team</p>
      </body>
    </html>  
    `;

    // TO INFORM ABOUT KYC STATUS
    case "USER_KYC_STATUS":
      return `
      <html>
      <head>
        <style>
          /* Add your styles here */
        </style>
      </head>
      <body>
        <h1>Hi ${user.firstName},</h1>
        <p>Your KYC request has ${value}</p>
        <p>${regards}</p>
        <p>${service_name} Team</p>
      </body>
    </html>    
      `;

    // TO WELCOME GREETINGS FOR MERCHANT
    case "MERCHANT_CONGRATES":
      return `
      <html>
      <head>
        <style>
          /* Add your styles here */
        </style></head
      >cxx
      <body>
        <h1>Hi ${user.firstName},</h1>
        <p>Thank you for registering you in ${service_name}!</p>
        <p>UserName - ${user.email}</p>
        <p>
          Please use your username to log in to your ${service_name}
          account. Feel free to contact our Customer Support at:
          <a href="tel:${service_contact_number}">${service_contact_number}</a> to
          get resolution of any issues related to
          <a href="${service_website}">${service_website}</a>
        </p>
        <p>${regards}</p>
        <p>${service_name} Team</p>
      </body>
    </html>   
    `;

    // TO SEND SERVICE RECEIPT
    case "SERVICE_RECEIPT":
      return `<html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Document</title>
      </head>
      <body>
        <div id="cvcmsgbod_18c587bd80a9e911" class="yh">
          <div class="lh">
            <div class="Lg Ng" dir="ltr">
              <u></u>
              <div>
                <table
                  style="
                    border-collapse: collapse;
                    table-layout: fixed;
                    margin: 0 auto;
                    border-spacing: 0;
                    padding: 0;
                    height: 100% !important;
                    width: 100% !important;
                    font-weight: normal;
                    color: #3e4152;
                    font-family: 'roboto', Arial, Helvetica, sans-serif;
                    font-size: 14px;
                    line-height: 1.4;
                  "
                  height="100%"
                  border="0"
                  cellpadding="0"
                  cellspacing="0"
                  width="100%"
                >
                  <tbody>
                    <tr>
                      <td style="background: #ffffff; padding: 16px 0">
                        <table
                          style="
                            max-width: 600px;
                            margin: auto;
                            border-spacing: 0;
                            background: #673ab7;
                            padding: 4px;
                            border-radius: 16px;
                            overflow: hidden;
                          "
                          align="center"
                          border="0"
                          cellpadding="0"
                          cellspacing="0"
                          width="100%"
                        >
                          <tbody>
                            <tr>
                              <td style="border-collapse: collapse">
                                <table
                                  style="
                                    margin: auto;
                                    border-spacing: 0;
                                    background: white;
                                    border-radius: 12px;
                                    overflow: hidden;
                                  "
                                  align="center"
                                  border="0"
                                  cellpadding="0"
                                  cellspacing="0"
                                  width="100%"
                                >
                                  <tbody>
                                    <tr>
                                      <td style="border-collapse: collapse">
                                        <table
                                          style="
                                            border-spacing: 0;
                                            border-collapse: collapse;
                                          "
                                          bgcolor="#ffffff"
                                          border="0"
                                          cellpadding="0"
                                          cellspacing="0"
                                          width="100%"
                                        >
                                          <tbody>
                                            <tr>
                                              <td
                                                style="
                                                  border-collapse: collapse;
                                                  padding: 16px 32px;
                                                "
                                                align="left"
                                                valign="middle"
                                              >
                                                <table
                                                  style="
                                                    border-spacing: 0;
                                                    border-collapse: collapse;
                                                  "
                                                  bgcolor="#ffffff"
                                                  border="0"
                                                  cellpadding="0"
                                                  cellspacing="0"
                                                  width="100%"
                                                >
                                                  <tbody>
                                                    <tr>
                                                      <td
                                                        style="
                                                          padding: 0;
                                                          text-align: left;
                                                          border-collapse: collapse;
                                                        "
                                                        width="40"
                                                        align="left"
                                                        valign="middle"
                                                      >
                                                        <a
                                                          href="https://www.aadyapay.com"
                                                          style="
                                                            text-decoration: none;
                                                            color: #ffffff;
                                                            outline: 0;
                                                            outline: none;
                                                            border: 0;
                                                            border: none;
                                                          "
                                                          target="_blank"
                                                          
                                                        >
                                                          <img
                                                            src="https://ik.imagekit.io"
                                                            title="Aadyapay"
                                                            alt="Aadyapay"
                                                            style="
                                                              margin: auto;
                                                              text-align: center;
                                                              border: 0px;
                                                              outline: none;
                                                              text-decoration: none;
                                                              min-height: 40px;
                                                              max-width: 2808px;
                                                            "
                                                            align="middle"
                                                            border="0"
                                                            width="40"
                                                          />
                                                        </a>
                                                      </td>
                                                      <td
                                                        width="16"
                                                        align="left"
                                                        valign="middle"
                                                        style="
                                                          border-collapse: collapse;
                                                        "
                                                      >
                                                        &nbsp;
                                                      </td>
                                                      <td
                                                        align="right"
                                                        valign="middle"
                                                      >
                                                        ${moment(
                                                          value?._doc?.createdAt
                                                        )?.format("ll")}
                                                      </td>
                                                    </tr>
                                                  </tbody>
                                                </table>
                                              </td>
                                            </tr>
                                          </tbody>
                                        </table>
                                      </td>
                                    </tr>
                                    <tr>
                                      <td
                                        style="
                                          border-collapse: collapse;
                                          padding: 0 16px;
                                        "
                                      >
                                        <table
                                          align="center"
                                          border="0"
                                          cellpadding="0"
                                          cellspacing="0"
                                          width="100%"
                                          style="
                                            background: #f7f9fa;
                                            padding: 16px;
                                            border-radius: 8px;
                                            overflow: hidden;
                                          "
                                        >
                                          <tbody>
                                            <tr>
                                              <td
                                                align="left"
                                                valign="middle"
                                                style="
                                                  border-collapse: collapse;
                                                  padding-bottom: 16px;
                                                  border-bottom: 1px solid #eaeaed;
                                                "
                                              >
                                                <table
                                                  align="center"
                                                  border="0"
                                                  cellpadding="0"
                                                  cellspacing="0"
                                                  width="100%"
                                                >
                                                  <tbody>
                                                    <tr>
                                                      <td
                                                        align="left"
                                                        valign="top"
                                                        style="
                                                          border-collapse: collapse;
                                                          text-transform: capitalize;
                                                        "
                                                      >
                                                        <span
                                                          style="
                                                            border-collapse: collapse;
                                                            width: 100%;
                                                            display: block;
                                                          "
                                                          >Payment For
                                                        </span>
                                                        <span
                                                          style="
                                                            border-collapse: collapse;
                                                            font-size: 16px;
                                                            font-weight: 500;
                                                            width: 100%;
                                                            display: block;
                                                          "
                                                        >
                                                          ${value?._doc?.number}
                                                        </span>
                                                      </td>
                                                      <td
                                                        width="32"
                                                        align="left"
                                                        valign="middle"
                                                        style="
                                                          border-collapse: collapse;
                                                        "
                                                      ></td>
                                                      <td
                                                        align="right"
                                                        valign="middle"
                                                        style="
                                                          border-collapse: collapse;
                                                          font-size: 20px;
                                                          font-weight: 500;
                                                        "
                                                      >
                                                        ₹${value?._doc?.amount}
                                                      </td>
                                                    </tr>
                                                  </tbody>
                                                </table>
                                              </td>
                                            </tr>
                                            <tr>
                                              <td
                                                align="left"
                                                valign="middle"
                                                style="
                                                  border-collapse: collapse;
                                                  padding: 8px 0;
                                                  border-bottom: 1px solid #eaeaed;
                                                  font-size: 12px;
                                                "
                                              >
                                                <table
                                                  align="center"
                                                  border="0"
                                                  cellpadding="0"
                                                  cellspacing="0"
                                                  width="100%"
                                                >
                                                  <tbody>
                                                    <tr>
                                                      <td
                                                        width="50%"
                                                        align="left"
                                                        valign="top"
                                                        style="
                                                          border-collapse: collapse;
                                                          text-transform: capitalize;
                                                        "
                                                      >
                                                        Txn. ID
                                                      </td>
                                                      <td
                                                        width="16"
                                                        align="left"
                                                        valign="top"
                                                        style="
                                                          border-collapse: collapse;
                                                          font-weight: normal;
                                                        "
                                                      >
                                                        :
                                                      </td>
                                                      <td
                                                        align="left"
                                                        valign="top"
                                                        style="
                                                          border-collapse: collapse;
                                                          font-weight: normal;
                                                        "
                                                      >
                                                        ${
                                                          value?._doc
                                                            ?.transactionId
                                                        }
                                                      </td>
                                                    </tr>
                                                  </tbody>
                                                </table>
                                              </td>
                                            </tr>
                                            <tr>
                                              <td
                                                align="left"
                                                valign="middle"
                                                style="
                                                  border-collapse: collapse;
                                                  padding: 8px 0;
                                                  border-bottom: 1px solid #eaeaed;
                                                  font-size: 12px;
                                                "
                                              >
                                                <table
                                                  align="center"
                                                  border="0"
                                                  cellpadding="0"
                                                  cellspacing="0"
                                                  width="100%"
                                                >
                                                  <tbody>
                                                    <tr>
                                                      <td
                                                        width="50%"
                                                        align="left"
                                                        valign="top"
                                                        style="
                                                          border-collapse: collapse;
                                                          text-transform: capitalize;
                                                        "
                                                      >
                                                        Txn. status
                                                      </td>
                                                      <td
                                                        width="16"
                                                        align="left"
                                                        valign="top"
                                                        style="
                                                          border-collapse: collapse;
                                                          font-weight: normal;
                                                        "
                                                      >
                                                        :
                                                      </td>
                                                      <td
                                                        align="left"
                                                        valign="top"
                                                        style="
                                                          border-collapse: collapse;
                                                          font-weight: normal;
                                                          font-size: 16px;
                                                          color: #5eaa46;
                                                        "
                                                      >
                                                        ${value?._doc?.status}
                                                      </td>
                                                    </tr>
                                                  </tbody>
                                                </table>
                                              </td>
                                            </tr>
                                            <!-- <tr>
                                              <td
                                                align="left"
                                                valign="middle"
                                                style="
                                                  border-collapse: collapse;
                                                  padding: 8px 0;
                                                  border-bottom: 1px solid #eaeaed;
                                                  font-size: 12px;
                                                "
                                              >
                                                <table
                                                  align="center"
                                                  border="0"
                                                  cellpadding="0"
                                                  cellspacing="0"
                                                  width="100%"
                                                >
                                                  <tbody>
                                                    <tr>
                                                      <td
                                                        width="50%"
                                                        align="left"
                                                        valign="top"
                                                        style="
                                                          border-collapse: collapse;
                                                          text-transform: capitalize;
                                                        "
                                                      >
                                                        Debited from
                                                      </td>
                                                    </tr>
                                                  </tbody>
                                                </table>
                                              </td>
                                            </tr> -->
                                            <tr>
                                              <td
                                                align="left"
                                                valign="middle"
                                                style="
                                                  border-collapse: collapse;
                                                  padding: 8px 0;
                                                  border-bottom: 1px solid #eaeaed;
                                                  font-size: 12px;
                                                "
                                              >
                                                <table
                                                  align="center"
                                                  border="0"
                                                  cellpadding="0"
                                                  cellspacing="0"
                                                  width="100%"
                                                >
                                                  <tbody>
                                                    <tr>
                                                      <td
                                                        width="50%"
                                                        align="left"
                                                        valign="top"
                                                        style="
                                                          border-collapse: collapse;
                                                          text-transform: capitalize;
                                                        "
                                                      >
                                                        <!-- <span
                                                          style="
                                                            border-collapse: collapse;
                                                            font-size: 12px;
                                                            width: 100%;
                                                            display: block;
                                                          "
                                                        >
                                                          Wallet
                                                        </span> -->
                                                        <span
                                                          style="
                                                            border-collapse: collapse;
                                                            width: 100%;
                                                            font-weight: normal;
                                                            display: block;
                                                          "
                                                        >
                                                          Wallet</span
                                                        >
                                                      </td>
                                                      <td
                                                        width="16"
                                                        align="left"
                                                        valign="top"
                                                        style="
                                                          border-collapse: collapse;
                                                          font-weight: normal;
                                                        "
                                                      >
                                                        :
                                                      </td>
                                                      <td
                                                        align="left"
                                                        valign="top"
                                                        style="
                                                          border-collapse: collapse;
                                                          font-weight: normal;
                                                          /* font-size: 12px; */
                                                        "
                                                      >
                                                        ₹${value?._doc?.amount}
                                                      </td>
                                                    </tr>
                                                  </tbody>
                                                </table>
                                              </td>
                                            </tr>
                                            <tr>
                                              <td
                                                align="left"
                                                valign="middle"
                                                style="
                                                  border-collapse: collapse;
                                                  padding: 8px 0;
                                                  border-bottom: 1px solid #eaeaed;
                                                  font-size: 12px;
                                                "
                                              >
                                                <table
                                                  align="center"
                                                  border="0"
                                                  cellpadding="0"
                                                  cellspacing="0"
                                                  width="100%"
                                                >
                                                  <tbody>
                                                    <tr>
                                                      <td
                                                        width="50%"
                                                        align="left"
                                                        valign="top"
                                                        style="
                                                          border-collapse: collapse;
                                                          text-transform: capitalize;
                                                        "
                                                      >
                                                        Operator Ref. No.
                                                      </td>
                                                      <td
                                                        width="16"
                                                        align="left"
                                                        valign="top"
                                                        style="
                                                          border-collapse: collapse;
                                                          font-weight: normal;
                                                        "
                                                      >
                                                        :
                                                      </td>
                                                      <td
                                                        align="left"
                                                        valign="top"
                                                        style="
                                                          border-collapse: collapse;
                                                          font-weight: normal;
                                                        "
                                                      >
                                                        ${
                                                          value?._doc?.operatorRef
                                                        }
                                                      </td>
                                                    </tr>
                                                  </tbody>
                                                </table>
                                              </td>
                                            </tr>
                                            <tr>
                                              <td
                                                align="left"
                                                valign="middle"
                                                style="
                                                  border-collapse: collapse;
                                                  padding: 8px 0;
                                                  border-bottom: 1px solid #eaeaed;
                                                  font-size: 12px;
                                                "
                                              >
                                                <table
                                                  align="center"
                                                  border="0"
                                                  cellpadding="0"
                                                  cellspacing="0"
                                                  width="100%"
                                                >
                                                  <tbody>
                                                    <tr>
                                                      <td
                                                        width="50%"
                                                        align="left"
                                                        valign="top"
                                                        style="
                                                          border-collapse: collapse;
                                                          text-transform: capitalize;
                                                        "
                                                      >
                                                        Bill/Recharge Amount
                                                      </td>
                                                      <td
                                                        width="16"
                                                        align="left"
                                                        valign="top"
                                                        style="
                                                          border-collapse: collapse;
                                                          font-weight: normal;
                                                        "
                                                      >
                                                        :
                                                      </td>
                                                      <td
                                                        align="left"
                                                        valign="top"
                                                        style="
                                                          border-collapse: collapse;
                                                          font-weight: normal;
                                                        "
                                                      >
                                                        ₹${value?._doc?.amount}
                                                      </td>
                                                    </tr>
                                                  </tbody>
                                                </table>
                                              </td>
                                            </tr>
    
                                            <tr>
                                              <td
                                                align="left"
                                                valign="middle"
                                                style="
                                                  border-collapse: collapse;
                                                  padding: 8px 0 0;
                                                  font-size: 12px;
                                                "
                                              >
                                                <table
                                                  align="center"
                                                  border="0"
                                                  cellpadding="0"
                                                  cellspacing="0"
                                                  width="100%"
                                                >
                                                  <tbody>
                                                    <tr>
                                                      <td
                                                        width="50%"
                                                        align="left"
                                                        valign="top"
                                                        style="
                                                          border-collapse: collapse;
                                                        "
                                                      >
                                                        Operator
                                                      </td>
                                                      <td
                                                        width="16"
                                                        align="left"
                                                        valign="top"
                                                        style="
                                                          border-collapse: collapse;
                                                          font-weight: normal;
                                                        "
                                                      >
                                                        :
                                                      </td>
                                                      <td
                                                        align="left"
                                                        valign="top"
                                                        style="
                                                          border-collapse: collapse;
                                                          font-weight: normal;
                                                        "
                                                      >
                                                        ${value?.operatorName}
                                                      </td>
                                                    </tr>
                                                  </tbody>
                                                </table>
                                              </td>
                                            </tr>
                                          </tbody>
                                        </table>
                                      </td>
                                    </tr>
                                    <tr>
                                      <td
                                        style="
                                          border-collapse: collapse;
                                          padding: 32px;
                                          background: #ffffff;
                                          font-family: 'roboto', Arial, Helvetica,
                                            sans-serif;
                                        "
                                      >
                                        <p style="padding: 0; margin: 0">
                                          Hi ${user?.firstName} ${
        user?.lastName
      } <br />
                                          <br />If you have not done this
                                          transaction or have not received this
                                          recharge, then you can mail us on
                                          <a
                                            style="
                                              color: blue;
                                              text-decoration: underline;
                                            "
                                            href="mailto:aadyapay@gmail.com"
                                            >aadyapay@gmail.com</a
                                          >.
                                          <br />
                                          <br />Cheers! <br />Team Aadyapay
                                        </p>
                                      </td>
                                    </tr>
                                    <tr>
                                      <td
                                        style="
                                          border-collapse: collapse;
                                          padding: 16px 32px;
                                          border-top: 1px solid #eaeaed;
                                          font-family: 'roboto', Arial, Helvetica,
                                            sans-serif;
                                          font-size: 12px;
                                        "
                                      >
                                        <table
                                          align="center"
                                          border="0"
                                          cellpadding="0"
                                          cellspacing="0"
                                          width="100%"
                                        >
                                          <tbody>
                                            <tr>
                                              <td
                                                align="left"
                                                valign="middle"
                                                style="
                                                  border-collapse: collapse;
                                                  font-weight: normal;
                                                "
                                              >
                                                <a
                                                  href="#"
                                                  style="
                                                    color: #673ab7;
                                                    font-size: 12px;
                                                    padding: 4px;
                                                    height: 24px;
                                                    display: inline-block;
                                                    text-transform: capitalize;
                                                    outline: 0;
                                                    outline: none;
                                                    border: 0;
                                                    border: none;
                                                  "
                                                  target="_blank"
                                                >
                                                  About us
                                                </a>
                                                <a
                                                  href="#"
                                                  style="
                                                    color: #673ab7;
                                                    font-size: 12px;
                                                    padding: 4px;
                                                    height: 24px;
                                                    display: inline-block;
                                                    text-transform: capitalize;
                                                    outline: 0;
                                                    outline: none;
                                                    border: 0;
                                                    border: none;
                                                  "
                                                  target="_blank"
                                                >
                                                  Policy
                                                </a>
                                                <a
                                                  href="#"
                                                  style="
                                                    color: #673ab7;
                                                    font-size: 12px;
                                                    padding: 4px;
                                                    height: 24px;
                                                    display: inline-block;
                                                    text-transform: capitalize;
                                                    outline: 0;
                                                    outline: none;
                                                    border: 0;
                                                    border: none;
                                                  "
                                                  target="_blank"
                                                >
                                                  Terms
                                                </a>
                                              </td>
                                              <td
                                                width="16"
                                                align="left"
                                                valign="middle"
                                                style="border-collapse: collapse"
                                              >
                                                &nbsp;
                                              </td>
                                             
                                            </tr>
                                            <tr>
                                              <td
                                                style="
                                                  border-collapse: collapse;
                                                  font-weight: normal;
                                                  padding-top: 16px;
                                                  font-style: italic;
                                                  color: #7e818c;
                                                "
                                                colspan="3"
                                              ></td>
                                            </tr>
                                            <tr>
                                              <td
                                                style="
                                                  border-collapse: collapse;
                                                  font-weight: normal;
                                                  padding-top: 16px;
                                                  font-style: italic;
                                                  color: #7e818c;
                                                "
                                                colspan="3"
                                              >
                                                Important Note: Aadyapay or its
                                                merchant partners never ask for your
                                                Aadyapay password, bank details or
                                                MPIN over email/phone. Please do not
                                                share your Aadyapay password or MPIN
                                                with anyone. For any questions write
                                                to
                                                <a
                                                  href="mailto:aadyapay@aadyapay.com"
                                                  style="color: #673ab7"
                                                  target="_blank"
                                                  >aadyapay@gmail.com</a
                                                >
                                              </td>
                                            </tr>
                                          </tbody>
                                        </table>
                                      </td>
                                    </tr>
                                  </tbody>
                                </table>
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </td>
                    </tr>
                  </tbody>
                </table>
                <p>&nbsp;<br /></p>
              </div>
              <div style="clear: both"></div>
            </div>
            <div style="clear: both"></div>
          </div>
        </div>
      </body>
    </html>`;
  }
};

function sendEmail(user, purpose, value) {
  // Set up a transporter object with Gmail credentials
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
      user: purpose === "USER_CONGRATES" ? signup_email : service_email,
      pass:
        purpose === "USER_CONGRATES"
          ? signup_email_password
          : service_email_password,
    },
  });

  // Define the email message to be sent

  const handlePurpose = (user, purpose, value) => {
    if (purpose === "SERVICE_RECEIPT") {
      return `Payment for Bill/Recharge of ₹${value?._doc?.amount} is successfull ✅`;
    } else if (purpose === "USER_CONGRATES") {
      return `Welcome! 🥳 ${user?.firstName} 🥳. `;
    } else if (purpose === "USER_KYC_STATUS") {
      return `Hi ${user?.firstName} Your KYC Status Update 🙄. `;
    } else if (purpose === "FORGOT_PASSWORD") {
      return `Forgot Password Request for Aadyapay`;
    }
  };

  const mailOptions = {
    from: purpose === "USER_CONGRATES" ? signup_email : service_email,
    to: user.email,
    subject: handlePurpose(user, purpose, value),
    html: handleTemplates(user, purpose, value),
  };

  // Send the email
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error("error", error);
    } else {
      console.log(`Email sent: ${info.response}`);
    }
  });
}

module.exports = sendEmail;
