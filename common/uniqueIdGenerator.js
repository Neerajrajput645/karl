function uniqueIdGenerator(purpose) {
  // number length
  const numLength = () => {
    switch (purpose) {
      case "referalId":
        return 7;

      case "orderId":
        return 12;

      case "sendMoney":
        return 35;

      case "giftCard":
        return 14;

      default:
        return 14;
    }
  };
  const length = numLength();
  const characters =
    purpose === "referalId"
      ? "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
      : "0123456789";
  let generatedId = "";

  // creation
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    generatedId += characters.charAt(randomIndex);
  }
  // return statement
  switch (purpose) {
    case "giftCard":
      return generatedId;

    case "referalId":
      return generatedId;

    case "orderId":
      return generatedId;

    case "sendMoney":
      return generatedId;

    default:
      return generatedId;
  }
}

module.exports = uniqueIdGenerator;
