import { TbHandMove } from 'react-icons/tb';
import type { holderType, lenType } from 'renderer/Scene';
import { Updater, useImmer } from 'use-immer';
import Draggable, {
  DraggableCore,
  DraggableData,
  DraggableEvent,
  DraggableEventHandler,
} from 'react-draggable';
import { CSSProperties } from 'react';

interface propsType {
  id: number;
  lensConf: lenType[];
  holderConf: holderType;
  setLens: Updater<lenType[]>;
}

export default function DragMove({
  id,
  holderConf: hF,
  lensConf: lF,
  setLens,
}: propsType) {
  const dragHandler = (e: DraggableEvent, data: DraggableData) => {
    let newDistance = (data.x - hF.leftMargin - hF.leftPadding) / hF.xScale;
    newDistance = Math.round(newDistance);
    setLens((draft) => {
      draft[id].distancemm = newDistance;
    });
  };

  return (
    <DraggableCore onDrag={dragHandler}>
      <TbHandMove />
    </DraggableCore>
  );
}
