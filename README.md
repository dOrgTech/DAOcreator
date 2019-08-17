# DAOcreator

Wizard for setting up your own DAOstack DAO.

## Contribute

Welcome Fellow Contributors. Today We DAO.

### Installing

`yarn` or `npm install`

### Running

`yarn start` or `npm run start`

1. Launches Ganache (`npm run eth-ganache-start`)
2. Deploys Contracts (`npm run eth-arc-migrate`)
3. Launches App (`npm run app-start`)

### Debugging

VS Code w/ Chrome

1. Install Extension "`Debugger for Chrome`"
2. Launch the app by running `yarn start` or `npm run start` for just the UI.
3. Press the green play button in the debug menu of VS Code.

## Project Architecture

### 3 Layers Of Data Types

We view the different data types in this project as if they are in 3 layers:

1. _Form Data_
2. _State Data_
3. _Dependency Data_

Data in each layer can flow in either direction, 1 <> 2 <> 3. In order to do this, we write mapping located in the `src/lib/dataMappings` folder.

We did this to avoid as many **run-time type related errors** as possible, and to decouple our user-friendly UI data from the backing state & dependency data.

These type definitions can be found in:

1. `src/lib/forms`
2. `src/lib/state`
3. `src/lib/dependency`

Confused? So were we, that's why we wrote this... here's a brief description of each layer:

- **Form Data**: This is user input data that needs to be sanitized before it can flow into the application's main state.

- **State Data**: This is the core state of the application.

- **Dependency Data**: These are the types that are provided by external dependencies. These types should not be accessible to the project as a whole, they should be constrained to the dependency's module. This way we can easily exchange the dependency.

## Folder Structure & Tools

TODO
