const { handleRefund, handleCashback } = require("../payment");

const handleRechargeStatusUpdate = async (TransID, Status) => {
  await Recharge.findOneAndUpdate(
    {
      transactionId: TransID,
    },
    { $set: { status: Status } }
  );
};
const handleBBPSStatusUpdate = async (TransID, Status) => {
  await BBPS.findOneAndUpdate(
    {
      transactionId: TransID,
    },
    { $set: { status: Status } }
  );
};
const handleRechargeSendNotification = async (
  findTxn,
  findRecord,
  userFound,
  Status
) => {
  const notification = {
    title: `Recharge ${Status}`,
    body: `Your ${findTxn.txnAmount} recharge is ${Status}`,
  };
  // save notification
  const newNotification = new Notification({
    ...notification,
    recipient: findRecord.userId,
  });
  await newNotification.save();
  // push notification
  userFound.deviceToken &&
    sendNotification(notification, userFound.deviceToken);
};
const handleBBPSSendNotification = async (
  findTxn,
  findBBPSRecord,
  userFound,
  Status
) => {
  const notification = {
    title: `Bill Payment ${Status}`,
    body: `Your ${findTxn.txnAmount} Payment is ${Status}`,
  };
  // save notification
  const newNotification = new Notification({
    ...notification,
    recipient: findBBPSRecord.userId,
  });
  await newNotification.save();
  // push notification
  userFound.deviceToken &&
    sendNotification(notification, userFound.deviceToken);
};

const Recharge_CallBack_Handler = asyncHandler(async (req, res) => {
  const Status =
    req.query.Status || req.query.status || req.query.STATUS === 1
      ? "success"
      : "failed";
  const TransID = req.query.TransID || req.query.txid || req.query.RRR;
  if (!Status || !TransID) {
    return res.status(400).json({ error: "Missing parameters" });
  }

  const findRecord = await Recharge.findOne({
    transactionId: TransID,
  });

  if (findRecord) {
    const findTxn = await Transaction.findOne({
      txnId: findRecord.transactionId,
      userId: findRecord.userId,
    });

    const findService = await Service.findById(findTxn?.serviceId);

    const percent = (findTxn.txnAmount / 100) * findService.percent;
    const userFound = await User.findById(findRecord.userId);

    const walletFound = await Wallet.findOne({ userId: userFound._id });

    if (
      (Status.toLowerCase() === "failed" ||
        Status.toLowerCase() === "failure") &&
      findRecord.status.toLowerCase() === "pending"
    ) {
      await handleRechargeStatusUpdate(TransID, Status);

      // Send Notificaiton for Failed Recharge

      await handleRechargeSendNotification(
        findTxn,
        findRecord,
        userFound,
        Status
      );

      //   Refund Amount Start------------------------
      const FindUser = userFound;
      const amount = findTxn.txnAmount;
      const transactionId = TransID;
      const ipAddress = getIpAddress(req);
      await handleRefund(
        FindUser,
        amount,
        transactionId,
        ipAddress,
        walletFound
      );

      res.status(200).send("Callback processed successfully");
    } else if (
      Status.toLowerCase() === "success" &&
      findRecord.status.toLowerCase() === "pending"
    ) {
      await handleRechargeStatusUpdate(TransID, Status);

      // Send Notificaiton for Success Recharge
      await handleRechargeSendNotification(
        findTxn,
        findRecord,
        userFound,
        Status
      );

      // Handle Cashback

      const cashbackPercent =
        (parseInt(findTxn.txnAmount) / 100) * findService.percent; // for both (prime & non prime)
      const ipAddress = getIpAddress(req);
      await handleCashback(
        userFound,
        cashbackPercent,
        TransID,
        ipAddress,
        walletFound
      );
      res.status(200).send("Callback processed successfully");
    } else {
      return res.status(400).json({ error: "No Valid Action" });
    }
  } else {
    const findBBPSRecord = await BBPS.findOne({
      transactionId: TransID,
    });
    const findTxn = await Transaction.findOne({
      txnId: findBBPSRecord.transactionId,
      userId: findBBPSRecord.userId,
    });

    const findService = await Service.findById(findTxn?.serviceId);

    const percent = (findTxn.txnAmount / 100) * findService.percent;
    if (findBBPSRecord) {
      const userFound = await User.findById(findBBPSRecord.userId);
      const walletFound = await Wallet.findOne({ userId: userFound._id });

      const findTxn = await Transaction.findOne({
        txnId: findBBPSRecord.transactionId,
        userId: findBBPSRecord.userId,
      });

      if (
        (Status.toLowerCase() === "failed" ||
          Status.toLowerCase() === "failure") &&
        findBBPSRecord.status.toLowerCase() === "pending"
      ) {
        await handleBBPSStatusUpdate(TransID, Status);
        // Send Notificaiton for Failed Recharge
        await handleBBPSSendNotification(
          findTxn,
          findBBPSRecord,
          userFound,
          Status
        );

        const FindUser = userFound;
        const amount = findTxn.txnAmount;
        const transactionId = TransID;
        const ipAddress = getIpAddress(req);

        await handleRefund(
          FindUser,
          amount,
          transactionId,
          ipAddress,
          walletFound
        );
        res.status(200).send("Callback processed successfully");
      } else if (
        Status.toLowerCase() === "success" &&
        findBBPSRecord.status.toLowerCase() === "pending"
      ) {
        if (findBBPSRecord.operator === "GLF") {
          await BBPS.findOneAndUpdate(
            {
              transactionId: TransID,
            },
            { $set: { status: Status, operatorRef: req.query.opid } }
          );

          // cashback Amount to User Wallet
          const FindUser = userFound;
          const cashbackPercent = percent;
          const txnId = TransID;
          const ipAddress = getIpAddress(req);
          await handleCashback(
            FindUser,
            cashbackPercent,
            txnId,
            ipAddress,
            walletFound
          );
        } else {
          await handleBBPSStatusUpdate(TransID, Status);
          // Send Notificaiton for Success Recharge
          await handleBBPSSendNotification(
            findTxn,
            findBBPSRecord,
            userFound,
            Status
          );
          const FindUser = userFound;
          const cashbackPercent = percent;
          const txnId = TransID;
          const ipAddress = getIpAddress(req);
          await handleCashback(
            FindUser,
            cashbackPercent,
            txnId,
            ipAddress,
            walletFound
          );
        }

        res.status(200).send("Callback processed successfully");
      } else {
        return res.status(400).json({ error: "No Valid Action" });
      }
    } else {
      return res.status(400).json({ error: "invalid TxnID" });
    }
  }
});
