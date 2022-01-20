# Ionic Demo - AuthConnect with Identity Vault and Camera Capture

This demo application serves to showcase the how to configure Auth Connect to work with Identity Vault while using the Capacitor Camera plugin. The only provider available at the moment is [Auth0](https://www.auth0.com/).

## Credentials

Current Auth0 is the only provider specified. The credentials are:

Username/Email: `test@ionic.io`  
Password: `Ion54321`

## Basic Project Setup

```shell
ionic start "AC IV Camera Demo" tabs --capacitor --type=angular --package-id=io.ionic.demo.acivcamera --project-id=demo-ac-iv-camera
```

- Install and configure [Camera Plugin](https://capacitorjs.com/docs/apis/camera)
- Install and configure [Identity Vault](https://ionic.io/docs/identity-vault/install)
- Install and configure [Auth Connect](https://ionic.io/docs/auth-connect/install)
- Clone this repository
- Follow the [Ionic Native Enterprise Edition Setup instructions](https://ionicframework.com/docs/enterprise/setup#install-tooling) if you have not already done so
- Follow the [Ionic Native Enterprise Edition Register instructions](https://ionicframework.com/docs/enterprise/setup#register-your-product-key) from this application's root directory, using they key you have chosen to use for demo applications. If you do not have a key, contact your Ionic sales representative.

- `npm i`
- `npm run build`
- `npx cap sync`

To run the application on a device, after running the `cap sync` command, open the `android`/`ios` projects included in this application to run with native tooling. See the [Capacitor Docs](https://capacitor.ionicframework.com/docs/basics/running-your-app) for additional information on running as a native application.
