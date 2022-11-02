//@@viewOn:imports
import { createVisualComponent, useRoute } from "uu5g05";
import { RouteController } from "uu_plus4u5g02-app";
import RouteContainer from "../core/route-container";
import JokeDetail from "../core/joke/detail";
import Config from "./config/config";
//@@viewOff:imports

const Joke = createVisualComponent({
  //@@viewOn:statics
  displayName: Config.TAG + "Joke",
  //@@viewOff:statics

  //@@viewOn:propTypes
  propTypes: {},
  //@@viewOff:propTypes

  //@@viewOn:defaultProps
  defaultProps: {},
  //@@viewOff:defaultProps

  render() {
    //@@viewOn:private
    const [route] = useRoute();
    //@@viewOff:private

    //@@viewOn:render
    return (
      <RouteController>
        <RouteContainer>
          <JokeDetail jokeId={route.params.id} />
        </RouteContainer>
      </RouteController>
    );
    //@@viewOff:render
  },
});

export default Joke;
