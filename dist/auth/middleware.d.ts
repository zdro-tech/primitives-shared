import { Request, Response, NextFunction } from 'express';
export declare const createAuthMiddleware: (requiredGroups: string[], awsRegion: string, poolID: string) => (req: Request, res: Response, next: NextFunction) => Promise<void>;
//# sourceMappingURL=middleware.d.ts.map