import { faLeftRight } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import type { scaleType } from 'renderer/Scene';
import { useImmer } from 'use-immer';
import Draggable, {
  DraggableCore,
  DraggableData,
  DraggableEvent,
  DraggableEventHandler,
} from 'react-draggable';

interface propsType {
  scale: scaleType;
  distance: number;
  lenWidth: number;
  setDistance: () => (val: number) => void;
}

export default function DragMove({
  scale,
  distance,
  lenWidth,
  setDistance,
}: propsType) {
  const leftCalc = scale.leftMargin + distance * scale.xScale - lenWidth / 2;

  const sty: React.CSSProperties = {
    position: 'fixed',
    bottom: scale.bottomMargin,
    left: leftCalc, //镜子的中心
    height: scale.holderHeight, //光具座的height
    width: lenWidth,
    backgroundColor: 'green',
    zIndex: 5,
  };

  const dragHandler = (e: DraggableEvent, data: DraggableData) => {
    const newDistance =
      (data.x - scale.leftMargin + lenWidth / 2) / scale.xScale;
    setDistance()(newDistance);
  };

  return (
    <DraggableCore onDrag={dragHandler}>
      <div style={sty}>
        <FontAwesomeIcon icon={faLeftRight} />
      </div>
    </DraggableCore>
  );
}
