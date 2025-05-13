import React, { useState } from 'react'
import * as XLSX from 'xlsx'
import styled, { keyframes } from 'styled-components'
import { format } from 'date-fns'

const AlertTitle = styled.h3`
    display: flex;
    font-size: 20px;
    line-height: 20px;
    margin-right: 10px;
    align-items: center;
    font-family: MainFont;
`

const DataInfo = styled.div`
    display: flex;
    font-size: 17px;
    line-height: 17px;
    margin-right: 10px;
    align-items: center;
    font-family: MainFont;
`

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
`

const Container = styled.div`
    font-family: 'Arial', sans-serif;
    padding: 2rem;
    max-width: 1200px;
    margin: auto;
`

const InputContainer = styled.div`
    background: #f9f9f9;
    border-left: 4px solid #007b00;
    padding: 1rem;
    margin: 1rem 0;
    border-radius: 5px;
    animation: ${fadeIn} 0.4s ease-in;
    display: flex;
    flex-direction: column;
`

const Input = styled.input`
    margin: 1rem 0;
    padding: 0.5rem;
    font-size: 1rem;
    border: 1px solid #ccc;
    border-radius: 5px;
    width: -webkit-fill-available;
`

const Button = styled.button`
    background: #007bff;
    color: white;
    padding: 0.6rem 1rem;
    margin-top: 1rem;
    border: none;
    border-radius: 5px;
    font-size: 1rem;
    cursor: pointer;
    transition: background 0.3s;
    &:hover {
        background: #0056b3;
    }
`

const Preview = styled.table`
    width: 100%;
    margin-top: 2rem;
    border-collapse: collapse;
    animation: ${fadeIn} 0.5s ease-in;
    th,
    td {
        border: 1px solid #ddd;
        padding: 0.5rem;
        text-align: left;
    }
    th {
        background-color: #f2f2f2;
    }
`

const StatBlock = styled.div`
    background: #f9f9f9;
    border-left: 4px solid #007bff;
    padding: 1rem;
    margin: 1rem 0;
    border-radius: 5px;
    animation: ${fadeIn} 0.4s ease-in;
`

const ModalBackground = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
`

const Modal = styled.div`
    background: white;
    padding: 2rem;
    border-radius: 10px;
    animation: ${fadeIn} 0.3s ease-in;
    max-width: 400px;
    width: 90%;
`

const ExcelToCsvConverter = () => {
    const [csvData, setCsvData] = useState<string[][]>([])
    const [insee, setInsee] = useState('')
    const [departement, setDepartement] = useState('')
    const [stats, setStats] = useState({ rows: 0, communes: new Set<string>() })
    const [fileName, setFileName] = useState<string>('')
    const [showModal, setShowModal] = useState(false)
    const [rawData, setRawData] = useState<string[][]>([])

    const fetchInseeAndDept = async (commune: string) => {
        const res = await fetch(
            `https://geo.api.gouv.fr/communes?nom=${commune}&fields=departement,code&limit=1`
        )
        const data = await res.json()
        if (data[0]) {
            setInsee(data[0].code)
            setDepartement(data[0].departement.nom)
        }
    }

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return
        setFileName(file.name.split('.xls')[0])

        const reader = new FileReader()
        reader.onload = async (evt) => {
            const data = evt.target?.result
            if (!data) return

            const workbook = XLSX.read(data, { type: 'binary' })
            const sheetName = workbook.SheetNames[0]
            const sheet = workbook.Sheets[sheetName]
            const parsed = XLSX.utils.sheet_to_json(sheet, { header: 1 }) as string[][]
            const communes = Array.from(new Set(parsed.map((row) => row[0]).filter(Boolean)))
            if (communes.length !== 1) {
                alert('Plusieurs communes trouvées, merci de vérifier le fichier.')
                return
            }
            setRawData(parsed)
            await fetchInseeAndDept(communes[0])
            setShowModal(true)
        }
        reader.readAsBinaryString(file)
    }

    const getExcelDateAsDate = (excelDate: number) => {
        // Convert Excel date to milliseconds (accounting for timezone offset)
        var unixTimestamp = (excelDate - 25569) * 86400000 - new Date().getTimezoneOffset() * 60000
        return new Date(unixTimestamp)
    }

    const handleConfirm = () => {
        const communesSet = new Set<string>()
        const formatted = rawData.map((row) => {
            const commune = row[0] || ''
            communesSet.add(commune)

            const code = insee
            const deptCode = code.substring(0, 2)

            return [
                'NIMEGUEV3',
                code,
                commune,
                deptCode,
                departement,
                'M',
                typeof row[5] === 'string'
                    ? row[5]
                    : format(getExcelDateAsDate(row[5]), 'dd/MM/yyyy'),
                '',
                '',
                '',
                row[1] || '',
                row[2] || '',
                '',
                '',
                '',
                '',
                '',
                '',
                '',
                '',
                '',
                '',
                '',
                '',
                '',
                '',
                '',
                '',
                row[3] || '',
                row[4] || '',
            ]
        })
        setCsvData(formatted)
        setStats({ rows: rawData.length, communes: communesSet })
        setShowModal(false)
    }

    const downloadCSV = () => {
        const csv = csvData.map((row) => row.join(';')).join('\r\n')
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
        const link = document.createElement('a')
        link.href = URL.createObjectURL(blob)
        link.setAttribute('download', `${fileName || 'default_export'}.csv`)
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
    }

    return (
        <Container>
            <InputContainer>
                <Input type="file" accept=".xlsx, .xls" onChange={handleFileUpload} />
            </InputContainer>

            {showModal && (
                <ModalBackground>
                    <Modal>
                        <AlertTitle>Confirmer les informations</AlertTitle>
                        <DataInfo>Code INSEE</DataInfo>
                        <Input
                            type="text"
                            placeholder="Code INSEE"
                            value={insee}
                            onChange={(e) => setInsee(e.target.value)}
                        />
                        <DataInfo>Département</DataInfo>
                        <Input
                            type="text"
                            placeholder="Nom du département"
                            value={departement}
                            onChange={(e) => setDepartement(e.target.value)}
                        />
                        <Button onClick={handleConfirm}>Valider</Button>
                    </Modal>
                </ModalBackground>
            )}

            {csvData.length > 0 && (
                <>
                    <StatBlock>
                        <p>
                            <strong>Nombre de lignes :</strong> {stats.rows}
                        </p>
                        <p>
                            <strong>Communes uniques :</strong> {Array.from(stats.communes).length}
                        </p>
                    </StatBlock>

                    <h3>Aperçu du CSV (10 premières lignes)</h3>
                    <Preview>
                        <tbody>
                            {csvData.slice(0, 10).map((row, idx) => (
                                <tr key={idx}>
                                    {row.map((cell, i) => (
                                        <td key={i}>{cell}</td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </Preview>

                    <Button onClick={downloadCSV}>Télécharger le CSV</Button>
                </>
            )}
        </Container>
    )
}

export default ExcelToCsvConverter
