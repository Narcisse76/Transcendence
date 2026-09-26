type AccordionProps = {
  title: string;
  paragraphs: string[];
};

export default function Accordion({ title, paragraphs }: AccordionProps) {
  return (
    <details className="mt-6 border-t border-gray-500 pt-4">
      <summary className="cursor-pointer text-yellow-400">{title}</summary>
      <div className="mt-3">
        {paragraphs.map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
      </div>
    </details>
  );
}
