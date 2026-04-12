import { CognitoUserSession } from "amazon-cognito-identity-js";
import { userPool } from "./cognito";

export const getFreshJwt = (): Promise<string> => {
    return new Promise((resolve, reject) => {
        const user = userPool.getCurrentUser();

        if (!user) {
            reject(new Error('No authenticated user'));
            return;
        }

        user.getSession((err: Error | null, session: CognitoUserSession | null) => {
            if (err || !session || !session.isValid()) {
                reject(err ?? new Error('Invalid session'));
                return;
            }

            const refreshToken = session.getRefreshToken();
            user.refreshSession(refreshToken, (refreshErr, refreshedSession) => {
                if (refreshErr || !refreshedSession) {
                    reject(refreshErr ?? new Error('Failed to refresh session'));
                    return;
                }
                resolve(refreshedSession.getIdToken().getJwtToken());
            });
        });
    });
}
