import React from 'react';
import { useColorMode, Button } from '@chakra-ui/react';

export default function ColorModeToggle() {
  const { colorMode, toggleColorMode } = useColorMode()
  return (
    <header>
      <Button onClick={toggleColorMode}>
        Toggle {colorMode === "light" ? "Dark" : "Light"}
      </Button>
    </header>
  )
}