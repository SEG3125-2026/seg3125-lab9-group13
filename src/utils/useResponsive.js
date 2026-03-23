import { useEffect, useState } from 'react'

function getScreenFlags() {
  const width = window.innerWidth

  return {
    isMobile: width < 768,
    isTablet: width >= 768 && width < 1100,
    isDesktop: width >= 1100,
  }
}

export function useResponsive() {
  const [screen, setScreen] = useState(getScreenFlags())

  useEffect(() => {
    function handleResize() {
      setScreen(getScreenFlags())
    }

    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  return screen
}