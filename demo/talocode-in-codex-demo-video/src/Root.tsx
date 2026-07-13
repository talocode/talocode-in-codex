import { Composition } from "remotion";
import "./index.css";
import { TalocodeInCodex } from "./TalocodeInCodex";

export const RemotionRoot: React.FC = () => {
  return (
    <Composition
      id="TalocodeInCodex"
      component={TalocodeInCodex}
      durationInFrames={41 * 30}
      fps={30}
      width={1920}
      height={1080}
    />
  );
};
