const config = {
    salesForceLoginUrl: process.env.SF_LOGIN_URL,
    salesForceUser: process.env.SF_USER,
    salesForcePassword: process.env.SF_PASSWORD,
    salesForceSecurityToken: process.env.SF_TOKEN,
    blacklistPath: process.env.SF_BL_PATH,
    whitelistPath: process.env.SF_WL_PATH
}

export { config };