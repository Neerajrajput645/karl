const moment = require("moment");
// const puppeteer = require("puppeteer");
const fs = require("fs");
const path = require("path");
// const sendEmail = require("./sendEmail");
const XLSX = require("xlsx");
const asyncHandler = require("express-async-handler");
// Import your models
const Recharge = require("../models/service/rechargeSchema");
const BillPayment = require("../models/service/bbps");
const DTH = require("../models/service/dthSchema");

const createHtmlToPdf = (user, value) => {
  // Define your HTML receipt content
  const htmlContent = `<html lang="en">
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
                                                        src="https://ik.imagekit.io/"
                                                        title="Practice"
                                                        alt="Practice"
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
                                                    ${moment( value?.createdAt)?.format("YYYY-MM-DD HH:mm")}
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
                                                      ${value?.number}
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
                                                    Rs.${value?.amount}
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
                                                    Service
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
                                                    ${ value?.serviceName }
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
                                                    ${ value?.TransID }
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
                                                      Payment Method</span
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
                                                    Wallet
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
                                                    ${ value?.operatorRef }
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
                                                    Rs.${value?.amount}
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
                                      Hi ${user?.firstName} ${ user?.lastName }
                                      <br />
                                      Mobile : ${user?.phone}, Email :
                                      ${user?.email}
                                      <br />
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
                                      <p>NOTE : This is computer generated receipt and does not require physical signature.</p>
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
                                              href="https://aadyapay.com/about-us/"
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
                                              href="https://aadyapay.com/privacy-policy/"
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
                                              href="https://aadyapay.com/terms-conditions/"
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
                                          <td
                                            align="right"
                                            valign="middle"
                                            style="border-collapse: collapse"
                                          >
                                            <table
                                              border="0"
                                              cellspacing="0"
                                              cellpadding="0"
                                            >
                                              <tbody>
                                                <tr>
                                                  <td
                                                    style="
                                                      border-collapse: collapse;
                                                    "
                                                  >
                                                    <a
                                                      "
                                                      style="
                                                        font-size: 0;
                                                        border: 0;
                                                        outline: 0;
                                                        border: none;
                                                        outline: none;
                                                        text-decoration: none;
                                                        margin-right: 4px;
                                                      "
                                                      target="_blank"
                                                      data-saferedirecturl="https://www.aadyapay.com/url?hl=en-GB&amp;q=https://bit.ly/48gdWfZ&amp;source=gmail&amp;ust=1702444694166000&amp;usg=AOvVaw0k0E00GoemBk7Lbh9Ewmpx"
                                                    >
                                                      <img
                                                        width="24"
                                                        src="https://upload.wikimedia.org/wikipedia/commons/6/6c/Facebook_Logo_2023.png"
                                                        title="Facebook"
                                                        alt="Facebook"
                                                        style="
                                                          max-width: 2808px;
                                                        "
                                                      />
                                                    </a>
                                                    <a
                                                      href="https://www.instagram.com/pay_deep.official/"
                                                      style="
                                                        font-size: 0;
                                                        border: 0;
                                                        outline: 0;
                                                        border: none;
                                                        outline: none;
                                                        text-decoration: none;
                                                        margin-right: 4px;
                                                      "
                                                      target="_blank"
                                                      data-saferedirecturl="https://www.aadyapay.com/url?hl=en-GB&amp;q=https://bit.ly/3Nj3USX&amp;source=gmail&amp;ust=1702444694166000&amp;usg=AOvVaw2_vRTBax2i8G4U5TTBP1aS"
                                                    >
                                                      <img
                                                        width="24"
                                                        src="https://upload.wikimedia.org/wikipedia/commons/thumb/9/95/Instagram_logo_2022.svg/2048px-Instagram_logo_2022.svg.png"
                                                        title="Instagram"
                                                        alt="Instagram"
                                                        style="
                                                          max-width: 2808px;
                                                        "
                                                      />
                                                    </a>
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
                                              href="mailto:support@aadyapay.com"
                                              style="color: #673ab7"
                                              target="_blank"
                                              >support@aadyapay.com</a
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
  const base64EncodedHTML = Buffer.from(htmlContent).toString("base64");
  const doc = `data:text/html;base64,${base64EncodedHTML}`;
  return doc;
};

const Generate_Excel_Report = asyncHandler(async (req, res) => {
  const { type, startDate, endDate } = req.query; // Query parameter for type
  if (!type) {
    return res.status(400).json({ error: "Type query parameter is required." });
  }
  if (!startDate || !endDate) {
    return res.status(400).json({
      error: "Both startDate and endDate query parameters are required.",
    });
  }
  console.log(type, "type");

  try {
    let Model;
    let reportName;
    // Determine the model and report name based on the type
    switch (type.toLowerCase()) {
      case "recharge":
        Model = Recharge;
        reportName = "Recharge_Report";
        break;
      case "bill":
        Model = BillPayment;
        reportName = "Bill_Payment_Report";
        break;
      case "dth":
        Model = DTH;
        reportName = "DTH_Report";
        break;
      default:
        return res.status(400).json({ error: "Invalid report type." });
    }

    const start = moment(startDate).startOf("day").utcOffset("+05:30");
    const end = moment(endDate).endOf("day").utcOffset("+05:30");

    // Fetch all data from the selected model
    const records = await Model.find({
      status: { $regex: /^success$/i },
      createdAt: { $gte: start, $lte: end }, // Filter by date range
    }).populate("userId", "firstName lastName email");
    console.log(records, "records");

    // Map data to Excel-compatible format
    const data = records.map((record, index) => ({
      S_No: index + 1,
      Name: record.userId
        ? `${record.userId.firstName} ${record.userId.lastName}`
        : "N/A",
      Email: record.userId ? record.userId.email : "N/A",
      Number: record.number || "N/A",
      Operator: record.operator || "N/A",
      Circle: record.circle || "N/A",
      Transaction_ID: record.transactionId || "N/A",
      Status: record.status || "N/A",
      Amount: record.amount || "N/A",
      Reference: record.operatorRef || "N/A",
      Created_At: record.createdAt ? record.createdAt.toLocaleString() : "N/A",
    }));

    console.log(data, "data");

    // Create Excel workbook and worksheet
    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.json_to_sheet(data);

    // Append worksheet to workbook
    XLSX.utils.book_append_sheet(workbook, worksheet, reportName);

    // Define file path
    const filePath = path.join(__dirname, `${type}_Report.xlsx`);

    // Write workbook to file
    XLSX.writeFile(workbook, filePath);

    // Send file as response
   res.setHeader('Content-Disposition', `attachment; filename=${type}_report.xlsx`);
res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
res.download(filePath, `${type}_report.xlsx`, (err) => {
  if (err) {
    console.error("Error sending file:", err);
    return res.status(500).send("Error downloading the report.");
  }

  // Delete file after sending
  fs.unlinkSync(filePath);
});
  } catch (error) {
    console.error("Error generating report:", error);
    res
      .status(500)
      .json({ error: "An error occurred while generating the report." });
  }
});

module.exports = {createHtmlToPdf, Generate_Excel_Report};
