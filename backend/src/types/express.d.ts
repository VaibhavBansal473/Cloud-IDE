import { user } from "./types";

declare global {
    namespace Express {
        interface Request {
            User?: user; // Add the AdminUser property
        }
    }
}