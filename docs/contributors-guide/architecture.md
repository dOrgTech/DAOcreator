## Project Architecture

TODO: Describe folder structure & tools

## 3 Layers Of Data Types

TODO: Still very WIP

We view the different data types in this project as if they are in 3 buckets:

1. _UI Data_
2. _Internal / Backend Data_
3. _3rd Party Dependency Data_

We want to avoid as many **run-time type related errors** as possible, so each layer has its own type definitions.

These definitions can be found in:

1. `src/components/**.ts`
2. `src/lib/types/*.ts`
3. `src/lib/integrations/**/types/*.ts`

Confused? So were we, that's why we wrote this...

#### UI types

These are types that are internal to a react component. This normally takes the form of the Component's Props and State interfaces.

Why make a UI type? Why not just use the Lib Types? Components should not be directly dependent on (2.) Lib Types as the component should only get access to the data that is strictly needed for that specific component.

Data from 1 gets to 2 through dispatched redux actions. Data gets from 2 to 1 through
The remapping between (2.) Lib types and UI types should happen in mapStateToProps (and in mapDispatchToProps if required).

TODO

Example:
1 to 2
// component, action, reducer (state)  
2 to 1
// map state to props

Bad:

```
interface Founder = {
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

#### 2. Lib types

These are the types that are used through the project for internal communication (state, actions, exposed by integration modules etc.).

#### 3. Integration types

These are the types that are provided by external dependencies. These types should not be accessible to the project as a whole, they should be constrained to the integration's integration module. Everything exposed by an integration module should have (2.) Lib type. This way we can easily exchange the integrations internal package.
