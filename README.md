# Portfolio: Authority Backend

> NOTE: package-lock.json not included, because i haven't settled in package versions and whatnot.

Authority duties are:
- `User` Registration
- `Session` Authorization
- `Session` Data Storing

## OS Level Requirements
- `NodeJS` >= v15.6.0
- `pm2` >= 4.5.1
    ```
    $ npm install -g pm2
    ```
- `nodemon` >= 2.0.7
    ```
    $ npm install -g nodemon
    ```

## Package Requirement Installations
### Deployment
```
npm install
```

### Development
```
npm install --also=dev
```

## Running
```
npm run start
```

## Documentation

Please refer to `.http` file