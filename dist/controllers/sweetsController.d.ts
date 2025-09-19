import { Request, Response } from "express";
import { AuthRequest } from "../middleware/auth";
export declare function addSweet(req: AuthRequest, res: Response): Promise<void>;
export declare function listSweets(req: Request, res: Response): Promise<void>;
export declare function searchSweets(req: Request, res: Response): Promise<void>;
export declare function updateSweet(req: AuthRequest, res: Response): Promise<void>;
export declare function deleteSweet(req: AuthRequest, res: Response): Promise<void>;
export declare function purchaseSweet(req: AuthRequest, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
export declare function restockSweet(req: AuthRequest, res: Response): Promise<void>;
