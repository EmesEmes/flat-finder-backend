import { Message } from "../models/message.model.js";

const getAllMessage = async (req, res) => {
  try {
    const id = req.params.flatId;
    const messages = await Message.find({ flatId: id });
    res.status(200).json({
      success: true,
      message: "Message succcesfull",
      data: messages,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
const addMessage = async (req, res) => {
  try {
    const message = new Message(req.body);
    await message.save();
    res.status(201).json({
      success: true,
      message: "New Message created",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const updateMessage = async (req, res) => {
  try {
    const messages = await Message.findByIdAndUpdate(req.params.messageId, req.body,
      {
        new: true,
        runValidators: true,
      }
    );
    if (!messages) {
      return res.status(404).json({
        success: false,
        message: "Message not found",
      });
    }
    res.status(201).json({
      success: true,
      message: "Message Updated",
    });
  } catch (error) {
    console.log("test")
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export { getAllMessage, addMessage, updateMessage };
