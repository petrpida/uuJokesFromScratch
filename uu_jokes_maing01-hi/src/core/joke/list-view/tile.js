//@@viewOn:imports
import UU5 from "uu5g04";
import "uu5g04-bricks";
import { createVisualComponent, Utils, useEffect, PropTypes } from "uu5g05";
import Uu5Elements, { Pending, Text } from "uu5g05-elements";
import Config from "./config/config";
//@@viewOff:imports

//@@viewOn:css
const Css = {
  content: () =>
    Config.Css.css({
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      overflow: "hidden",
      height: "100%",
    }),
  text: (parent) =>
    Config.Css.css({
      display: "block",
      marginLeft: parent.padding.left,
      marginRight: parent.padding.right,
      marginBottom: parent.padding.bottom,
      marginTop: parent.padding.top,
    }),

  image: () => Config.Css.css({ width: "100%" }),
};
//@@viewOff:css

export const Tile = createVisualComponent({
  //@@viewOn:statics
  uu5Tag: Config.TAG + "Tile",
  //@@viewOff:statics

  //@@viewOn:propTypes
  propTypes: {
    onDetail: PropTypes.func,
    onUpdate: PropTypes.func,
    onDelete: PropTypes.func,
    jokesPermissions: PropTypes.object,
  },
  //@@viewOff:propTypes

  //@@viewOn:defaultProps
  defaultProps: {},
  //@@viewOff:defaultProps

  render(props) {
    //@@viewOn:private
    const { data: jokeDataObject } = props;
    const actionsDisabled = jokeDataObject.state === "pending";

    useEffect(() => {
      if (
        jokeDataObject.data.image &&
        !jokeDataObject.data.imageUrl &&
        jokeDataObject.state === "ready" &&
        jokeDataObject.handlerMap?.getImage
      ) {
        jokeDataObject.handlerMap
          .getImage(jokeDataObject.data)
          .catch((error) => Tile.logger.error("Error loading image", error));
      }
    }, [jokeDataObject]);

    const handleDetail = () => {
      props.onDetail(jokeDataObject.data);
    };

    function handleUpdate(event) {
      event.stopPropagation();
      props.onUpdate(jokeDataObject);
    }

    function handleDelete(event) {
      event.stopPropagation();
      props.onDelete(jokeDataObject);
    }

    function getItemActions() {
      const actionList = [];

      if (props.jokesPermissions.joke.canManage) {
        actionList.push({
          icon: "mdi-pencil",
          onClick: handleUpdate,
          disabled: actionsDisabled,
        });

        actionList.push({
          icon: "mdi-delete",
          onClick: handleDelete,
          disabled: actionsDisabled,
        });
      }

      return actionList;
    }
    //@@viewOff:private

    //@@viewOn:render
    const [elementProps] = Utils.VisualComponent.splitProps(props);
    const joke = jokeDataObject.data;

    return (
      <Uu5Elements.Tile
        {...elementProps}
        header={<Header joke={joke} />}
        footer={<Footer joke={joke} />}
        footerSignificance="distinct"
        onClick={handleDetail}
        significance="subdued"
        borderRadius="elementary"
        actionList={getItemActions()}
      >
        {(tile) => (
          <div className={Css.content()}>
            {joke.text && !joke.image && (
              <Text
                category="interface"
                segment="content"
                type="medium"
                colorScheme="building"
                className={Css.text(tile)}
              >
                {joke.text}
              </Text>
            )}
            {joke.imageUrl && <img src={joke.imageUrl} alt={joke.name} className={Css.image()} />}
            {joke.image && !joke.imageUrl && <Pending size="xl" />}
          </div>
        )}
      </Uu5Elements.Tile>
    );
    //@@viewOff:render
  },
});

function Header({ joke }) {
  return (
    <Text category="interface" segment="title" type="micro" colorScheme="building">
      {joke.name}
    </Text>
  );
}

function Footer({ joke }) {
  return (
    <div className={Config.Css.css({ display: "flex", justifyContent: "center" })}>
      <UU5.Bricks.Rating value={joke.averageRating} />
    </div>
  );
}

export default Tile;
