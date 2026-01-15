const crypto = require("crypto");
const xml2js = require('xml2js');
const generatePayuHash = (txnid, Txnamount, firstname, email) => {
  const input = `${process.env.PAYU_KEY}|${txnid}|${Txnamount}|Wallet_Topup|${firstname}|${email}|||||||||||${process.env.PAYU_SALT}`;
  return crypto.createHash("sha512").update(input).digest("hex");
};

const verifyPaymentPayuHash = (txnid) => {
  const input = `${process.env.PAYU_KEY}|verify_payment|${txnid}|${process.env.PAYU_SALT}`;
  return crypto.createHash("sha512").update(input).digest("hex");
};

const MobikwikCheckSumGenerate = (data) => {
  // Ensure all values except adParams are strings
  const cleanPayload = {
    // adParams: data.adParams || {},
    uid: String(data.uid),
    password: String(data.password),
    amt: String(data.amt),
    cir: String(data.cir),
    cn: String(data.cn),
    op: String(data.op),
  };

  const bodyString = JSON.stringify(cleanPayload); // Must match request body byte-for-byte
  console.log(bodyString, "bodyString");
  const checksum = crypto
    .createHmac("sha256", process.env.MOBIKWIK_SECRET_KEY)
    .update(bodyString)
    .digest("base64");
  console.log(checksum, "checksum");

  return checksum;
};

const parseXMLToJSON = async(xml, type)=>{
  const parser = new xml2js.Parser({ trim: true, explicitArray: false });
  const result = await parser.parseStringPromise(xml);
  return result[type];
}

module.exports = {
  generatePayuHash,
  verifyPaymentPayuHash,
  MobikwikCheckSumGenerate,
  parseXMLToJSON
};
