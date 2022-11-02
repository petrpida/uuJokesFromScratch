//@@viewOn:imports
import UU5 from "uu5g04";
import { createVisualComponent, Utils, Lsi, useLanguage, PropTypes, useEffect, useLsi } from "uu5g05";
import { Box, Line, Text, DateTime, useSpacing } from "uu5g05-elements";
import { PersonPhoto } from "uu_plus4u5g02-elements";
import Config from "./config/config";
import importLsi from "../../../lsi/import-lsi";
//@@viewOff:imports

//@@viewOn:css
const Css = {
  image: () =>
    Config.Css.css({
      display: "block",
      maxWidth: "35%",
      margin: "auto",
    }),

  text: ({ spaceA, spaceB }) =>
    Config.Css.css({
      display: "block",
      marginLeft: spaceA,
      marginRight: spaceA,
      marginTop: spaceB,
      marginBottom: spaceB,
    }),

  infoLine: ({ spaceA, spaceC }) =>
    Config.Css.css({
      display: "block",
      marginLeft: spaceA,
      marginTop: spaceC,
    }),

  footer: ({ spaceA, spaceB, spaceC }) =>
    Config.Css.css({
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",

      marginTop: spaceC,
      paddingTop: spaceB,
      paddingBottom: spaceB,
      paddingLeft: spaceA,
      paddingRight: spaceA,
    }),

  photo: ({ spaceC }) =>
    Config.Css.css({
      marginRight: spaceC,
    }),
};
//@@viewOff:css

const Content = createVisualComponent({
  //@@viewOn:statics
  uu5Tag: Config.TAG + "Content",
  //@@viewOff:statics

  //@@viewOn:propTypes
  propTypes: {
    jokeDataObject: PropTypes.object.isRequired,
    categoryDataList: PropTypes.object.isRequired,
  },
  //@@viewOff:propTypes

  //@@viewOn:defaultProps
  defaultProps: {},
  //@@viewOff:defaultProps

  render(props) {
    //@@viewOn:private
    const lsi = useLsi(importLsi, [Content.uu5Tag]);
    const { jokeDataObject } = props;

    const spacing = useSpacing();
    const [language] = useLanguage();

    function buildCategoryNames() {
      // for faster lookup
      let categoryIds = new Set(joke.categoryIdList);
      return props.categoryDataList.data
        .reduce((acc, { data: category }) => {
          if (categoryIds.has(category.id)) {
            acc.push(category.name);
          }
          return acc;
        }, [])
        .join(", ");
    }

    function getRatingCountLsi(ratingCount) {
      const pluralRules = new Intl.PluralRules(language);
      const rule = pluralRules.select(ratingCount);
      return Utils.String.format(lsi[`${rule}Votes`], ratingCount);
    }

    useEffect(() => {
      if (
        jokeDataObject.data.image &&
        !jokeDataObject.data.imageUrl &&
        jokeDataObject.state === "ready" &&
        jokeDataObject.handlerMap?.getImage
      ) {
        jokeDataObject.handlerMap.getImage(joke).catch((error) => console.error(error));
      }
    }, [jokeDataObject]);
    //@@viewOff:private

    //@@viewOn:render
    const attrs = Utils.VisualComponent.getAttrs(props);
    const joke = jokeDataObject.data;

    return (
      <div {...attrs}>
        {joke.text && (
          <Text
            category="interface"
            segment="content"
            type="medium"
            colorScheme="building"
            className={Css.text(spacing)}
          >
            {joke.text}
          </Text>
        )}

        {joke.imageUrl && <img src={joke.imageUrl} alt={joke.name} className={Css.image()} />}

        <Line significance="subdued" />

        {joke.categoryIdList?.length > 0 && <InfoLine>{buildCategoryNames()}</InfoLine>}

        <InfoLine>
          <DateTime value={joke.sys.cts} dateFormat="short" timeFormat="none" />
        </InfoLine>

        <InfoLine>
          <Lsi lsi={getRatingCountLsi(joke.ratingCount)} params={[joke.ratingCount]} />
        </InfoLine>

        <Box significance="distinct" className={Css.footer(spacing)}>
          <span>
            <>
              <PersonPhoto uuIdentity={joke.uuIdentity} size="xs" className={Css.photo(spacing)} />
              <Text category="interface" segment="content" colorScheme="building" type="medium">
                {joke.uuIdentityName}
              </Text>
            </>
          </span>
          <UU5.Bricks.Rating value={joke.averageRating} />
        </Box>
      </div>
    );
    //@@viewOff:render
  },
});

//@@viewOn:helpers
function InfoLine({ children }) {
  const spacing = useSpacing();

  return (
    <Text
      category="interface"
      segment="content"
      type="medium"
      significance="subdued"
      colorScheme="building"
      className={Css.infoLine(spacing)}
    >
      {children}
    </Text>
  );
}
//@@viewOff:helpers

export default Content;
