import * as React from 'react'

import styled from 'styled-components'
import { useDropzone } from 'react-dropzone'
import readXlsxFile from 'read-excel-file'
import { CSVLink } from 'react-csv'
import event_validator from '../components/EventValidator'

const HomeScreen = () => {
    const [launched, setLaunched] = React.useState<boolean>(false)
    const [files, setFiles] = React.useState<MyFile[]>([])
    const [analyzedFiles, setAnalayzedFiles] = React.useState<MyAnalyzedFiles[]>([])

    const { acceptedFiles, getRootProps, getInputProps } = useDropzone()

    // SCROLL EFFECT
    React.useEffect(() => {
        window.scrollTo({
            left: 0,
            top: document.getElementById('loading')?.scrollHeight,
            behavior: 'smooth',
        })
    }, [launched])

    React.useEffect(() => {
        window.scrollTo({
            left: 0,
            top: document.getElementById('results')?.scrollHeight,
            behavior: 'smooth',
        })
    }, [analyzedFiles])

    //PROCESSING
    const processFiles = (myfiles: File[]) => {
        setLaunched(true)
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
            <Header>
                <Pagetitle>Gestion des événements partenaires</Pagetitle>
            </Header>
            <Section>
                <Title>Fichiers à traiter</Title>
                <Horizontal>
                    <Vertical flexed={1}>
                        <Subtitle>Dépôt des fichiers</Subtitle>
                        <FileDropzone {...getRootProps({ className: 'dropzone' })}>
                            <FileImage src={require('../assets/file.png')} alt="File dropzone" />
                            <input {...getInputProps()} />
                        </FileDropzone>
                    </Vertical>
                    <Vertical flexed={2}>
                        <Subtitle>Fichiers chargés ({acceptedFiles.length})</Subtitle>
                        <FileContainer>
                            <FileArray>
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
                        disabled={acceptedFiles.length === 0}
                        onClick={() => processFiles(acceptedFiles)}>
                        Lancer le traitement
                    </Button>
                </ButtonContainer>
            </Section>
            {launched && (
                <>
                    {analyzedFiles.length === 0 ? (
                        <Section id="loading">
                            <Loading>Traitement en cours...</Loading>
                        </Section>
                    ) : (
                        <>
                            <Section id="results">
                                <Title>Résultats du traitement</Title>
                                <Horizontal>
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
                                </Horizontal>
                                <Horizontal>
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
                                </Horizontal>
                            </Section>
                            <ButtonContainer>
                                <CSVLinkButton
                                    data={allEventsToCSV as any}
                                    target="_blank"
                                    filename={`${new Date().getTime()}_partners_events.csv`}>
                                    Exporter le résultat
                                </CSVLinkButton>
                            </ButtonContainer>
                            <Section>
                                <Title>Analyse des données</Title>
                                {analyzedFiles.map((file_error) => (
                                    <>
                                        <table id="errors">
                                            <thead>
                                                <tr>
                                                    <th>{file_error.filename}</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {file_error.errors.map((error) => (
                                                    <tr>
                                                        <td>{error}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </>
                                ))}
                            </Section>
                        </>
                    )}
                </>
            )}
            <ScrollToTop onClick={() => window.scrollTo({ left: 0, top: 0, behavior: 'smooth' })}>
                <Chevron src={require('../assets/chevron.png')} />
            </ScrollToTop>
            <Footer></Footer>
        </>
    )
}

export default HomeScreen

const Header = styled.header`
    box-shadow: 0px 3px 5px #000000;
    background-color: #344d59;
    justify-content: center;
    align-items: center;
    display: flex;
    height: 150px;
`
const Pagetitle = styled.h1`
    color: #ffffff;
    text-transform: uppercase;
`
const Title = styled.h1`
    margin: 0;
    font-size: 40px;
    margin-bottom: 20px;
    text-transform: uppercase;
`
const Subtitle = styled.h2`
    margin: 20px 0;
`
const Section = styled.section`
    box-shadow: 5px 5px 5px #000000;
    background-color: #efefef;
    border-radius: 15px;
    padding: 50px;
    margin: 50px 100px;
`
const Horizontal = styled.div`
    flex-direction: row;
    display: flex;
    align-items: center;
`
const Vertical = styled.div<{ flexed?: number }>`
    flex: ${(props) => props.flexed || 1};
    flex-direction: column;
    padding: 10px;
    display: flex;
`
const FileDropzone = styled.div`
    background-color: #22232a11;
    border: 3px dashed #22232a;
    justify-content: center;
    align-items: center;
    border-radius: 10px;
    cursor: pointer;
    height: 200px;
    display: flex;
    padding: 10px;
`
const FileImage = styled.img`
    height: 100px;
    width: 100px;
`
const FileContainer = styled.aside`
    background-color: #22232a11;
    border: 3px dashed #22232a;
    border-radius: 10px;
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
const LoadedFilesLine = styled.li`
    flex-direction: row;
    display: flex;
    padding: 5px;
    flex: 1;

    &:hover {
        color: #ffffff;
        cursor: pointer;
        background-color: #22232a22;
    }
`
const FileLine = styled.div`
    flex: 1;
    display: flex;
`
const Loading = styled.div`
    font-size: 30px;
    text-align: center;
`
const VData = styled.div`
    flex-direction: column;
    border: 0px solid #344d59;
    border-left-width: 5px;
    display: flex;
    flex: 1;
    padding-left: 5px;
    justify-content: center;
    border-radius: 5px;
`
const DataLine = styled.div`
    margin: 10px;
    display: flex;
`
const DataInfo = styled.div`
    font-size: 25px;
    display: flex;
    line-height: 25px;
`
const DataIcon = styled.img`
    height: 25px;
    width: 25px;
    margin-right: 10px;
`
const ButtonContainer = styled.div`
    display: flex;
    margin-top: 20px;
    justify-content: flex-end;
`
const Button = styled.button<{ disabled?: boolean }>`
    box-shadow: 1px 1px 1px #000000;
    background-color: ${(props) => (props.disabled ? '#AAAAAA' : '#137C8B')};
    ${(props) => !props.disabled && 'cursor: pointer'};
    border-radius: 5px;
    padding: 5px 25px;
    font-size: 20px;
    color: #ffffff;
    margin: auto;
    border: 0px;

    &:hover {
        ${(props) => !props.disabled && 'background-color: #137C8BCC;'}
    }
`
const CSVLinkButton = styled(CSVLink)`
    box-shadow: 1px 1px 1px #000000;
    background-color: #137c8b;
    cursor: pointer;
    border-radius: 5px;
    padding: 5px 25px;
    font-size: 20px;
    color: #ffffff;
    margin: auto;
    border: 0px;

    &:hover {
        background-color: #137c8bcc;
    }
`
const Footer = styled.footer`
    box-shadow: 0px -3px 5px #000000;
    background-color: #344d59;
    margin-top: 50px;
    height: 100px;
`
const ScrollToTop = styled.div`
    box-shadow: 0px 0px 5px #000000;
    background-color: #137c8b;
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
`
const Chevron = styled.img`
    height: 20px;
    width: 20px;
`
