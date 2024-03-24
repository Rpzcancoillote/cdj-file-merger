import * as React from 'react'
import styled from 'styled-components'

interface Props {
    subtitle: string
}
const Subtitle = ({ subtitle }: Props) => {
    return <Container>{subtitle}</Container>
}

export default Subtitle

const Container = styled.h2`
    margin: 20px 0;
    font-weight: normal;
    text-transform: uppercase;
`
