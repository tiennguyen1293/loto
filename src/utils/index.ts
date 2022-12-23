export function randomIntFromInterval(min: number, max: number) {
  return Math.round(Math.random() * (max - min) + min)
}

export function generateArrayNumbers(min: number, max: number, length: number) {
  let array = []

  while (array.length < length) {
    const randomNumber = randomIntFromInterval(min, max)
    const isExisting = array.some((number: number) => number === randomNumber)

    if (!isExisting) {
      array.push(randomNumber)
    }
  }

  return array
}

export function transpose(matrix: number[][]) {
  let [row] = matrix

  return row.map((_, column) => matrix.map((row) => row[column]))
}

const COLUMN_LENGTH = 9
const ROW_LENGTH = 9

export function generateLotoTicket({
  rows = ROW_LENGTH,
  columns = COLUMN_LENGTH,
}: {
  rows: number
  columns: number
}) {
  const conditionsGenerate = [
    generateArrayNumbers(1, 9, rows),
    generateArrayNumbers(10, 19, rows),
    generateArrayNumbers(20, 29, rows),
    generateArrayNumbers(30, 39, rows),
    generateArrayNumbers(40, 49, rows),
    generateArrayNumbers(50, 59, rows),
    generateArrayNumbers(60, 69, rows),
    generateArrayNumbers(70, 79, rows),
    generateArrayNumbers(80, 90, rows),
  ]

  const generateNumbers = Array(columns)
    .fill(1)
    .map((_, index) => conditionsGenerate[index])

  const transposeColumnToRow = transpose(generateNumbers)

  return transposeColumnToRow.map((row) => {
    const randomHidden = generateArrayNumbers(
      0,
      columns - 1,
      columns === 9 ? 4 : 1,
    )

    return row.map((number, numberIndex) =>
      randomHidden.includes(numberIndex) ? 0 : number,
    )
  })
}
