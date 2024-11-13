/* A super primitive markdown to HTML converter */
const markdownToHtml = (md, substitutions = {}) =>
{
  md = substitute(md, substitutions)

  md = md.replace(/!\[video\]\((.+?)\)/g, '<video controls src="$1"></video>')

  md = md.replace(/!\[(.*?)\]\((.+?)\)/g, '<img src="$2" alt="$1">')

  md = md.replace(/^## (.+)$/gm, '<h2>$1</h2>')
  md = md.replace(/^# (.+)$/gm, '<h1>$1</h1>')

  md = md.replace(/\*\*(.+?)\*\*/g, '<b>$1</b>')
  md = md.replace(/\*(.+?)\*/g, '<i>$1</i>')

  md = md.replace(/^\s*-\s+(.+)$/gm, '<li>$1</li>')
  md = md.replace(/(<li>.*<\/li>)/gms, '<ul>$1</ul>')

  md = md.replace(/\n/g, '')
  return md
}

const substitute = (line, substitutions = {}) =>
{
  for (const [key, value] of Object.entries(substitutions)) {
    const placeholder = new RegExp(`:${key}`, 'g')
    line = line.replace(placeholder, value)
  }
  return line
}

const charFile = (pos, files) => files[pos]

const ordFile = (file, files) => files.indexOf(file)

/* Converts a list of strings to a two-level list using string as a delimiter */
const splitList = (arr, delimiter) =>
  arr.reduce((acc, item) => {
    if (item === delimiter) {
      if (acc[acc.length - 1].length > 0) {
        acc.push([])
      }
    } else {
      acc[acc.length - 1].push(item)
    }
    return acc
  }, [[]])

/* Capitalizes string */
const capitalize = s => s[0].toUpperCase() + s.slice(1)

export { markdownToHtml, substitute, splitList, charFile, ordFile, capitalize }
