interface SeoJsonLdProps {
  graph: Record<string, unknown>[];
  id: string;
}

export function SeoJsonLd({ graph, id }: SeoJsonLdProps) {
  return (
    <script
      id={id}
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify({
          '@context': 'https://schema.org',
          '@graph': graph,
        }),
      }}
    />
  );
}
