import { domain } from "./domain";

const apiGeneral = {
  login: `${domain}/login`,
  signup: `${domain}/signup`,
  createPod: `${domain}/create`,
  joinPod: `${domain}/join`,

  chats: `${domain}/messages/chats/`,
  send: `${domain}/messages/send`,

  taskSubmission: `${domain}/tasks/upload-files`,
  submissions: `${domain}/tasks/get-files`,
  files: `${domain}/files/`,

  userPods: `${domain}/create/userPods/`,

  getResources: `${domain}/create/get-resource/`,

  lastThreeRoadmap: `${domain}/api/roadmap/last-three/`,
  getAllRoadmaps: `${domain}/api/roadmap/get-all/`,
  getRoadmapData: `${domain}/api/roadmap/full`,

  generateRoadmap: `${domain}/api/ai_generated_path`,
};

export { apiGeneral };
