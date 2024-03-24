import * as React from 'react'
import styled from 'styled-components'

interface Props {
    title: string
}
const Title = ({ title }: Props) => {
    return <Container>{title}</Container>
}

export default Title

const Container = styled.h1`
    margin: 0;
    font-size: 40px;
    margin-bottom: 20px;
    text-transform: uppercase;
    border: 0px solid #000000;
    border-bottom-width: 1px;
`
