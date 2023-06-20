# Foliaging Express Server and Admin Panel

This is an Express server and is the backend for Foliaging project
- Access demo integration with frontend [here](https://foliaging.netlify.app/profile)
- For more details, please visit the README at frontend repository [here](https://github.com/raziawong/p3-foliaging)
<br/>
<br/>

# Fly.io

The application is hosted on [Fly.io](https://fly.io/) and following section will describe necessary steps to for deployment to the platform.
<br/>
<br/>

## Steps to deploy to Fly.io

Prequisites:
  - Signed up an account with [Fly.io](https://fly.io/)
  - Install Fly CLI on local machine
  - For more details on accessing Fly apps, visit [Flyctl - Fly CLI documentation](https://fly.io/docs/flyctl/)
<br/>
<br/>

### Prepare NodeJS Express to be deployed to Fly.io
  1. Add host "0.0.0.0" for server to listen to all interfaces
        ```
        app.listen("3001", "0.0.0.0", () => {
            # callback
        });
        ```

  2. Declare node version used in _package.json_
        ```
        "engines": {
            "node": "20.3.0"
        }
        ```
<br/>
<br/>
       
### Launch Fly.io App
  1. Navigate to root of NodeJS code directory in terminal

  2. Launch a Fly app by using following command for interactive setup
        ```
        fly launch
        ```

  3. The interactive setup will have prompts to help set the name, organization, region of the app 
  
  4. Select 'No' if prompted to install Postgres at this point, and also 'No' if prompted to deploy now
  
  5. Following files will be automatically created by Fly CLI:
  - _Dockerfile_: update the port, and any runtime commands if different from generated file
  - _fly.toml_: update the port if different from generated file
  - _.dockerignore_: check that necessary file and/or directories will be ignored in the deployed environment
<br/>
<br/>
    
### Create Fly Postgres Cluster and Managing It Locally
Note that at this point, following instructions on Fly Postgres documentations could not opened up the cluster for public connections and thus the following will be using proxy for local system connections in order to facilitate management of the database.

  1. Suggest to navigate to a different directory or perpare a folder to store details of the cluster and generate file
  
  2. Create Postgres cluster using Fly CLI and giving it a custome name with the _-n_ flag
        ```
        flyctl postgres create -n <custom app name>
        ```
  
  3. Wait for the machine to start and store the cluster details printed by Fly CLI. The details provided will not be found again if missed. Following is a sample of the format:
        ```
        Username:    <Postgres DB username>
        Password:    <Postgres DB password>
        Hostname:    <DB Internal hostname>
        Flycast:     <DB Internal IP address>
        Proxy port:  <Proxy port number>
        Postgres port:  <Postgres DB port number>
        Connection string: postgres://<username>:<password>@<hostname>:<port>
        ```
  
  4. _fly.toml_ file will be generated at the end of creating Fly Postgres Cluster

  5. Reminder to add the file where the cluster details are saved into _.gitigore_ and _.dockerignore_ if they are in the same code repository

  6. Proceed to attach NodeJS app to the Postgres Cluster app
        ```
        fly postgres attach -a <NodeJS app name> <Postgres Cluster app name>
        ```

  7. With the attachment, a new user and database at Postgres will be generated

  8. The secret *DATABASE_URL* will be automatically created and stored in the NodeJS app on Fly.io, it will also be printed out in the terminal. Again, store the string somewhere as it will be encrypted when accessed via dashboard or Fly CLI the next time
        ```
        DATABASE_URL=postgres://<username>:<password>@<hostname>:<port>/<database>?<options>
        ```

  9. Using the above to dissect the environment variables required for NodeJS to connect to the database, and update your local _.env_ file 

  10. With everything up and local environment variables set, you can now try to forward the Postgres server port to your local system with _fly proxy_:
        ```
        fly proxy <Proxy port number> -a <Postgres app name>
        ```

  11. As long as the proxy is running, your local server will be serving data from the database on Fly Postgres cluster

  12. Perform testing on the new database
<br/>
<br/>

### Deploy Fly.io App
After ensuring server can be connected to the database on Fly.io locally, proceed to deploy the codes into the Fly app.

  1. Navigate to root of NodeJS code repository in the terminal, where the _fly.toml_ file is for the app

  2. You may set environment variables on the Fly app with your local _.env_ file using the following: 
        ```
        fly secrets import < <env filename>
        ```

  3. Ensure secrets are set by checking the Fly.io app secrets dashboard, otherwise check that you are in the correct directory

  4. Proceed to deploy
        ```
        fly deploy
        ```  

  5. After machines are started, the server can be accessed in any web browser with <app name>.fly.dev