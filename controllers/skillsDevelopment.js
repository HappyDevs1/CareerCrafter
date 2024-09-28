import fetch from "node-fetch";
import { API_URL, API_KEY } from "../config";

const HF_API_URL = API_URL;
  const headers = {
    "Authorization": API_KEY,
    "Content-Type": "application/json"
  };

export const analyzeSkills = async (req, res) => {
  const { userSkills, jobDescription } = req.body;

  const body = JSON.stringify({
    inputs: {
      text: `User skils: ${userSkills}. Job description: ${jobDescription}. What skills are missing?`
    }
  });

  try {
    const response = await fetch(HF_API_URL, {
      method: "Post",
      header: headers,
      body: body
    });

    const result = await response.json();
    res.status(200).json({ message: "Sucessfully analzed the skills", comparedSkills: result});
  } catch (error) {
    res.status(500).json({ error : "Error analyzing skills" });
  }
};