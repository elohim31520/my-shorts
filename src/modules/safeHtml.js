import DOMPurify from 'isomorphic-dompurify'

export default function (htmlString) {
	return DOMPurify.sanitize(_replace(htmlString, /\n/g, '<br>'))
}
