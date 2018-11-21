import * as React from "react"
import * as blockies from "ethereum-blockies-png"
import {
  withStyles,
  Typography,
  Theme,
  WithStyles,
  createStyles,
  Grid,
  Card,
  CardHeader,
  CardActions,
  Button,
  CardContent,
  ListItemIcon,
  ListItemText,
  ListSubheader,
  ListItem,
} from "@material-ui/core"

//Mock data
const members = [
  "0x925ea5af075bde17811e4bcdc198dc5d3675e466",
  "0x4672bad527107471cb5067a887f4656d585a8a31",
]

const ListWrapper = (members: Array<string>) => {
  return (
    <>
      {members.map(addr => {
        const dataURL = blockies.createDataURL({ seed: addr })
        return (
          <ListItem button>
            <ListItemIcon>
              <img src={dataURL} />
            </ListItemIcon>
            <ListItemText primary={addr} />
          </ListItem>
        )
      })}
    </>
  )
}

type Founder = {
  firstName: string
  lastName: string
  title: string
  address: string
}

type State = {
  accounts: Array<Founder>
  creator: string
}

interface Props extends WithStyles<typeof styles> {}

/**
 * TODO:
 * - Add state, events, and actions to add addressses to the members array
 * - Create a dropdown animation for each founder to enter more details
 * - Wire 'Next' navigation to DAOCreationWizard
 */

const Founders: React.SFC<Props> = ({ classes }) => (
  <>
    <Card className={classes.card}>
      <ListSubheader>
        Creator&#39;s address: 0xafe8b8f2ef2ac6cb4d263c1a05486a7c5beb27a4
      </ListSubheader>
      {ListWrapper(members)}
      <CardHeader title="Staking Agreement" />
      <CardContent>
        <Typography>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus et
          lacinia mauris. Vestibulum non leo lobortis, ultrices metus et,
          pulvinar metus. Maecenas sit amet laoreet leo, semper dapibus ipsum.
          Morbi suscipit velit id urna aliquet tempor. Sed quis urna semper nibh
          vehicula efficitur. Quisque purus neque, bibendum quis gravida a,
          tempus id metus. Sed sed erat mi. Nam posuere, sapien quis consequat
          tempus, purus leo rutrum metus, sit amet lacinia enim enim ac augue.
          Vivamus sit amet orci vel nunc iaculis sodales sit amet nec neque.
          Nunc in purus porta, aliquet eros eu, pretium turpis. Donec fringilla,
          est a mattis porttitor, lorem diam fringilla tellus, ut feugiat est
          est maximus lorem.
          <br />
          <br />
          Praesent vestibulum orci ac lorem pharetra, ornare aliquam lacus
          aliquam. Fusce eu purus sapien. Etiam lorem eros, tristique sed nulla
          sodales, faucibus maximus eros. Donec vitae turpis sit amet enim
          gravida semper vitae at erat. Integer scelerisque vel dui a bibendum.
          Nullam ut placerat enim, ut porttitor odio. Nullam id aliquet justo.
          Etiam urna ligula, sagittis quis nunc pellentesque, efficitur
          dignissim lorem. Phasellus et mollis nulla. Nulla ut nulla non dolor
          porta sagittis sit amet at nibh. Etiam suscipit est non lorem accumsan
          hendrerit. Sed nec sapien vitae ipsum elementum feugiat nec quis nisi.
          Aliquam erat volutpat. Ut ut ante commodo, faucibus nisl consequat,
          convallis diam. In pharetra justo non lectus vulputate, eget commodo
          ante tempor. Suspendisse auctor quam a ultrices auctor.
        </Typography>
      </CardContent>
      <CardActions>
        <Button variant="outlined" href="" target="_blank">
          Next
        </Button>
      </CardActions>
    </Card>
  </>
)

const styles = ({  }: Theme) =>
  createStyles({
    header: {
      marginTop: 100,
      textAlign: "center",
    },
    card: {
      maxWidth: 700,
      margin: "auto",
      marginTop: 100,
    },
  })

export default withStyles(styles)(Founders)
