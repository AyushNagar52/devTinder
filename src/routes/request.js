const express = require("express");
const mongoose = require("mongoose");

const requestRouter = express.Router();
const { userAuth } = require("../middleware/auth");
const ConnectionRequest = require("../models/connectionRequest");
const User = require("../models/user");

const sendStatuses = ["ignored", "interested"];
const reviewStatuses = ["accepted", "rejected"];

const isValidId = (id) => mongoose.Types.ObjectId.isValid(id);

// Send a connection request or ignore another user.
requestRouter.post(
  "/request/send/:status/:toUserId",
  userAuth,
  async (req, res) => {
    try {
      const { status, toUserId } = req.params;
      const fromUserId = req.user._id;

      if (!sendStatuses.includes(status)) {
        return res.status(400).json({ message: "Invalid request status" });
      }

      if (!isValidId(toUserId)) {
        return res.status(400).json({ message: "Invalid user id" });
      }

      if (fromUserId.equals(toUserId)) {
        return res
          .status(400)
          .json({ message: "You cannot send a request to yourself" });
      }

      const toUser = await User.findById(toUserId);
      if (!toUser) {
        return res.status(404).json({ message: "User not found" });
      }

      const existingRequest = await ConnectionRequest.findOne({
        $or: [
          { fromUserId, toUserId },
          { fromUserId: toUserId, toUserId: fromUserId },
        ],
      });

      if (existingRequest) {
        return res
          .status(400)
          .json({ message: "Connection request already exists" });
      }

      const connectionRequest = await ConnectionRequest.create({
        fromUserId,
        toUserId,
        status,
      });

      return res.status(201).json({
        message: "Connection request sent successfully",
        data: connectionRequest,
      });
    } catch (err) {
      return res.status(400).json({ message: err.message });
    }
  }
);

// Accept or reject a received connection request.
requestRouter.post(
  "/request/review/:status/:requestId",
  userAuth,
  async (req, res) => {
    try {
      const { status, requestId } = req.params;

      if (!reviewStatuses.includes(status)) {
        return res.status(400).json({ message: "Invalid review status" });
      }

      if (!isValidId(requestId)) {
        return res.status(400).json({ message: "Invalid request id" });
      }

      const connectionRequest = await ConnectionRequest.findOne({
        _id: requestId,
        toUserId: req.user._id,
        status: "interested",
      });

      if (!connectionRequest) {
        return res
          .status(404)
          .json({ message: "Connection request not found" });
      }

      connectionRequest.status = status;
      await connectionRequest.save();

      return res.json({
        message: `Connection request ${status}`,
        data: connectionRequest,
      });
    } catch (err) {
      return res.status(400).json({ message: err.message });
    }
  }
);

// Get all accepted connections for the logged-in user.
requestRouter.get("/user/connections", userAuth, async (req, res) => {
  try {
    const requests = await ConnectionRequest.find({
      status: "accepted",
      $or: [{ fromUserId: req.user._id }, { toUserId: req.user._id }],
    })
      .populate("fromUserId", "firstName lastName emailId photourl about skills")
      .populate("toUserId", "firstName lastName emailId photourl about skills");

    const connections = requests.map((request) =>
      request.fromUserId._id.equals(req.user._id)
        ? request.toUserId
        : request.fromUserId
    );

    return res.json({ data: connections });
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
});

// Get pending requests received by the logged-in user.
requestRouter.get("/user/requests", userAuth, async (req, res) => {
  try {
    const requests = await ConnectionRequest.find({
      toUserId: req.user._id,
      status: "interested",
    }).populate(
      "fromUserId",
      "firstName lastName emailId photourl about skills"
    );

    return res.json({ data: requests });
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
});

module.exports = requestRouter;
