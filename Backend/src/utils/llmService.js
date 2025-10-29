const axios = require("axios");
const { GoogleGenerativeAI } = require("@google/generative-ai");
const contentWithLLM = async (content) => {
  const genAI = new GoogleGenerativeAI(
    "AIzaSyCvISj9B2-DtuzhfGqtlcPNDiFuiizlmh8"
  );
  const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

  const prompt = `You are an intelligent categorization system. Analyze the following content and categorize it into one of the predefined categories. Provide only one word for the category.\n\nContent:\n${content}`;

  const result = await model.generateContent(prompt);
  console.log(result.response.text());
  return result.response.text();
};
module.exports = { contentWithLLM };
