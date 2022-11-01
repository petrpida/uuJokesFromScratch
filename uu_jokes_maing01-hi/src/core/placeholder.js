//@@viewOn:imports
import { createVisualComponent, PropTypes, Utils } from "uu5g05";
import { Block, Box, Text } from "uu5g05-elements";
import Config from "./config/config";
//@@viewOff:imports

//@@viewOn:css
const Css = {
  dataBox: () =>
    Config.Css.css({
      marginTop: "16px",
      marginBottom: "16px",
    }),
};
//@@viewOff:css

export const Placeholder = createVisualComponent({
  //@@viewOn:statics
  uu5Tag: Config.TAG + "Placeholder",
  //@@viewOff:statics

  //@@viewOn:propTypes
  propTypes: {
    dataObject: PropTypes.object.isRequired,
  },
  //@@viewOff:propTypes

  //@@viewOn:defaultProps
  defaultProps: {},
  //@@viewOff:defaultProps

  render(props) {
    //@@viewOn:render
    const [, rest] = Utils.VisualComponent.splitProps(props);
    const { nestingLevel, ...data } = rest;

    return (
      <Block header="Placeholder" card="full">
        {Object.keys(data).map((key) => (
          <DataBlock key={key} header={key} data={data[key]} />
        ))}
      </Block>
    );
    //@@viewOff:render
  },
});

function DataBlock(props) {
  return (
    <>
      <Text category="interface" segment="title">
        {props.header}
      </Text>
      <Box card="content" className={Css.dataBox()}>
        <pre>{transformValue(props.data)}</pre>
      </Box>
    </>
  );
}

function transformValue(value) {
  if (typeof value === "function") {
    return "function";
  } else {
    return JSON.stringify(value, null, 2);
  }
}

export default Placeholder;
