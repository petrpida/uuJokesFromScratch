//@@viewOn:imports
import { createComponent, useDataObject, useEffect, useRef, PropTypes } from "uu5g05";
import Config from "./config/config";
import Calls from "calls";
//@@viewOff:imports

export const JokeProvider = createComponent({
  //@@viewOn:statics
  uu5Tag: Config.TAG + "Provider",
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
    const jokeDataObject = useDataObject({
      handlerMap: {
        load: handleLoad,
        getImage: handleGetImage,
      },
    });

    const imageUrlListRef = useRef([]);

    function handleLoad() {
      return Calls.Joke.get({ id: props.jokeId });
    }

    async function handleGetImage(joke) {
      const dtoIn = { code: joke.image };
      const imageFile = await Calls.Joke.getImage(dtoIn);
      const imageUrl = generateAndRegisterImageUrl(imageFile);
      return { ...joke, imageFile, imageUrl };
    }

    function generateAndRegisterImageUrl(imageFile) {
      const imageUrl = URL.createObjectURL(imageFile);
      imageUrlListRef.current.push(imageUrl);
      return imageUrl;
    }

    useEffect(() => {
      // We don't use it to store reference on another React component
      // eslint-disable-next-line uu5/hooks-exhaustive-deps
      return () => imageUrlListRef.current.forEach((url) => URL.revokeObjectURL(url));
      // We want to trigger this effect only once.
      // eslint-disable-next-line uu5/hooks-exhaustive-deps
    }, []);
    //@@viewOff:private

    //@@viewOn:render
    return typeof props.children === "function" ? props.children(jokeDataObject) : props.children;
    //@@viewOff:render
  },
});

export default JokeProvider;
