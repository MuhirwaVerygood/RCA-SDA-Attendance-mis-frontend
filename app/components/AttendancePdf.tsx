import { AttendanceRow } from "./AttendanceReport";
import { StyleSheet, Document, Page, Text, View } from '@react-pdf/renderer';

const AttendancePDF = ({ attendanceData, date }: { attendanceData: AttendanceRow[], date: string | null }) => {
    const styles = StyleSheet.create({
        page: {
            padding: 10,
            fontFamily: 'Helvetica',
        },
        header: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 20,
        },
        title: {
            fontSize: 16,
            fontWeight: 'bold',
        },
        table: {
            flexDirection: 'column',
            width: 'auto',
            margin: '0 auto',
            borderWidth: 1,
            borderColor: '#000',
            borderStyle: 'solid',
        },
        tableRow: {
            flexDirection: 'row',
        },
        tableCell: {
            flex: 1,
            padding: 5,
            borderWidth: 1,
            borderColor: '#000',
            textAlign: 'center',
        },
        headerCell: {
            backgroundColor: '#f2f2f2',
            fontWeight: 'bold',
        },
    });

    return (
        <Document>
            <Page size="A4" style={styles.page}>
                <View style={styles.header}>
                    <Text style={styles.title}>Attendance Report</Text>
                    <Text>{date || "No Date Provided"}</Text>
                </View>
                <View style={styles.table}>
                    {/* Table Header */}
                    <View style={[styles.tableRow, styles.headerCell]}>
                        <Text style={[styles.tableCell, styles.headerCell]}>Feature</Text>
                        <Text style={[styles.tableCell, styles.headerCell]}>Ebenezer</Text>
                        <Text style={[styles.tableCell, styles.headerCell]}>Salv Sibs</Text>
                        <Text style={[styles.tableCell, styles.headerCell]}>Jehovah Nissi</Text>
                        <Text style={[styles.tableCell, styles.headerCell]}>Church</Text>
                    </View>
                    {/* Table Rows */}
                    {attendanceData.map((row, index) => (
                        <View style={styles.tableRow} key={index}>
                            <Text style={styles.tableCell}>{row.feature}</Text>
                            <Text style={styles.tableCell}>{row.ebenezer}</Text>
                            <Text style={styles.tableCell}>{row.salvSibs}</Text>
                            <Text style={styles.tableCell}>{row.jehovahNissi}</Text>
                            <Text style={styles.tableCell}>{row.church}</Text>
                        </View>
                    ))}
                </View>
            </Page>
        </Document>
    );
};
