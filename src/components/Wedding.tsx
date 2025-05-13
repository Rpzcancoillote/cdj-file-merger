import React, { useState } from 'react'
import * as XLSX from 'xlsx'
import styled, { keyframes } from 'styled-components'

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
    border-left: 4px solid #007bff;
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

const ExcelToCsvConverter = () => {
    const [csvData, setCsvData] = useState<string[][]>([])
    const [insee, setInsee] = useState('')
    const [departement, setDepartement] = useState('')
    const [stats, setStats] = useState({ rows: 0, communes: new Set<string>() })

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return

        const reader = new FileReader()
        reader.onload = (evt) => {
            const data = evt.target?.result
            if (!data) return

            const workbook = XLSX.read(data, { type: 'binary' })
            const sheetName = workbook.SheetNames[0]
            const sheet = workbook.Sheets[sheetName]
            const rawData = XLSX.utils.sheet_to_json(sheet, { header: 1 }) as string[][]

            const communesSet = new Set<string>()
            const formatted = rawData.map((row) => {
                const commune = row[0] || ''
                communesSet.add(commune)

                const code = insee
                const deptCode = code.substring(0, 2)

                return [
                    'NIMEGUEV3', // A
                    code, // B
                    commune, // C (col A)
                    deptCode, // D
                    departement, // E
                    'M', // F
                    row[5] || '', // G (Date mariage - col F)
                    '',
                    '',
                    '', // H, I, J
                    row[1] || '', // K (Nom marié - col B)
                    row[2] || '', // L (Prénom marié - col C)
                    '',
                    '',
                    '',
                    '',
                    '',
                    '',
                    '',
                    '', // M à AB
                    row[3] || '', // AC (Nom mariée - col D)
                    row[4] || '', // AD (Prénom mariée - col E)
                ]
            })

            setCsvData(formatted)
            setStats({ rows: rawData.length, communes: communesSet })
        }

        reader.readAsBinaryString(file)
    }

    const downloadCSV = () => {
        const csv = csvData.map((row) => row.join(';')).join('\n')
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
        const link = document.createElement('a')
        link.href = URL.createObjectURL(blob)
        link.setAttribute('download', 'export.csv')
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
    }

    return (
        <Container>
            <h2>Convertisseur Excel → CSV</h2>
            <InputContainer>
                <Input
                    type="text"
                    placeholder="Code INSEE"
                    value={insee}
                    onChange={(e) => setInsee(e.target.value)}
                />
                <Input
                    type="text"
                    placeholder="Nom du département"
                    value={departement}
                    onChange={(e) => setDepartement(e.target.value)}
                />
                <Input type="file" accept=".xlsx, .xls" onChange={handleFileUpload} />
            </InputContainer>

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
