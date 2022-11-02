//@@viewOn:imports
import { createVisualComponent, PropTypes } from "uu5g05";
import Config from "./config/config";
import JokeProvider from "./provider";
import CategoryListProvider from "../category/list-provider";
import DetailView from "./detail-view";
//@@viewOff:imports

export const Detail = createVisualComponent({
  //@@viewOn:statics
  uu5Tag: Config.TAG + "Detail",
  //@@viewOff:statics

  //@@viewOn:propTypes
  propTypes: {
    jokeId: PropTypes.string.isRequired,
  },
  //@@viewOff:propTypes

  //@@viewOn:defaultProps
  defaultProps: {},
  //@@viewOff:defaultProps

  render(props) {
    //@@viewOn:private
    //@@viewOff:private

    //@@viewOn:render
    return (
      <JokeProvider jokeId={props.jokeId}>
        {(jokeDataObject) => (
          <CategoryListProvider>
            {(categoryDataList) => <DetailView jokeDataObject={jokeDataObject} categoryDataList={categoryDataList} />}
          </CategoryListProvider>
        )}
      </JokeProvider>
    );
    //@@viewOff:render
  },
});

export default Detail;
