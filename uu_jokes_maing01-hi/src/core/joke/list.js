//@@viewOn:imports
import { createVisualComponent } from "uu5g05";
import JokeListProvider from "./list-provider";
import CategoryListProvider from "../category/list-provider";
import ListView from "./list-view";
import Config from "./config/config";
//@@viewOff:imports

export const List = createVisualComponent({
  //@@viewOn:statics
  uu5Tag: Config.TAG + "List",
  //@@viewOff:statics

  //@@viewOn:propTypes
  propTypes: {},
  //@@viewOff:propTypes

  //@@viewOn:defaultProps
  defaultProps: {},
  //@@viewOff:defaultProps

  render() {
    //@@viewOn:private
    //@@viewOff:private

    //@@viewOn:render
    return (
      <JokeListProvider>
        {({ jokeDataList, filterList, sorterList }) => (
          <CategoryListProvider>
            {(categoryDataList) => (
              <ListView
                jokeDataList={jokeDataList}
                categoryDataList={categoryDataList}
                filterList={filterList}
                sorterList={sorterList}
              />
            )}
          </CategoryListProvider>
        )}
      </JokeListProvider>
    );
    //@@viewOff:render
  },
});

export default List;
