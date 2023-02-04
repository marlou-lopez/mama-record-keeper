import { DateRangePickerValue } from '@mantine/dates';
import {
  Page,
  PDFViewer,
  View,
  Document,
  StyleSheet,
  Text,
} from '@react-pdf/renderer';
import { FilteredOrderByDateType } from '../PrintRecordForm/PrintRecordForm';
import OneColumnView from './views/OneColumnView';
import TwoColumnView from './views/TwoColumnView';

const styles = StyleSheet.create({
  page: {
    display: 'flex',
  },
  pageWrapper: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  pageHeader: {
    borderBottom: '1px solid grey',
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    height: '64px',
    padding: '8px',
    alignItems: 'center',
  },
  pageHeaderText: {
    fontWeight: 'bold',
    fontSize: '24px',
  },
  footer: {
    position: 'absolute',
    bottom: 4,
    right: 76,
    display: 'flex',
    justifyContent: 'flex-end',
    flexDirection: 'row',
    width: '100%',
  },
  total: {
    fontSize: '18px',
    border: '1px solid rgb(156, 163, 176)',
    padding: '12px',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
});

// export function isMultipleRecords(
//   data: PrintPageProps['data']
// ): data is Record<string, FullRecordItemDetails[]> {
//   return !Array.isArray(data);
// }

export const COLUMN_LIMIT = 15;

const PrintPageContent = ({ data }: Pick<PrintViewProps, 'data'>) => {
  // Only approximate
  const numberOfItems = Object.keys(data).length;
  // const numberOfRecords = Object.values(data).flatMap((d) =>
  //   Object.values(d)
  // ).length;
  if (numberOfItems > COLUMN_LIMIT) return <TwoColumnView data={data} />;
  return <OneColumnView data={data} />;
};

const PrintPageFooter = ({ data }: Pick<PrintViewProps, 'data'>) => {
  const allRecordAmounts = Object.values(data)
    .flatMap((d) => Object.values(d))
    .reduce((acc, cur) => acc + cur.reduce((a, c) => a + c.amount, 0), 0);
  return (
    <Text style={styles.total}>Total: {allRecordAmounts.toLocaleString()}</Text>
  );
};

export type PrintViewProps = {
  data: FilteredOrderByDateType;
  dateRange: DateRangePickerValue;
};

const PrintRecords = ({ data, dateRange }: PrintViewProps) => {
  return (
    <PDFViewer
      style={{
        height: '100%',
        width: '100%',
      }}
    >
      <Document>
        <Page size="A4" style={styles.page} wrap>
          <View style={styles.pageWrapper}>
            <View style={styles.pageHeader}>
              <Text style={styles.pageHeaderText}>
                Receipt:
                {`${dateRange[0]?.toLocaleDateString()} - ${dateRange[1]?.toLocaleDateString()}`}
              </Text>
            </View>
            <PrintPageContent data={data} />
            <View>
              <PrintPageFooter data={data} />
            </View>
          </View>
        </Page>
      </Document>
    </PDFViewer>
  );
};

export default PrintRecords;
