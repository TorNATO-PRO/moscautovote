import { Typography, useTheme } from "@mui/material";

type HeadingProps = Readonly<{
  heading: string,
  children: React.ReactElement,
}>;

/**
 * Heading defines the header props.
 *
 * @param props The properties of the react component.
 * @returns An Heading react component.
 */
function Heading(props: HeadingProps) {
  const theme = useTheme();
  
  return (
    <div style={{
      display: "flex",
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginTop: theme.spacing(3),
      marginLeft: theme.spacing(3),
      marginRight: theme.spacing(3),
      marginBottom: theme.spacing(8),
    }}>
      <Typography
        variant="h3"
      >
        {props.heading}
      </Typography>
      {props.children}
    </div>
  );
}

export default Heading;