import { TbHandMove } from 'react-icons/tb';
import { DraggableCore, DraggableData, DraggableEvent } from 'react-draggable';
import { InstrumentConfig, StyleConfig } from 'renderer/typing/config.type';

interface propsType {
  id: number;
  instrumentConfig: InstrumentConfig;
  styleConfig: StyleConfig;
  onchange: (id: number, distancemm: number) => void;
}

export default function DragMove({
  id,
  instrumentConfig,
  styleConfig,
  onchange,
}: propsType) {
  const hStyle = styleConfig.holder;

  const dragHandler = (e: DraggableEvent, data: DraggableData) => {
    let newDistance =
      (data.x - hStyle.leftMargin - hStyle.leftPadding) / hStyle.xScale;
    if (id === 0 && newDistance < 0) {
      newDistance = 0;
    }
    if (id > 0 && newDistance < instrumentConfig.lens[id - 1].distancemm) {
      newDistance = instrumentConfig.lens[id - 1].distancemm;
    }
    if (
      id < instrumentConfig.lens.length - 1 &&
      newDistance > instrumentConfig.lens[id + 1].distancemm
    ) {
      newDistance = instrumentConfig.lens[id + 1].distancemm;
    }
    newDistance = Math.round(newDistance);
    onchange(id, newDistance);
  };

  return (
    <DraggableCore onDrag={dragHandler}>
      <TbHandMove style={{ fontSize: 25 }} />
    </DraggableCore>
  );
}
