import * as React from 'react'

import styled from 'styled-components'
import FileMerger from '../components/FileMerger'
import KmlExtractor from '../components/KmlExtractor'
import MariageNimegue from '../components/MariageNimegue'
import ExcelToCsvPage from '../components/Wedding'

const HomeScreen = () => {
    const [action, setAction] = React.useState<
        'mariageNimegue' | 'ExcelToCsvPage' | 'filemerger' | 'kmlextractor'
    >('ExcelToCsvPage')

    return (
        <>
            <Header>
                <BackgroundHeader src={require('../assets/header.png')} />
                <MenuContent>
                    <Pagetitle>Traitement fichiers Nimegue</Pagetitle>
                    <Pagesubtitle>
                        {action === 'mariageNimegue'
                            ? 'Mariage (XLS)'
                            : action === 'filemerger'
                              ? 'Traitement des évenements'
                              : 'Traitement des tracés'}
                    </Pagesubtitle>
                    <Menu>
                        {/* <MenuItem
                            selected={action === 'mariageNimegue'}
                            onClick={() => setAction('mariageNimegue')}>
                            Mariage
                        </MenuItem> */}
                        <MenuItem
                            selected={action === 'ExcelToCsvPage'}
                            onClick={() => setAction('ExcelToCsvPage')}>
                            MARIAGES
                        </MenuItem>
                        {/* <MenuItem
                            selected={action === 'filemerger'}
                            onClick={() => setAction('filemerger')}>
                            Évènements
                        </MenuItem>
                        <MenuItem
                            selected={action === 'kmlextractor'}
                            onClick={() => setAction('kmlextractor')}>
                            Tracés kml
                        </MenuItem> */}
                    </Menu>
                </MenuContent>
            </Header>
            {action === 'mariageNimegue' ? (
                <MariageNimegue />
            ) : action === 'ExcelToCsvPage' ? (
                <ExcelToCsvPage />
            ) : action === 'filemerger' ? (
                <FileMerger />
            ) : (
                <KmlExtractor />
            )}
            <ScrollToTop onClick={() => window.scrollTo({ left: 0, top: 0, behavior: 'smooth' })}>
                <Arrow src={require('../assets/arrow.png')} />
            </ScrollToTop>
            <Footer id="footer"></Footer>
        </>
    )
}

export default HomeScreen

const HEADER_HEIGHT = 300
const Header = styled.header`
    box-shadow: 0px 2px 5px #4d4d4d;
    height: ${HEADER_HEIGHT}px;
    justify-content: center;
    align-items: center;
    display: flex;
`
const BackgroundHeader = styled.img`
    height: ${HEADER_HEIGHT}px;
    position: absolute;
    object-fit: cover;
    width: 100%;
`
const MenuContent = styled.div`
    flex-direction: column;
    justify-content: center;
    align-items: center;
    display: flex;
    z-index: 1;
`
const Pagetitle = styled.h1`
    text-transform: uppercase;
    color: #ffffff;
    z-index: 1;
    text-align: center;

    line-height: 50px;
    min-height: 50px;
    margin: 0;
`
const Pagesubtitle = styled.h2`
    text-transform: uppercase;
    color: #ffffff;
    z-index: 1;
    font-weight: normal;
    text-align: center;

    line-height: 50px;
    min-height: 50px;
    margin: 0;
    margin-bottom: 20px;
`
const Menu = styled.ul`
    justify-content: space-around;
    background-color: #000000;
    flex-direction: row;
    align-items: center;
    width: fit-content;
    border-radius: 5px;
    display: flex;
    height: 50px;
    padding: 0;
`
const MenuItem = styled.li<{ selected: boolean }>`
    ${(props) => props.selected && `background-color: #4d4d4d;`}
    text-transform: uppercase;
    justify-content: center;
    align-items: center;
    border-radius: 5px;
    font-weight: bold;
    list-style: none;
    cursor: pointer;
    color: #ffffff;
    display: flex;
    padding: 5px;
    height: 30px;
    margin: 5px;

    &:hover {
        ${(props) => !props.selected && `background-color: #2d2d2d;`}
    }
`
const Footer = styled.footer`
    background-color: #000000;
    margin-top: 50px;
    height: 200px;
`
const ScrollToTop = styled.div`
    box-shadow: 0px 0px 2px #000000;
    background: linear-gradient(-45deg, #590148, #fb5556);
    border-radius: 40px;
    cursor: pointer;
    position: fixed;
    height: 50px;
    bottom: 30px;
    width: 50px;
    right: 30px;
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
`
const Arrow = styled.img`
    height: 20px;
    width: 20px;
    rotate: 180deg;
`
