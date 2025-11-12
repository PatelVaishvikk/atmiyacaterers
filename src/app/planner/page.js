import PlannerClient from './PlannerClient'

export const metadata = {
  title: 'Menu Planner | Build Custom Gujarati Catering Packages',
  description:
    'Use the Atmiya Caterers planner to mix and match Gujarati dishes, share guest counts, and generate tailored proposals for weddings, garbas, and corporate events across Ontario.',
  keywords: [
    'Gujarati catering planner',
    'build custom wedding menu',
    'Atmiya Caterers planning tool',
    'Ontario catering quote builder'
  ]
}

export default function PlannerPage() {
  return <PlannerClient />
}
