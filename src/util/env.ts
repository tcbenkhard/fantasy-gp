export const getEnv = (name: string, defaultValue?: string) => {
    const actualValue = process.env[name];
    if(actualValue) return actualValue;
    if(defaultValue) {
        console.log(`Defaulting ${name} to ${defaultValue}`);
        return defaultValue;
    }
    throw new Error(`Missing environment variable ${name}`);
}