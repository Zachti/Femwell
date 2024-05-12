import { Response } from "./reponse.model";
export interface Questionnare {
  username: string;
  userId: string;
  responses: Response[];
}
