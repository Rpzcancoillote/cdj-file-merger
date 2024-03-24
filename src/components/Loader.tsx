import * as React from 'react'
import { RotatingLines } from 'react-loader-spinner'
import styled from 'styled-components'

const Loader = () => {
    return (
        <Container>
            <RotatingLines
                visible={true}
                width="50"
                strokeColor="#97214D"
                strokeWidth="5"
                animationDuration="0.75"
                ariaLabel="rotating-lines-loading"
            />
        </Container>
    )
}

export default Loader

const Container = styled.div``
