module.exports = {
  apps: [
    {
      name: "cron-10",
      script: "dist/cron/cron10.js",
      env: {
        NODE_ENV: "local",
      },
    },
  ],
};
