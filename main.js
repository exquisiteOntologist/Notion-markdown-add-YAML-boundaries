const fs = require('fs')

const replaceText = (text) => {
	const textWithYamlBounds = text
		.replace(new RegExp('\n{2,3}'), '\n---\n')
		.replace(new RegExp('\n{1,3}.*(\n{2})'), '\n---\n\n')

	let textLinesAsArray = textWithYamlBounds.split(new RegExp('\n'))

	const hasHeading = textWithYamlBounds[0] === '#'
	if (hasHeading) {
		const heading = textLinesAsArray.shift()
		const posLastBound = textLinesAsArray.lastIndexOf('---')
		
		const lines = [
			...textLinesAsArray.splice(0, posLastBound + 1),
			`\n${heading}`,
			...textLinesAsArray
		]

		textLinesAsArray = lines
	}

	const notYaml = textLinesAsArray[1].indexOf(':') === -1
	if (notYaml) return text

	const textOut = textLinesAsArray.join('\n')
	return textOut
}

const updateFile = async (file) => {
	const fileText = await new Promise((res, rej) => fs.readFile(file, 'utf8', (err, data) => data ? res(data) : rej(err)))
	console.log(file, 'file text', fileText)
	if (!fileText) return
	fs.writeFileSync(file, replaceText(fileText), 'utf8')
}

const fileExt = '.md'
const extLength = fileExt.length

const fileLoop = async (dirPath) => {
	const contents = fs.readdirSync(dirPath)

	console.log('dir path', dirPath)
	console.log('contents', contents)
	const jobs = contents.map(fName => {
		const filePath = `${dirPath}/${fName}`
		const stat = fs.lstatSync(filePath)
		if (stat.isDirectory && fName.indexOf('.') === -1) {
			return fileLoop(fs.realpathSync(filePath))
		} else if (stat.isFile && filePath.indexOf(fileExt) === (filePath.length - extLength)) {
			return updateFile(fs.realpathSync(filePath))
		}
	})

	return await Promise.all(jobs)
}

const pathArg = process.argv[2]
if (!pathArg) console.log('please specify a path (use quotes around path)')
else fileLoop(fs.realpathSync(pathArg))



