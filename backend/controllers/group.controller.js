import Group from "../models/Group.js";

export const createGroup = async (req, res) => {
  try {
    const { name, description, members } = req.body;

    if (!name) return res.status(400).json({ message: "Group name is required" });

    const group = await Group.create({
      name,
      description,
      admin: req.user._id,
      members: [req.user._id, ...(members || [])],
    });

    await group.populate("members", "name avatar email");
    await group.populate("admin", "name avatar");

    res.status(201).json(group);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getMyGroups = async (req, res) => {
  try {
    const groups = await Group.find({ members: req.user._id })
      .populate("members", "name avatar email")
      .populate("admin", "name avatar")
      .populate({
        path: "lastMessage",
        populate: { path: "sender", select: "name" },
      })
      .sort({ updatedAt: -1 });

    res.json(groups);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getGroupById = async (req, res) => {
  try {
    const group = await Group.findById(req.params.id)
      .populate("members", "name avatar email")
      .populate("admin", "name avatar");

    if (!group) return res.status(404).json({ message: "Group not found" });

    const isMember = group.members.some(
      (m) => m._id.toString() === req.user._id.toString()
    );
    if (!isMember) return res.status(403).json({ message: "Not a member" });

    res.json(group);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const addMember = async (req, res) => {
  try {
    const { userId } = req.body;
    const group = await Group.findById(req.params.id);

    if (!group) return res.status(404).json({ message: "Group not found" });
    if (group.admin.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Only admin can add members" });
    }

    if (group.members.includes(userId)) {
      return res.status(400).json({ message: "User already a member" });
    }

    group.members.push(userId);
    await group.save();
    await group.populate("members", "name avatar email");
    await group.populate("admin", "name avatar");

    res.json(group);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const removeMember = async (req, res) => {
  try {
    const group = await Group.findById(req.params.id);
    if (!group) return res.status(404).json({ message: "Group not found" });

    const isAdmin = group.admin.toString() === req.user._id.toString();
    const isSelf = req.params.userId === req.user._id.toString();

    if (!isAdmin && !isSelf) {
      return res.status(403).json({ message: "Not authorized" });
    }

    group.members = group.members.filter(
      (m) => m.toString() !== req.params.userId
    );
    await group.save();

    res.json({ message: "Member removed" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
