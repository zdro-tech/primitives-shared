import { Request, Response, NextFunction } from 'express';
export declare const createAuthMiddleware: (requiredGroups: string[], awsRegion: string, poolID: string, cookieName?: string) => (req: Request, res: Response, next: NextFunction) => Promise<void>;
export declare const createOptionalAuthMiddleware: (requiredGroups: string[], awsRegion: string, poolID: string, cookieName?: string) => (req: Request, res: Response, next: NextFunction) => Promise<void>;
//# sourceMappingURL=middleware.d.ts.map