module.exports = {
    apps: [
        {
            name: "backend-authority",
            script: 'npm start',
            watch: true,
            ignore_watch: [
                "build",
                "node_modules"
            ],
            env: {
                NODE_ENV: "production",
                SERVICE_HOST: "0.0.0.0",
                SERVICE_PORT: 6969,
                DB_HOST: "localhost",
                DB_PORT: 27017,
                DB_NAME: "authority",
            }
        }
    ]
};