import dynamic from 'next/dynamic'
import Container from '@mui/material/Container'

const DataTable = dynamic(() => import('@/components/DataTable'), { ssr: false })

const Page = () => (
  <Container maxWidth="lg" style={{ marginTop: 24 }}>
    <h1>Dynamic Data Table Manager</h1>
    <DataTable />
  </Container>
)

export default Page
