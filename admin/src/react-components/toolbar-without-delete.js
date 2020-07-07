import React from 'react'
import { Toolbar, SaveButton } from 'react-admin'

export const ToolbarWithoutDelete = props => (
  <Toolbar {...props}>
    <SaveButton />
  </Toolbar>
)
