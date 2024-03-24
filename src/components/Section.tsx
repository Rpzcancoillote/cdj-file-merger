import * as React from 'react'
import { isMobile } from 'react-device-detect'
import styled from 'styled-components'

interface Props {
    id: string
    children: React.ReactNode
}

const Section = ({ id, children }: Props) => {
    console.log('Is mobile : ', isMobile)
    return (
        <Container id={id} isMobile={isMobile}>
            {children}
        </Container>
    )
}

export default Section

const Container = styled.section<{ isMobile: boolean }>`
    background-color: #fafafa;
    margin: ${(props) => (props.isMobile ? '10px' : '50px 100px')};
    padding: ${(props) => (props.isMobile ? '10px' : '50px')};
`
