# dOrg dApp
TODO

## Style Guide
### Note on types
#### 1. UI types
This is types that are internal to a react component. This types should be used sparingly, as its most often possible to represent Props, State, etc. by base types like string, number, boolean etc.

Bad:
```
type Founder = {
  name: string
}

type Props = {
  founder: Founder
}
```
Good:
```
type Props = {
  founderName: string
}
```

Components should not be directly dependent on (2.) Lib types as the component should only get access to the data that is strictly needed for that specific component. The remapping between (2.) Lib types and UI types should happen in mapStateToProps (and in mapDispatchToProps if required). 

#### 2. Lib types
This is the types that are used through the project for internal communication (state, actions, exposed by integration modules etc.).

#### 3. Integration types
This is types that are provided by external dependencies. This types should not be accessible to the project as a whole, they should be constrained to the integrations integration module. Everything exposed by an integration module should have (2.) Lib type. This way we can easily exchange the integrations internal package.
