import { CognitoUserPool } from "amazon-cognito-identity-js";

const poolData = {
    UserPoolId: "us-east-1_9PY8xoWAh",
    ClientId: "5cskeikgeqct23o3r99h4d0tq7"
};

export const userPool = new CognitoUserPool(poolData);