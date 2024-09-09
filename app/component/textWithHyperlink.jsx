export default function SpanWithHyperlink({ line }) {
  // HTML 특수 문자를 이스케이프 처리
  const escapeHTML = (text) => {
    return text.replace(/&/g, "&amp;")
               .replace(/</g, "&lt;")
               .replace(/>/g, "&gt;")
               .replace(/"/g, "&quot;")
               .replace(/'/g, "&#039;");
  };

  // URL을 하이퍼링크로 변환
  const urlPattern = /(http|https):\/\/([\w-]+(\.[\w-]+)+)(\/[\w-./?%&=]*)?$/g;
  const converter = (text) => escapeHTML(text).replace(urlPattern, (url) => {
    return `<a style="text-decoration:underline;" href="${url}" target="_blank">${url}</a>`;
  });


  return (
    <span>
      <span dangerouslySetInnerHTML={{ __html: converter(line) }} />
      <br />
    </span>
  );
}
