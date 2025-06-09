import { useAuth } from '@clerk/clerk-expo'
import { useCallback, useEffect, useState } from 'react'

const usePagination = (url, limit, method) => {
  const [data, setData] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [hasMore, setHasMore] = useState(true)
  const [offset, setOffset] = useState(0)
  const { getToken } = useAuth()

  const fetchData = async (reset = false) => {
    if (isLoading) return
    const token = await getToken()

    setIsLoading(true)
    try {
      const skip = reset ? 0 : offset
      const response = await fetch(`${url}limit=${limit}&skip=${skip}`, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      })
      const result = await response.json()

      setData((prev) => (reset ? result.data : [...prev, ...result.data]))
      setOffset(skip + limit)

      if (result.data.length < limit) setHasMore(false)
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setIsLoading(false)
      setIsRefreshing(false)
    }
  }

  useEffect(() => {
    fetchData(true) // true para resetar offset ao montar
  }, [])

  const loadMore = () => {
    if (!isLoading && hasMore) {
      fetchData()
    }
  }

  const refresh = useCallback(() => {
    setIsRefreshing(true)
    setHasMore(true)
    setOffset(0)
    fetchData(true)
  }, [])

  return {
    data,
    isLoading,
    isRefreshing,
    loadMore,
    refresh,
  }
}

export default usePagination
