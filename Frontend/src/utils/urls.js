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
};

export { apiGeneral };
