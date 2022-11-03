//@@viewOn:imports
import { createVisualComponent, Utils, PropTypes } from "uu5g05";
import { UuGds } from "uu5g05-elements";
import { Grid } from "uu5tilesg02-elements";
import { FilterBar, FilterManagerModal, SorterBar, SorterManagerModal } from "uu5tilesg02-controls";
import Tile from "./tile";
import Config from "./config/config";
//@@viewOff:imports

const TILE_HEIGHT = 300; // px

// Space between rows in grid [px]
const ROW_SPACING = UuGds.SpacingPalette.getValue(["fixed", "c"]);

//@@viewOn:css
const Css = {
  grid: () => Config.Css.css({ marginTop: UuGds.SpacingPalette.getValue(["fixed", "c"]) }),
};
//@@viewOff:css

export const Content = createVisualComponent({
  //@@viewOn:statics
  uu5Tag: Config.TAG + "Content",
  //@@viewOff:statics

  //@@viewOn:propTypes
  propTypes: {
    jokeDataList: PropTypes.object.isRequired,
    categoryDataList: PropTypes.object.isRequired,
    jokePermissions: PropTypes.object,
    onLoadNext: PropTypes.func,
    onDetail: PropTypes.func,
    onUpdate: PropTypes.func,
    onDelete: PropTypes.func,
  },
  //@@viewOff:propTypes

  //@@viewOn:defaultProps
  defaultProps: {},
  //@@viewOff:defaultProps

  render(props) {
    //@@viewOn:private
    const { jokeDataList, categoryDataList, ...tileProps } = props;
    const pageSize = jokeDataList.pageSize;

    function handleLoadNext({ indexFrom }) {
      props.onLoadNext({ pageSize: pageSize, pageIndex: Math.floor(indexFrom / pageSize) });
    }
    //@@viewOff:private

    //@@viewOn:render
    const attrs = Utils.VisualComponent.getAttrs(tileProps);

    return (
      <div {...attrs}>
        <FilterBar disabled={jokeDataList.state !== "ready"} />
        <SorterBar disabled={jokeDataList.state !== "ready"} />
        <Grid
          onLoad={handleLoadNext}
          tileMinWidth={270}
          tileMaxWidth={600}
          tileHeight={TILE_HEIGHT}
          horizontalGap={UuGds.SpacingPalette.getValue(["fixed", "c"])}
          verticalGap={ROW_SPACING}
          className={Css.grid()}
        >
          <Tile
            {...tileProps}
            onDetail={props.onDetail}
            onUpdate={props.onUpdate}
            onDelete={props.onDelete}
            jokesPermissions={props.jokesPermissions}
          />
        </Grid>
        <FilterManagerModal />
        <SorterManagerModal />
      </div>
    );
    //@@viewOff:render
  },
});

//@@viewOn:helpers
//@@viewOff:helpers

export default Content;
