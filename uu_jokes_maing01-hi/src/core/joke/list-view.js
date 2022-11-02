//@@viewOn:imports
import {
  createVisualComponent,
  useCallback,
  Utils,
  PropTypes,
  Lsi,
  useState,
  useRoute,
  useLsi,
  useSession,
} from "uu5g05";
import Uu5Elements, { Link, useAlertBus } from "uu5g05-elements";
import { useSystemData } from "uu_plus4u5g02";
import { ControllerProvider } from "uu5tilesg02";
import { FilterButton, SorterButton } from "uu5tilesg02-controls";
import Content from "./list-view/content";
import DataListStateResolver from "../data-list-state-resolver";
import CreateModal from "./list-view/create-modal";
import UpdateModal from "./list-view/update-modal";
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
    const { identity } = useSession();
    const lsi = useLsi(importLsi, [ListView.uu5Tag]);
    const { data: systemData } = useSystemData();
    const { addAlert } = useAlertBus();
    const [createData, setCreateData] = useState({ shown: false });
    const [updateData, setUpdateData] = useState({ shown: false, id: undefined });
    const [, setRoute] = useRoute();

    const activeDataObjectId = updateData.id;
    let activeDataObject;

    if (activeDataObjectId) {
      activeDataObject = getJokeDataObject(props.jokeDataList, activeDataObjectId);
    }

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

    const handleCreate = useCallback(() => {
      setCreateData({ shown: true });
    }, [setCreateData]);

    const handleCreateDone = (joke) => {
      setCreateData({ shown: false });
      showCreateSuccess(joke);

      try {
        // HINT: The filtering and sorting is done on the server side.
        // There is no business logic about these on the client side.
        // Therefore we need to reload data to properly show new item
        // on the right place according filters, sorters and pageInfo.
        props.jokeDataList.handlerMap.reload();
      } catch (error) {
        ListView.logger.error("Error creating joke", error);
        showError(error);
      }
    };

    const handleCreateCancel = () => {
      setCreateData({ shown: false });
    };

    function showCreateSuccess(joke) {
      const message = (
        <>
          <Lsi import={importLsi} path={[ListView.uu5Tag, "createSuccessPrefix"]} />

          <Link colorSchema="primary" onClick={() => handleDetail({ id: joke.id })}>
            {joke.name}
          </Link>

          <Lsi import={importLsi} path={[ListView.uu5Tag, "createSuccessSuffix"]} />
        </>
      );

      addAlert({ message, priority: "success", durationMs: 5000 });
    }

    const handleDetail = (joke) => {
      setRoute("jokeDetail", { id: joke.id });
    };

    const handleUpdate = useCallback(
      (jokeDataObject) => {
        setUpdateData({ shown: true, id: jokeDataObject.data.id });
      },
      [setUpdateData]
    );

    const handleUpdateDone = () => {
      setUpdateData({ shown: false });
    };

    const handleUpdateCancel = () => {
      setUpdateData({ shown: false });
    };

    // Defining permissions
    const profileList = systemData.profileData.uuIdentityProfileList;
    const isAuthority = profileList.includes("Authorities");
    const isExecutive = profileList.includes("Executives");
    function isOwner(joke) {
      return identity?.uuIdentity === joke.uuIdentity;
    }

    const jokesPermissions = {
      joke: {
        canCreate: () => isAuthority || isExecutive,
        canManage: (joke) => isAuthority || (isExecutive && isOwner(joke)),
      },
    };
    //@@viewOff:private

    //@@viewOn:render
    const attrs = Utils.VisualComponent.getAttrs(props);
    const actionList = getActions(props, jokesPermissions, { handleCreate });

    return (
      <>
        {createData.shown && (
          <CreateModal
            jokeDataList={props.jokeDataList}
            categoryDataList={props.categoryDataList}
            shown={true}
            onSaveDone={handleCreateDone}
            onCancel={handleCreateCancel}
          />
        )}
        {updateData.shown && (
          <UpdateModal
            jokeDataObject={activeDataObject}
            categoryDataList={props.categoryDataList}
            onSaveDone={handleUpdateDone}
            onCancel={handleUpdateCancel}
            shown
          />
        )}
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
                  jokesPermissions={jokesPermissions}
                  onLoadNext={handleLoadNext}
                  onDetail={handleDetail}
                  onUpdate={handleUpdate}
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

function getJokeDataObject(jokeDataList, id) {
  // HINT: We need to also check newData where are newly created items
  // that don't meet filtering, sorting or paging criteria.
  const item =
    jokeDataList.newData?.find((item) => item?.data.id === id) ||
    jokeDataList.data.find((item) => item?.data.id === id);

  return item;
}

function getActions(props, jokesPermissions, { handleCreate }) {
  const actionList = [];

  if (props.jokeDataList.data) {
    actionList.push({
      component: FilterButton,
    });

    actionList.push({
      component: SorterButton,
    });
  }

  if (jokesPermissions.joke.canCreate()) {
    actionList.push({
      icon: "mdi-plus",
      children: <Lsi import={importLsi} path={[ListView.uu5Tag, "createJoke"]} />,
      primary: true,
      onClick: handleCreate,
      disabled: props.disabled,
    });
  }

  return actionList;
}
//@@viewOff:helpers

//@@viewOn:exports
export { ListView };
export default ListView;
//@@viewOff:exports
