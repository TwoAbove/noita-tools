import { memo, useEffect, useState } from "react";
import Icon from "../Icon";
import NoitaTexture from "./noitaTexture";

interface INormalMapRendererProps {
  materialColor: any;
  imageSrc: any;
}
const NormalMapRenderer = ({ materialColor, imageSrc, ...rest }: INormalMapRendererProps) => {
  const [texture, setTexture] = useState<string | null>();

  useEffect(() => {
    (() => {
      NoitaTexture(materialColor, imageSrc)
        .then(texture => {
          setTexture(texture);
        })
        .catch(e => {
          console.error(e);
        });
      return null;
    })();
  }, [imageSrc, materialColor]);

  if (!texture) {
    return <>loading</>;
  }
  return <Icon uri={texture} {...rest} />;
};
const MemoizedNormalMapRenderer = memo(
  NormalMapRenderer,
  (p, n) => p.materialColor === n.materialColor && p.imageSrc === n.imageSrc,
);

export { NormalMapRenderer };
export default MemoizedNormalMapRenderer;
