import * as React from 'react'
import styled from 'styled-components'

interface Props {
    label: string
    onClick: () => void
    disabled?: boolean
}
const Button = ({ label, onClick, disabled = false }: Props) => {
    return (
        <Container onClick={onClick} disabled={disabled}>
            <ButtonLabel disabled={disabled}>{label}</ButtonLabel>
            <ArrowContainer disabled={disabled}>
                <Arrow src={require('../assets/arrow.png')} />
            </ArrowContainer>
        </Container>
    )
}

export default Button

const BUTTON_HEIGHT = 40
const DISABLED_COLOR = '#D4D4D4'

const Container = styled.button<{ disabled: boolean }>`
    display: flex;
    align-items: center;
    justify-content: space-between;

    height: ${BUTTON_HEIGHT}px;
    width: fit-content;
    padding: 0;

    border-radius: 5px;
    border: 2px solid ${(props) => (props.disabled ? DISABLED_COLOR : '#000000')};
    cursor: pointer;

    &:hover {
        ${(props) => !props.disabled && 'background-color: #000000;'}

        &>h4 {
            ${(props) => !props.disabled && 'color: #FFFFFF;'}
        }
    }
`
const ButtonLabel = styled.h4<{ disabled: boolean }>`
    ${(props) => props.disabled && `color: ${DISABLED_COLOR};`}
    font-family: MainFont;
    font-size: 16px;
    font-style: italic;

    margin: 0 10px;
`
const ArrowContainer = styled.div<{ disabled: boolean }>`
    width: 30px;
    height: ${BUTTON_HEIGHT}px;
    padding-left: 10px;
    display: flex;
    align-items: center;
    justify-content: center;

    background-color: ${(props) => (props.disabled ? DISABLED_COLOR : '#000000')};
    border-radius: 50px 0 0 50px;
`
const Arrow = styled.img`
    width: 15px;
    height: 15px;
    rotate: -90deg;
`
