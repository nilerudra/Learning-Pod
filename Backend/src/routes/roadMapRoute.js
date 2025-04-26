import express from 'express';
import Roadmap from '../models/GeneratedRoadmap.js'
const router = express.Router();


router.get('/:userId', async (req, res) => {
    const { userId } = req.params;  


    console.log("Received userId:", userId);

    if (!userId) {
      return res.status(400).json({ message: 'User ID is required' });
    }
  
    try {
      const roadmap = await Roadmap.find({ userId }).sort({ createdAt: -1 });
      
  
      if (!roadmap) {
        return res.status(404).json({ message: 'Roadmap not found' });
      }
  
      res.json(roadmap);
    } catch (error) {
      res.status(500).json({
        message: 'Error fetching roadmap',
        error: error.message,
      });
    }
  });


  router.get('/last-three/:userId', async (req, res) => {
    const { userId } = req.params;
   
    if (!userId) {
        return res.status(400).json({ message: 'User ID is required' });
    }
   
    try {
        const lastThreeRoadmaps = await Roadmap.find({ userId })
            .sort({ createdAt: -1 })
            .limit(3)
            .select('userName roadmap.title roadmap.phases createdAt'); 

        if (!lastThreeRoadmaps || lastThreeRoadmaps.length === 0) {
            return res.status(404).json({ message: 'No roadmaps found for this user' });
        }

       
        const formattedRoadmaps = lastThreeRoadmaps.map(roadmap => ({
            title: roadmap.roadmap.title,
            author: roadmap.userName,
            createdAt: roadmap.createdAt,
            keySkills: roadmap.roadmap.phases[0]?.actionableSteps.slice(0, 3) || [], // Take skills from the first phase
            industryTrends: roadmap.roadmap.phases[0]?.industryTrends || "No data available",
        }));

        res.json(formattedRoadmaps);
    } catch (error) {
        res.status(500).json({
            message: 'Error fetching roadmaps',
            error: error.message,
        });
    }
});
  
export default router;
