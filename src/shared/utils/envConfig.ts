interface EnvConfig {
  mongoDb: {
    username: string;
    password: string;
    host: string;
    port: string;
    dbName: string;
  };
}

export const envConfig = (): EnvConfig => {
  return {
    mongoDb: {
      username: process.env.MONGO_USERNAME ?? '',
      password: process.env.MONGO_PASSWORD ?? '',
      host: process.env.MONGO_HOST ?? '',
      port: process.env.MONGO_PORT ?? '',
      dbName: process.env.MONGO_DB_NAME ?? '',
    },
  };
};
