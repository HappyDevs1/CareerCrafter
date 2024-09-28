import mongoose from "mongoose";

const jobTitleSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    unique: true,
  },
  category: {
    type: String,
    required: true,
    enum: ["Low-Level Skill", "Mid-Level Skill", "High-Level Skill"],
  },
});

const JobTitle = mongoose.model("JobTitle", jobTitleSchema);

export default JobTitle;
