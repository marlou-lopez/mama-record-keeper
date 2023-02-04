import { View, Text, StyleSheet } from '@react-pdf/renderer';
import { MapType } from '../PrintRecordForm/PrintRecordForm';

const styles = StyleSheet.create({
  itemContainer: {
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    gap: '8px',
    border: '1px solid #000',
    padding: '4px',
  },
  itemList: {
    display: 'flex',
    flexDirection: 'column',
    flexGrow: 1,
  },
  itemListItem: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    fontSize: '14px',
  },
});

type ListItemProps = {
  date: string;
  restaurants: Record<string, MapType[]>;
};
export default function ListItem({ date, restaurants }: ListItemProps) {
  return (
    <View style={styles.itemContainer}>
      <Text
        style={{
          fontSize: '12px',
        }}
      >
        {date}
      </Text>
      <View style={styles.itemList}>
        {Object.entries(restaurants).map(([restaurant, records]) => {
          return (
            <View style={styles.itemListItem} key={`${restaurant}-${date}`}>
              <Text>{restaurant}</Text>
              <Text>
                {records
                  .reduce((acc, cur) => acc + cur.amount, 0)
                  .toLocaleString()}
              </Text>
            </View>
          );
        })}
      </View>
    </View>
  );
}
