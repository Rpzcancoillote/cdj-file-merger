/* eslint-disable no-sparse-arrays */
import * as React from 'react'

import styled from 'styled-components'
import { useDropzone } from 'react-dropzone'
import readXlsxFile from 'read-excel-file'
import { CSVLink } from 'react-csv'
import Section from './Section'
import Title from './Title'
import Subtitle from './Subtitle'
import Button from './Button'
import Loader from './Loader'
import { isMobile } from 'react-device-detect'

const MariageNimegue = () => {
    const [launched, setLaunched] = React.useState<boolean>(false)
    const [datas, setDatas] = React.useState<Row[][]>([])

    const { acceptedFiles, getRootProps, getInputProps } = useDropzone({ maxFiles: 1 })

    const [insee, setInsee] = React.useState<string>('')
    const [departement, setDepartement] = React.useState<string>('')

    // SCROLL EFFECT
    React.useEffect(() => {
        if (launched) {
            window.scrollTo({
                left: 0,
                top: window.innerHeight,
                behavior: 'smooth',
            })
        }
    }, [launched])

    //PROCESSING
    const processFiles = (myfiles: File[]) => {
        setLaunched(true)
        setTimeout(() => {
            Promise.all(myfiles.map((file) => readXlsxFile(file))).then((content) => {
                console.log('Content : ', content)
                setDatas(content)
            })
        }, 1000)
    }

    const allEventsToCSV =
        datas[0] &&
        datas[0].map((e) => [
            'NIMEGUEV3',
            insee,
            e[0],
            insee.slice(0, 2),
            departement,
            'M',
            e[5],
            ,
            ,
            ,
            e[1],
            e[2],
            ,
            ,
            ,
            ,
            ,
            ,
            ,
            ,
            ,
            ,
            ,
            ,
            ,
            ,
            ,
            ,
            e[3],
            e[4],
        ])

    return (
        <>
            <Section id="inputfiles">
                <Title title="Fichiers à traiter" />
                <Horizontal isMobile={isMobile}>
                    <Vertical flexed={1} isMobile={isMobile}>
                        <Subtitle subtitle="Dépôt des fichiers" />
                        <FileDropzone {...getRootProps({ className: 'dropzone' })}>
                            <FileImage src={require('../assets/xls.png')} alt="File dropzone" />
                            <input {...getInputProps()} />
                        </FileDropzone>
                    </Vertical>
                    {acceptedFiles.length !== 0 && acceptedFiles[0] && (
                        <Vertical flexed={2} isMobile={isMobile}>
                            <Subtitle subtitle={`Fichier chargé : (${acceptedFiles[0].name})`} />
                            <FileContainer>
                                <FileArray>
                                    <DataLine>
                                        <DataInfo>Code Insee</DataInfo>
                                        <DataInput
                                            value={insee}
                                            onChange={(t) => setInsee(t.target.value)}
                                            type="number"
                                        />
                                    </DataLine>
                                    <DataLine>
                                        <DataInfo>Département</DataInfo>
                                        <DataInput
                                            value={departement}
                                            onChange={(t) => setDepartement(t.target.value)}
                                            type="text"
                                        />
                                    </DataLine>
                                </FileArray>
                            </FileContainer>
                        </Vertical>
                    )}
                </Horizontal>
                <ButtonContainer>
                    <Button
                        label="Lancer le traitement"
                        onClick={() => processFiles(acceptedFiles)}
                        disabled={acceptedFiles.length === 0 || insee === '' || departement === ''}
                    />
                </ButtonContainer>
            </Section>
            {launched && (
                <>
                    {datas.length === 0 ? (
                        <LoaderContainer>
                            <Loader />
                        </LoaderContainer>
                    ) : (
                        <>
                            <Section id="results">
                                <Title title="Résultats du traitement" />
                                <Subtitle subtitle="État des évènements" />
                                <VData>
                                    <DataLine>
                                        <DataIcon src={require('../assets/analyzed.png')} />
                                        <DataInfo>{datas[0].length} mariages traités</DataInfo>
                                    </DataLine>
                                </VData>
                                <ButtonContainer>
                                    <CSVLink
                                        style={{ textDecoration: 'unset' }}
                                        data={allEventsToCSV as any}
                                        separator=";"
                                        enclosingCharacter={`'`}
                                        target="_blank"
                                        filename={`${acceptedFiles[0].name.split('.')[0]}.csv`}>
                                        <Button label="Exporter le fichier" onClick={() => {}} />
                                    </CSVLink>
                                </ButtonContainer>
                            </Section>
                        </>
                    )}
                </>
            )}
        </>
    )
}

export default MariageNimegue

const Horizontal = styled.div<{ isMobile: boolean }>`
    display: flex;
    align-items: center;
    flex-direction: ${(props) => (props.isMobile ? 'column' : 'row')};
`
const Vertical = styled.div<{ flexed?: number; isMobile: boolean }>`
    flex: ${(props) => props.flexed || 1};
    flex-direction: column;
    padding: 10px;
    display: flex;
    ${(props) => props.isMobile && 'width: 100%;'}
`
const FileDropzone = styled.div`
    background-color: #ffffff;
    border: 1px dashed #000000;
    justify-content: center;
    align-items: center;
    border-radius: 5px;
    cursor: pointer;
    height: 200px;
    display: flex;
    padding: 10px;

    &:hover {
        background: linear-gradient(45deg, #e14854, #97214d);
        & > img {
            rotate: -10deg;
        }
    }
`
const FileImage = styled.img`
    height: 100px;
    width: 100px;
`
const FileContainer = styled.aside`
    background-color: #ffffff;
    border: 1px dashed #000000;
    border-radius: 5px;
    overflow: scroll;
    display: flex;
    height: 200px;
    padding: 10px;
`
const FileArray = styled.ul`
    flex-direction: column;
    list-style: none;
    display: flex;
    padding: 0;
    margin: 0;
    flex: 1;
`
const LoaderContainer = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
`
const VData = styled.div`
    flex-direction: column;
    border: 0px solid #97214d;
    border-left-width: 3px;

    flex: 1;
    display: flex;
    padding-left: 15px;
    margin-bottom: 50px;
    justify-content: center;
`
const DataLine = styled.div`
    margin: 5px;
    display: flex;
`
const DataInfo = styled.div`
    display: flex;
    font-size: 18px;
    line-height: 18px;
    margin-right: 10px;
    align-items: center;
`
const DataInput = styled.input`
    flex: 1;
    height: 30px;
    font-family: MainFont;
    font-size: 16px;
`
const DataIcon = styled.img`
    height: 20px;
    width: 20px;
    margin-right: 5px;
`
const ButtonContainer = styled.div`
    display: flex;
    margin-top: 20px;
    justify-content: flex-end;
`
