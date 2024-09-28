import Job from "../models/Job.js";
import JobTitle from "../models/JobTitle.js";

export const createJob = async (req, res) => {
  const { titleId, description, category, skillLevel } = req.body;

  if (!titleId || !description || !category || !skillLevel) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    // Ensure the job title exists in the database
    const jobTitle = await JobTitle.findById(titleId);
    if (!jobTitle) {
      return res.status(400).json({ message: "Invalid job title" });
    }

    const job = new Job({
      title: jobTitle.title,
      description,
      category,
      skillLevel,
      postedBy: req.user._id,
    });

    const createdJob = await job.save();
    res.status(201).json(createdJob);
  } catch (error) {
    console.error("Error creating job:", error);
    res.status(500).json({ message: error.message });
  }
};

export const getJobs = async (req, res) => {
  const { category, skillLevel } = req.query; // Optional filters

  try {
    const query = {};

    if (category) {
      query.category = category;
    }

    if (skillLevel) {
      query.skillLevel = skillLevel;
    }

    // Fetch jobs based on filters (if any) and populate the postedBy field
    const jobs = await Job.find(query)
      .populate("postedBy", "username email") // Populate user info
      .sort({ createdAt: -1 }); // Sort by latest jobs

    res.json(jobs);
  } catch (error) {
    console.error("Error fetching jobs:", error);
    res.status(500).json({ message: error.message });
  }
};

export const getJobTitles = async (req, res) => {
  try {
    const jobTitles = await JobTitle.find(); // Fetch all predefined job titles
    res.json(jobTitles);
  } catch (error) {
    console.error("Error fetching job titles:", error);
    res.status(500).json({ message: error.message });
  }
};
