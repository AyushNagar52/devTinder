const express = require("express");
const userRouter = express.Router();

const { userAuth } = require("../middleware/auth");
const ConnectionRequest = require("../models/connectionRequest");
const User = require("../models/user");

const feedFields = "firstName lastName photourl about skills age gender";
const USER_SAFE_DATA = "firstName lastName emailId photourl about skills age gender";

// Get users who are not the logged-in user and have no existing connection
// request with them.
userRouter.get("/user/feed", userAuth, async (req, res) => {
  try {
    const page = Number.parseInt(req.query.page, 10) || 1;
    const limit = Number.parseInt(req.query.limit, 10) || 10;

    if (page < 1 || limit < 1 || limit > 50) {
      return res.status(400).json({
        message: "Page must be positive and limit must be between 1 and 50",
      });
    }

    const requests = await ConnectionRequest.find({
      $or: [{ fromUserId: req.user._id }, { toUserId: req.user._id }],
    }).select("fromUserId toUserId");

    const excludedUserIds = new Set([req.user._id.toString()]);
    requests.forEach((request) => {
      excludedUserIds.add(request.fromUserId.toString());
      excludedUserIds.add(request.toUserId.toString());
    });

    const users = await User.find({
      _id: { $nin: [...excludedUserIds] },
    })
      .select(feedFields)
      .skip((page - 1) * limit)
      .limit(limit);

    return res.json({ data: users, page, limit });
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
});

// Get all accepted connections for the logged-in user.
userRouter.get("/user/connections", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;

    const connectionRequests = await ConnectionRequest.find({
      $or: [
        { toUserId: loggedInUser._id, status: "accepted" },
        { fromUserId: loggedInUser._id, status: "accepted" },
      ],
    })
      .populate("fromUserId", USER_SAFE_DATA)
      .populate("toUserId", USER_SAFE_DATA);

    const connections = connectionRequests.map((request) =>
      request.fromUserId._id.equals(loggedInUser._id)
        ? request.toUserId
        : request.fromUserId
    );

    return res.json({ data: connections });
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
});

// Get all pending connection requests for the logged-in user
userRouter.get("/user/requests", userAuth, async (req, res) => {
  try {
    const connectionRequests = await ConnectionRequest.find({
      toUserId: req.user._id,
      status: "interested",
    }).populate(
      "fromUserId",
      "firstName lastName emailId photourl about skills"
    );

    return res.json({
      data: connectionRequests,
    });
  } catch (err) {
    return res.status(400).send("ERROR: " + err.message);
  }
});

module.exports = userRouter;
