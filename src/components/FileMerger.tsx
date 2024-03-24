import * as React from 'react'

import styled from 'styled-components'
import { useDropzone } from 'react-dropzone'
import readXlsxFile from 'read-excel-file'
import { CSVLink } from 'react-csv'
import event_validator from '../components/EventValidator'
import Section from './Section'
import Title from './Title'
import Subtitle from './Subtitle'
import Button from './Button'
import Loader from './Loader'
import { isMobile } from 'react-device-detect'

const FileMerger = () => {
    const [launched, setLaunched] = React.useState<boolean>(false)
    const [files, setFiles] = React.useState<MyFile[]>([])
    const [analyzedFiles, setAnalayzedFiles] = React.useState<MyAnalyzedFiles[]>([])

    const { acceptedFiles, getRootProps, getInputProps } = useDropzone()

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

    React.useEffect(() => {
        if (analyzedFiles.length !== 0) {
            window.scrollTo({
                left: 0,
                top: document.getElementById('results')?.scrollHeight,
                behavior: 'smooth',
            })
        }
    }, [analyzedFiles])

    //PROCESSING
    const processFiles = (myfiles: File[]) => {
        setLaunched(true)
        setTimeout(() => {
            Promise.all(myfiles.map((file) => readXlsxFile(file))).then((content) => {
                const loadedFiles = content.map((itm, idx) => ({
                    filename: myfiles[idx].name,
                    content: itm.slice(2),
                }))
                setFiles(loadedFiles)
                setAnalayzedFiles(
                    loadedFiles.map((f) => ({
                        filename: f.filename,
                        ...event_validator(f),
                    }))
                )
            })
        }, 1000)
    }

    const categories = [
        // @ts-ignore
        ...new Set(analyzedFiles.map((a) => a.events.map((b) => b.category_code)).flat()),
    ]
    const number_categories = categories.reduce(
        (acc, cur) => [
            ...acc,
            {
                category: cur,
                number: analyzedFiles.reduce(
                    (acc2, cur2) =>
                        cur2.events.filter((e) => e.category_code === cur).length + acc2,
                    0
                ),
            },
        ],
        []
    )
    const partners = [
        // @ts-ignore
        ...new Set(analyzedFiles.map((a) => a.events.map((b) => b.presenting_partner)).flat()),
    ]
    const number_partners = partners.reduce(
        (acc, cur) => [
            ...acc,
            {
                partner: cur,
                number: analyzedFiles.reduce(
                    (acc2, cur2) =>
                        cur2.events.filter((e) => e.presenting_partner === cur).length + acc2,
                    0
                ),
            },
        ],
        []
    )

    const allValidatedEvents = analyzedFiles.map((af) => af.events.map((e) => e)).flat()
    const csvHeader = allValidatedEvents.length !== 0 ? Object.keys(allValidatedEvents[0]) : []
    const allEventsToCSV = allValidatedEvents.map((e) =>
        // @ts-ignore
        Object.keys(e).reduce((acc, cur) => [...acc, String(e[cur])], [] as String[])
    )
    allEventsToCSV.unshift(csvHeader)

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
                    <Vertical flexed={2} isMobile={isMobile}>
                        <Subtitle subtitle={`Fichiers chargés (${acceptedFiles.length})`} />
                        <FileContainer>
                            <FileArray>
                                {acceptedFiles.length === 0 &&
                                    "Aucun fichier n'a été déposé pour l'instant."}
                                {acceptedFiles.map((file) => (
                                    // @ts-ignore
                                    <LoadedFilesLine key={file.path}>
                                        <FileLine>
                                            {/* @ts-ignore */}
                                            {file.path}
                                        </FileLine>
                                    </LoadedFilesLine>
                                ))}
                            </FileArray>
                        </FileContainer>
                    </Vertical>
                </Horizontal>
                <ButtonContainer>
                    <Button
                        label="Lancer le traitement"
                        onClick={() => processFiles(acceptedFiles)}
                        disabled={acceptedFiles.length === 0}
                    />
                </ButtonContainer>
            </Section>
            {launched && (
                <>
                    {analyzedFiles.length === 0 ? (
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
                                        <DataInfo>
                                            {files.reduce(
                                                (acc, cur) => acc + cur.content.length,
                                                0
                                            )}{' '}
                                            lignes traitées
                                        </DataInfo>
                                    </DataLine>
                                    <DataLine>
                                        <DataIcon src={require('../assets/incorrect.png')} />
                                        <DataInfo>
                                            {analyzedFiles.reduce(
                                                (acc, cur) => acc + cur.errors.length,
                                                0
                                            )}{' '}
                                            erreurs
                                        </DataInfo>
                                    </DataLine>
                                    <DataLine>
                                        <DataIcon src={require('../assets/correct.png')} />
                                        <DataInfo>
                                            {analyzedFiles.reduce(
                                                (acc, cur) => acc + cur.events.length,
                                                0
                                            )}{' '}
                                            évènements
                                        </DataInfo>
                                    </DataLine>
                                </VData>
                                <Subtitle subtitle="Répartition par organisateur" />
                                <VData>
                                    {/* @ts-ignore */}
                                    {number_partners.map((c) => (
                                        <DataLine>
                                            <DataInfo>
                                                {c.number} évenements {c.partner}
                                            </DataInfo>
                                        </DataLine>
                                    ))}
                                </VData>
                                <Subtitle subtitle="Répartition par catégorie" />
                                <VData>
                                    {/* @ts-ignore */}
                                    {number_categories.map((c) => (
                                        <DataLine>
                                            <DataInfo>
                                                {c.number} évenements {c.category}
                                            </DataInfo>
                                        </DataLine>
                                    ))}
                                </VData>
                                <ButtonContainer>
                                    <CSVLink
                                        style={{ textDecoration: 'unset' }}
                                        data={allEventsToCSV as any}
                                        target="_blank"
                                        filename={`${new Date().getTime()}_partners_events.csv`}>
                                        <Button label="Exporter le résultat" onClick={() => {}} />
                                    </CSVLink>
                                </ButtonContainer>
                            </Section>
                            <Section id="analysed">
                                <Title title="Liste des anomalies" />
                                {analyzedFiles.map((file_error) => (
                                    <>
                                        <Tableau id="errors">
                                            <thead>
                                                <tr>
                                                    <TableauHeader>
                                                        {file_error.filename}
                                                    </TableauHeader>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {file_error.errors.map((error) => (
                                                    <tr>
                                                        <TableauLine>{error}</TableauLine>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </Tableau>
                                    </>
                                ))}
                            </Section>
                        </>
                    )}
                </>
            )}
        </>
    )
}

export default FileMerger

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
const FILE_LINE_HEIGHT = isMobile ? 60 : 40
const LoadedFilesLine = styled.li`
    display: flex;
    flex-direction: row;
    height: ${FILE_LINE_HEIGHT}px;

    &:hover {
        & > div {
            color: #ffffff;
            cursor: pointer;
            border-radius: 5px;
            background: linear-gradient(45deg, #e14854, #97214d);
        }
    }
`
const FileLine = styled.div`
    flex: 1;
    display: flex;
    padding-left: 10px;
    align-items: center;
    height: ${FILE_LINE_HEIGHT}px;
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
const Tableau = styled.table`
    font-family: MainFont;
`
const TableauHeader = styled.th`
    font-family: MainFont;
    text-transform: uppercase;
    background: linear-gradient(45deg, #e14854, #97214d);
`
const TableauLine = styled.td`
    font-family: MainFont;
`
