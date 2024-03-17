
export default function spanWithHyperlink({line}) {
  const urlPattern = /(http|https):\/\/([\w-]+(\.[\w-]+)+)(\/[\w-./?%&=]*)?$/g;
  const converter = (text) => text.replace(urlPattern, (url) => {
    return `<a style="text-decoration:underline;" href="${url}" target="_blank">${url}</a>`;
  })
  return (
    <span>
      <span dangerouslySetInnerHTML={{__html: [converter(line)]}}/>
      <br />
    </span>
  );
}