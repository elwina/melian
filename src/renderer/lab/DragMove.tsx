import { TbHandMove } from 'react-icons/tb';
import { Updater, useImmer } from 'use-immer';
import Draggable, {
  DraggableCore,
  DraggableData,
  DraggableEvent,
  DraggableEventHandler,
} from 'react-draggable';
import { CSSProperties } from 'react';
import { InstrumentConfig, StyleConfig } from 'renderer/typing/config.type';

interface propsType {
  id: number;
  styleConfig: StyleConfig;
  onchange: (id: number, distancemm: number) => void;
}

export default function DragMove({ id, styleConfig, onchange }: propsType) {
  const hStyle = styleConfig.holder;

  const dragHandler = (e: DraggableEvent, data: DraggableData) => {
    let newDistance =
      (data.x - hStyle.leftMargin - hStyle.leftPadding) / hStyle.xScale;
    newDistance = Math.round(newDistance);
    onchange(id, newDistance);
  };

  return (
    <DraggableCore onDrag={dragHandler}>
      <TbHandMove style={{ fontSize: 25 }} />
    </DraggableCore>
  );
}
