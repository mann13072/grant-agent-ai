export const dummyNarrative = `
1. Kurzdarstellung des Vorhabens

Das vorliegende Forschungs- und Entwicklungsvorhaben "ThermoFlow II" zielt auf die Entwicklung eines neuartigen Phasenwechsel-Grenzflächenmaterials (Phase-Change Thermal Interface Material, PC-TIM) für die thermische Anbindung von Hochleistungs-Batteriezellen in Elektrofahrzeugen ab. Die innovativen Eigenschaften dieses Materials ermöglichen eine Reduktion des thermischen Widerstands an der Grenzfläche zwischen Batteriezelle und Kühlsystem um voraussichtlich 40% gegenüber dem Stand der Technik.

Die Notwendigkeit dieses Vorhabens ergibt sich aus den gestiegenen Anforderungen an die Wärmeabfuhr in modernen Hochenergie-Batteriesystemen, deren Leistungsdichte in den vergangenen Jahren erheblich gesteigert worden ist. Eine unzureichende thermische Anbindung führt zu erhöhten Betriebstemperaturen, was sowohl die Lebensdauer der Batteriezellen als auch die Fahrzeugsicherheit beeinträchtigt.

2. Stand der Wissenschaft und Technik

Gegenwärtig werden in der Elektromobilitätsindustrie überwiegend konventionelle Wärmeleitpasten und Gap-Filler-Materialien eingesetzt, deren thermische Leitfähigkeit im Bereich von 1–5 W/(m·K) liegt. Diese Materialien weisen jedoch erhebliche Nachteile auf:

- Die Viskositätsänderungen über den Betriebstemperaturbereich führen zu Pumpeffekten und ungleichmäßiger Materialverteilung.
- Konventionelle Gap-Filler zeigen nach wiederholten Temperaturzyklen eine signifikante Degradation der thermischen Eigenschaften.
- Die mechanischen Spannungen, die durch unterschiedliche thermische Ausdehnungskoeffizienten entstehen, können zu Delaminationseffekten führen.

Bisherige Ansätze zur Entwicklung von PC-TIMs für Batteriesysteme haben entweder eine unzureichende thermische Leitfähigkeit oder eine mangelnde langzeitstabile Haftung aufgewiesen.

3. Zielsetzung und Innovation

Das Vorhaben ThermoFlow II verfolgt folgende technische Hauptziele:

3.1 Entwicklung eines PC-TIM mit einer effektiven thermischen Leitfähigkeit von mindestens 8 W/(m·K) im erstarrten Zustand durch den Einsatz orientierter Boron-Nitrid-Nanoplatten als Wärmeleitfüller.

3.2 Realisierung eines Schmelzpunkts im Bereich von 42–48°C, der eine automatische Temperaturregelung innerhalb des optimalen Betriebsfensters von Lithium-Ionen-Zellen ermöglicht.

3.3 Nachweis einer Zyklusstabilität über mindestens 1.000 Temperaturwechselzyklen ohne signifikante Degradation der thermischen und mechanischen Eigenschaften.

4. Arbeitsplan mit Arbeitspaketen

Arbeitspaket 1: Materialentwicklung und Charakterisierung (Monate 1–8)
Im Rahmen dieses Arbeitspakets werden unterschiedliche Matrixmaterialien und Füllstoffkombinationen systematisch untersucht. Die Charakterisierung der thermischen Eigenschaften erfolgt mittels Laser-Flash-Analyse, während die mechanischen Eigenschaften durch dynamisch-mechanische Analyse bestimmt werden.

Arbeitspaket 2: Prozessentwicklung und Skalierung (Monate 6–16)
Die Entwicklung eines reproduzierbaren Herstellungsprozesses umfasst die Optimierung der Füllstoffdispergierung sowie die Etablierung eines kontinuierlichen Fertigungsverfahrens. Die Skalierung von der Laborebene (50g-Chargen) auf Pilotmaßstab (5kg-Chargen) bildet den Abschluss dieses Arbeitspakets.

Arbeitspaket 3: Systemintegration und Validierung (Monate 12–24)
Die Integration des entwickelten PC-TIM in repräsentative Batteriemodule erfolgt in enger Zusammenarbeit mit einem Automobilzulieferer. Die Validierung umfasst Temperaturwechseltests gemäß IEC 62660-2 sowie Langzeitmessungen unter realitätsnahen Fahrbedingungen.

5. Verwertungsplan

Die wirtschaftliche Verwertung der Projektergebnisse ist durch mehrere komplementäre Strategien geplant:

Primärer Verwertungspfad: Die Lizenzierung der entwickelten Technologie an etablierte Hersteller von Wärmeleitpasten und Batteriekomponenten ermöglicht eine schnelle Marktdurchdringung ohne erhebliche Investitionen in eigene Fertigungskapazitäten.

Sekundärer Verwertungspfad: Die Eigenproduktion und der Direktvertrieb an Tier-1-Automobilzulieferer bieten höhere Margen bei gleichzeitig stärkerem Wettbewerbsschutz durch proprietäre Fertigungsverfahren.

6. Notwendigkeit der Zuwendung

Die Förderung dieses Vorhabens durch das ZIM-Programm ist aus mehreren Gründen unerlässlich:

Das Technologierisiko des Vorhabens liegt deutlich über dem Niveau, das üblicherweise durch private Investoren oder Unternehmensgewinne finanziert werden kann. Die Entwicklung neuartiger Phasenwechselmaterialien mit definierten thermischen und mechanischen Eigenschaften erfordert umfangreiche Voruntersuchungen, deren Ergebnisse per se keinen unmittelbaren wirtschaftlichen Wert darstellen.

Ohne die beantragte Förderung wäre ThermoVolt GmbH nicht in der Lage, das für eine erfolgreiche Projektdurchführung notwendige Fachpersonal im erforderlichen Umfang zu beschäftigen. Die Personalkosten für das spezialisierte Forschungspersonal übersteigen die derzeitigen Möglichkeiten der Eigenfinanzierung erheblich.
`;

export const dummyFinancialTableData = [
  { label: "Total Personnel Costs", value: 312000, status: "ok" },
  { label: "Overhead / Materials (50%)", value: 156000, status: "ok" },
  { label: "Subcontracting", value: 45000, status: "ok" },
  { label: "Total Eligible Costs", value: 513000, status: "ok" },
  { label: "ZIM Cap (Individual)", value: 550000, status: "ok" },
  { label: "Funding Rate (Small, West Germany)", value: 0.45, status: "ok", isPercent: true },
  { label: "Grant Amount", value: 230850, status: "ok", highlight: true },
  { label: "Own Contribution", value: 282150, status: "ok" },
  { label: "Forschungszulage (25% of own contribution)", value: 70538, status: "ok" },
  { label: "Total Non-Dilutive Capital", value: 301388, status: "ok", highlight: true, bold: true },
];
