import {
  CognitoUserPool,
  CognitoUser,
  CognitoUserAttribute,
  AuthenticationDetails,
} from "amazon-cognito-identity-js";

// --- Cognito Pool Config ---
const poolData = {
  UserPoolId: process.env.NEXT_PUBLIC_COGNITO_USER_POOL_ID,
  ClientId: process.env.NEXT_PUBLIC_COGNITO_CLIENT_ID,
};

export const userPool = new CognitoUserPool(poolData);

/**
 * Sign up a new user in AWS Cognito
 * @param {string} email
 * @param {string} password
 * @param {string} name
 * @param {string} phoneNumber - must include country code, e.g. +919876543210
 */
export function signUpUser(email, password, name = "", phoneNumber = "") {
  return new Promise((resolve, reject) => {
    const attributeList = [];

    // ✅ Correct way — use CognitoUserAttribute
    if (email)
      attributeList.push(new CognitoUserAttribute({ Name: "email", Value: email }));
    if (name)
      attributeList.push(new CognitoUserAttribute({ Name: "name", Value: name }));
    if (phoneNumber)
      attributeList.push(
        new CognitoUserAttribute({ Name: "phone_number", Value: phoneNumber })
      );

    userPool.signUp(email.trim(), password.trim(), attributeList, null, (err, result) => {
      if (err) {
        console.error("Signup error:", err);
        reject(err);
      } else {
        console.log("Signup success:", result);
        resolve(result);
      }
    });
  });
}

export function confirmUser(email, code) {
  const user = new CognitoUser({ Username: email, Pool: userPool });
  return new Promise((resolve, reject) => {
    user.confirmRegistration(code.trim(), true, (err, result) => {
      if (err) reject(err);
      else resolve(result);
    });
  });
}

export function resendConfirmation(email) {
  const user = new CognitoUser({ Username: email, Pool: userPool });
  return new Promise((resolve, reject) => {
    user.resendConfirmationCode((err, result) => {
      if (err) reject(err);
      else resolve(result);
    });
  });
}

export function loginUser(email, password) {
  const authDetails = new AuthenticationDetails({
    Username: email.trim(),
    Password: password.trim(),
  });
  const user = new CognitoUser({ Username: email.trim(), Pool: userPool });

  return new Promise((resolve, reject) => {
    user.authenticateUser(authDetails, {
      onSuccess: (session) => resolve(session),
      onFailure: (err) => reject(err),
      newPasswordRequired: (userAttributes, requiredAttributes) => {
        reject({
          code: "NewPasswordRequired",
          message: "New password required",
          userAttributes,
          requiredAttributes,
        });
      },
    });
  });
}
