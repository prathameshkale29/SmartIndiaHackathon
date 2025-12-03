// backend/routes/traceability.js
const express = require("express");
const router = express.Router();
const contract = require("../blockchain");

// POST /api/trace/register-batch
router.post("/register-batch", async (req, res) => {
  try {
    if (!contract) {
      return res.status(500).json({ status: "error", error: "Blockchain not configured" });
    }
    const { batchId, crop, originFarm } = req.body;
    const tx = await contract.registerBatch(batchId, crop, originFarm);
    await tx.wait();
    res.json({ status: "ok", txHash: tx.hash });
  } catch (err) {
    console.error("register-batch error:", err);
    res.status(500).json({ status: "error", error: err.message });
  }
});

// POST /api/trace/add-event
router.post("/add-event", async (req, res) => {
  try {
    if (!contract) {
      return res.status(500).json({ status: "error", error: "Blockchain not configured" });
    }
    const { batchId, actorType, actorId, location, action, extraData } = req.body;
    const tx = await contract.addEvent(
      batchId,
      actorType,
      actorId,
      location,
      action,
      extraData || ""
    );
    await tx.wait();
    res.json({ status: "ok", txHash: tx.hash });
  } catch (err) {
    console.error("add-event error:", err);
    res.status(500).json({ status: "error", error: err.message });
  }
});

// GET /api/trace/:batchId
router.get("/:batchId", async (req, res) => {
  try {
    if (!contract) {
      return res.status(500).json({ status: "error", error: "Blockchain not configured" });
    }
    const batchId = req.params.batchId;
    const [id, crop, originFarm, createdAt] = await contract.getBatch(batchId);
    const events = await contract.getEvents(batchId);

    const formattedEvents = events.map((e) => ({
      actorType: e.actorType,
      actorId: e.actorId,
      location: e.location,
      action: e.action,
      timestamp: Number(e.timestamp),
      extraData: e.extraData,
    }));

    res.json({
      status: "ok",
      batch: {
        batchId: id,
        crop,
        originFarm,
        createdAt: Number(createdAt),
      },
      events: formattedEvents,
    });
  } catch (err) {
    console.error("get trace error:", err);
    res.status(500).json({ status: "error", error: err.message });
  }
});

module.exports = router;
