export function renderParagraphs(blocks: string[], color: string, fontSize: number, centered = false) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: centered ? 20 : 16,
        color,
        fontSize,
        lineHeight: 1.7,
        textAlign: centered ? 'center' : 'left',
      }}
    >
      {blocks.map((block, index) => (
        <p
          key={`${index}-${block.slice(0, 20)}`}
          style={{
            margin: 0,
            whiteSpace: 'pre-wrap',
            wordBreak: 'break-word',
          }}
        >
          {block}
        </p>
      ))}
    </div>
  );
}
