import { Box, Flex, SimpleGrid, Text } from '@chakra-ui/react'
import { collection, getDocs } from 'firebase/firestore'
import dynamic from 'next/dynamic'
import { useEffect, useState } from 'react'
import { Header } from '../components/Header'
import { Sidebar } from '../components/Sidebar'
import { db } from '../services/firebase'

const Chart = dynamic(() => import('react-apexcharts'), { ssr: false })

const options: any = {
  chart: {
    toolbar: {
      show: false,
    },
    zoom: {
      enabled: false,
    },
    foreColor: '#fff',
  },
  grid: {
    show: false,
  },
  dataLabels: {
    enabled: false,
  },
  tooltip: {
    enabled: false,
  },
  xaxis: {
    type: 'datetime',
    axisBorder: {
      color: '#fff',
    },
    axisTicks: {
      color: '#fff',
    },
    categories: [
      '2022-07-31T00:00:00.000Z',
      '2022-08-01T00:00:00.000Z',
      '2022-08-02T00:00:00.000Z',
      '2022-08-03T00:00:00.000Z',
      '2022-08-04T00:00:00.000Z',
      '2022-08-05T00:00:00.000Z',
      '2022-08-06T00:00:00.000Z',
    ],
  },
  fill: {
    opacity: 0.3,
    type: 'gradient',
    gradient: {
      shade: 'dark',
      opacityFrom: 0.7,
      opacityTo: 0.3,
    },
  },
}
const series = [
  {
    name: 'series1',
    data: [30, 40, 20, 30, 10, 25, 30, 30],
  },
]

export default function Dashboard() {
  const [totalUsers, setTotalUsers] = useState(0)
  const [totalCompanies, setTotalCompanies] = useState(0)

  useEffect(() => {
    async function loadTotalUsers() {
      const query = await getDocs(collection(db, 'users'))
      setTotalUsers(query.docs.length)
    }

    loadTotalUsers()
  }, [])

  useEffect(() => {
    async function loadTotalCompanies() {
      const query = await getDocs(collection(db, 'companies'))
      setTotalCompanies(query.docs.length)
    }

    loadTotalCompanies()
  }, [])

  return (
    <Flex direction="column" h="100vh">
      <Header />

      <Flex w="100%" my="6" mx="auto" px="6" maxWidth={1480}>
        <Sidebar />

        <SimpleGrid
          flex="1"
          gap="4"
          minChildWidth="320px"
          alignItems="flex-start"
        >
          <Box p={['6', '8']} bg="gray.700" borderRadius={8} pb="4">
            <Box display="flex" w="100%">
              <Text fontSize="lg" mb="4" color="white">
                Empresas
              </Text>
              <Text ml="auto" fontSize="lg" mb="4" color="white">
                {totalCompanies}
              </Text>
            </Box>
            <Chart options={options} series={series} type="area" height={160} />
          </Box>

          <Box p={['6', '8']} bg="gray.700" borderRadius={8} pb="4">
            <Box display="flex" w="100%">
              <Text fontSize="lg" mb="4" color="white">
                Usuários
              </Text>
              <Text ml="auto" fontSize="lg" mb="4" color="white">
                {totalUsers}
              </Text>
            </Box>
            <Chart options={options} series={series} type="area" height={160} />
          </Box>
        </SimpleGrid>
      </Flex>
    </Flex>
  )
}
