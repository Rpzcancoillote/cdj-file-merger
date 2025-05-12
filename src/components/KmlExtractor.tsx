import * as React from 'react'

import styled from 'styled-components'
import { useDropzone } from 'react-dropzone'
import { CSVLink } from 'react-csv'
import Section from './Section'
import Title from './Title'
import Subtitle from './Subtitle'
import Button from './Button'
import Loader from './Loader'
import XMLParser from 'react-xml-parser'
import { addSeconds, differenceInSeconds } from 'date-fns'
import { MapContainer, TileLayer, Polyline } from 'react-leaflet'
import { latLng, polyline } from 'leaflet'
import { isMobile } from 'react-device-detect'

const KmlExtractor = () => {
    const [launched, setLaunched] = React.useState<boolean>(false)
    const [allDatedLocations, setAllDatedLocations] = React.useState<DatedLocation[][]>([])

    const { acceptedFiles, getRootProps, getInputProps } = useDropzone()

    //PROCESSING
    const processFiles = (myfiles: File[]) => {
        setLaunched(true)
        Promise.all(myfiles.map((f) => readKmlFile(f))).then((results) => {
            setAllDatedLocations(results)
        })
    }

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
        if (allDatedLocations.length !== 0) {
            window.scrollTo({
                left: 0,
                top: document.getElementById('locations')?.scrollHeight,
                behavior: 'smooth',
            })
        }
    }, [allDatedLocations])

    const readKmlFile = (file: any): Promise<DatedLocation[]> => {
        const reader = new FileReader()
        return new Promise((resolve, reject) => {
            reader.onabort = () => console.log('file reading was aborted')
            reader.onerror = () => console.log('file reading has failed')
            reader.onload = () => {
                var xml = new XMLParser().parseFromString(reader.result)

                const date_string = xml.getElementsByTagName('name')[0].value.split(' ')[2]
                const start_string = xml.getElementsByTagName('name')[2].value.split(' ')[5]
                const end_string = xml.getElementsByTagName('name')[3].value.split(' ')[5]

                const date_day = date_string.split('.')[0]
                const date_month = date_string.split('.')[1] - 1
                const date_year = date_string.split('.')[2]
                const start_date_hour = start_string.split(':')[0]
                const start_date_minute = start_string.split(':')[1]
                const end_date_hour = end_string.split(':')[0]
                const end_date_minute = end_string.split(':')[1]
                const start_datetime = new Date(
                    date_year,
                    date_month,
                    date_day,
                    start_date_hour,
                    start_date_minute
                )
                const end_datetime = new Date(
                    date_year,
                    date_month,
                    date_day,
                    end_date_hour,
                    end_date_minute
                )
                const path_total_seconds = differenceInSeconds(end_datetime, start_datetime)
                const path_locations: string[] = xml
                    .getElementsByTagName('coordinates')[2]
                    .value.split(' ')
                const difftime_locations_seconds = path_total_seconds / path_locations.length
                const dated_locations = path_locations.reduce((acc, cur, idx) => {
                    acc.push({
                        start: addSeconds(start_datetime, idx * difftime_locations_seconds),
                        longitude: cur.split(',')[0],
                        latitude: cur.split(',')[1],
                    })
                    return acc
                }, [] as DatedLocation[])
                resolve(dated_locations)
            }
            reader.readAsText(file)
        })
    }

    const csvPositionHeader = ['start_datetime', 'longitude', 'latitude']
    const allTorchPositions = allDatedLocations
        .flat()
        .map((e) => [new Date(e.start).toJSON(), String(e.longitude), String(e.latitude)])
    allTorchPositions.unshift(csvPositionHeader)

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
            {launched &&
                (allDatedLocations.length === 0 ? (
                    <LoaderContainer>
                        <Loader />
                    </LoaderContainer>
                ) : (
                    <>
                        <Section id="locations">
                            <Title title="Analyse des fichiers" />
                            <MapsContainer>
                                {allDatedLocations.map((daypath, idx) => {
                                    const polygonLocations = daypath.map((location) =>
                                        latLng(
                                            Number(location.latitude),
                                            Number(location.longitude)
                                        )
                                    )
                                    const polylineLocations = polyline(polygonLocations)
                                    return (
                                        <MyMapContainer
                                            id="map"
                                            key={idx}
                                            bounds={polylineLocations.getBounds()}
                                            scrollWheelZoom={false}>
                                            <TileLayer
                                                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                                                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                            />
                                            <Polyline positions={polygonLocations} />
                                        </MyMapContainer>
                                    )
                                })}
                            </MapsContainer>
                            <ButtonContainer>
                                <CSVLink
                                    style={{ textDecoration: 'unset' }}
                                    data={allTorchPositions as any}
                                    target="_blank"
                                    filename={`${new Date().getTime()}_torch_positions.csv`}>
                                    <Button
                                        label="Télécharger le fichier des positions"
                                        onClick={() => {}}
                                    />
                                </CSVLink>
                            </ButtonContainer>
                            <ButtonContainer id="pathfile">
                                <a
                                    download={`${new Date().getTime()}_torch_path.kml`}
                                    target="_blank"
                                    rel="noreferrer"
                                    href={URL.createObjectURL(
                                        new Blob(
                                            [
                                                `<?xml version="1.0" encoding="UTF-8"?>
                                                <kml xmlns="http://earth.google.com/kml/2.1">
                                                    <Document>
                                                        ${allDatedLocations.map(
                                                            (locations) =>
                                                                `<Placemark>
                                                                    <name>${new Date(locations[0].start).toJSON()}</name>
                                                                    <LineString>
                                                                        <coordinates>${locations.map((l) => l.longitude + ',' + l.latitude).join(' ')}</coordinates>
                                                                    </LineString>
                                                                </Placemark>`
                                                        )}
                                                    </Document>
                                                </kml>`,
                                            ],
                                            { type: 'text/plain' }
                                        )
                                    )}
                                    style={{
                                        textDecoration: 'inherit',
                                        color: 'inherit',
                                    }}>
                                    <Button
                                        label="Télécharger le fichier des tracés"
                                        onClick={() => {}}
                                    />
                                </a>
                            </ButtonContainer>
                        </Section>
                    </>
                ))}
        </>
    )
}

export default KmlExtractor

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
            rotate: 10deg;
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
const ButtonContainer = styled.div`
    display: flex;
    margin-top: 20px;
    justify-content: flex-end;
`
const MapsContainer = styled.div`
    display: flex;
    flex-wrap: wrap;
    flex-direction: row;
`
const MAP_HEIGHT = 250
const MyMapContainer = styled(MapContainer)`
    box-shadow: 0px 0px 2px #000000;
    height: ${MAP_HEIGHT}px;
    border-radius: 10px;
    margin: ${isMobile ? 5 : 10 / 6}%;
    width: ${isMobile ? 90 : 30}%;
`
