import { FilteredOrderByDateType } from '@/components/PrintRecordForm/PrintRecordForm';
import { View, StyleSheet } from '@react-pdf/renderer';
import ListItem from '../ListItem';
import { COLUMN_LIMIT, PrintViewProps } from '../PrintView';

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flexDirection: 'row',
    padding: '16px',
    width: '100%',
  },
});

type MultipleColumnProps = {
  data: FilteredOrderByDateType;
  start?: number;
  end?: number;
};
const MultipleRecordsColumn = ({
  data,
  start = 0,
  end = Object.keys(data).length,
}: MultipleColumnProps) => {
  return (
    <>
      {Object.entries(data)
        .slice(start, end)
        .map(([date, restaurants]) => {
          return <ListItem key={date} date={date} restaurants={restaurants} />;
        })}
    </>
  );
};

const TwoColumnView = ({ data }: Pick<PrintViewProps, 'data'>) => {
  return (
    <View style={styles.container}>
      <View
        style={{
          flexGrow: 1,
        }}
      >
        <MultipleRecordsColumn data={data} end={COLUMN_LIMIT} />
      </View>
      <View
        style={{
          flexGrow: 1,
          marginLeft: '8px',
        }}
      >
        <MultipleRecordsColumn data={data} start={COLUMN_LIMIT} />
      </View>
    </View>
  );
};

export default TwoColumnView;
