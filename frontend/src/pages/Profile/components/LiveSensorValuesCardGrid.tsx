import { getWsMessageValidator, useSocket } from 'tools';
import { ISensorMeasurement } from 'types';
import { useLatestMeasurementsStore } from '../hooks';
import {
  BehavioralInfo,
  RealTimeSensorGrid,
  RealTimeSensorInfo,
  RealTimeSensorName,
  RealTimeSensorValue,
} from './styled';

export function LiveSensorValuesCardGrid({
  reservoirId,
  abstractSensorsMentionedInReservoir,
}: {
  reservoirId: number;
  abstractSensorsMentionedInReservoir: Record<number, any>;
}) {
  const { getLatestMeasurementsFor, setNewLatestMeasurements } =
    useLatestMeasurementsStore();

  useSocket({
    namespace: '/sensorMeasurement',
    onConnect(socket) {
      socket.emit('latest/byReservoir', { reservoirId });
    },
    handlers: {
      many: (messages) =>
        setNewLatestMeasurements(messages.map(validateAndTransformMeasurement)),
      latest: (messages) =>
        setNewLatestMeasurements(messages.map(validateAndTransformMeasurement)),
    },
  });

  return (
    <RealTimeSensorGrid>
      {abstractSensorsMentionedInReservoir[1].sensorParameters.map(
        ({ id, shortName, unit }) => (
          <RealTimeSensorInfo
            title={`sensor model ${abstractSensorsMentionedInReservoir[1].modelName}`}
            invert={id % 2 === 1}
            key={id}
          >
            <RealTimeSensorName>
              {shortName}
              {unit ? `, ${unit}` : ''}
            </RealTimeSensorName>
            <RealTimeSensorValue>
              {parseFloat(
                /* Here should be id of sensor parameter instance, not id of sensor parameter. It is intentional bug just for demo */
                ((getLatestMeasurementsFor(id)?.value as number) || 0).toFixed(
                  2,
                ),
              )}
            </RealTimeSensorValue>
          </RealTimeSensorInfo>
        ),
      )}

      <BehavioralInfo>
        Тип поведения: {getLatestMeasurementsFor(1)?.value || 'Норма'}
      </BehavioralInfo>
    </RealTimeSensorGrid>
  );
}

const validateAndTransformMeasurement =
  getWsMessageValidator(ISensorMeasurement);
