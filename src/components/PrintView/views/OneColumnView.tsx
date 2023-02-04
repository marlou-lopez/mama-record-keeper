import { View, StyleSheet } from '@react-pdf/renderer';
import ListItem from '../ListItem';
import { PrintViewProps } from '../PrintView';
const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    padding: '16px',
    width: '80%',
    gap: '4px',
  },
});

const OneColumnView = ({ data }: Pick<PrintViewProps, 'data'>) => {
  return (
    <View style={styles.container}>
      {Object.entries(data).map(([date, restaurants]) => {
        return <ListItem key={date} date={date} restaurants={restaurants} />;
      })}
    </View>
  );
};

export default OneColumnView;
