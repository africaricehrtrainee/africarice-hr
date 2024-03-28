/* eslint-disable jsx-a11y/alt-text */
'use client'
import { Document, Font, Image, Page, StyleSheet, Text, View } from '@react-pdf/renderer'

interface SummaryProps {
    user: Employee;
    objectives: Objective[];
    evaluation: Evaluation;
    year: string;
}

// Stylesheet

const styles = StyleSheet.create({

    container: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-start',
        padding: 8,
        alignItems: 'center',
        gap: 4
    },
    section: {
        width: '100%',
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'flex-start',
        gap: 16,
        alignItems: 'flex-start',
        padding: 16,
        marginTop: 8,
        borderBottomStyle: 'dashed',
        borderBottomColor: 'lightgray',
        borderBottomWidth: 1,
    },
    fieldLabel: {
        fontFamily: 'Geist-Mono',
        fontSize: 8,
        opacity: .5
    },
    fieldValue: {
        fontSize: 10
    },
    sectionTitle: {
        fontWeight: 'bold',
    },

})


function Header({ user, year, objectives, evaluation }: { user: Employee, year: string, objectives: Objective[], evaluation: Evaluation }) {
    if (!user.supervisor) return null
    return (<View style={styles.container}>
        <Image src="/africarice.png" style={{ width: 'auto', marginBottom: 16, height: 30 }} />
        <Text style={styles.sectionTitle}>EMPLOYEE EVALUATION SUMMARY</Text>
        <View style={styles.section}>
            <View style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 12 }}>
                <View>
                    <Text style={styles.fieldLabel}>LAST NAME</Text>
                    <Text style={styles.fieldValue}>{user.lastName}</Text>
                </View>
                <View>
                    <Text style={styles.fieldLabel}>FIRST NAME</Text>
                    <Text style={styles.fieldValue}>{user.firstName}</Text>
                </View>
                <View>
                    <Text style={styles.fieldLabel}>MATRICULE</Text>
                    <Text style={styles.fieldValue}>{user.matricule}</Text>
                </View>
            </View>
            <View style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 12 }}>
                <View>
                    <Text style={styles.fieldLabel}>EVALUATION YEAR</Text>
                    <Text style={styles.fieldValue}>{year}</Text>
                </View>
                <View>
                    <Text style={styles.fieldLabel}>SUPERVISOR</Text>
                    <Text style={styles.fieldValue}>{user.supervisor.lastName.split(" ")[0] + " " + user.supervisor.firstName.split(" ")[0]}</Text>
                </View>
                <View>
                    <Text style={styles.fieldLabel}>SUPERVISOR MATRICULE</Text>
                    <Text style={styles.fieldValue}>{user.supervisor.matricule}</Text>
                </View>
            </View>
        </View>
    </View>)
}

function Evaluation({ evaluation }: { evaluation: Evaluation }) {
    return <View style={[styles.container, {marginTop: 24}]}>
        {/* COMPETENCY EVALUATION*/}
        <View>
            <Text style={styles.sectionTitle}>COMPETENCY EVALUATION</Text>
        </View>
        <View style={styles.section}>
            <View style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 12 }}>
                <View>
                    <Text style={styles.fieldLabel}>EFFICIENCY / EFFICACITE</Text>
                    <Text style={styles.fieldValue}>{evaluation.efficiency}</Text>
                </View>
                <View>
                    <Text style={styles.fieldLabel}>TECHNICAL COMPETENCY / COMPETENCES TECHNIQUES</Text>
                    <Text style={styles.fieldValue}>{evaluation.competency}</Text>
                </View>
                <View>
                    <Text style={styles.fieldLabel}>COMMITMENT / ENGAGEMENT</Text>
                    <Text style={styles.fieldValue}>{evaluation.commitment}</Text>
                </View>
            </View>
            <View style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 12 }}>
                <View>
                    <Text style={styles.fieldLabel}>TAKING INITITATIVE / PRISE D’INITIATIVE</Text>
                    <Text style={styles.fieldValue}>{evaluation.initiative}</Text>
                </View>
                <View>
                    <Text style={styles.fieldLabel}>FOLLOWING INSTRUCTIONS / RESPECT DES PROCEDURES</Text>
                    <Text style={styles.fieldValue}>{evaluation.respect}</Text>
                </View>
                <View>
                    <Text style={styles.fieldLabel}>LEADERSHIP</Text>
                    <Text style={styles.fieldValue}>{evaluation.leadership}</Text>
                </View>
            </View>
        </View>

        {/* COMPETENCY SELF-EVALUATION */}
        <View style={{marginTop : 16}}>
            <Text style={styles.sectionTitle}>COMPETENCY SELF-EVALUATION</Text>
        </View> 

        <View style={styles.section}>
            <View style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 12 }}>
                <View>
                    <Text style={styles.fieldLabel}>EFFICIENCY / EFFICACITE</Text>
                    <Text style={styles.fieldValue}>{evaluation.selfEfficiency}</Text>
                </View>
                <View>
                    <Text style={styles.fieldLabel}>TECHNICAL COMPETENCY / COMPETENCES TECHNIQUES</Text>
                    <Text style={styles.fieldValue}>{evaluation.selfCompetency}</Text>
                </View>
                <View>
                    <Text style={styles.fieldLabel}>COMMITMENT / ENGAGEMENT</Text>
                    <Text style={styles.fieldValue}>{evaluation.selfCommitment}</Text>
                </View>
            </View>
            <View style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 12 }}>
                <View>
                    <Text style={styles.fieldLabel}>TAKING INITITATIVE / PRISE D’INITIATIVE</Text>
                    <Text style={styles.fieldValue}>{evaluation.selfInitiative}</Text>
                </View>
                <View>
                    <Text style={styles.fieldLabel}>FOLLOWING INSTRUCTIONS / RESPECT DES PROCEDURES</Text>
                    <Text style={styles.fieldValue}>{evaluation.selfRespect}</Text>
                </View>
                <View>
                    <Text style={styles.fieldLabel}>LEADERSHIP</Text>
                    <Text style={styles.fieldValue}>{evaluation.selfLeadership}</Text>
                </View>
            </View>
            </View>
    </View>
}

export default function Summary(props: SummaryProps) {
    Font.register({
        family: 'Geist', fonts: [
            { src: '/fonts/Geist-Regular.ttf' },
            { src: '/fonts/Geist-Bold.ttf', fontWeight: 'bold' }
        ]
    },)

    Font.register({
        family: 'Geist-Mono', fonts: [
            { src: '/fonts/GeistMono-Regular.ttf' },
            { src: '/fonts/GeistMono-Bold.ttf', fontWeight: 'bold' }
        ]
    })
    return (
        <Document>
            <Page size="A4" style={{ padding: 16, fontFamily: 'Geist', letterSpacing: -.3, fontSize: 12 }}>
                <Header user={props.user} year={props.year} objectives={props.objectives} evaluation={props.evaluation} />
                <Evaluation evaluation={props.evaluation} />
            </Page>
        </Document>
    )
}