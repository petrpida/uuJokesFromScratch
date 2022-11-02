//@@viewOn:imports
import { createVisualComponent, useCallback, Utils, PropTypes, Lsi, useLsi, useRoute } from "uu5g05";
import Uu5Elements, { useAlertBus } from "uu5g05-elements";
import { ControllerProvider } from "uu5tilesg02";
import { FilterButton, SorterButton } from "uu5tilesg02-controls";
import Content from "./list-view/content";
import DataListStateResolver from "../data-list-state-resolver";
import Config from "./config/config";
import importLsi from "../../lsi/import-lsi";
//@@viewOff:imports

const STATICS = {
  //@@viewOn:statics
  uu5Tag: Config.TAG + "ListView",
  //@@viewOff:statics
};

const ListView = createVisualComponent({
  ...STATICS,

  //@@viewOn:propTypes
  propTypes: {
    jokeDataList: PropTypes.object.isRequired,
    categoryDataList: PropTypes.object.isRequired,
    filterList: PropTypes.array.isRequired,
    sorterList: PropTypes.array.isRequired,
  },
  //@@viewOff:propTypes

  //@@viewOn:defaultProps
  defaultProps: {},
  //@@viewOff:defaultProps

  render(props) {
    //@@viewOn:private
    const lsi = useLsi(importLsi, [ListView.uu5Tag]);
    const { addAlert } = useAlertBus();
    const [, setRoute] = useRoute();

    const showError = useCallback(
      (error) =>
        addAlert({
          message: error.message,
          priority: "error",
        }),
      [addAlert]
    );

    const handleLoad = useCallback(
      async (event) => {
        try {
          await props.jokeDataList.handlerMap.load(event?.data);
        } catch (error) {
          showError(error);
        }
      },
      [props.jokeDataList, showError]
    );

    const handleLoadNext = useCallback(
      async (pageInfo) => {
        try {
          await props.jokeDataList.handlerMap.loadNext(pageInfo);
        } catch (error) {
          showError(error);
        }
      },
      [props.jokeDataList, showError]
    );

    const handleDetail = (joke) => {
      setRoute("jokeDetail", { id: joke.id });
    };
    //@@viewOff:private

    //@@viewOn:render
    const attrs = Utils.VisualComponent.getAttrs(props);
    const actionList = getActions(props);

    return (
      <>
        <ControllerProvider
          data={props.jokeDataList.data}
          filterDefinitionList={getFilters(props.categoryDataList, lsi)}
          sorterDefinitionList={getSorters(lsi)}
          filterList={props.filterList}
          sorterList={props.sorterList}
          onFilterChange={handleLoad}
          onSorterChange={handleLoad}
        >
          <Uu5Elements.Block
            {...attrs}
            actionList={actionList}
            info={<Lsi import={importLsi} path={[ListView.uu5Tag, "info"]} />}
            header={<Lsi import={importLsi} path={[ListView.uu5Tag, "header"]} />}
            headerType="heading"
            card="none"
          >
            <DataListStateResolver dataList={props.jokeDataList}>
              <DataListStateResolver dataList={props.categoryDataList}>
                <Content
                  jokeDataList={props.jokeDataList}
                  categoryDataList={props.categoryDataList}
                  onLoadNext={handleLoadNext}
                  onDetail={handleDetail}
                />
              </DataListStateResolver>
            </DataListStateResolver>
          </Uu5Elements.Block>
        </ControllerProvider>
      </>
    );

    //@@viewOff:render
  },
});

//@@viewOn:helpers
function getFilters(categoryDataList, lsi) {
  let filterList = [];
  if (categoryDataList.state === "ready") {
    filterList.push({
      key: "categoryIdList",
      label: lsi.category,
      inputType: "select",
      inputProps: {
        multiple: true,
        itemList: categoryDataList.data.map((categoryDto) => ({
          value: categoryDto.data.id,
          children: categoryDto.data.name,
        })),
      },
    });
  }

  return filterList;
}

function getSorters(lsi) {
  return [
    {
      key: "name",
      label: lsi.name,
    },
    {
      key: "averageRating",
      label: lsi.rating,
    },
  ];
}

function getActions(props) {
  const actionList = [];

  if (props.jokeDataList.data) {
    actionList.push({
      component: FilterButton,
    });

    actionList.push({
      component: SorterButton,
    });
  }

  return actionList;
}
//@@viewOff:helpers

//@@viewOn:exports
export { ListView };
export default ListView;
//@@viewOff:exports
